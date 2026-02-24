// Riyadh Tourism Platform - Pre-defined Tours Data
// الرحلات المتكاملة

export interface TourWaypoint {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    latitude: number;
    longitude: number;
    order: number;
    duration: number; // minutes to spend
    activities: string[];
    activitiesAr: string[];
    image: string;
}

export interface Tour {
    id: string;
    name: string;
    nameAr: string;
    subtitle: string;
    subtitleAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    gallery: string[];
    category: string[];
    categoryAr: string[];
    difficulty: 'easy' | 'moderate' | 'challenging';
    duration: number; // total minutes
    distance: number; // km
    startPoint: {
        name: string;
        nameAr: string;
        latitude: number;
        longitude: number;
    };
    waypoints: TourWaypoint[];
    highlights: string[];
    highlightsAr: string[];
    bestTime: string;
    bestTimeAr: string;
    tips: string[];
    tipsAr: string[];
    badge: {
        id: string;
        name: string;
        nameAr: string;
        icon: string;
        xp: number;
    };
}

export const tours: Tour[] = [
    {
        id: 'kafd-tour',
        name: 'KAFD Tour',
        nameAr: 'رحلة كافد',
        subtitle: 'The Spirit of Modern Architecture',
        subtitleAr: 'روح العمارة الحديثة',
        description: 'Explore the King Abdullah Financial District, a masterpiece of modern architecture featuring iconic towers, sustainable design, and world-class amenities.',
        descriptionAr: 'استكشف مركز الملك عبدالله المالي، تحفة معمارية حديثة تضم أبراجاً أيقونية وتصميماً مستداماً ومرافق عالمية المستوى.',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
            'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800',
        ],
        category: ['Entertainment', 'Architecture'],
        categoryAr: ['ترفيه', 'عمارة'],
        difficulty: 'easy',
        duration: 180, // 3 hours
        distance: 2.5,
        startPoint: {
            name: 'The Wadi',
            nameAr: 'الوادي',
            latitude: 24.7660,
            longitude: 46.6400,
        },
        waypoints: [
            {
                id: 'kafd-1',
                name: 'The Wadi',
                nameAr: 'الوادي',
                description: 'Start your journey at The Wadi, a stunning landscaped valley with water features and green spaces.',
                descriptionAr: 'ابدأ رحلتك في الوادي، وادٍ طبيعي مذهل مع ميزات مائية ومساحات خضراء.',
                latitude: 24.7660,
                longitude: 46.6400,
                order: 1,
                duration: 30,
                activities: ['Photography', 'Walking', 'Relaxation'],
                activitiesAr: ['تصوير', 'مشي', 'استرخاء'],
                image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
            },
            {
                id: 'kafd-2',
                name: 'PIF Tower',
                nameAr: 'برج صندوق الاستثمارات العامة',
                description: 'Marvel at the iconic PIF Tower, one of the tallest buildings in KAFD with stunning architecture.',
                descriptionAr: 'استمتع بمشاهدة برج صندوق الاستثمارات العامة الأيقوني، أحد أطول المباني في كافد.',
                latitude: 24.7670,
                longitude: 46.6420,
                order: 2,
                duration: 20,
                activities: ['Architecture Tour', 'Photography'],
                activitiesAr: ['جولة معمارية', 'تصوير'],
                image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
            },
            {
                id: 'kafd-3',
                name: 'KAFD Grand Mosque',
                nameAr: 'جامع كافد الكبير',
                description: 'Visit the beautifully designed KAFD Mosque, a masterpiece of Islamic modern architecture.',
                descriptionAr: 'زر جامع كافد الجميل، تحفة من العمارة الإسلامية الحديثة.',
                latitude: 24.7655,
                longitude: 46.6410,
                order: 3,
                duration: 30,
                activities: ['Prayer', 'Architecture Appreciation'],
                activitiesAr: ['صلاة', 'تأمل العمارة'],
                image: 'https://images.unsplash.com/photo-1545071442-f9ef7b47c8e4?w=800',
            },
            {
                id: 'kafd-4',
                name: 'Fine Dining Zone',
                nameAr: 'منطقة المطاعم الفاخرة',
                description: 'End your tour with a meal at one of the premium restaurants offering international cuisine.',
                descriptionAr: 'اختتم جولتك بوجبة في أحد المطاعم الفاخرة التي تقدم مأكولات عالمية.',
                latitude: 24.7680,
                longitude: 46.6430,
                order: 4,
                duration: 60,
                activities: ['Dining', 'Relaxation'],
                activitiesAr: ['تناول الطعام', 'استرخاء'],
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            },
        ],
        highlights: [
            'Sustainable architecture design',
            'World-class dining options',
            'Stunning water features',
            'Modern Islamic architecture',
        ],
        highlightsAr: [
            'تصميم معماري مستدام',
            'خيارات طعام عالمية المستوى',
            'ميزات مائية مذهلة',
            'عمارة إسلامية حديثة',
        ],
        bestTime: 'Evening (4 PM - 10 PM)',
        bestTimeAr: 'المساء (4 - 10 م)',
        tips: [
            'Wear comfortable walking shoes',
            'Best visited during sunset for photography',
            'Reservations recommended for restaurants',
        ],
        tipsAr: [
            'ارتدِ حذاء مريحاً للمشي',
            'يُفضل الزيارة وقت الغروب للتصوير',
            'يُنصح بالحجز المسبق للمطاعم',
        ],
        badge: {
            id: 'modern-explorer',
            name: 'Modern Explorer',
            nameAr: 'مستكشف الحداثة',
            icon: '🏗️',
            xp: 500,
        },
    },
    {
        id: 'bujairi-tour',
        name: 'Bujairi Terrace Tour',
        nameAr: 'رحلة مطل البجيري',
        subtitle: 'Where History Meets Luxury',
        subtitleAr: 'التاريخ يلتقي بالفخامة',
        description: 'Experience the perfect blend of history and modern luxury at Bujairi Terrace, overlooking the UNESCO World Heritage site of At-Turaif.',
        descriptionAr: 'استمتع بالمزج المثالي بين التاريخ والفخامة الحديثة في مطل البجيري، المطل على موقع التراث العالمي الطريف.',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
            'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
        ],
        category: ['History', 'Luxury'],
        categoryAr: ['تاريخي', 'فاخر'],
        difficulty: 'easy',
        duration: 240, // 4 hours
        distance: 1.5,
        startPoint: {
            name: 'Bujairi Terrace Main Gate',
            nameAr: 'البوابة الرئيسية لمطل البجيري',
            latitude: 24.7341,
            longitude: 46.5765,
        },
        waypoints: [
            {
                id: 'bujairi-1',
                name: 'Main Entrance',
                nameAr: 'المدخل الرئيسي',
                description: 'Enter through the stunning main gate designed to complement the historical architecture of Diriyah.',
                descriptionAr: 'ادخل من البوابة الرئيسية المذهلة المصممة لتكمل العمارة التاريخية للدرعية.',
                latitude: 24.7341,
                longitude: 46.5765,
                order: 1,
                duration: 15,
                activities: ['Photography', 'Orientation'],
                activitiesAr: ['تصوير', 'التوجيه'],
                image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
            },
            {
                id: 'bujairi-2',
                name: 'At-Turaif Viewpoint',
                nameAr: 'إطلالة الطريف',
                description: 'Enjoy panoramic views of the UNESCO-listed At-Turaif district, the birthplace of the Saudi state.',
                descriptionAr: 'استمتع بإطلالات بانورامية على حي الطريف المسجل في اليونسكو، مهد الدولة السعودية.',
                latitude: 24.7345,
                longitude: 46.5770,
                order: 2,
                duration: 30,
                activities: ['Sightseeing', 'History Learning', 'Photography'],
                activitiesAr: ['مشاهدة المعالم', 'تعلم التاريخ', 'تصوير'],
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
            },
            {
                id: 'bujairi-3',
                name: 'Traditional Architecture Zone',
                nameAr: 'منطقة العمارة التقليدية',
                description: 'Learn about Najdi mud-brick architecture and traditional building techniques.',
                descriptionAr: 'تعرف على عمارة الطوب اللبن النجدية وتقنيات البناء التقليدية.',
                latitude: 24.7348,
                longitude: 46.5768,
                order: 3,
                duration: 45,
                activities: ['Architecture Tour', 'Museum Visit'],
                activitiesAr: ['جولة معمارية', 'زيارة متحف'],
                image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
            },
            {
                id: 'bujairi-4',
                name: 'Fine Dining Experience',
                nameAr: 'تجربة الطعام الفاخرة',
                description: 'Dine at world-class restaurants with stunning views of the historical district.',
                descriptionAr: 'تناول الطعام في مطاعم عالمية المستوى مع إطلالات خلابة على الحي التاريخي.',
                latitude: 24.7350,
                longitude: 46.5775,
                order: 4,
                duration: 90,
                activities: ['Fine Dining', 'Sunset Viewing'],
                activitiesAr: ['طعام فاخر', 'مشاهدة الغروب'],
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            },
        ],
        highlights: [
            'UNESCO World Heritage Site views',
            'Traditional Najdi architecture',
            'World-class dining',
            'Sunset photography spots',
        ],
        highlightsAr: [
            'إطلالات موقع التراث العالمي',
            'العمارة النجدية التقليدية',
            'تناول طعام عالمي المستوى',
            'أماكن تصوير الغروب',
        ],
        bestTime: 'Sunset (4 PM - 9 PM)',
        bestTimeAr: 'وقت الغروب (4 - 9 م)',
        tips: [
            'Book restaurant reservations in advance',
            'Bring a camera for sunset shots',
            'Wear modest clothing',
        ],
        tipsAr: [
            'احجز في المطاعم مسبقاً',
            'أحضر كاميرا لصور الغروب',
            'ارتدِ ملابس محتشمة',
        ],
        badge: {
            id: 'heritage-guardian',
            name: 'Heritage Guardian',
            nameAr: 'حارس التراث',
            icon: '🏛️',
            xp: 600,
        },
    },
    {
        id: 'gardens-tour',
        name: 'Gardens of Riyadh',
        nameAr: 'رحلة الحدائق',
        subtitle: 'The Lungs of Riyadh',
        subtitleAr: 'رئة الرياض',
        description: 'Discover the beautiful green spaces of Riyadh, from expansive parks to botanical gardens.',
        descriptionAr: 'اكتشف المساحات الخضراء الجميلة في الرياض، من الحدائق الواسعة إلى الحدائق النباتية.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        ],
        category: ['Nature', 'Family'],
        categoryAr: ['طبيعة', 'عوائل'],
        difficulty: 'easy',
        duration: 300, // 5 hours
        distance: 5,
        startPoint: {
            name: 'King Abdullah Park',
            nameAr: 'حديقة الملك عبدالله',
            latitude: 24.6900,
            longitude: 46.7200,
        },
        waypoints: [
            {
                id: 'gardens-1',
                name: 'King Abdullah Park',
                nameAr: 'حديقة الملك عبدالله',
                description: 'Start at one of Riyadh\'s most beautiful parks with expansive lawns and modern amenities.',
                descriptionAr: 'ابدأ في واحدة من أجمل حدائق الرياض مع مساحات خضراء واسعة ومرافق حديثة.',
                latitude: 24.6900,
                longitude: 46.7200,
                order: 1,
                duration: 60,
                activities: ['Walking', 'Playground', 'Picnic'],
                activitiesAr: ['مشي', 'ألعاب أطفال', 'نزهة'],
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            },
            {
                id: 'gardens-2',
                name: 'Walking Trails',
                nameAr: 'مسارات المشي',
                description: 'Explore the landscaped walking trails surrounded by native and imported plants.',
                descriptionAr: 'استكشف مسارات المشي المحاطة بالنباتات المحلية والمستوردة.',
                latitude: 24.6910,
                longitude: 46.7210,
                order: 2,
                duration: 45,
                activities: ['Walking', 'Jogging', 'Nature Photography'],
                activitiesAr: ['مشي', 'هرولة', 'تصوير الطبيعة'],
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            },
            {
                id: 'gardens-3',
                name: 'Fountain Shows',
                nameAr: 'عروض النوافير',
                description: 'Watch the spectacular fountain shows with music and lights.',
                descriptionAr: 'شاهد عروض النوافير المذهلة مع الموسيقى والأضواء.',
                latitude: 24.6905,
                longitude: 46.7205,
                order: 3,
                duration: 30,
                activities: ['Watching Shows', 'Relaxation'],
                activitiesAr: ['مشاهدة العروض', 'استرخاء'],
                image: 'https://images.unsplash.com/photo-1556566229-cd2e4e8d9254?w=800',
            },
            {
                id: 'gardens-4',
                name: 'Sports Zone',
                nameAr: 'المنطقة الرياضية',
                description: 'End with some sports activities or simply relax and watch others.',
                descriptionAr: 'اختتم ببعض الأنشطة الرياضية أو استرخِ وشاهد الآخرين.',
                latitude: 24.6915,
                longitude: 46.7215,
                order: 4,
                duration: 60,
                activities: ['Sports', 'Relaxation', 'Family Time'],
                activitiesAr: ['رياضة', 'استرخاء', 'وقت عائلي'],
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
            },
        ],
        highlights: [
            'Native plant species',
            'Fountain shows',
            'Children\'s playgrounds',
            'Sports facilities',
        ],
        highlightsAr: [
            'أنواع نباتات محلية',
            'عروض النوافير',
            'ملاعب الأطفال',
            'المرافق الرياضية',
        ],
        bestTime: 'Morning (6 AM - 10 AM) or Evening (4 PM - 9 PM)',
        bestTimeAr: 'الصباح (6 - 10 ص) أو المساء (4 - 9 م)',
        tips: [
            'Bring water and snacks',
            'Wear comfortable shoes',
            'Arrive early on weekends',
        ],
        tipsAr: [
            'أحضر ماء ووجبات خفيفة',
            'ارتدِ حذاء مريحاً',
            'احضر مبكراً في عطلة نهاية الأسبوع',
        ],
        badge: {
            id: 'nature-lover',
            name: 'Nature Lover',
            nameAr: 'مستكشف الطبيعة',
            icon: '🌿',
            xp: 400,
        },
    },
    {
        id: 'wadi-hanifa-tour',
        name: 'Wadi Hanifa Experience',
        nameAr: 'رحلة وادي حنيفة',
        subtitle: 'Natural Relaxation',
        subtitleAr: 'الاستجمام الطبيعي',
        description: 'Explore the rehabilitated Wadi Hanifa valley, a 120km natural corridor offering walking trails, picnic spots, and stunning sunset views.',
        descriptionAr: 'استكشف وادي حنيفة المُعاد تأهيله، ممر طبيعي بطول 120 كم يوفر مسارات مشي ومناطق نزهة وإطلالات غروب خلابة.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        ],
        category: ['Relaxation', 'Nature'],
        categoryAr: ['استجمام', 'طبيعة'],
        difficulty: 'moderate',
        duration: 360, // 6 hours
        distance: 8,
        startPoint: {
            name: 'Wadi Hanifa Dam Park',
            nameAr: 'متنزه سد وادي حنيفة',
            latitude: 24.5500,
            longitude: 46.6200,
        },
        waypoints: [
            {
                id: 'wadi-1',
                name: 'Dam Park',
                nameAr: 'متنزه السد',
                description: 'Start at the dam park with stunning water features and shaded seating areas.',
                descriptionAr: 'ابدأ في متنزه السد مع ميزات مائية رائعة ومناطق جلوس مظللة.',
                latitude: 24.5500,
                longitude: 46.6200,
                order: 1,
                duration: 45,
                activities: ['Photography', 'Relaxation', 'Walking'],
                activitiesAr: ['تصوير', 'استرخاء', 'مشي'],
                image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
            },
            {
                id: 'wadi-2',
                name: 'Walking Trail',
                nameAr: 'مسار المشي',
                description: 'Walk along the stream through the green valley with native vegetation.',
                descriptionAr: 'امشِ على طول المجرى المائي عبر الوادي الأخضر مع النباتات المحلية.',
                latitude: 24.5520,
                longitude: 46.6180,
                order: 2,
                duration: 90,
                activities: ['Hiking', 'Bird Watching', 'Nature Photography'],
                activitiesAr: ['هايكنج', 'مراقبة الطيور', 'تصوير الطبيعة'],
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            },
            {
                id: 'wadi-3',
                name: 'BBQ Area',
                nameAr: 'منطقة الشواء',
                description: 'Designated BBQ areas where you can enjoy grilling with family and friends.',
                descriptionAr: 'مناطق شواء مخصصة حيث يمكنك الاستمتاع بالشواء مع العائلة والأصدقاء.',
                latitude: 24.5550,
                longitude: 46.6150,
                order: 3,
                duration: 120,
                activities: ['BBQ', 'Family Gathering', 'Picnic'],
                activitiesAr: ['شواء', 'تجمع عائلي', 'نزهة'],
                image: 'https://images.unsplash.com/photo-1529168068210-cc7dfb7fa56e?w=800',
            },
            {
                id: 'wadi-4',
                name: 'Sunset Point',
                nameAr: 'نقطة الغروب',
                description: 'End your day at the best sunset viewing spot in the valley.',
                descriptionAr: 'اختتم يومك في أفضل نقطة لمشاهدة الغروب في الوادي.',
                latitude: 24.5580,
                longitude: 46.6120,
                order: 4,
                duration: 60,
                activities: ['Sunset Viewing', 'Photography', 'Meditation'],
                activitiesAr: ['مشاهدة الغروب', 'تصوير', 'تأمل'],
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            },
        ],
        highlights: [
            'Environmental rehabilitation story',
            'Designated BBQ zones',
            'Spectacular sunset views',
            'Native wildlife',
        ],
        highlightsAr: [
            'قصة إعادة التأهيل البيئي',
            'مناطق شواء مخصصة',
            'مناظر غروب خلابة',
            'الحياة البرية المحلية',
        ],
        bestTime: 'Late Afternoon to Sunset (3 PM - 7 PM)',
        bestTimeAr: 'بعد الظهر متأخراً حتى الغروب (3 - 7 م)',
        tips: [
            'Bring BBQ supplies if planning to grill',
            'Wear hiking shoes',
            'Carry enough water',
            'Bring insect repellent',
        ],
        tipsAr: [
            'أحضر مستلزمات الشواء إذا كنت تخطط للشواء',
            'ارتدِ حذاء رياضي',
            'احمل ماء كافٍ',
            'أحضر طارد للحشرات',
        ],
        badge: {
            id: 'wadi-explorer',
            name: 'Wadi Explorer',
            nameAr: 'مستكشف الوادي',
            icon: '🏞️',
            xp: 700,
        },
    },
];

export const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
        'History': '🏛️',
        'Modern': '🏙️',
        'Shopping': '🛍️',
        'Dining': '🍽️',
        'Entertainment': '🎭',
        'Nature': '🌿',
        'Architecture': '🏗️',
        'Luxury': '💎',
        'Family': '👨‍👩‍👧‍👦',
        'Relaxation': '🧘',
    };
    return icons[category] || '📍';
};
