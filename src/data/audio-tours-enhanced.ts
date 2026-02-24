/**
 * Enhanced Audio Tours Data - All Saudi Cities
 * الرحلات الصوتية المحسنة - جميع المدن السعودية
 * 
 * Features:
 * - Documentary + Narrative style (توثيقي + قصصي)
 * - Internal sub-tours for large landmarks
 * - AI-generated content with manual override option
 * - Sources from Saudi Tourism Authority
 */

export type ContentSource = 'ai_generated' | 'manual' | 'tourism_authority';

export interface AudioSubTour {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    duration: string;
    order: number;
    coordinates?: [number, number];
    script?: string;
    scriptAr?: string;
    vrEnabled?: boolean;
    vrHotspots?: VRHotspot[];
}

export interface VRHotspot {
    id: string;
    name: string;
    nameAr: string;
    position: { x: number; y: number; z: number };
    audioScript: string;
    audioScriptAr: string;
}

export interface EnhancedAudioStop {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    // Documentary style - facts and history
    documentaryScript?: string;
    documentaryScriptAr?: string;
    // Narrative style - storytelling
    narrativeScript?: string;
    narrativeScriptAr?: string;
    // Combined script
    script?: string;
    scriptAr?: string;
    duration: string;
    audioUrl: string;
    professionalAudioUrl?: string; // Professional recording
    ttsAudioUrl?: string; // TTS fallback
    image: string;
    coordinates?: [number, number];
    contentSource: ContentSource;
    sourceReference?: string; // e.g., "Saudi Tourism Authority - 2024"
    subTours?: AudioSubTour[];
    vrEnabled?: boolean;
    vrSceneUrl?: string;
    vrHotspots?: VRHotspot[];
}

export interface EnhancedAudioTour {
    id: string;
    cityId: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    fullDescription: string;
    fullDescriptionAr: string;
    duration: string;
    durationAr: string;
    stops: number;
    image: string;
    category: string;
    categoryAr: string;
    rating: number;
    reviews: number;
    isFeatured: boolean;
    pointsCost: number;
    playlist: EnhancedAudioStop[];
    hasSubTours: boolean;
    vrSupported: boolean;
    contentSource: ContentSource;
    lastUpdated: string;
}

