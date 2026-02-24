import { NextRequest, NextResponse } from 'next/server';

// ============================================
// RATE LIMITER
// ============================================

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Every minute

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
}

const defaultConfig: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
};

function getClientKey(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    return ip;
}

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
    const { maxRequests, windowMs, keyGenerator } = { ...defaultConfig, ...config };

    return (req: NextRequest): { allowed: boolean; remaining: number; resetTime: number } => {
        const key = keyGenerator ? keyGenerator(req) : getClientKey(req);
        const now = Date.now();
        const entry = rateLimitStore.get(key);

        if (!entry || now > entry.resetTime) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
        }

        entry.count++;

        if (entry.count > maxRequests) {
            return { allowed: false, remaining: 0, resetTime: entry.resetTime };
        }

        return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
    };
}

// Pre-configured limiters
export const apiLimiter = rateLimit({ maxRequests: 100, windowMs: 60000 });
export const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60000 });
export const aiLimiter = rateLimit({ maxRequests: 20, windowMs: 60000 });
export const uploadLimiter = rateLimit({ maxRequests: 10, windowMs: 300000 });
export const searchLimiter = rateLimit({ maxRequests: 60, windowMs: 60000 });

// ============================================
// SECURITY HEADERS
// ============================================

export function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=self, microphone=self, geolocation=self');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://*.tile.openstreetmap.org; " +
        "connect-src 'self' https://api.openai.com https://*.googleapis.com http://localhost:*; " +
        "media-src 'self' blob:; " +
        "frame-src 'self' https://www.google.com;"
    );
    return response;
}

// ============================================
// API RESPONSE HELPERS
// ============================================

export function apiSuccess<T>(data: T, message?: string, status = 200) {
    return NextResponse.json(
        { success: true, data, message },
        { status }
    );
}

export function apiError(message: string, status = 400, errors?: Record<string, string>) {
    return NextResponse.json(
        { success: false, error: message, errors },
        { status }
    );
}

export function apiPaginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
) {
    return NextResponse.json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
        message,
    });
}

// ============================================
// ERROR HANDLER WRAPPER
// ============================================

type ApiHandler = (req: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
    return async (req: NextRequest, context?: { params: Record<string, string> }) => {
        try {
            return await handler(req, context);
        } catch (error: unknown) {
            console.error('API Error:', error);

            if (error instanceof Error) {
                // Prisma errors
                if (error.message.includes('Unique constraint')) {
                    return apiError('هذا العنصر موجود مسبقاً', 409);
                }
                if (error.message.includes('Record to update not found')) {
                    return apiError('العنصر غير موجود', 404);
                }
                if (error.message.includes('Foreign key constraint')) {
                    return apiError('لا يمكن الحذف - يوجد بيانات مرتبطة', 409);
                }
            }

            return apiError('حدث خطأ في الخادم', 500);
        }
    };
}

// ============================================
// RATE LIMIT MIDDLEWARE
// ============================================

export function withRateLimit(handler: ApiHandler, limiter = apiLimiter): ApiHandler {
    return async (req: NextRequest, context?: { params: Record<string, string> }) => {
        const result = limiter(req);

        if (!result.allowed) {
            const response = apiError('تم تجاوز الحد الأقصى للطلبات، حاول مرة أخرى لاحقاً', 429);
            response.headers.set('X-RateLimit-Remaining', '0');
            response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
            response.headers.set('Retry-After', String(Math.ceil((result.resetTime - Date.now()) / 1000)));
            return response;
        }

        const response = await handler(req, context);
        response.headers.set('X-RateLimit-Remaining', String(result.remaining));
        response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
        return response;
    };
}
