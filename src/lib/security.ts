import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple rate limiter using in-memory storage
 * For production, use Redis or similar distributed cache
 */
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function createRateLimiter(config: RateLimitConfig) {
    return {
        ...config,
        check(ip: string): { allowed: boolean; remaining: number } {
            const now = Date.now();
            const key = ip;
            const entry = rateLimitStore.get(key);

            if (!entry || now > entry.resetTime) {
                rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
                return { allowed: true, remaining: config.maxRequests - 1 };
            }

            if (entry.count >= config.maxRequests) {
                return { allowed: false, remaining: 0 };
            }

            entry.count++;
            return { allowed: true, remaining: config.maxRequests - entry.count };
        }
    };
}

// Pre-configured rate limiters
export const apiLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 100 }); // 100 req/min
export const authLimiter = createRateLimiter({ windowMs: 900000, maxRequests: 10 }); // 10 req/15min
export const searchLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 30 }); // 30 req/min

/**
 * Error handling wrapper
 */
export function withErrorHandler(
    handler: (req: NextRequest) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        try {
            return await handler(req);
        } catch (error) {
            console.error('API Error:', error);
            const message = error instanceof Error ? error.message : 'Internal server error';
            return NextResponse.json(
                { success: false, error: message },
                { status: 500 }
            );
        }
    };
}

/**
 * Rate limiting wrapper
 */
export function withRateLimit(
    handler: (req: NextRequest) => Promise<NextResponse>,
    limiter: ReturnType<typeof createRateLimiter>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const { allowed, remaining } = limiter.check(ip);

        if (!allowed) {
            return NextResponse.json(
                { success: false, error: 'تم تجاوز الحد الأقصى للطلبات. حاول بعد قليل.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil(limiter.windowMs / 1000)),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            );
        }

        const response = await handler(req);
        response.headers.set('X-RateLimit-Remaining', String(remaining));
        return response;
    };
}

/**
 * Input sanitization
 */
export function sanitizeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * API response helpers
 */
export function apiSuccess(data: unknown, message?: string) {
    return NextResponse.json({
        success: true,
        data,
        ...(message ? { message } : {}),
    });
}

export function apiError(error: string, status = 400) {
    return NextResponse.json(
        { success: false, error },
        { status }
    );
}
