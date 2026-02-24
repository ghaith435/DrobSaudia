/**
 * Diriyah Historical District Data
 * UNESCO World Heritage Site - Birthplace of Saudi Civilization
 */

export interface DiriyahAttraction {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    history: string;
    historyAr: string;
    coordinates: { lat: number; lng: number };
    images: string[];
    openingHours: {
        days: string;
        daysAr: string;
        hours: string;
    };
    entryFee: {
        adult: number;
        child: number;
        currency: string;
    };
    features: string[];
    featuresAr: string[];
    accessibility: {
        wheelchairAccessible: boolean;
        audioGuide: boolean;
        signLanguage: boolean;
    };
    category: 'heritage' | 'museum' | 'shopping' | 'dining' | 'entertainment';
    rating: number;
    reviewCount: number;
}

export const DIRIYAH_CENTER = {
    lat: 24.7347,
    lng: 46.5769,
};

export const diriyahAttractions: DiriyahAttraction[] = [
    {
        id: 'at-turaif',
        name: 'At-Turaif District',
        nameAr: 'حي الطريف',
        description: 'UNESCO World Heritage Site and the original home of the Saudi royal family. This historic district features traditional Najdi architecture and served as the capital of the First Saudi State.',
        descriptionAr: 'موقع تراث عالمي لليونسكو والمنزل الأصلي للعائلة المالكة السعودية. يتميز هذا الحي التاريخي بالعمارة النجدية التقليدية وكان عاصمة الدولة السعودية الأولى.',
        history: 'Founded in 1446, At-Turaif became the seat of power for the House of Saud in 1744 when Muhammad ibn Saud allied with reformer Muhammad ibn Abd al-Wahhab. The district witnessed the birth of the First Saudi State and remained the capital until 1818.',
        historyAr: 'تأسس حي الطريف عام 1446م، وأصبح مقرًا لآل سعود عام 1744م عندما تحالف محمد بن سعود مع المصلح محمد بن عبد الوهاب. شهد الحي ولادة الدولة السعودية الأولى وظل عاصمتها حتى عام 1818م.',
        coordinates: { lat: 24.7344, lng: 46.5777 },
        images: [
            'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
            'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
        ],
        openingHours: {
            days: 'Sunday - Thursday',
            daysAr: 'الأحد - الخميس',
            hours: '9:00 AM - 9:00 PM',
        },
        entryFee: {
            adult: 50,
            child: 25,
            currency: 'SAR',
        },
        features: ['Guided Tours', 'Audio Guide', 'Museum', 'Photography Allowed', 'Gift Shop'],
        featuresAr: ['جولات مرشدة', 'دليل صوتي', 'متحف', 'التصوير مسموح', 'متجر هدايا'],
        accessibility: {
            wheelchairAccessible: true,
            audioGuide: true,
            signLanguage: true,
        },
        category: 'heritage',
        rating: 4.8,
        reviewCount: 2453,
    },
    {
        id: 'bujairi',
        name: 'Bujairi Terrace',
        nameAr: 'البجيري',
        description: 'A vibrant lifestyle destination featuring world-class dining, cultural experiences, and stunning views of At-Turaif. The terrace blends Saudi heritage with contemporary design.',
        descriptionAr: 'وجهة حياتية نابضة تضم مطاعم عالمية وتجارب ثقافية وإطلالات خلابة على حي الطريف. يمزج البجيري التراث السعودي مع التصميم المعاصر.',
        history: 'Historically, Bujairi was the commercial hub of Diriyah, where traders and scholars gathered. Today, it has been transformed into a premium destination while preserving its historical significance.',
        historyAr: 'تاريخياً، كان البجيري المركز التجاري للدرعية حيث تجمع التجار والعلماء. اليوم، تحول إلى وجهة فاخرة مع الحفاظ على أهميته التاريخية.',
        coordinates: { lat: 24.7356, lng: 46.5752 },
        images: [
            'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800',
        ],
        openingHours: {
            days: 'Daily',
            daysAr: 'يومياً',
            hours: '10:00 AM - 12:00 AM',
        },
        entryFee: {
            adult: 0,
            child: 0,
            currency: 'SAR',
        },
        features: ['Fine Dining', 'Cafes', 'Panoramic Views', 'Cultural Events', 'Night Activities'],
        featuresAr: ['مطاعم فاخرة', 'مقاهي', 'إطلالات بانورامية', 'فعاليات ثقافية', 'أنشطة ليلية'],
        accessibility: {
            wheelchairAccessible: true,
            audioGuide: false,
            signLanguage: false,
        },
        category: 'dining',
        rating: 4.6,
        reviewCount: 1876,
    },
    {
        id: 'diriyah-museum',
        name: 'Diriyah Museum',
        nameAr: 'متحف الدرعية',
        description: 'A comprehensive museum showcasing the history of the First Saudi State, archaeological findings, and the cultural heritage of the region through interactive exhibits.',
        descriptionAr: 'متحف شامل يعرض تاريخ الدولة السعودية الأولى والاكتشافات الأثرية والتراث الثقافي للمنطقة من خلال معارض تفاعلية.',
        history: 'The museum was established to preserve and present the rich history of Diriyah and the founding of the Saudi state. It houses artifacts dating back centuries.',
        historyAr: 'أُنشئ المتحف للحفاظ على تاريخ الدرعية الغني وتقديمه وتأسيس الدولة السعودية. يضم قطعًا أثرية يعود تاريخها إلى قرون.',
        coordinates: { lat: 24.7339, lng: 46.5762 },
        images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        ],
        openingHours: {
            days: 'Saturday - Thursday',
            daysAr: 'السبت - الخميس',
            hours: '9:00 AM - 5:00 PM',
        },
        entryFee: {
            adult: 30,
            child: 15,
            currency: 'SAR',
        },
        features: ['Interactive Exhibits', 'Virtual Reality', 'Guided Tours', 'Research Library', 'Kids Zone'],
        featuresAr: ['معارض تفاعلية', 'واقع افتراضي', 'جولات مرشدة', 'مكتبة بحثية', 'منطقة أطفال'],
        accessibility: {
            wheelchairAccessible: true,
            audioGuide: true,
            signLanguage: true,
        },
        category: 'museum',
        rating: 4.7,
        reviewCount: 1234,
    },
    {
        id: 'diriyah-souq',
        name: 'Diriyah Souq',
        nameAr: 'سوق الدرعية',
        description: 'Traditional Arabian marketplace featuring local crafts, spices, perfumes, and authentic Saudi products in a historic setting.',
        descriptionAr: 'سوق عربي تقليدي يضم الحرف المحلية والتوابل والعطور والمنتجات السعودية الأصيلة في بيئة تاريخية.',
        history: 'The souq has been a gathering place for merchants for centuries. It has been restored to offer an authentic shopping experience while preserving its historical character.',
        historyAr: 'كان السوق مكانًا لتجمع التجار لعدة قرون. تم ترميمه لتقديم تجربة تسوق أصيلة مع الحفاظ على طابعه التاريخي.',
        coordinates: { lat: 24.7351, lng: 46.5745 },
        images: [
            'https://images.unsplash.com/photo-1555529771-122e5d9f2341?w=800',
        ],
        openingHours: {
            days: 'Daily',
            daysAr: 'يومياً',
            hours: '10:00 AM - 10:00 PM',
        },
        entryFee: {
            adult: 0,
            child: 0,
            currency: 'SAR',
        },
        features: ['Local Crafts', 'Traditional Food', 'Spices', 'Perfumes', 'Souvenirs'],
        featuresAr: ['حرف محلية', 'أطعمة تقليدية', 'توابل', 'عطور', 'تذكارات'],
        accessibility: {
            wheelchairAccessible: true,
            audioGuide: false,
            signLanguage: false,
        },
        category: 'shopping',
        rating: 4.5,
        reviewCount: 987,
    },
    {
        id: 'salwa-palace',
        name: 'Salwa Palace',
        nameAr: 'قصر سلوى',
        description: 'The largest structure in At-Turaif, Salwa Palace was the residence of Saudi rulers during the First Saudi State. Its seven connected units showcase the finest Najdi architecture.',
        descriptionAr: 'أكبر مبنى في حي الطريف، كان قصر سلوى مقر إقامة حكام آل سعود خلال الدولة السعودية الأولى. تعرض وحداته السبع المتصلة أرقى العمارة النجدية.',
        history: 'Built over multiple phases, Salwa Palace served as both a residence and administrative center. It witnessed key moments in Saudi history and hosted important diplomatic meetings.',
        historyAr: 'بُني قصر سلوى على مراحل متعددة، وكان مقرًا للإقامة ومركزًا إداريًا. شهد لحظات رئيسية في التاريخ السعودي واستضاف اجتماعات دبلوماسية مهمة.',
        coordinates: { lat: 24.7346, lng: 46.5780 },
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        ],
        openingHours: {
            days: 'Sunday - Thursday',
            daysAr: 'الأحد - الخميس',
            hours: '9:00 AM - 6:00 PM',
        },
        entryFee: {
            adult: 40,
            child: 20,
            currency: 'SAR',
        },
        features: ['Historic Tours', 'Architecture Tours', 'Photography', 'Audio Guide'],
        featuresAr: ['جولات تاريخية', 'جولات معمارية', 'تصوير', 'دليل صوتي'],
        accessibility: {
            wheelchairAccessible: false,
            audioGuide: true,
            signLanguage: false,
        },
        category: 'heritage',
        rating: 4.9,
        reviewCount: 756,
    },
];

/**
 * Get attraction by ID
 */
export function getAttractionById(id: string): DiriyahAttraction | undefined {
    return diriyahAttractions.find(a => a.id === id);
}

/**
 * Get attractions by category
 */
export function getAttractionsByCategory(category: DiriyahAttraction['category']): DiriyahAttraction[] {
    return diriyahAttractions.filter(a => a.category === category);
}

/**
 * Get wheelchair accessible attractions
 */
export function getAccessibleAttractions(): DiriyahAttraction[] {
    return diriyahAttractions.filter(a => a.accessibility.wheelchairAccessible);
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get nearest attractions from a given location
 */
export function getNearestAttractions(
    userCoords: { lat: number; lng: number },
    limit: number = 5
): Array<DiriyahAttraction & { distance: number }> {
    return diriyahAttractions
        .map(attraction => ({
            ...attraction,
            distance: calculateDistance(userCoords, attraction.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
}
