// نظام الأوسمة والمكافآت - Badges & Rewards System

export interface Badge {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    icon: string;
    category: 'exploration' | 'history' | 'nature' | 'social' | 'special' | 'seasonal';
    xpReward: number;
    requirement: {
        type: 'visit_count' | 'tour_complete' | 'category_visits' | 'streak' | 'special';
        target: number;
        categoryFilter?: string;
        tourId?: string;
    };
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked?: boolean;
    progress?: number;
    earnedAt?: Date;
}

export const badges: Badge[] = [
    // Exploration Badges
    {
        id: 'first-steps',
        name: 'First Steps',
        nameAr: 'الخطوات الأولى',
        description: 'Visit your first tourist attraction',
        descriptionAr: 'زُر أول معلم سياحي',
        icon: '👣',
        category: 'exploration',
        xpReward: 50,
        requirement: { type: 'visit_count', target: 1 },
        rarity: 'common',
    },
    {
        id: 'riyadh-explorer',
        name: 'Riyadh Explorer',
        nameAr: 'مستكشف الرياض',
        description: 'Visit 5 different tourist attractions',
        descriptionAr: 'زُر 5 معالم سياحية مختلفة',
        icon: '🧭',
        category: 'exploration',
        xpReward: 200,
        requirement: { type: 'visit_count', target: 5 },
        rarity: 'common',
    },
    {
        id: 'city-master',
        name: 'City Master',
        nameAr: 'خبير المدينة',
        description: 'Visit 15 different tourist attractions',
        descriptionAr: 'زُر 15 معلم سياحي مختلف',
        icon: '🏆',
        category: 'exploration',
        xpReward: 500,
        requirement: { type: 'visit_count', target: 15 },
        rarity: 'rare',
    },
    {
        id: 'riyadh-legend',
        name: 'Riyadh Legend',
        nameAr: 'أسطورة الرياض',
        description: 'Visit all tourist attractions in the app',
        descriptionAr: 'زُر جميع المعالم السياحية في التطبيق',
        icon: '👑',
        category: 'exploration',
        xpReward: 2000,
        requirement: { type: 'visit_count', target: 50 },
        rarity: 'legendary',
    },

    // History Badges
    {
        id: 'history-buff',
        name: 'History Buff',
        nameAr: 'مؤرخ الرياض',
        description: 'Visit 5 historical sites',
        descriptionAr: 'زُر 5 مواقع تاريخية',
        icon: '📜',
        category: 'history',
        xpReward: 300,
        requirement: { type: 'category_visits', target: 5, categoryFilter: 'History' },
        rarity: 'rare',
    },
    {
        id: 'heritage-guardian',
        name: 'Heritage Guardian',
        nameAr: 'حارس التراث',
        description: 'Complete the Bujairi Terrace Tour',
        descriptionAr: 'أكمل رحلة مطل البجيري',
        icon: '🏛️',
        category: 'history',
        xpReward: 600,
        requirement: { type: 'tour_complete', target: 1, tourId: 'bujairi-tour' },
        rarity: 'epic',
    },
    {
        id: 'unesco-collector',
        name: 'UNESCO Collector',
        nameAr: 'جامع مواقع اليونسكو',
        description: 'Visit all UNESCO World Heritage sites in Riyadh',
        descriptionAr: 'زُر جميع مواقع اليونسكو في الرياض',
        icon: '🌍',
        category: 'history',
        xpReward: 1000,
        requirement: { type: 'special', target: 1 },
        rarity: 'legendary',
    },

    // Nature Badges
    {
        id: 'nature-lover',
        name: 'Nature Lover',
        nameAr: 'عاشق الطبيعة',
        description: 'Visit 3 nature attractions',
        descriptionAr: 'زُر 3 أماكن طبيعية',
        icon: '🌿',
        category: 'nature',
        xpReward: 200,
        requirement: { type: 'category_visits', target: 3, categoryFilter: 'Nature' },
        rarity: 'common',
    },
    {
        id: 'wadi-explorer',
        name: 'Wadi Explorer',
        nameAr: 'مستكشف الوادي',
        description: 'Complete the Wadi Hanifa Experience',
        descriptionAr: 'أكمل رحلة وادي حنيفة',
        icon: '🏞️',
        category: 'nature',
        xpReward: 700,
        requirement: { type: 'tour_complete', target: 1, tourId: 'wadi-hanifa-tour' },
        rarity: 'epic',
    },
    {
        id: 'sunset-chaser',
        name: 'Sunset Chaser',
        nameAr: 'مطارد الغروب',
        description: 'Visit Edge of the World',
        descriptionAr: 'زُر حافة العالم',
        icon: '🌅',
        category: 'nature',
        xpReward: 500,
        requirement: { type: 'special', target: 1 },
        rarity: 'rare',
    },

    // Social Badges
    {
        id: 'reviewer',
        name: 'Reviewer',
        nameAr: 'مُقيّم',
        description: 'Write your first review',
        descriptionAr: 'اكتب أول تقييم لك',
        icon: '✍️',
        category: 'social',
        xpReward: 100,
        requirement: { type: 'special', target: 1 },
        rarity: 'common',
    },
    {
        id: 'influencer',
        name: 'Influencer',
        nameAr: 'مؤثر',
        description: 'Write 10 reviews',
        descriptionAr: 'اكتب 10 تقييمات',
        icon: '⭐',
        category: 'social',
        xpReward: 400,
        requirement: { type: 'special', target: 10 },
        rarity: 'rare',
    },
    {
        id: 'photography-pro',
        name: 'Photography Pro',
        nameAr: 'محترف التصوير',
        description: 'Upload 20 photos to reviews',
        descriptionAr: 'ارفع 20 صورة في التقييمات',
        icon: '📸',
        category: 'social',
        xpReward: 500,
        requirement: { type: 'special', target: 20 },
        rarity: 'epic',
    },

    // Special Badges
    {
        id: 'modern-explorer',
        name: 'Modern Explorer',
        nameAr: 'مستكشف الحداثة',
        description: 'Complete the KAFD Tour',
        descriptionAr: 'أكمل رحلة كافد',
        icon: '🏗️',
        category: 'special',
        xpReward: 500,
        requirement: { type: 'tour_complete', target: 1, tourId: 'kafd-tour' },
        rarity: 'epic',
    },
    {
        id: 'gardens-master',
        name: 'Gardens Master',
        nameAr: 'خبير الحدائق',
        description: 'Complete the Gardens of Riyadh Tour',
        descriptionAr: 'أكمل رحلة حدائق الرياض',
        icon: '🌳',
        category: 'special',
        xpReward: 400,
        requirement: { type: 'tour_complete', target: 1, tourId: 'gardens-tour' },
        rarity: 'rare',
    },
    {
        id: 'tour-master',
        name: 'Tour Master',
        nameAr: 'خبير الجولات',
        description: 'Complete all 4 pre-defined tours',
        descriptionAr: 'أكمل جميع الرحلات الأربع',
        icon: '🎯',
        category: 'special',
        xpReward: 2000,
        requirement: { type: 'special', target: 4 },
        rarity: 'legendary',
    },

    // Seasonal Badges
    {
        id: 'riyadh-season-2026',
        name: 'Riyadh Season 2026',
        nameAr: 'موسم الرياض 2026',
        description: 'Visit a Riyadh Season event',
        descriptionAr: 'زُر فعالية من موسم الرياض',
        icon: '🎪',
        category: 'seasonal',
        xpReward: 300,
        requirement: { type: 'special', target: 1 },
        rarity: 'rare',
    },
    {
        id: 'night-owl',
        name: 'Night Owl',
        nameAr: 'بومة الليل',
        description: 'Visit 3 places after 10 PM',
        descriptionAr: 'زُر 3 أماكن بعد الساعة 10 مساءً',
        icon: '🦉',
        category: 'seasonal',
        xpReward: 250,
        requirement: { type: 'special', target: 3 },
        rarity: 'rare',
    },
    {
        id: 'early-bird',
        name: 'Early Bird',
        nameAr: 'طائر مبكر',
        description: 'Visit 3 places before 8 AM',
        descriptionAr: 'زُر 3 أماكن قبل الساعة 8 صباحاً',
        icon: '🐦',
        category: 'seasonal',
        xpReward: 250,
        requirement: { type: 'special', target: 3 },
        rarity: 'rare',
    },
    {
        id: 'weekend-warrior',
        name: 'Weekend Warrior',
        nameAr: 'محارب نهاية الأسبوع',
        description: 'Visit 5 places on a single weekend',
        descriptionAr: 'زُر 5 أماكن في نهاية أسبوع واحدة',
        icon: '⚔️',
        category: 'seasonal',
        xpReward: 400,
        requirement: { type: 'streak', target: 5 },
        rarity: 'epic',
    },
];

