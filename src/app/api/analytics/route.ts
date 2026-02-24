import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess } from '@/lib/security';

async function handler(req: NextRequest) {
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || '30d';

    // Generate analytics data
    const now = new Date();
    const analytics = {
        overview: {
            totalUsers: 15420,
            activeUsers: 3280,
            totalPlaces: 156,
            totalReviews: 890,
            totalTours: 24,
            totalBookings: 342,
            revenue: 45680,
            avgRating: 4.3,
        },
        growth: {
            users: { current: 3280, previous: 2890, change: 13.5 },
            reviews: { current: 89, previous: 72, change: 23.6 },
            bookings: { current: 42, previous: 38, change: 10.5 },
            revenue: { current: 4568, previous: 3890, change: 17.4 },
        },
        topPlaces: [
            { id: '1', name: 'برج المملكة', views: 4520, rating: 4.7, reviews: 156 },
            { id: '2', name: 'الدرعية', views: 3890, rating: 4.8, reviews: 132 },
            { id: '3', name: 'بوليفارد الرياض', views: 3450, rating: 4.5, reviews: 98 },
            { id: '4', name: 'المتحف الوطني', views: 2780, rating: 4.6, reviews: 87 },
            { id: '5', name: 'حافة العالم', views: 2560, rating: 4.9, reviews: 76 },
        ],
        userActivity: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(now.getTime() - (29 - i) * 86400000).toISOString().split('T')[0],
            users: Math.floor(Math.random() * 200) + 100,
            views: Math.floor(Math.random() * 1000) + 500,
            reviews: Math.floor(Math.random() * 10) + 1,
        })),
        categories: [
            { name: 'معالم', count: 45, percentage: 29 },
            { name: 'مطاعم', count: 38, percentage: 24 },
            { name: 'ترفيه', count: 28, percentage: 18 },
            { name: 'طبيعة', count: 22, percentage: 14 },
            { name: 'تاريخي', count: 15, percentage: 10 },
            { name: 'تسوق', count: 8, percentage: 5 },
        ],
        recentActivity: [
            { type: 'review', user: 'أحمد', action: 'كتب مراجعة عن برج المملكة', time: '5 دقائق' },
            { type: 'booking', user: 'سارة', action: 'حجزت جولة في الدرعية', time: '15 دقيقة' },
            { type: 'register', user: 'محمد', action: 'سجل حساب جديد', time: '30 دقيقة' },
            { type: 'review', user: 'نورة', action: 'كتبت مراجعة عن بوليفارد الرياض', time: 'ساعة' },
            { type: 'tour', user: 'خالد', action: 'أكمل جولة صوتية', time: 'ساعتين' },
        ],
        heatmap: {
            // Hourly distribution of activity
            hours: Array.from({ length: 24 }, (_, h) => ({
                hour: h,
                activity: h >= 8 && h <= 23 ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 20),
            })),
            // Day of week distribution
            weekdays: [
                { day: 'الأحد', activity: 85 },
                { day: 'الإثنين', activity: 72 },
                { day: 'الثلاثاء', activity: 68 },
                { day: 'الأربعاء', activity: 75 },
                { day: 'الخميس', activity: 95 },
                { day: 'الجمعة', activity: 100 },
                { day: 'السبت', activity: 88 },
            ],
        },
        demographics: {
            ageGroups: [
                { range: '18-24', percentage: 22 },
                { range: '25-34', percentage: 35 },
                { range: '35-44', percentage: 25 },
                { range: '45-54', percentage: 12 },
                { range: '55+', percentage: 6 },
            ],
            languages: [
                { lang: 'العربية', percentage: 65 },
                { lang: 'English', percentage: 28 },
                { lang: 'Other', percentage: 7 },
            ],
        },
    };

    return apiSuccess(analytics);
}

export const GET = withRateLimit(withErrorHandler(handler), apiLimiter);
