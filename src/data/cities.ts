export interface CityPlace {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    category: string;
    rating: number;
}

export interface City {
    id: string;
    name: string;
    nameAr: string;
    backgroundImage: string;
    description: string;
    descriptionAr: string;
    highlights: string[];
    highlightsAr: string[];
    places: CityPlace[];
}

export const CITIES_DATA: City[] = [
    {
        id: 'riyadh',
        name: 'Riyadh',
        nameAr: 'الرياض',
        backgroundImage: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920',
        description: 'The capital and largest city of Saudi Arabia, a modern metropolis blending tradition with innovation',
        descriptionAr: 'العاصمة وأكبر مدينة في المملكة العربية السعودية، مدينة عصرية تمزج بين التقاليد والابتكار',
        highlights: ['Kingdom Tower', 'Diriyah', 'Boulevard', 'National Museum'],
        highlightsAr: ['برج المملكة', 'الدرعية', 'البوليفارد', 'المتحف الوطني'],
        places: [
            {
                id: 'riyadh-1',
                name: 'Kingdom Centre Tower',
                nameAr: 'برج المملكة',
                description: 'Iconic 99-story skyscraper with the Sky Bridge observation deck',
                descriptionAr: 'ناطحة سحاب شهيرة من 99 طابقاً مع جسر السماء للمراقبة',
                image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800',
                category: 'Modern',
                rating: 4.8
            },
            {
                id: 'riyadh-2',
                name: 'At-Turaif District',
                nameAr: 'حي الطريف',
                description: 'UNESCO World Heritage site, birthplace of the Saudi state',
                descriptionAr: 'موقع تراث عالمي لليونسكو، مهد الدولة السعودية',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
                category: 'Heritage',
                rating: 4.9
            },
            {
                id: 'riyadh-3',
                name: 'Boulevard Riyadh City',
                nameAr: 'بوليفارد رياض سيتي',
                description: 'Premium entertainment destination with world-class attractions',
                descriptionAr: 'وجهة ترفيهية متميزة مع معالم جذب عالمية',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
                category: 'Entertainment',
                rating: 4.7
            },
            {
                id: 'riyadh-4',
                name: 'National Museum',
                nameAr: 'المتحف الوطني',
                description: 'Premier museum showcasing Saudi Arabian history and culture',
                descriptionAr: 'المتحف الرائد الذي يعرض تاريخ وثقافة المملكة العربية السعودية',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
                category: 'Culture',
                rating: 4.6
            }
        ]
    },
    {
        id: 'jeddah',
        name: 'Jeddah',
        nameAr: 'جدة',
        backgroundImage: '/images/jeddah-cityscape.png',
        description: 'The Gateway to Mecca, a vibrant coastal city known for its historic district and Red Sea coastline',
        descriptionAr: 'بوابة مكة، مدينة ساحلية نابضة بالحياة معروفة بحيها التاريخي وساحل البحر الأحمر',
        highlights: ['Al-Balad', 'Corniche', 'Jeddah Tower', 'Red Sea Mall'],
        highlightsAr: ['البلد', 'الكورنيش', 'برج جدة', 'رد سي مول'],
        places: [
            {
                id: 'jeddah-1',
                name: 'Al-Balad Historic District',
                nameAr: 'حي البلد التاريخي',
                description: 'UNESCO World Heritage site with traditional Hijazi architecture',
                descriptionAr: 'موقع تراث عالمي لليونسكو بعمارة حجازية تقليدية',
                image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
                category: 'Heritage',
                rating: 4.8
            },
            {
                id: 'jeddah-2',
                name: 'Jeddah Corniche',
                nameAr: 'كورنيش جدة',
                description: 'Beautiful 30km waterfront promenade along the Red Sea',
                descriptionAr: 'كورنيش جميل بطول 30 كم على ساحل البحر الأحمر',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
                category: 'Nature',
                rating: 4.7
            },
            {
                id: 'jeddah-3',
                name: 'King Fahd Fountain',
                nameAr: 'نافورة الملك فهد',
                description: 'World\'s tallest fountain shooting water up to 312 meters',
                descriptionAr: 'أطول نافورة في العالم تضخ المياه حتى 312 متراً',
                image: 'https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=800',
                category: 'Landmark',
                rating: 4.9
            },
            {
                id: 'jeddah-4',
                name: 'Red Sea Mall',
                nameAr: 'رد سي مول',
                description: 'Premium shopping destination with international brands',
                descriptionAr: 'وجهة تسوق راقية مع علامات تجارية عالمية',
                image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
                category: 'Shopping',
                rating: 4.5
            }
        ]
    },
    {
        id: 'mecca',
        name: 'Mecca',
        nameAr: 'مكة المكرمة',
        backgroundImage: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1920',
        description: 'The holiest city in Islam, home to the Masjid al-Haram and the Kaaba',
        descriptionAr: 'أقدس مدينة في الإسلام، موطن المسجد الحرام والكعبة المشرفة',
        highlights: ['Masjid al-Haram', 'Abraj Al-Bait', 'Jabal al-Nour', 'Mina'],
        highlightsAr: ['المسجد الحرام', 'أبراج البيت', 'جبل النور', 'منى'],
        places: [
            {
                id: 'mecca-1',
                name: 'Masjid al-Haram',
                nameAr: 'المسجد الحرام',
                description: 'The largest mosque and holiest site in Islam',
                descriptionAr: 'أكبر مسجد وأقدس موقع في الإسلام',
                image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
                category: 'Religious',
                rating: 5.0
            },
            {
                id: 'mecca-2',
                name: 'Abraj Al-Bait Clock Tower',
                nameAr: 'ساعة أبراج البيت',
                description: 'World\'s tallest clock tower overlooking the Grand Mosque',
                descriptionAr: 'أطول برج ساعة في العالم يطل على المسجد الحرام',
                image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
                category: 'Modern',
                rating: 4.9
            },
            {
                id: 'mecca-3',
                name: 'Jabal al-Nour',
                nameAr: 'جبل النور',
                description: 'Mountain containing the Cave of Hira where Prophet Muhammad received his first revelation',
                descriptionAr: 'الجبل الذي يحتوي على غار حراء حيث تلقى النبي محمد أول الوحي',
                image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
                category: 'Religious',
                rating: 4.8
            },
            {
                id: 'mecca-4',
                name: 'Makkah Museum',
                nameAr: 'متحف مكة المكرمة',
                description: 'Museum showcasing the history and heritage of the holy city',
                descriptionAr: 'متحف يعرض تاريخ وتراث المدينة المقدسة',
                image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
                category: 'Culture',
                rating: 4.5
            }
        ]
    },
    {
        id: 'medina',
        name: 'Medina',
        nameAr: 'المدينة المنورة',
        backgroundImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920',
        description: 'The second holiest city in Islam, home to the Prophet\'s Mosque',
        descriptionAr: 'ثاني أقدس مدينة في الإسلام، موطن المسجد النبوي الشريف',
        highlights: ['Prophet\'s Mosque', 'Quba Mosque', 'Uhud Mountain', 'Date Farms'],
        highlightsAr: ['المسجد النبوي', 'مسجد قباء', 'جبل أحد', 'مزارع التمور'],
        places: [
            {
                id: 'medina-1',
                name: 'Al-Masjid an-Nabawi',
                nameAr: 'المسجد النبوي',
                description: 'The Prophet\'s Mosque, second holiest site in Islam',
                descriptionAr: 'المسجد النبوي الشريف، ثاني أقدس موقع في الإسلام',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
                category: 'Religious',
                rating: 5.0
            },
            {
                id: 'medina-2',
                name: 'Quba Mosque',
                nameAr: 'مسجد قباء',
                description: 'The first mosque built in Islamic history',
                descriptionAr: 'أول مسجد بني في تاريخ الإسلام',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
                category: 'Religious',
                rating: 4.9
            },
            {
                id: 'medina-3',
                name: 'Mount Uhud',
                nameAr: 'جبل أحد',
                description: 'Historic mountain where the Battle of Uhud took place',
                descriptionAr: 'الجبل التاريخي الذي دارت فيه غزوة أحد',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
                category: 'Historical',
                rating: 4.7
            },
            {
                id: 'medina-4',
                name: 'Al-Noor Mall',
                nameAr: 'النور مول',
                description: 'Modern shopping center near the Prophet\'s Mosque',
                descriptionAr: 'مركز تسوق حديث قريب من المسجد النبوي',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
                category: 'Shopping',
                rating: 4.4
            }
        ]
    },
    {
        id: 'dammam',
        name: 'Dammam',
        nameAr: 'الدمام',
        backgroundImage: '/images/dammam-skyline.png',
        description: 'The capital of the Eastern Province, a coastal city on the Arabian Gulf',
        descriptionAr: 'عاصمة المنطقة الشرقية، مدينة ساحلية على الخليج العربي',
        highlights: ['Corniche', 'King Fahd Park', 'Tarout Island', 'Al Khobar'],
        highlightsAr: ['الكورنيش', 'حديقة الملك فهد', 'جزيرة تاروت', 'الخبر'],
        places: [
            {
                id: 'dammam-1',
                name: 'Dammam Corniche',
                nameAr: 'كورنيش الدمام',
                description: 'Beautiful waterfront promenade with parks and restaurants',
                descriptionAr: 'كورنيش جميل على البحر مع حدائق ومطاعم',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
                category: 'Nature',
                rating: 4.6
            },
            {
                id: 'dammam-2',
                name: 'King Fahd Park',
                nameAr: 'حديقة الملك فهد',
                description: 'Large public park with lakes, gardens, and entertainment',
                descriptionAr: 'حديقة عامة كبيرة مع بحيرات وحدائق وترفيه',
                image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
                category: 'Nature',
                rating: 4.5
            },
            {
                id: 'dammam-3',
                name: 'Tarout Castle',
                nameAr: 'قلعة تاروت',
                description: 'Ancient fortress on Tarout Island with 5000 years of history',
                descriptionAr: 'قلعة قديمة في جزيرة تاروت بتاريخ يمتد لـ 5000 عام',
                image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
                category: 'Heritage',
                rating: 4.7
            },
            {
                id: 'dammam-4',
                name: 'Dhahran Mall',
                nameAr: 'الظهران مول',
                description: 'Premium shopping destination in the Eastern Province',
                descriptionAr: 'وجهة تسوق راقية في المنطقة الشرقية',
                image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
                category: 'Shopping',
                rating: 4.4
            }
        ]
    },
    {
        id: 'alula',
        name: 'AlUla',
        nameAr: 'العلا',
        backgroundImage: '/images/alula-hegra.png',
        description: 'An ancient oasis city with remarkable archaeological sites and stunning desert landscapes',
        descriptionAr: 'مدينة واحة قديمة مع مواقع أثرية رائعة ومناظر صحراوية خلابة',
        highlights: ['Hegra', 'Elephant Rock', 'Old Town', 'Maraya Concert Hall'],
        highlightsAr: ['الحجر', 'صخرة الفيل', 'البلدة القديمة', 'قاعة مرايا للحفلات'],
        places: [
            {
                id: 'alula-1',
                name: 'Hegra (Mada\'in Salih)',
                nameAr: 'الحجر (مدائن صالح)',
                description: 'UNESCO World Heritage Nabataean archaeological site',
                descriptionAr: 'موقع أثري نبطي مسجل في التراث العالمي لليونسكو',
                image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
                category: 'Heritage',
                rating: 4.9
            },
            {
                id: 'alula-2',
                name: 'Elephant Rock',
                nameAr: 'صخرة الفيل',
                description: 'Iconic natural rock formation shaped like an elephant',
                descriptionAr: 'تشكيل صخري طبيعي مميز على شكل فيل',
                image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
                category: 'Nature',
                rating: 4.8
            },
            {
                id: 'alula-3',
                name: 'AlUla Old Town',
                nameAr: 'البلدة القديمة بالعلا',
                description: 'Ancient labyrinthine town with 900+ mud-brick houses',
                descriptionAr: 'بلدة قديمة متاهية تضم أكثر من 900 منزل طيني',
                image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
                category: 'Heritage',
                rating: 4.7
            },
            {
                id: 'alula-4',
                name: 'Maraya Concert Hall',
                nameAr: 'قاعة مرايا للحفلات',
                description: 'World\'s largest mirrored building hosting international events',
                descriptionAr: 'أكبر مبنى مرايا في العالم يستضيف فعاليات دولية',
                image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
                category: 'Entertainment',
                rating: 4.9
            }
        ]
    },
    {
        id: 'abha',
        name: 'Abha',
        nameAr: 'أبها',
        backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920',
        description: 'The city of fog, a mountainous resort city known for its cool climate and scenic beauty',
        descriptionAr: 'مدينة الضباب، مدينة جبلية سياحية معروفة بمناخها البارد وجمالها الخلاب',
        highlights: ['Asir National Park', 'Cable Car', 'Green Mountain', 'Habala Village'],
        highlightsAr: ['منتزه عسير الوطني', 'التلفريك', 'الجبل الأخضر', 'قرية حبالة'],
        places: [
            {
                id: 'abha-1',
                name: 'Asir National Park',
                nameAr: 'منتزه عسير الوطني',
                description: 'Beautiful national park with diverse wildlife and stunning views',
                descriptionAr: 'منتزه وطني جميل مع حياة برية متنوعة ومناظر خلابة',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
                category: 'Nature',
                rating: 4.8
            },
            {
                id: 'abha-2',
                name: 'Green Mountain',
                nameAr: 'الجبل الأخضر',
                description: 'Illuminated mountain offering panoramic views of Abha',
                descriptionAr: 'جبل مضاء يوفر إطلالات بانورامية على أبها',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
                category: 'Nature',
                rating: 4.7
            },
            {
                id: 'abha-3',
                name: 'Habala Village',
                nameAr: 'قرية حبالة المعلقة',
                description: 'Historic hanging village accessible by cable car',
                descriptionAr: 'قرية تاريخية معلقة يمكن الوصول إليها بالتلفريك',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                category: 'Heritage',
                rating: 4.9
            },
            {
                id: 'abha-4',
                name: 'Rijal Almaa Village',
                nameAr: 'قرية رجال ألمع',
                description: 'UNESCO-listed heritage village with colorful traditional houses',
                descriptionAr: 'قرية تراثية مسجلة باليونسكو مع منازل تقليدية ملونة',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                category: 'Heritage',
                rating: 4.8
            }
        ]
    },
    {
        id: 'taif',
        name: 'Taif',
        nameAr: 'الطائف',
        backgroundImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920',
        description: 'The City of Roses, a summer resort known for its pleasant climate, rose gardens, and fruit farms',
        descriptionAr: 'مدينة الورود، منتجع صيفي معروف بمناخه اللطيف وحدائق الورود ومزارع الفاكهة',
        highlights: ['Shubra Palace', 'Rose Farms', 'Al Hada', 'Souq Okaz'],
        highlightsAr: ['قصر شبرا', 'مزارع الورد', 'الهدا', 'سوق عكاظ'],
        places: [
            {
                id: 'taif-1',
                name: 'Shubra Palace',
                nameAr: 'قصر شبرا',
                description: 'Historic palace showcasing traditional Hijazi and Ottoman architecture',
                descriptionAr: 'قصر تاريخي يعرض العمارة الحجازية والعثمانية التقليدية',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800',
                category: 'Heritage',
                rating: 4.6
            },
            {
                id: 'taif-2',
                name: 'Rose Farms',
                nameAr: 'مزارع الورد الطائفي',
                description: 'Famous Taif rose gardens producing premium rose oil',
                descriptionAr: 'حدائق الورد الطائفي الشهيرة المنتجة لزيت الورد الفاخر',
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
                category: 'Nature',
                rating: 4.8
            },
            {
                id: 'taif-3',
                name: 'Al Hada Mountain',
                nameAr: 'جبل الهدا',
                description: 'Scenic mountain area with cable car and panoramic views',
                descriptionAr: 'منطقة جبلية خلابة مع تلفريك وإطلالات بانورامية',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
                category: 'Nature',
                rating: 4.7
            },
            {
                id: 'taif-4',
                name: 'Souq Okaz',
                nameAr: 'سوق عكاظ',
                description: 'Revived ancient market celebrating Arab poetry and culture',
                descriptionAr: 'سوق قديم أُحيي للاحتفاء بالشعر والثقافة العربية',
                image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
                category: 'Culture',
                rating: 4.5
            }
        ]
    }
];

export const getCityById = (cityId: string): City | undefined => {
    return CITIES_DATA.find(city => city.id === cityId);
};

export const getCityPlaces = (cityId: string): CityPlace[] => {
    const city = getCityById(cityId);
    return city?.places || [];
};