// ===================== RIYADH TOURS =====================
export const riyadhAudioTours: EnhancedAudioTour[] = [
    {
        id: 'diriyah-comprehensive',
        cityId: 'riyadh',
        title: 'Comprehensive Diriyah Experience',
        titleAr: 'تجربة الدرعية الشاملة',
        description: 'A complete journey through the birthplace of Saudi Arabia',
        descriptionAr: 'رحلة كاملة عبر مهد المملكة العربية السعودية',
        fullDescription: 'Explore every corner of the UNESCO World Heritage site with detailed historical narratives and immersive storytelling.',
        fullDescriptionAr: 'استكشف كل ركن من موقع التراث العالمي لليونسكو مع سرد تاريخي مفصل وقصص غامرة.',
        duration: '90 min',
        durationAr: '90 دقيقة',
        stops: 8,
        image: 'https://images.unsplash.com/photo-1580824456770-4d8961314d64',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.9,
        reviews: 456,
        isFeatured: true,
        pointsCost: 75,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-15',
        playlist: [
            {
                id: 'dir-1',
                title: 'Welcome to Diriyah',
                titleAr: 'مرحباً بكم في الدرعية',
                description: 'Gateway to Saudi heritage',
                descriptionAr: 'بوابة التراث السعودي',
                documentaryScript: 'Diriyah, established in 1446 by Mani Al-Muraydi, an ancestor of the Al Saud family, served as the capital of the First Saudi State from 1727 to 1818. In 2010, At-Turaif was designated a UNESCO World Heritage Site. The site spans over 4,000 hectares and contains some of the finest examples of Najdi mud-brick architecture.',
                documentaryScriptAr: 'تأسست الدرعية عام 1446م على يد مانع المريدي، جد آل سعود، وكانت عاصمة الدولة السعودية الأولى من 1727 إلى 1818م. في عام 2010، سُجل حي الطريف ضمن قائمة التراث العالمي لليونسكو. يمتد الموقع على مساحة تزيد عن 4000 هكتار ويضم أفضل نماذج العمارة النجدية الطينية.',
                narrativeScript: 'Close your eyes and imagine yourself traveling back in time. The year is 1744. You are walking through the dusty streets of Diriyah, where merchants call out their wares and scholars debate in the shade of mud-brick walls. This is where modern Saudi Arabia was born, where a handshake between Muhammad ibn Saud and Muhammad ibn Abd al-Wahhab changed history forever.',
                narrativeScriptAr: 'أغمض عينيك وتخيل أنك تسافر عبر الزمن. السنة هي 1744م. تمشي في شوارع الدرعية المغبرة، حيث ينادي التجار على بضائعهم ويتناقش العلماء في ظل الجدران الطينية. هنا ولدت المملكة العربية السعودية الحديثة، حيث غيّرت مصافحة بين محمد بن سعود ومحمد بن عبد الوهاب التاريخ إلى الأبد.',
                duration: '04:00',
                audioUrl: '/audio/tours/diriyah/welcome.mp3',
                professionalAudioUrl: '/audio/tours/diriyah/welcome-pro.mp3',
                image: 'https://images.unsplash.com/photo-1580824456770-4d8961314d64',
                coordinates: [24.7347, 46.5769],
                contentSource: 'tourism_authority',
                sourceReference: 'Saudi Tourism Authority - Heritage Sites Guide 2024',
                vrEnabled: true,
                vrSceneUrl: '/vr/diriyah/entrance',
                vrHotspots: [
                    {
                        id: 'gate',
                        name: 'Main Gate',
                        nameAr: 'البوابة الرئيسية',
                        position: { x: 0, y: 1.5, z: -5 },
                        audioScript: 'This is the main entrance to At-Turaif. Notice the traditional Najdi architectural elements - the mud-brick walls, the crenelated parapets, and the narrow windows designed for both defense and cooling.',
                        audioScriptAr: 'هذا هو المدخل الرئيسي لحي الطريف. لاحظ العناصر المعمارية النجدية التقليدية - الجدران الطينية، والحواجز المسننة، والنوافذ الضيقة المصممة للدفاع والتبريد.'
                    }
                ]
            },
            {
                id: 'dir-2',
                title: 'Salwa Palace Complex',
                titleAr: 'مجمع قصر سلوى',
                description: 'The heart of Saudi governance',
                descriptionAr: 'قلب الحكم السعودي',
                documentaryScript: 'Salwa Palace is the largest structure in At-Turaif, comprising seven interconnected units built over different periods. The palace complex spans approximately 10,000 square meters and served as the residence of the Saudi rulers and administrative headquarters of the First Saudi State.',
                documentaryScriptAr: 'قصر سلوى هو أكبر مبنى في حي الطريف، يتكون من سبع وحدات متصلة بُنيت في فترات مختلفة. يمتد مجمع القصر على مساحة تقارب 10,000 متر مربع، وكان مقر إقامة حكام آل سعود والمقر الإداري للدولة السعودية الأولى.',
                narrativeScript: 'As you enter Salwa Palace, imagine Imam Muhammad ibn Saud receiving diplomats and tribal leaders in these very halls. The thick mud walls kept the interior cool during scorching summers and warm during cold desert nights. Every room whispers stories of decisions that shaped a nation.',
                narrativeScriptAr: 'عند دخولك قصر سلوى، تخيل الإمام محمد بن سعود يستقبل الدبلوماسيين وزعماء القبائل في هذه القاعات ذاتها. حافظت الجدران الطينية السميكة على برودة الداخل خلال الصيف الحارق ودفئه خلال ليالي الصحراء الباردة. كل غرفة تهمس بقصص القرارات التي شكلت أمة.',
                duration: '06:30',
                audioUrl: '/audio/tours/diriyah/salwa-palace.mp3',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
                coordinates: [24.7346, 46.5780],
                contentSource: 'tourism_authority',
                sourceReference: 'Diriyah Gate Development Authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'salwa-throne',
                        title: 'Throne Room',
                        titleAr: 'قاعة العرش',
                        description: 'The main reception hall',
                        descriptionAr: 'قاعة الاستقبال الرئيسية',
                        duration: '03:00',
                        order: 1,
                        script: 'The throne room, known as the Majlis, was where important decisions were made and guests were received. Notice the elevated platform where the Imam would sit, and the geometric patterns carved into the walls - each symbolizing different aspects of Islamic art.',
                        scriptAr: 'قاعة العرش، المعروفة بالمجلس، كانت حيث تُتخذ القرارات المهمة وتُستقبل الضيوف. لاحظ المنصة المرتفعة حيث يجلس الإمام، والأنماط الهندسية المنقوشة على الجدران - كل منها يرمز إلى جوانب مختلفة من الفن الإسلامي.'
                    },
                    {
                        id: 'salwa-private',
                        title: 'Private Quarters',
                        titleAr: 'الأجنحة الخاصة',
                        description: 'Family living areas',
                        descriptionAr: 'مناطق سكن العائلة',
                        duration: '02:30',
                        order: 2,
                        script: 'These private quarters housed the ruling family. The rooms are arranged around internal courtyards, providing privacy and natural ventilation. Small windows placed high on the walls allowed light while maintaining the family\'s privacy.',
                        scriptAr: 'كانت هذه الأجنحة الخاصة تضم العائلة الحاكمة. الغرف مرتبة حول أفنية داخلية، توفر الخصوصية والتهوية الطبيعية. النوافذ الصغيرة العالية على الجدران تسمح بدخول الضوء مع الحفاظ على خصوصية العائلة.'
                    }
                ]
            }
        ]
    },
    {
        id: 'bujairi-terrace-tour',
        cityId: 'riyadh',
        title: 'Bujairi Terrace Experience',
        titleAr: 'تجربة مطل البجيري',
        description: 'Where luxury meets heritage',
        descriptionAr: 'حيث تلتقي الفخامة بالتراث',
        fullDescription: 'Discover the vibrant Bujairi Terrace with its world-class dining, cultural spaces, and stunning views of At-Turaif.',
        fullDescriptionAr: 'اكتشف مطل البجيري النابض بالحياة مع مطاعمه العالمية ومساحاته الثقافية وإطلالاته الخلابة على حي الطريف.',
        duration: '60 min',
        durationAr: '60 دقيقة',
        stops: 6,
        image: 'https://s3.ticketmx.com/uploads/images/cf21b699deb9ee2655400ffb8f8e4dbcd9ae72ac.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg',
        category: 'Lifestyle',
        categoryAr: 'أسلوب حياة',
        rating: 4.7,
        reviews: 289,
        isFeatured: true,
        pointsCost: 50,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'manual',
        lastUpdated: '2024-01-20',
        playlist: [
            {
                id: 'buj-1',
                title: 'The Historic Market',
                titleAr: 'السوق التاريخي',
                description: 'The commercial heart of old Diriyah',
                descriptionAr: 'القلب التجاري للدرعية القديمة',
                documentaryScript: 'Bujairi was historically the main commercial district of Diriyah, where traders from across the Arabian Peninsula gathered to exchange goods. The area derived its name from the Bujairi family who were prominent merchants.',
                documentaryScriptAr: 'كان البجيري تاريخياً المنطقة التجارية الرئيسية في الدرعية، حيث تجمع التجار من أنحاء الجزيرة العربية لتبادل البضائع. اشتق اسم المنطقة من عائلة البجيري الذين كانوا تجاراً بارزين.',
                narrativeScript: 'Picture the scene centuries ago: the aroma of frankincense and spices filling the air, the sound of camels and bargaining merchants, the colorful textiles and gleaming brass. Today, Bujairi has been transformed while honoring its past, creating a bridge between centuries.',
                narrativeScriptAr: 'تخيل المشهد قبل قرون: رائحة البخور والتوابل تملأ الهواء، صوت الجمال والتجار المتفاوضين، الأقمشة الملونة والنحاس اللامع. اليوم، تحول البجيري مع تكريم ماضيه، ليخلق جسراً بين القرون.',
                duration: '03:30',
                audioUrl: '/audio/tours/bujairi/historic-market.mp3',
                image: 'https://images.unsplash.com/photo-1555529771-122e5d9f2341',
                coordinates: [24.7351, 46.5745],
                contentSource: 'manual',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'buj-spice',
                        title: 'Spice Alley',
                        titleAr: 'زقاق التوابل',
                        description: 'Traditional Arabian spices',
                        descriptionAr: 'التوابل العربية التقليدية',
                        duration: '02:00',
                        order: 1
                    },
                    {
                        id: 'buj-crafts',
                        title: 'Artisan Quarter',
                        titleAr: 'حي الحرفيين',
                        description: 'Local craftsmen workshops',
                        descriptionAr: 'ورش الحرفيين المحليين',
                        duration: '02:00',
                        order: 2
                    }
                ]
            },
            {
                id: 'buj-2',
                title: 'Culinary Journey',
                titleAr: 'رحلة الطهي',
                description: 'World-class dining with heritage views',
                descriptionAr: 'مطاعم عالمية مع إطلالات تراثية',
                documentaryScript: 'Bujairi Terrace hosts over 20 restaurants representing cuisines from around the world, from Michelin-starred establishments to traditional Saudi dining experiences. All designed to offer views of the illuminated At-Turaif district.',
                documentaryScriptAr: 'يضم مطل البجيري أكثر من 20 مطعماً تمثل مطابخ من حول العالم، من المطاعم الحاصلة على نجوم ميشلان إلى تجارب الطعام السعودية التقليدية. جميعها مصممة لتوفر إطلالات على حي الطريف المضاء.',
                duration: '04:00',
                audioUrl: '/audio/tours/bujairi/dining.mp3',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                coordinates: [24.7356, 46.5752],
                contentSource: 'tourism_authority'
            }
        ]
    },
    {
        id: 'muaiqiliya-heritage',
        cityId: 'riyadh',
        title: 'Al-Muaiqiliya Heritage Walk',
        titleAr: 'جولة المعيقيلية التراثية',
        description: 'The scholarly quarter of old Diriyah',
        descriptionAr: 'الحي العلمي في الدرعية القديمة',
        fullDescription: 'Explore the historic Al-Muaiqiliya district, known for its scholars, mosques, and traditional architecture.',
        fullDescriptionAr: 'استكشف حي المعيقيلية التاريخي، المعروف بعلمائه ومساجده وعمارته التقليدية.',
        duration: '45 min',
        durationAr: '45 دقيقة',
        stops: 5,
        image: 'https://i.ytimg.com/vi/fg0fmgnx6cs/maxresdefault.jpg',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.8,
        reviews: 178,
        isFeatured: false,
        pointsCost: 40,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-18',
        playlist: [
            {
                id: 'muai-1',
                title: 'The Knowledge District',
                titleAr: 'حي العلم',
                description: 'Center of Islamic learning',
                descriptionAr: 'مركز التعلم الإسلامي',
                documentaryScript: 'Al-Muaiqiliya was one of the main residential and scholarly quarters of Diriyah. This neighborhood housed many of the scholars and teachers who made Diriyah a center of Islamic learning in the Arabian Peninsula.',
                documentaryScriptAr: 'كانت المعيقيلية واحدة من الأحياء السكنية والعلمية الرئيسية في الدرعية. ضم هذا الحي العديد من العلماء والمعلمين الذين جعلوا الدرعية مركزاً للتعلم الإسلامي في الجزيرة العربية.',
                narrativeScript: 'Walk these ancient streets where students once gathered to learn from renowned scholars. The sound of Quran recitation would fill the air at dawn, and spirited debates on theology and jurisprudence continued well into the night. This was the intellectual heart of the First Saudi State.',
                narrativeScriptAr: 'امشِ في هذه الشوارع القديمة حيث تجمع الطلاب ذات يوم للتعلم من العلماء المشهورين. كان صوت تلاوة القرآن يملأ الهواء عند الفجر، واستمرت النقاشات الحية حول اللاهوت والفقه حتى وقت متأخر من الليل. كان هذا القلب الفكري للدولة السعودية الأولى.',
                duration: '03:00',
                audioUrl: '/audio/tours/muaiqiliya/knowledge.mp3',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b',
                coordinates: [24.7350, 46.5760],
                contentSource: 'tourism_authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'muai-mosque',
                        title: 'The Scholar\'s Mosque',
                        titleAr: 'مسجد العلماء',
                        description: 'Historic teaching mosque',
                        descriptionAr: 'مسجد التدريس التاريخي',
                        duration: '02:00',
                        order: 1
                    },
                    {
                        id: 'muai-library',
                        title: 'The Old Library',
                        titleAr: 'المكتبة القديمة',
                        description: 'Manuscript collection site',
                        descriptionAr: 'موقع مجموعة المخطوطات',
                        duration: '02:00',
                        order: 2
                    }
                ]
            }
        ]
    },
    {
        id: 'kingdom-tower-tour',
        cityId: 'riyadh',
        title: 'Kingdom Tower & Modern Riyadh',
        titleAr: 'برج المملكة والرياض الحديثة',
        description: 'Experience the modern skyline',
        descriptionAr: 'استمتع بأفق المدينة الحديث',
        fullDescription: 'From the iconic Sky Bridge to the bustling Boulevard, experience modern Riyadh in all its glory.',
        fullDescriptionAr: 'من جسر السماء الأيقوني إلى البوليفارد الصاخب، استمتع بالرياض الحديثة في كل مجدها.',
        duration: '40 min',
        durationAr: '40 دقيقة',
        stops: 4,
        image: 'https://images.unsplash.com/photo-1570701123964-1e075c35b866',
        category: 'Modern',
        categoryAr: 'حديث',
        rating: 4.7,
        reviews: 312,
        isFeatured: true,
        pointsCost: 35,
        hasSubTours: false,
        vrSupported: true,
        contentSource: 'ai_generated',
        lastUpdated: '2024-01-25',
        playlist: [
            {
                id: 'kt-1',
                title: 'Kingdom Centre Tower',
                titleAr: 'برج مركز المملكة',
                description: 'The crown jewel of Riyadh\'s skyline',
                descriptionAr: 'جوهرة تاج أفق الرياض',
                documentaryScript: 'Kingdom Centre Tower, completed in 2002, stands at 302 meters and was designed by Ellerbe Becket and Omrania. The distinctive inverted parabolic arch at the top houses the Sky Bridge observation deck. The tower holds the record for the tallest building in Saudi Arabia.',
                documentaryScriptAr: 'اكتمل بناء برج مركز المملكة عام 2002، بارتفاع 302 متراً، وصممه مكتب إلير بكت وعمرانية. يضم القوس المكافئ المقلوب المميز في القمة جسر المشاهدة. يحمل البرج لقب أطول مبنى في المملكة العربية السعودية.',
                narrativeScript: 'As you ascend to the Sky Bridge, 300 meters above the city, you are quite literally touching the sky. On clear days, the view extends over 50 kilometers in every direction. Below you, Riyadh pulses with life - a city of 8 million souls transforming before the world\'s eyes.',
                narrativeScriptAr: 'بينما تصعد إلى جسر السماء، على ارتفاع 300 متر فوق المدينة، أنت حرفياً تلمس السماء. في الأيام الصافية، يمتد المنظر لأكثر من 50 كيلومتراً في كل اتجاه. تحتك، الرياض تنبض بالحياة - مدينة 8 ملايين نسمة تتحول أمام أعين العالم.',
                duration: '04:00',
                audioUrl: '/audio/tours/kingdom/tower.mp3',
                image: 'https://images.unsplash.com/photo-1570701123964-1e075c35b866',
                coordinates: [24.7114, 46.6744],
                contentSource: 'ai_generated',
                vrEnabled: true
            }
        ]
    }
];

