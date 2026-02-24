export interface Activity {
    id: string;
    place: string;
    description: string;
    duration: string;
    category: string;
    categoryAr: string;
    coordinates: [number, number];
    image?: string;
    priceLevel: 'free' | 'low' | 'moderate' | 'high';
    bestTime?: 'morning' | 'afternoon' | 'evening';
}

export const activitiesData: Record<string, Activity[]> = {
    history: [
        {
            id: 'diriyah',
            place: 'حي الطريف - الدرعية',
            description: 'استكشف موقع التراث العالمي لليونسكو وقصور الطين التاريخية',
            duration: '3.5 ساعات',
            category: 'history',
            categoryAr: 'تراث وتاريخ',
            coordinates: [24.7342, 46.5747],
            image: 'https://images.unsplash.com/photo-1580824456770-4d8961314d64',
            priceLevel: 'moderate',
            bestTime: 'afternoon'
        },
        {
            id: 'national-museum',
            place: 'المتحف الوطني',
            description: 'رحلة عبر الزمن من العصور القديمة حتى العصر الحديث',
            duration: '2.5 ساعة',
            category: 'history',
            categoryAr: 'متاحف',
            coordinates: [24.6479, 46.7106],
            image: 'https://placehold.co/600x400',
            priceLevel: 'low',
            bestTime: 'morning'
        },
        {
            id: 'masmak',
            place: 'قصر المصمك',
            description: 'شاهد القلعة التي شهدت انطلاقة توحيد المملكة',
            duration: '1.5 ساعة',
            category: 'history',
            categoryAr: 'تراث',
            coordinates: [24.6311, 46.7134],
            image: 'https://placehold.co/600x400',
            priceLevel: 'free',
            bestTime: 'morning'
        },
    ],
    nature: [
        {
            id: 'wadi-hanifa',
            place: 'وادي حنيفة',
            description: 'تنزه في أجمل المسارات الطبيعية وسط الرياض',
            duration: '3 ساعات',
            category: 'nature',
            categoryAr: 'طبيعة',
            coordinates: [24.6647, 46.5898],
            image: 'https://placehold.co/600x400',
            priceLevel: 'free',
            bestTime: 'afternoon'
        },
        {
            id: 'edge-world',
            place: 'حافة العالم',
            description: 'مغامرة لا تنسى مع إطلالات خلابة على المنحدرات',
            duration: '5 ساعات',
            category: 'nature',
            categoryAr: 'مغامرة',
            coordinates: [24.9438, 45.9928],
            image: 'https://placehold.co/600x400',
            priceLevel: 'free',
            bestTime: 'afternoon'
        },
    ],
    shopping: [
        {
            id: 'riyadh-park',
            place: 'الرياض بارك',
            description: 'تجربة تسوق عصرية مع مطاعم وسينما',
            duration: '3.5 ساعات',
            category: 'shopping',
            categoryAr: 'تسوق',
            coordinates: [24.7570, 46.6300],
            image: 'https://placehold.co/600x400',
            priceLevel: 'moderate',
            bestTime: 'evening'
        },
        {
            id: 'boulevard-city',
            place: 'بوليفارد رياض سيتي',
            description: 'أكبر منطقة ترفيهية مع متاجر عالمية ومطاعم',
            duration: '4.5 ساعات',
            category: 'shopping',
            categoryAr: 'ترفيه وتسوق',
            coordinates: [24.7680, 46.6361],
            image: 'https://placehold.co/600x400',
            priceLevel: 'high',
            bestTime: 'evening'
        },
    ],
    food: [
        {
            id: 'bujairi',
            place: 'مطل البجيري',
            description: 'عشاء فاخر مع إطلالة ساحرة على حي الطريف',
            duration: '2.5 ساعة',
            category: 'food',
            categoryAr: 'مطاعم فاخرة',
            coordinates: [24.7360, 46.5720],
            image: 'https://placehold.co/600x400',
            priceLevel: 'high',
            bestTime: 'evening'
        },
        {
            id: 'najd-village',
            place: 'قرية نجد',
            description: 'تجربة الأطباق السعودية التقليدية في أجواء تراثية',
            duration: '2 ساعة',
            category: 'food',
            categoryAr: 'مأكولات شعبية',
            coordinates: [24.7000, 46.6800],
            image: 'https://placehold.co/600x400',
            priceLevel: 'moderate',
            bestTime: 'afternoon'
        },
    ],
    entertainment: [
        {
            id: 'via-riyadh',
            place: 'فيا الرياض',
            description: 'وجهة الرفاهية الأولى للسينما والمقاهي',
            duration: '3 ساعات',
            category: 'entertainment',
            categoryAr: 'نمط حياة',
            coordinates: [24.6850, 46.6500],
            image: 'https://placehold.co/600x400',
            priceLevel: 'high',
            bestTime: 'evening'
        },
    ],
    architecture: [
        {
            id: 'kingdom-tower',
            place: 'برج المملكة',
            description: 'مشاهدة الرياض كاملة من الجسر المعلق',
            duration: '1.5 ساعة',
            category: 'architecture',
            categoryAr: 'معالم',
            coordinates: [24.7111, 46.6746],
            image: 'https://placehold.co/600x400',
            priceLevel: 'moderate',
            bestTime: 'evening'
        },
        {
            id: 'kafd',
            place: 'مركز الملك عبدالله المالي',
            description: 'تجول بين ناطحات السحاب المستقبلية',
            duration: '2 ساعة',
            category: 'architecture',
            categoryAr: 'عمارة',
            coordinates: [24.7600, 46.6500],
            image: 'https://placehold.co/600x400',
            priceLevel: 'free',
            bestTime: 'afternoon'
        },
    ],
};