// XP Level System
export interface Level {
    level: number;
    name: string;
    nameAr: string;
    minXp: number;
    maxXp: number;
    icon: string;
    perks: string[];
    perksAr: string[];
}

export const levels: Level[] = [
    {
        level: 1,
        name: 'Newcomer',
        nameAr: 'زائر جديد',
        minXp: 0,
        maxXp: 99,
        icon: '🌱',
        perks: ['Access to basic features'],
        perksAr: ['الوصول للميزات الأساسية'],
    },
    {
        level: 2,
        name: 'Tourist',
        nameAr: 'سائح',
        minXp: 100,
        maxXp: 299,
        icon: '🎒',
        perks: ['5% discount on partner offers'],
        perksAr: ['خصم 5% على عروض الشركاء'],
    },
    {
        level: 3,
        name: 'Explorer',
        nameAr: 'مستكشف',
        minXp: 300,
        maxXp: 599,
        icon: '🧭',
        perks: ['10% discount', 'Priority booking'],
        perksAr: ['خصم 10%', 'أولوية الحجز'],
    },
    {
        level: 4,
        name: 'Adventurer',
        nameAr: 'مغامر',
        minXp: 600,
        maxXp: 999,
        icon: '⛺',
        perks: ['15% discount', 'Exclusive tours'],
        perksAr: ['خصم 15%', 'جولات حصرية'],
    },
    {
        level: 5,
        name: 'Master Explorer',
        nameAr: 'خبير الاستكشاف',
        minXp: 1000,
        maxXp: 1999,
        icon: '🏅',
        perks: ['20% discount', 'VIP access'],
        perksAr: ['خصم 20%', 'وصول VIP'],
    },
    {
        level: 6,
        name: 'Legend',
        nameAr: 'أسطورة',
        minXp: 2000,
        maxXp: 3999,
        icon: '🏆',
        perks: ['25% discount', 'VIP + Free tours'],
        perksAr: ['خصم 25%', 'VIP + جولات مجانية'],
    },
    {
        level: 7,
        name: 'Riyadh Ambassador',
        nameAr: 'سفير الرياض',
        minXp: 4000,
        maxXp: Infinity,
        icon: '👑',
        perks: ['30% discount', 'All perks', 'Exclusive events'],
        perksAr: ['خصم 30%', 'جميع المزايا', 'فعاليات حصرية'],
    },
];

export function getLevelForXp(xp: number): Level {
    return levels.find(l => xp >= l.minXp && xp <= l.maxXp) || levels[0];
}

export function getNextLevel(xp: number): Level | null {
    const currentLevel = getLevelForXp(xp);
    const nextIndex = levels.indexOf(currentLevel) + 1;
    return nextIndex < levels.length ? levels[nextIndex] : null;
}

export function getXpProgress(xp: number): number {
    const level = getLevelForXp(xp);
    const levelRange = level.maxXp - level.minXp;
    const progress = xp - level.minXp;
    return Math.min((progress / levelRange) * 100, 100);
}

export function getRarityColor(rarity: Badge['rarity']): string {
    const colors: Record<Badge['rarity'], string> = {
        common: '#9ca3af',
        rare: '#3b82f6',
        epic: '#a855f7',
        legendary: '#f59e0b',
    };
    return colors[rarity];
}