// ===================== JEDDAH TOURS =====================
export const jeddahAudioTours: EnhancedAudioTour[] = [
    {
        id: 'albalad-heritage',
        cityId: 'jeddah',
        title: 'Al-Balad Historic District',
        titleAr: 'حي البلد التاريخي',
        description: 'UNESCO World Heritage walking tour',
        descriptionAr: 'جولة مشي في موقع التراث العالمي',
        fullDescription: 'Explore the ancient heart of Jeddah with its distinctive coral stone buildings, ornate wooden balconies, and winding alleyways.',
        fullDescriptionAr: 'استكشف قلب جدة القديم بمبانيه المميزة من الحجر المرجاني والشرفات الخشبية المزخرفة والأزقة المتعرجة.',
        duration: '75 min',
        durationAr: '75 دقيقة',
        stops: 7,
        image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
        category: 'Heritage',
        categoryAr: 'تراثي',
        rating: 4.9,
        reviews: 523,
        isFeatured: true,
        pointsCost: 60,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-22',
        playlist: [
            {
                id: 'jed-1',
                title: 'Welcome to Al-Balad',
                titleAr: 'مرحباً بكم في البلد',
                description: 'Introduction to historic Jeddah',
                descriptionAr: 'مقدمة عن جدة التاريخية',
                documentaryScript: 'Al-Balad, meaning "The Town," is the historic core of Jeddah, established in the 7th century as a major port for pilgrims traveling to Mecca. The district was inscribed as a UNESCO World Heritage Site in 2014, recognized for its exceptional architectural heritage of Hijazi-style buildings dating from the late 19th century.',
                documentaryScriptAr: 'البلد، أو "المدينة"، هو القلب التاريخي لجدة، أُسس في القرن السابع كميناء رئيسي للحجاج المسافرين إلى مكة. سُجل الحي كموقع تراث عالمي لليونسكو في 2014، معترفاً به لتراثه المعماري الاستثنائي من المباني ذات الطراز الحجازي التي يعود تاريخها إلى أواخر القرن التاسع عشر.',
                narrativeScript: 'Step through the ancient gates of Al-Balad and enter a world frozen in time. For over a thousand years, pilgrims from Africa, Asia, and beyond have walked these very streets on their sacred journey to Mecca. The air is thick with history - the smell of incense, the call of merchants, the prayers of travelers.',
                narrativeScriptAr: 'اعبر بوابات البلد القديمة وادخل عالماً مجمداً في الزمن. لأكثر من ألف عام، مشى الحجاج من أفريقيا وآسيا وما وراءها في هذه الشوارع ذاتها في رحلتهم المقدسة إلى مكة. الهواء مشبع بالتاريخ - رائحة البخور، نداء التجار، صلوات المسافرين.',
                duration: '04:00',
                audioUrl: '/audio/tours/jeddah/albalad-welcome.mp3',
                image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b',
                coordinates: [21.4858, 39.1925],
                contentSource: 'tourism_authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'jed-gates',
                        title: 'The Historic Gates',
                        titleAr: 'البوابات التاريخية',
                        description: 'Entry points to the old city',
                        descriptionAr: 'مداخل المدينة القديمة',
                        duration: '02:30',
                        order: 1
                    }
                ]
            },
            {
                id: 'jed-2',
                title: 'Naseef House',
                titleAr: 'بيت نصيف',
                description: 'A merchant\'s magnificent mansion',
                descriptionAr: 'قصر تاجر عظيم',
                documentaryScript: 'Beit Naseef, built in 1881, is one of the most significant historic buildings in Al-Balad. This five-story mansion was home to the wealthy Naseef merchant family and notably hosted King Abdulaziz in 1925 when he unified the Kingdom.',
                documentaryScriptAr: 'بُني بيت نصيف عام 1881، وهو أحد أهم المباني التاريخية في البلد. هذا القصر المكون من خمسة طوابق كان منزل عائلة نصيف التجارية الثرية، واستضاف الملك عبد العزيز عام 1925 عند توحيده المملكة.',
                narrativeScript: 'Look up at the intricate rawasheen - the elaborately carved wooden balconies that are the signature of Jeddah\'s architecture. Behind these screens, generations of families watched the bustle of the street below while staying cool in the shade. This house once welcomed a king who would unite a nation.',
                narrativeScriptAr: 'انظر إلى الرواشين المعقدة - الشرفات الخشبية المنقوشة ببراعة التي هي توقيع عمارة جدة. خلف هذه الستائر، راقبت أجيال من العائلات صخب الشارع أدناه وهم في برودة الظل. هذا البيت استقبل ذات مرة ملكاً سيوحد أمة.',
                duration: '05:00',
                audioUrl: '/audio/tours/jeddah/naseef-house.mp3',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b',
                coordinates: [21.4862, 39.1895],
                contentSource: 'tourism_authority',
                vrEnabled: true
            }
        ]
    },
    {
        id: 'jeddah-corniche',
        cityId: 'jeddah',
        title: 'Jeddah Corniche Walk',
        titleAr: 'جولة كورنيش جدة',
        description: 'Red Sea waterfront experience',
        descriptionAr: 'تجربة واجهة البحر الأحمر',
        fullDescription: 'A scenic journey along the 30km Jeddah Corniche, featuring the world\'s tallest fountain and stunning Red Sea views.',
        fullDescriptionAr: 'رحلة خلابة على طول كورنيش جدة البالغ طوله 30 كم، تضم أطول نافورة في العالم وإطلالات مذهلة على البحر الأحمر.',
        duration: '45 min',
        durationAr: '45 دقيقة',
        stops: 5,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        category: 'Nature',
        categoryAr: 'طبيعة',
        rating: 4.6,
        reviews: 387,
        isFeatured: true,
        pointsCost: 30,
        hasSubTours: false,
        vrSupported: false,
        contentSource: 'ai_generated',
        lastUpdated: '2024-01-20',
        playlist: [
            {
                id: 'corn-1',
                title: 'King Fahd Fountain',
                titleAr: 'نافورة الملك فهد',
                description: 'The world\'s tallest fountain',
                descriptionAr: 'أطول نافورة في العالم',
                documentaryScript: 'King Fahd\'s Fountain, inaugurated in 1985, shoots seawater up to 312 meters into the air, making it the tallest fountain of its kind in the world. The fountain uses no dye or coloring - its illumination comes from 500 spotlights.',
                documentaryScriptAr: 'نافورة الملك فهد، افتُتحت عام 1985، تضخ مياه البحر حتى ارتفاع 312 متراً في الهواء، مما يجعلها أطول نافورة من نوعها في العالم. لا تستخدم النافورة أي صبغة أو تلوين - إضاءتها تأتي من 500 كشاف.',
                narrativeScript: 'As evening falls over the Red Sea, witness nature and engineering merge into pure spectacle. Water erupts skyward, catching the last golden rays of sunset before transforming into a column of shimmering silver under the spotlights. This is Jeddah greeting the night.',
                narrativeScriptAr: 'مع حلول المساء على البحر الأحمر، شاهد الطبيعة والهندسة تندمجان في مشهد خالص. المياه تنفجر نحو السماء، تلتقط آخر أشعة غروب الشمس الذهبية قبل أن تتحول إلى عمود من الفضة المتلألئة تحت الأضواء. هذه جدة تحيي الليل.',
                duration: '04:00',
                audioUrl: '/audio/tours/jeddah/fountain.mp3',
                image: 'https://images.unsplash.com/photo-1473181488821-2d23949a045a',
                coordinates: [21.5169, 39.1394],
                contentSource: 'ai_generated'
            }
        ]
    }
];

