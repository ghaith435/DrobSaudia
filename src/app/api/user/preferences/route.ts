export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess } from '@/lib/security';

async function handleGet() {
    return apiSuccess({
        language: 'ar',
        theme: 'dark',
        pushEnabled: true,
        emailEnabled: true,
        categories: [],
        locationEnabled: true,
        notificationSound: true,
    });
}

async function handlePut(req: NextRequest) {
    const body = await req.json();
    // In production, save to database
    return apiSuccess({
        ...body,
        updatedAt: new Date().toISOString(),
    }, 'تم تحديث التفضيلات بنجاح');
}

export const GET = withRateLimit(withErrorHandler(handleGet), apiLimiter);
export const PUT = withRateLimit(withErrorHandler(handlePut), apiLimiter);
