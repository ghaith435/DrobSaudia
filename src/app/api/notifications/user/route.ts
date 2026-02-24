import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess } from '@/lib/security';

const sampleNotifications = [
    {
        id: 'n1',
        title: '🎉 مرحباً بك في دليل الرياض!',
        body: 'اكتشف المعالم والفعاليات والجولات الصوتية المميزة.',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/',
    },
    {
        id: 'n2',
        title: '🏅 شارة جديدة!',
        body: 'حصلت على شارة "مستكشف" - زرت 5 أماكن مختلفة!',
        type: 'REWARD',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/rewards',
    },
    {
        id: 'n3',
        title: '🎧 جولة صوتية جديدة',
        body: 'أضفنا جولة صوتية جديدة في حي جدة التاريخي. جربها الآن!',
        type: 'ANNOUNCEMENT',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        actionUrl: '/audio-tours',
    },
    {
        id: 'n4',
        title: '🎫 عرض خاص!',
        body: 'خصم 25% على جلسات أورا سبا - استبدل نقاطك الآن.',
        type: 'PROMOTION',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        actionUrl: '/rewards',
    },
];

async function handleGet() {
    const unreadCount = sampleNotifications.filter(n => !n.isRead).length;
    return apiSuccess({
        notifications: sampleNotifications,
        unreadCount,
    });
}

async function handlePut(req: NextRequest) {
    const body = await req.json();
    // Mark as read
    return apiSuccess({ marked: body.notificationIds || [], success: true });
}

export const GET = withRateLimit(withErrorHandler(handleGet), apiLimiter);
export const PUT = withRateLimit(withErrorHandler(handlePut), apiLimiter);