// ===================== MECCA TOURS =====================
export const meccaAudioTours: EnhancedAudioTour[] = [
    {
        id: 'mecca-heritage',
        cityId: 'mecca',
        title: 'Holy City Heritage Tour',
        titleAr: 'جولة تراث المدينة المقدسة',
        description: 'Sacred sites and historical landmarks',
        descriptionAr: 'المواقع المقدسة والمعالم التاريخية',
        fullDescription: 'Explore the historical significance of Islam\'s holiest city and its sacred surroundings.',
        fullDescriptionAr: 'استكشف الأهمية التاريخية لأقدس مدينة في الإسلام ومحيطها المقدس.',
        duration: '60 min',
        durationAr: '60 دقيقة',
        stops: 5,
        image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb',
        category: 'Religious',
        categoryAr: 'ديني',
        rating: 5.0,
        reviews: 1245,
        isFeatured: true,
        pointsCost: 100,
        hasSubTours: true,
        vrSupported: false,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-28',
        playlist: [
            {
                id: 'mec-1',
                title: 'Jabal al-Nour',
                titleAr: 'جبل النور',
                description: 'Mountain of Light',
                descriptionAr: 'جبل النور',
                documentaryScript: 'Jabal al-Nour, the Mountain of Light, rises 642 meters above sea level and is located approximately 3 kilometers from the Masjid al-Haram. At its summit lies Ghar Hira (the Cave of Hira), where Prophet Muhammad (PBUH) received the first revelation of the Quran in 610 CE.',
                documentaryScriptAr: 'جبل النور يرتفع 642 متراً فوق مستوى سطح البحر ويقع على بعد حوالي 3 كيلومترات من المسجد الحرام. في قمته يقع غار حراء، حيث تلقى النبي محمد صلى الله عليه وسلم أول وحي من القرآن عام 610م.',
                narrativeScript: 'Close your eyes and imagine the silence of this mountain 1,400 years ago. Here, in a small cave overlooking the barren valley, a contemplative man named Muhammad sought solitude and truth. One night, an angel appeared with words that would change the course of human history: "Read, in the name of your Lord."',
                narrativeScriptAr: 'أغمض عينيك وتخيل سكون هذا الجبل قبل 1400 عام. هنا، في كهف صغير يطل على الوادي القاحل، بحث رجل متأمل اسمه محمد عن العزلة والحقيقة. ذات ليلة، ظهر ملاك بكلمات ستغير مسار التاريخ البشري: "اقرأ باسم ربك".',
                duration: '05:00',
                audioUrl: '/audio/tours/mecca/jabal-nour.mp3',
                image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769',
                coordinates: [21.4579, 39.8594],
                contentSource: 'tourism_authority',
                vrEnabled: false
            }
        ]
    }
];

