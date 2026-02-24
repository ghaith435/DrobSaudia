export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess, apiError } from '@/lib/security';

// Bookings management API

const sampleBookings = [
    {
        id: 'b1',
        bookingNumber: 'REXP-2026-00001',
        userId: 'u1',
        experienceId: 'e1',
        experienceTitle: 'جولة تاريخية في الدرعية',
        guideId: 'g1',
        guideName: 'أحمد العتيبي',
        date: '2026-02-15',
        startTime: '09:00',
        endTime: '12:00',
        duration: 180,
        guestCount: 2,
        totalAmount: 300,
        currency: 'SAR',
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        createdAt: '2026-02-10T10:00:00Z',
    },
    {
        id: 'b2',
        bookingNumber: 'REXP-2026-00002',
        userId: 'u1',
        experienceId: 'e2',
        experienceTitle: 'ورشة طبخ سعودي',
        guideId: 'g2',
        guideName: 'نورة الشمري',
        date: '2026-02-20',
        startTime: '16:00',
        endTime: '19:00',
        duration: 180,
        guestCount: 4,
        totalAmount: 500,
        currency: 'SAR',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: '2026-02-10T12:00:00Z',
    },
];

async function handleGet(req: NextRequest) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let bookings = sampleBookings;
    if (status) {
        bookings = bookings.filter(b => b.status === status.toUpperCase());
    }

    return apiSuccess(bookings);
}

async function handlePost(req: NextRequest) {
    const body = await req.json();

    if (!body.experienceId || !body.date || !body.guestCount) {
        return apiError('Missing required fields', 400);
    }

    const newBooking = {
        id: `b${Date.now()}`,
        bookingNumber: `REXP-2026-${String(Date.now()).slice(-5)}`,
        userId: 'current-user',
        experienceId: body.experienceId,
        experienceTitle: body.experienceTitle || 'تجربة جديدة',
        guideId: body.guideId || 'g1',
        guideName: body.guideName || 'المرشد',
        date: body.date,
        startTime: body.startTime || '09:00',
        endTime: body.endTime || '12:00',
        duration: body.duration || 180,
        guestCount: body.guestCount,
        totalAmount: body.totalAmount || 0,
        currency: 'SAR',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: body.specialRequests,
        createdAt: new Date().toISOString(),
    };

    return apiSuccess(newBooking, 'تم إنشاء الحجز بنجاح');
}

export const GET = withRateLimit(withErrorHandler(handleGet), apiLimiter);
export const POST = withRateLimit(withErrorHandler(handlePost), apiLimiter);
