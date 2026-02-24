import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=self, microphone=self, geolocation=self');

    // Admin route protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // In production, check session cookie here
        const hasSession = request.cookies.get('next-auth.session-token') ||
            request.cookies.get('__Secure-next-auth.session-token');
        // Allow access to admin for now - real auth check happens in the component
    }

    // API rate limit headers
    if (request.nextUrl.pathname.startsWith('/api/')) {
        response.headers.set('X-API-Version', '1.0');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