// ===================== ALULA TOURS =====================
export const alulaAudioTours: EnhancedAudioTour[] = [
    {
        id: 'hegra-discovery',
        cityId: 'alula',
        title: 'Hegra Archaeological Discovery',
        titleAr: 'اكتشاف آثار الحجر',
        description: 'Saudi\'s first UNESCO World Heritage Site',
        descriptionAr: 'أول موقع تراث عالمي سعودي',
        fullDescription: 'Journey through the ancient Nabataean city of Hegra with its monumental tombs carved into sandstone cliffs.',
        fullDescriptionAr: 'رحلة عبر مدينة الحجر النبطية القديمة بمقابرها الضخمة المنحوتة في الصخور الرملية.',
        duration: '90 min',
        durationAr: '90 دقيقة',
        stops: 8,
        image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
        category: 'Archaeological',
        categoryAr: 'أثري',
        rating: 4.9,
        reviews: 678,
        isFeatured: true,
        pointsCost: 80,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-30',
        playlist: [
            {
                id: 'heg-1',
                title: 'Welcome to Hegra',
                titleAr: 'مرحباً بكم في الحجر',
                description: 'Introduction to the Nabataean civilization',
                descriptionAr: 'مقدمة عن الحضارة النبطية',
                documentaryScript: 'Hegra, known in ancient times as Mada\'in Salih, was the southernmost settlement of the Nabataean Kingdom. Built between the 1st century BCE and the 1st century CE, it served as a vital trading hub on the incense route. The site contains over 100 well-preserved monumental tombs.',
                documentaryScriptAr: 'الحجر، المعروفة قديماً بمدائن صالح، كانت أقصى مستوطنة جنوبية للمملكة النبطية. بُنيت بين القرن الأول قبل الميلاد والقرن الأول الميلادي، وكانت مركزاً تجارياً حيوياً على طريق البخور. يضم الموقع أكثر من 100 مقبرة ضخمة محفوظة جيداً.',
                narrativeScript: 'Two thousand years ago, caravans laden with frankincense and myrrh stopped here after weeks of desert travel. The Nabataeans, master traders and engineers, carved their eternal legacy into these rose-tinted cliffs. Walk in the footsteps of ancient merchants and stand before monuments that have defied time itself.',
                narrativeScriptAr: 'قبل ألفي عام، توقفت القوافل المحملة باللبان والمر هنا بعد أسابيع من السفر الصحراوي. نحت الأنباط، التجار والمهندسون المتفوقون، إرثهم الأبدي في هذه الصخور الوردية. امشِ على خطى التجار القدماء وقف أمام نصب تحدت الزمن نفسه.',
                duration: '05:00',
                audioUrl: '/audio/tours/alula/hegra-welcome.mp3',
                image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
                coordinates: [26.7841, 37.9528],
                contentSource: 'tourism_authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'heg-qasr',
                        title: 'Qasr al-Farid',
                        titleAr: 'قصر الفريد',
                        description: 'The Lonely Castle',
                        descriptionAr: 'القلعة الوحيدة',
                        duration: '04:00',
                        order: 1
                    }
                ]
            }
        ]
    }
];

// Import additional city tours
import { medinaAudioTours, dammamAudioTours, abhaAudioTours, taifAudioTours } from './audio-tours-cities';

// ===================== ALL TOURS COMBINED =====================
export const allEnhancedAudioTours: EnhancedAudioTour[] = [
    ...riyadhAudioTours,
    ...jeddahAudioTours,
    ...meccaAudioTours,
    ...alulaAudioTours,
    ...medinaAudioTours,
    ...dammamAudioTours,
    ...abhaAudioTours,
    ...taifAudioTours
];

// Helper functions
export function getAudioToursByCity(cityId: string): EnhancedAudioTour[] {
    return allEnhancedAudioTours.filter(tour => tour.cityId === cityId);
}

export function getAudioTourById(tourId: string): EnhancedAudioTour | undefined {
    return allEnhancedAudioTours.find(tour => tour.id === tourId);
}

export function getFeaturedAudioTours(): EnhancedAudioTour[] {
    return allEnhancedAudioTours.filter(tour => tour.isFeatured);
}

export function getVRSupportedTours(): EnhancedAudioTour[] {
    return allEnhancedAudioTours.filter(tour => tour.vrSupported);
}
