// فعاليات موسم الرياض والفعاليات المؤقتة

export interface Event {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    startDate: string;
    endDate: string;
    location: {
        name: string;
        nameAr: string;
        latitude: number;
        longitude: number;
        address: string;
    };
    category: 'riyadh_season' | 'cultural' | 'sports' | 'entertainment' | 'food' | 'music';
    price: 'free' | 'paid';
    priceRange?: string;
    website?: string;
    isActive: boolean;
    tags: string[];
    tagsAr: string[];
}

export const events: Event[] = [
    {
        id: 'riyadh-season-2026',
        name: 'Riyadh Season 2026',
        nameAr: 'موسم الرياض 2026',
        description: 'The biggest entertainment event in the Middle East, featuring concerts, shows, and activities across multiple zones.',
        descriptionAr: 'أكبر حدث ترفيهي في الشرق الأوسط، يضم حفلات موسيقية وعروض وأنشطة في مناطق متعددة.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
        startDate: '2025-10-15',
        endDate: '2026-03-15',
        location: {
            name: 'Boulevard City',
            nameAr: 'بوليفارد سيتي',
            latitude: 24.7890,
            longitude: 46.6110,
            address: 'Hittin District, Riyadh',
        },
        category: 'riyadh_season',
        price: 'paid',
        priceRange: 'SAR 50-500',
        website: 'https://riyadhseason.sa',
        isActive: true,
        tags: ['Entertainment', 'Music', 'Food', 'Family'],
        tagsAr: ['ترفيه', 'موسيقى', 'طعام', 'عائلي'],
    },
    {
        id: 'winter-wonderland-2026',
        name: 'Winter Wonderland',
        nameAr: 'وينتر وندرلاند',
        description: 'European-style winter festival with ice skating, Christmas markets, and themed attractions.',
        descriptionAr: 'مهرجان شتوي على الطراز الأوروبي مع التزلج على الجليد وأسواق عيد الميلاد والمعالم السياحية المميزة.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        startDate: '2025-12-01',
        endDate: '2026-02-28',
        location: {
            name: 'Boulevard World',
            nameAr: 'بوليفارد وورلد',
            latitude: 24.7880,
            longitude: 46.6100,
            address: 'Hittin District, Riyadh',
        },
        category: 'riyadh_season',
        price: 'paid',
        priceRange: 'SAR 100-300',
        isActive: true,
        tags: ['Winter', 'Family', 'Ice Skating', 'Entertainment'],
        tagsAr: ['شتاء', 'عائلي', 'تزلج', 'ترفيه'],
    },
    {
        id: 'saudi-cup-2026',
        name: 'Saudi Cup 2026',
        nameAr: 'كأس السعودية 2026',
        description: 'The world\'s richest horse race, featuring international horses and jockeys.',
        descriptionAr: 'أغلى سباق خيل في العالم، يضم خيولاً وفرساناً دوليين.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        startDate: '2026-02-20',
        endDate: '2026-02-22',
        location: {
            name: 'King Abdulaziz Racecourse',
            nameAr: 'ميدان الملك عبدالعزيز للفروسية',
            latitude: 24.6800,
            longitude: 46.7500,
            address: 'Janadriyah, Riyadh',
        },
        category: 'sports',
        price: 'paid',
        priceRange: 'SAR 200-5000',
        website: 'https://thesaudicup.com.sa',
        isActive: true,
        tags: ['Sports', 'Horse Racing', 'VIP', 'International'],
        tagsAr: ['رياضة', 'سباق خيل', 'VIP', 'دولي'],
    },
    {
        id: 'diriyah-seasons',
        name: 'Diriyah Season',
        nameAr: 'موسم الدرعية',
        description: 'Historic and cultural events at the UNESCO World Heritage site of Diriyah.',
        descriptionAr: 'فعاليات تاريخية وثقافية في موقع الدرعية المسجل في التراث العالمي.',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&h=600&fit=crop',
        startDate: '2025-11-01',
        endDate: '2026-02-28',
        location: {
            name: 'Diriyah Gate',
            nameAr: 'بوابة الدرعية',
            latitude: 24.7341,
            longitude: 46.5765,
            address: 'Diriyah, Riyadh',
        },
        category: 'cultural',
        price: 'paid',
        priceRange: 'SAR 50-200',
        isActive: true,
        tags: ['Culture', 'History', 'Heritage', 'Food'],
        tagsAr: ['ثقافة', 'تاريخ', 'تراث', 'طعام'],
    },
    {
        id: 'food-festival-2026',
        name: 'Riyadh Food Festival',
        nameAr: 'مهرجان الرياض للطعام',
        description: 'Annual food festival featuring local and international cuisines, celebrity chefs, and cooking competitions.',
        descriptionAr: 'مهرجان الطعام السنوي يضم مأكولات محلية وعالمية وطهاة مشاهير ومسابقات طبخ.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        startDate: '2026-01-15',
        endDate: '2026-01-25',
        location: {
            name: 'Riyadh Front',
            nameAr: 'الرياض فرونت',
            latitude: 24.8000,
            longitude: 46.6500,
            address: 'North Riyadh, Riyadh',
        },
        category: 'food',
        price: 'free',
        isActive: true,
        tags: ['Food', 'Cooking', 'International', 'Family'],
        tagsAr: ['طعام', 'طبخ', 'دولي', 'عائلي'],
    },
    {
        id: 'mdlbeast-soundstorm',
        name: 'Soundstorm 2026',
        nameAr: 'ساوندستورم 2026',
        description: 'The region\'s biggest music festival featuring world-class DJs and electronic music.',
        descriptionAr: 'أكبر مهرجان موسيقي في المنطقة يضم أشهر منسقي الأغاني والموسيقى الإلكترونية.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
        startDate: '2025-12-19',
        endDate: '2025-12-21',
        location: {
            name: 'MDLBEAST Grounds',
            nameAr: 'أرض MDLBEAST',
            latitude: 24.7500,
            longitude: 46.5000,
            address: 'Banban, Riyadh',
        },
        category: 'music',
        price: 'paid',
        priceRange: 'SAR 500-2000',
        website: 'https://soundstorm.com',
        isActive: true,
        tags: ['Music', 'EDM', 'Festival', 'Nightlife'],
        tagsAr: ['موسيقى', 'إلكترونية', 'مهرجان', 'ليلي'],
    },
];

// Helper functions
export function getActiveEvents(currentDate: Date = new Date()): Event[] {
    return events.filter(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return currentDate >= start && currentDate <= end && event.isActive;
    });
}

export function getUpcomingEvents(currentDate: Date = new Date()): Event[] {
    return events.filter(event => {
        const start = new Date(event.startDate);
        return start > currentDate && event.isActive;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function getEventsByCategory(category: Event['category']): Event[] {
    return events.filter(event => event.category === category);
}

export function formatEventDate(startDate: string, endDate: string, locale: 'en' | 'ar' = 'en'): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    if (locale === 'ar') {
        return `${start.toLocaleDateString('ar-SA', options)} - ${end.toLocaleDateString('ar-SA', options)}`;
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

export const eventCategoryIcons: Record<Event['category'], string> = {
    riyadh_season: '🎭',
    cultural: '🏛️',
    sports: '🏆',
    entertainment: '🎪',
    food: '🍽️',
    music: '🎵',
};
