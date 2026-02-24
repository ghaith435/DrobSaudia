import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess, apiError } from '@/lib/security';

// Rewards/XP engine
const XP_CONFIG = {
    VISIT_PLACE: 50,
    WRITE_REVIEW: 100,
    COMPLETE_TOUR: 200,
    SHARE_TRIP: 75,
    DAILY_LOGIN: 25,
    FIRST_VISIT: 150,
    PHOTO_UPLOAD: 30,
    COMPLETE_CHALLENGE: 300,
};

const BADGES = [
    { id: "explorer", name: "مستكشف", nameAr: "مستكشف", icon: "🧭", description: "زُر 5 أماكن مختلفة", requirement: { type: "visits", count: 5 }, xp: 200 },
    { id: "reviewer", name: "ناقد", nameAr: "ناقد", icon: "✍️", description: "اكتب 3 مراجعات", requirement: { type: "reviews", count: 3 }, xp: 150 },
    { id: "guide_master", name: "خبير الجولات", nameAr: "خبير الجولات", icon: "🎧", description: "أكمل 3 جولات صوتية", requirement: { type: "tours", count: 3 }, xp: 250 },
    { id: "photographer", name: "مصوّر", nameAr: "مصوّر", icon: "📸", description: "ارفع 10 صور", requirement: { type: "photos", count: 10 }, xp: 200 },
    { id: "planner", name: "مخطط رحلات", nameAr: "مخطط رحلات", icon: "📅", description: "أنشئ 3 رحلات", requirement: { type: "trips", count: 3 }, xp: 150 },
    { id: "social", name: "اجتماعي", nameAr: "اجتماعي", icon: "🤝", description: "شارك 5 رحلات", requirement: { type: "shares", count: 5 }, xp: 175 },
    { id: "diriyah_expert", name: "خبير الدرعية", nameAr: "خبير الدرعية", icon: "🏛️", description: "زُر جميع معالم الدرعية", requirement: { type: "diriyah_visits", count: 4 }, xp: 500 },
    { id: "night_owl", name: "بومة الليل", nameAr: "بومة الليل", icon: "🦉", description: "زُر مكان بعد الساعة 10 مساءً", requirement: { type: "night_visit", count: 1 }, xp: 100 },
    { id: "early_bird", name: "الطائر المبكر", nameAr: "الطائر المبكر", icon: "🐦", description: "زُر مكان قبل الساعة 7 صباحاً", requirement: { type: "morning_visit", count: 1 }, xp: 100 },
    { id: "champion", name: "بطل", nameAr: "بطل", icon: "🏆", description: "اجمع 5000 نقطة خبرة", requirement: { type: "total_xp", count: 5000 }, xp: 1000 },
];

const LEVELS = [
    { level: 1, name: "مبتدئ", xpRequired: 0 },
    { level: 2, name: "مسافر", xpRequired: 200 },
    { level: 3, name: "مستكشف", xpRequired: 500 },
    { level: 4, name: "رحّال", xpRequired: 1000 },
    { level: 5, name: "خبير", xpRequired: 2000 },
    { level: 6, name: "مرشد", xpRequired: 3500 },
    { level: 7, name: "أسطورة", xpRequired: 5000 },
    { level: 8, name: "حارس التراث", xpRequired: 8000 },
    { level: 9, name: "سفير السياحة", xpRequired: 12000 },
    { level: 10, name: "أيقونة", xpRequired: 20000 },
];

const CHALLENGES = [
    { id: "weekly_explorer", name: "مستكشف الأسبوع", nameAr: "مستكشف الأسبوع", icon: "🗺️", description: "زُر 3 أماكن هذا الأسبوع", xpReward: 300, type: "weekly", target: 3, targetType: "visits" },
    { id: "review_writer", name: "كاتب المراجعات", nameAr: "كاتب المراجعات", icon: "📝", description: "اكتب مراجعتين هذا الأسبوع", xpReward: 200, type: "weekly", target: 2, targetType: "reviews" },
    { id: "daily_check", name: "تسجيل يومي", nameAr: "تسجيل يومي", icon: "📅", description: "سجل دخولك اليوم", xpReward: 25, type: "daily", target: 1, targetType: "login" },
    { id: "photo_week", name: "أسبوع التصوير", nameAr: "أسبوع التصوير", icon: "📷", description: "ارفع 5 صور هذا الأسبوع", xpReward: 250, type: "weekly", target: 5, targetType: "photos" },
    { id: "tour_complete", name: "أكمل جولة", nameAr: "أكمل جولة", icon: "🎧", description: "أكمل جولة صوتية واحدة هذا الأسبوع", xpReward: 200, type: "weekly", target: 1, targetType: "tours" },
];

const PARTNER_REWARDS = [
    { id: "coffee_15", partnerId: "p1", partnerName: "Barn's Coffee", partnerNameAr: "بارنز كوفي", logo: "☕", discount: "15%", pointsCost: 500, description: "خصم 15% على جميع المشروبات" },
    { id: "restaurant_20", partnerId: "p2", partnerName: "The Globe", partnerNameAr: "ذا غلوب", logo: "🍽️", discount: "20%", pointsCost: 800, description: "خصم 20% على العشاء" },
    { id: "hotel_10", partnerId: "p3", partnerName: "Hilton Riyadh", partnerNameAr: "هيلتون الرياض", logo: "🏨", discount: "10%", pointsCost: 1200, description: "خصم 10% على الإقامة" },
    { id: "spa_25", partnerId: "p4", partnerName: "Aura Spa", partnerNameAr: "أورا سبا", logo: "💆", discount: "25%", pointsCost: 600, description: "خصم 25% على جلسات السبا" },
    { id: "museum_free", partnerId: "p5", partnerName: "National Museum", partnerNameAr: "المتحف الوطني", logo: "🏛️", discount: "مجانًا", pointsCost: 300, description: "دخول مجاني للمتحف" },
];

function getLevel(totalXp: number) {
    let currentLevel = LEVELS[0];
    for (const level of LEVELS) {
        if (totalXp >= level.xpRequired) currentLevel = level;
        else break;
    }
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    return {
        ...currentLevel,
        nextLevel,
        progress: nextLevel
            ? ((totalXp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
            : 100,
    };
}

async function handleGet(req: NextRequest) {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'profile';

    if (action === 'profile') {
        const userXp = {
            totalXp: 1250,
            points: 800,
            visitCount: 12,
            tourCount: 3,
            reviewCount: 5,
        };
        const level = getLevel(userXp.totalXp);
        const earnedBadges = BADGES.slice(0, 3).map(b => ({ ...b, earnedAt: new Date().toISOString() }));

        return apiSuccess({
            xp: userXp,
            level,
            badges: { earned: earnedBadges, available: BADGES },
            challenges: CHALLENGES,
            partnerRewards: PARTNER_REWARDS,
        });
    }

    if (action === 'badges') {
        return apiSuccess(BADGES);
    }

    if (action === 'challenges') {
        return apiSuccess(CHALLENGES);
    }

    if (action === 'rewards') {
        return apiSuccess(PARTNER_REWARDS);
    }

    if (action === 'leaderboard') {
        const leaderboard = [
            { rank: 1, name: "أحمد", xp: 5200, level: 7, badges: 8, avatar: "👤" },
            { rank: 2, name: "سارة", xp: 4800, level: 6, badges: 7, avatar: "👤" },
            { rank: 3, name: "محمد", xp: 3900, level: 6, badges: 6, avatar: "👤" },
            { rank: 4, name: "نورة", xp: 3200, level: 5, badges: 5, avatar: "👤" },
            { rank: 5, name: "خالد", xp: 2800, level: 5, badges: 4, avatar: "👤" },
            { rank: 6, name: "فاطمة", xp: 2100, level: 4, badges: 4, avatar: "👤" },
            { rank: 7, name: "عبدالله", xp: 1900, level: 4, badges: 3, avatar: "👤" },
            { rank: 8, name: "لمى", xp: 1500, level: 3, badges: 3, avatar: "👤" },
            { rank: 9, name: "عمر", xp: 1250, level: 3, badges: 3, avatar: "👤" },
            { rank: 10, name: "ريم", xp: 900, level: 2, badges: 2, avatar: "👤" },
        ];
        return apiSuccess(leaderboard);
    }

    return apiError('Unknown action', 400);
}

async function handlePost(req: NextRequest) {
    const body = await req.json();
    const { action, placeId, tourId } = body;

    if (!action) return apiError('Action is required', 400);

    const xpConfig = XP_CONFIG as Record<string, number>;
    const xpEarned = xpConfig[action.toUpperCase()] || 0;

    if (xpEarned === 0) return apiError('Invalid action', 400);

    // In production, update database
    const result = {
        xpEarned,
        action,
        placeId,
        tourId,
        newTotal: 1250 + xpEarned,
        level: getLevel(1250 + xpEarned),
        message: `حصلت على ${xpEarned} نقطة خبرة! 🎉`,
    };

    // Check for new badges
    const newBadges: typeof BADGES = [];
    // Simplified check - in production this would check actual user stats
    if (action === 'VISIT_PLACE' && result.newTotal > 500) {
        newBadges.push(BADGES[0]); // explorer
    }

    return apiSuccess({ ...result, newBadges });
}

export const GET = withRateLimit(withErrorHandler(handleGet), apiLimiter);
export const POST = withRateLimit(withErrorHandler(handlePost), apiLimiter);
