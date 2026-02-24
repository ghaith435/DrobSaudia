/**
 * Additional City Audio Tours Data
 * رحلات صوتية إضافية للمدن الأخرى
 * 
 * Cities: Medina, Dammam, Abha, Taif
 */

import { EnhancedAudioTour } from './audio-tours-enhanced';

// ===================== MEDINA TOURS =====================
export const medinaAudioTours: EnhancedAudioTour[] = [
    {
        id: 'medina-prophetic',
        cityId: 'medina',
        title: 'The Prophetic City Tour',
        titleAr: 'جولة المدينة النبوية',
        description: 'Walk in the footsteps of the Prophet',
        descriptionAr: 'امشِ على خطى النبي',
        fullDescription: 'A spiritual journey through the second holiest city in Islam, visiting the Prophet\'s Mosque and surrounding historical sites.',
        fullDescriptionAr: 'رحلة روحية عبر ثاني أقدس مدينة في الإسلام، زيارة المسجد النبوي والمواقع التاريخية المحيطة.',
        duration: '75 min',
        durationAr: '75 دقيقة',
        stops: 6,
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
        category: 'Religious',
        categoryAr: 'ديني',
        rating: 5.0,
        reviews: 1567,
        isFeatured: true,
        pointsCost: 100,
        hasSubTours: true,
        vrSupported: false,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-25',
        playlist: [
            {
                id: 'med-1',
                title: 'Al-Masjid an-Nabawi',
                titleAr: 'المسجد النبوي الشريف',
                description: 'The Prophet\'s Mosque',
                descriptionAr: 'المسجد النبوي',
                documentaryScript: 'Al-Masjid an-Nabawi, the Prophet\'s Mosque, is the second holiest site in Islam after the Masjid al-Haram in Mecca. Originally built by Prophet Muhammad (PBUH) in 622 CE after his migration from Mecca, the mosque has been expanded numerous times and can now accommodate over one million worshippers.',
                documentaryScriptAr: 'المسجد النبوي هو ثاني أقدس موقع في الإسلام بعد المسجد الحرام في مكة. بناه النبي محمد صلى الله عليه وسلم في العام 622م بعد هجرته من مكة، وتم توسيعه عدة مرات ويستوعب الآن أكثر من مليون مصلٍ.',
                narrativeScript: 'As you approach the Prophet\'s Mosque, notice how the towering minarets seem to reach toward the heavens. For 1,400 years, pilgrims have walked these grounds, their hearts full of devotion. The Prophet himself prayed where you now stand. His blessed grave lies beneath the Green Dome, a beacon of faith for Muslims worldwide.',
                narrativeScriptAr: 'وأنت تقترب من المسجد النبوي، لاحظ كيف تبدو المآذن الشاهقة وكأنها تمتد نحو السماء. لمدة 1400 عام، مشى الحجاج على هذه الأرض، قلوبهم مليئة بالإيمان. صلى النبي نفسه حيث تقف الآن. قبره المبارك يقع تحت القبة الخضراء، منارة للإيمان للمسلمين في جميع أنحاء العالم.',
                duration: '06:00',
                audioUrl: '/audio/tours/medina/prophet-mosque.mp3',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
                coordinates: [24.4672, 39.6112],
                contentSource: 'tourism_authority',
                sourceReference: 'Saudi Ministry of Islamic Affairs',
                vrEnabled: false,
                subTours: [
                    {
                        id: 'med-rawdah',
                        title: 'Ar-Rawdah ash-Sharifah',
                        titleAr: 'الروضة الشريفة',
                        description: 'The Noble Garden',
                        descriptionAr: 'الروضة الشريفة',
                        duration: '03:00',
                        order: 1
                    },
                    {
                        id: 'med-mihrab',
                        title: 'The Prophet\'s Mihrab',
                        titleAr: 'محراب النبي',
                        description: 'Where the Prophet led prayers',
                        descriptionAr: 'حيث كان النبي يؤم المصلين',
                        duration: '02:00',
                        order: 2
                    }
                ]
            },
            {
                id: 'med-2',
                title: 'Quba Mosque',
                titleAr: 'مسجد قباء',
                description: 'The first mosque in Islam',
                descriptionAr: 'أول مسجد في الإسلام',
                documentaryScript: 'Masjid Quba is the oldest mosque in the world and was founded by Prophet Muhammad (PBUH) on his arrival in Medina in 622 CE. Praying two rakats in Quba Mosque is equivalent to performing Umrah, according to hadith.',
                documentaryScriptAr: 'مسجد قباء هو أول مسجد بني في الإسلام، أسسه النبي محمد صلى الله عليه وسلم عند وصوله إلى المدينة عام 622م. صلاة ركعتين في مسجد قباء تعدل أجر عمرة، وفق الحديث الشريف.',
                narrativeScript: 'Imagine arriving after a long, dangerous journey from Mecca. The first thing the Prophet did was lay the foundation stones of this mosque. With his own hands, he built a place of worship. Today, as you walk through its courtyards, you are walking on blessed ground where history began.',
                narrativeScriptAr: 'تخيل الوصول بعد رحلة طويلة وخطيرة من مكة. أول ما فعله النبي هو وضع حجر الأساس لهذا المسجد. ببديه الكريمتين، بنى مكاناً للعبادة. اليوم، وأنت تمشي في ساحاته، تمشي على أرض مباركة حيث بدأ التاريخ.',
                duration: '04:30',
                audioUrl: '/audio/tours/medina/quba.mp3',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
                coordinates: [24.4397, 39.6175],
                contentSource: 'tourism_authority'
            },
            {
                id: 'med-3',
                title: 'Mount Uhud',
                titleAr: 'جبل أحد',
                description: 'The mountain that loved the Prophet',
                descriptionAr: 'الجبل الذي أحب النبي',
                documentaryScript: 'Mount Uhud is located about 4 kilometers north of the Prophet\'s Mosque. It was the site of the Battle of Uhud in 625 CE. The Prophet said: "Uhud is a mountain that loves us and we love it." The Martyrs\' Cemetery at its base holds the companions who fell in battle.',
                documentaryScriptAr: 'يقع جبل أحد على بعد حوالي 4 كيلومترات شمال المسجد النبوي. كان موقع غزوة أحد عام 625م. قال النبي: "أُحُد جبل يحبنا ونحبه." مقبرة الشهداء عند سفحه تضم الصحابة الذين استشهدوا في المعركة.',
                narrativeScript: 'Look at Mount Uhud rising before you, its red stone glowing in the sunlight. The Prophet called it a mountain that loves us. Here, under this soil, rest the bodies of 70 martyrs including Hamza, the Prophet\'s beloved uncle. Their sacrifice echoes through the centuries.',
                narrativeScriptAr: 'انظر إلى جبل أحد يرتفع أمامك، حجره الأحمر يتوهج في ضوء الشمس. سماه النبي جبلاً يحبنا. هنا، تحت هذه التربة، ترقد أجساد 70 شهيداً بينهم حمزة عم النبي الحبيب. تضحيتهم تتردد عبر القرون.',
                duration: '05:00',
                audioUrl: '/audio/tours/medina/uhud.mp3',
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
                coordinates: [24.5005, 39.6178],
                contentSource: 'tourism_authority'
            }
        ]
    }
];

// ===================== DAMMAM TOURS =====================
export const dammamAudioTours: EnhancedAudioTour[] = [
    {
        id: 'dammam-coastal',
        cityId: 'dammam',
        title: 'Eastern Province Coastal Tour',
        titleAr: 'جولة ساحل المنطقة الشرقية',
        description: 'Explore the Arabian Gulf coastline',
        descriptionAr: 'استكشف ساحل الخليج العربي',
        fullDescription: 'From the historic Tarout Castle to the modern Dammam Corniche, discover the Eastern Province\'s rich maritime heritage.',
        fullDescriptionAr: 'من قلعة تاروت التاريخية إلى كورنيش الدمام الحديث، اكتشف تراث المنطقة الشرقية البحري الغني.',
        duration: '60 min',
        durationAr: '60 دقيقة',
        stops: 5,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        category: 'Heritage',
        categoryAr: 'تراثي',
        rating: 4.6,
        reviews: 234,
        isFeatured: true,
        pointsCost: 45,
        hasSubTours: false,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-20',
        playlist: [
            {
                id: 'dam-1',
                title: 'Tarout Castle',
                titleAr: 'قلعة تاروت',
                description: '5,000 years of history',
                descriptionAr: '5000 عام من التاريخ',
                documentaryScript: 'Tarout Castle sits on Tarout Island in the Arabian Gulf, one of the oldest settlements in the region with artifacts dating back 5,000 years. The current structure dates from the Portuguese era (16th century) but rests on foundations from the Dilmun civilization.',
                documentaryScriptAr: 'تقع قلعة تاروت على جزيرة تاروت في الخليج العربي، وهي من أقدم المستوطنات في المنطقة مع آثار تعود إلى 5000 عام. الهيكل الحالي يعود للعصر البرتغالي (القرن السادس عشر) لكنه يرتكز على أساسات من حضارة دلمون.',
                narrativeScript: 'Stand before walls that have witnessed five millennia of human history. Phoenician traders, Persian conquerors, Portuguese sailors - they all left their mark on this ancient island. Touch these stones and feel the weight of centuries. This is where Arabia first met the sea.',
                narrativeScriptAr: 'قف أمام جدران شهدت خمسة آلاف عام من التاريخ البشري. التجار الفينيقيون، الغزاة الفرس، البحارة البرتغاليون - كلهم تركوا بصمتهم على هذه الجزيرة القديمة. المس هذه الحجارة واشعر بثقل القرون. هنا التقت الجزيرة العربية بالبحر لأول مرة.',
                duration: '04:30',
                audioUrl: '/audio/tours/dammam/tarout.mp3',
                image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769',
                coordinates: [26.5697, 50.0567],
                contentSource: 'tourism_authority',
                vrEnabled: true
            },
            {
                id: 'dam-2',
                title: 'Dammam Corniche',
                titleAr: 'كورنيش الدمام',
                description: 'Modern waterfront promenade',
                descriptionAr: 'كورنيش حديث على الواجهة البحرية',
                documentaryScript: 'The Dammam Corniche stretches along the Arabian Gulf coastline, offering parks, beaches, restaurants, and recreational areas. The corniche development began in the 1980s as part of the city\'s modernization, transforming industrial shoreline into a family destination.',
                documentaryScriptAr: 'يمتد كورنيش الدمام على طول ساحل الخليج العربي، ويوفر حدائق وشواطئ ومطاعم ومناطق ترفيهية. بدأ تطوير الكورنيش في الثمانينيات كجزء من تحديث المدينة، محولاً الشاطئ الصناعي إلى وجهة عائلية.',
                duration: '03:30',
                audioUrl: '/audio/tours/dammam/corniche.mp3',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
                coordinates: [26.4272, 50.0897],
                contentSource: 'ai_generated'
            }
        ]
    }
];

// ===================== ABHA TOURS =====================
export const abhaAudioTours: EnhancedAudioTour[] = [
    {
        id: 'abha-mountains',
        cityId: 'abha',
        title: 'Asir Highlands Adventure',
        titleAr: 'مغامرة مرتفعات عسير',
        description: 'The cool mountain escape',
        descriptionAr: 'الهروب إلى الجبال الباردة',
        fullDescription: 'Experience the unique Asiri culture, dramatic landscapes, and cool climate of Saudi Arabia\'s southern highlands.',
        fullDescriptionAr: 'استمتع بالثقافة العسيرية الفريدة والمناظر الطبيعية الدرامية والمناخ البارد لمرتفعات جنوب المملكة.',
        duration: '90 min',
        durationAr: '90 دقيقة',
        stops: 7,
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        category: 'Nature',
        categoryAr: 'طبيعة',
        rating: 4.8,
        reviews: 456,
        isFeatured: true,
        pointsCost: 65,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-28',
        playlist: [
            {
                id: 'abh-1',
                title: 'Green Mountain (Jabal Akhdar)',
                titleAr: 'الجبل الأخضر',
                description: 'Illuminated mountain viewpoint',
                descriptionAr: 'نقطة مراقبة الجبل المضيء',
                documentaryScript: 'Green Mountain, the symbol of Abha, rises 2,200 meters above sea level in the heart of the city. At night, it is illuminated with thousands of green lights, making it visible from across the region. A cable car connects the summit to the valley below.',
                documentaryScriptAr: 'الجبل الأخضر، رمز أبها، يرتفع 2200 متر فوق مستوى سطح البحر في قلب المدينة. في الليل، يُضاء بآلاف الأضواء الخضراء، مما يجعله مرئياً من جميع أنحاء المنطقة. يربط التلفريك القمة بالوادي أدناه.',
                narrativeScript: 'As the fog rolls in over Abha, the Green Mountain emerges like an emerald beacon. This is the City of Fog, where clouds dance between the peaks and the air is sweet and cool. Take the cable car to the summit, and for a moment, feel like you\'re floating among the clouds.',
                narrativeScriptAr: 'مع تدفق الضباب على أبها، يظهر الجبل الأخضر كمنارة زمردية. هذه مدينة الضباب، حيث ترقص الغيوم بين القمم والهواء عذب وبارد. اركب التلفريك إلى القمة، وللحظة، اشعر وكأنك تطفو بين الغيوم.',
                duration: '04:00',
                audioUrl: '/audio/tours/abha/green-mountain.mp3',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
                coordinates: [18.2168, 42.5050],
                contentSource: 'tourism_authority',
                vrEnabled: true
            },
            {
                id: 'abh-2',
                title: 'Habala Village',
                titleAr: 'قرية حبالة المعلقة',
                description: 'The hanging village',
                descriptionAr: 'القرية المعلقة',
                documentaryScript: 'Habala, meaning "the one with ropes," is a historic village perched on a cliff edge in the Asir Mountains. Until the 1980s, residents used ropes to descend to their terraced farms. Today, a cable car provides access to this unique UNESCO World Heritage tentative site.',
                documentaryScriptAr: 'حبالة، أي "ذات الحبال"، قرية تاريخية تقع على حافة جرف في جبال عسير. حتى الثمانينيات، استخدم السكان الحبال للنزول إلى مزارعهم المدرجة. اليوم، يوفر التلفريك وصولاً إلى هذا الموقع الفريد المرشح لقائمة التراث العالمي.',
                narrativeScript: 'Look down from the cliff edge and marvel at human determination. For centuries, the people of Habala climbed up and down these vertical cliffs using only ropes. Their stone houses cling to the mountainside as if grown from the rock itself. This is living history, frozen in time.',
                narrativeScriptAr: 'انظر من حافة الجرف وتعجب من إصرار الإنسان. لقرون، صعد أهل حبالة ونزلوا هذه الجروف العمودية باستخدام الحبال فقط. منازلهم الحجرية تتمسك بجانب الجبل كأنها نمت من الصخر نفسه. هذا تاريخ حي، مجمد في الزمن.',
                duration: '05:00',
                audioUrl: '/audio/tours/abha/habala.mp3',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                coordinates: [18.0833, 42.7833],
                contentSource: 'tourism_authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'abh-habala-farms',
                        title: 'Terraced Farms',
                        titleAr: 'المزارع المدرجة',
                        description: 'Ancient agricultural techniques',
                        descriptionAr: 'تقنيات زراعية قديمة',
                        duration: '02:30',
                        order: 1
                    }
                ]
            },
            {
                id: 'abh-3',
                title: 'Rijal Almaa Village',
                titleAr: 'قرية رجال ألمع',
                description: 'UNESCO heritage candidate',
                descriptionAr: 'مرشحة لتراث اليونسكو',
                documentaryScript: 'Rijal Almaa is a 400-year-old village famous for its tower houses built from stone, slate, and mud, decorated in vibrant colors. The village museum showcases traditional Asiri artifacts, costumes, and crafts. It is on Saudi Arabia\'s tentative list for UNESCO World Heritage.',
                documentaryScriptAr: 'رجال ألمع قرية عمرها 400 عام مشهورة ببيوتها البرجية المبنية من الحجر والأردواز والطين، المزينة بألوان زاهية. يعرض متحف القرية المصنوعات اليدوية والأزياء والحرف العسيرية التقليدية. وهي على قائمة السعودية المؤقتة لتراث اليونسكو.',
                duration: '05:30',
                audioUrl: '/audio/tours/abha/rijal-almaa.mp3',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                coordinates: [17.9167, 42.2833],
                contentSource: 'tourism_authority'
            }
        ]
    }
];

// ===================== TAIF TOURS =====================
export const taifAudioTours: EnhancedAudioTour[] = [
    {
        id: 'taif-roses',
        cityId: 'taif',
        title: 'City of Roses Tour',
        titleAr: 'جولة مدينة الورود',
        description: 'Fragrant heritage and cool escapes',
        descriptionAr: 'تراث عطر وهروب إلى البرودة',
        fullDescription: 'Discover Taif, the summer capital of Saudi Arabia, famous for its rose farms, historic palaces, and pleasant mountain climate.',
        fullDescriptionAr: 'اكتشف الطائف، العاصمة الصيفية للمملكة، المشهورة بمزارع الورد والقصور التاريخية والمناخ الجبلي اللطيف.',
        duration: '70 min',
        durationAr: '70 دقيقة',
        stops: 6,
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
        category: 'Heritage',
        categoryAr: 'تراثي',
        rating: 4.7,
        reviews: 345,
        isFeatured: true,
        pointsCost: 55,
        hasSubTours: true,
        vrSupported: true,
        contentSource: 'tourism_authority',
        lastUpdated: '2024-01-22',
        playlist: [
            {
                id: 'taf-1',
                title: 'Taif Rose Farms',
                titleAr: 'مزارع الورد الطائفي',
                description: 'The rose harvest tradition',
                descriptionAr: 'تقليد حصاد الورد',
                documentaryScript: 'Taif roses, known as Ward Taifi, have been cultivated in the region for over 200 years. The damascene rose variety thrives in Taif\'s unique climate at 1,800 meters elevation. Over 800 farms produce roses each spring, distilling them into precious rose oil and rose water.',
                documentaryScriptAr: 'ورد الطائف، المعروف بالورد الطائفي، يُزرع في المنطقة منذ أكثر من 200 عام. صنف الورد الدمشقي يزدهر في مناخ الطائف الفريد على ارتفاع 1800 متر. أكثر من 800 مزرعة تنتج الورد كل ربيع، وتقطره إلى زيت الورد وماء الورد الثمين.',
                narrativeScript: 'Close your eyes and breathe deeply. The air here is perfumed with thousands of roses, their pink petals catching the morning dew. For generations, families have woken before dawn to harvest these precious flowers by hand. Each drop of rose oil represents thousands of petals, and centuries of tradition.',
                narrativeScriptAr: 'أغمض عينيك وتنفس بعمق. الهواء هنا معطر بآلاف الورود، بتلاتها الوردية تلتقط ندى الصباح. لأجيال، استيقظت العائلات قبل الفجر لحصاد هذه الزهور الثمينة يدوياً. كل قطرة من زيت الورد تمثل آلاف البتلات، وقرون من التقاليد.',
                duration: '05:00',
                audioUrl: '/audio/tours/taif/roses.mp3',
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
                coordinates: [21.2703, 40.4158],
                contentSource: 'tourism_authority',
                vrEnabled: true,
                subTours: [
                    {
                        id: 'taf-distillery',
                        title: 'Rose Distillery',
                        titleAr: 'معمل تقطير الورد',
                        description: 'Traditional distillation process',
                        descriptionAr: 'عملية التقطير التقليدية',
                        duration: '03:00',
                        order: 1
                    }
                ]
            },
            {
                id: 'taf-2',
                title: 'Shubra Palace',
                titleAr: 'قصر شبرا',
                description: 'Royal summer residence',
                descriptionAr: 'المقر الصيفي الملكي',
                documentaryScript: 'Shubra Palace was built in 1904 as a residence for Ali Pasha, later becoming a summer palace for King Abdulaziz. The four-story building blends Hijazi and Ottoman architectural styles. Now a museum, it houses artifacts from the region\'s history.',
                documentaryScriptAr: 'بُني قصر شبرا عام 1904 كمقر إقامة لعلي باشا، ثم أصبح قصراً صيفياً للملك عبد العزيز. المبنى المكون من أربعة طوابق يمزج بين الطرازين الحجازي والعثماني. الآن متحف يضم قطعاً أثرية من تاريخ المنطقة.',
                duration: '04:30',
                audioUrl: '/audio/tours/taif/shubra.mp3',
                image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b',
                coordinates: [21.2703, 40.4158],
                contentSource: 'tourism_authority'
            },
            {
                id: 'taf-3',
                title: 'Souq Okaz',
                titleAr: 'سوق عكاظ',
                description: 'Ancient poetry market',
                descriptionAr: 'سوق الشعر القديم',
                documentaryScript: 'Souq Okaz was one of the greatest pre-Islamic markets, where Arabs gathered annually to trade goods and compete in poetry. The market has been revived as an annual cultural festival celebrating Arabic poetry, heritage, and arts.',
                documentaryScriptAr: 'سوق عكاظ كان من أعظم الأسواق قبل الإسلام، حيث تجمع العرب سنوياً لتجارة البضائع والتنافس في الشعر. أُعيد إحياء السوق كمهرجان ثقافي سنوي يحتفي بالشعر العربي والتراث والفنون.',
                narrativeScript: 'In the days before Islam, the greatest poets of Arabia gathered here to compete for glory. Imagine the scene: tribes on horseback, poets declaiming their verses to thunderous applause, merchants haggling over incense and silk. This was the stage where Arabic poetry was born.',
                narrativeScriptAr: 'في أيام ما قبل الإسلام، تجمع أعظم شعراء العرب هنا للتنافس على المجد. تخيل المشهد: القبائل على ظهور الخيل، الشعراء يلقون أشعارهم وسط تصفيق حار، التجار يساومون على البخور والحرير. هذه كانت المسرح الذي وُلد فيه الشعر العربي.',
                duration: '05:00',
                audioUrl: '/audio/tours/taif/okaz.mp3',
                image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a',
                coordinates: [21.2833, 40.3167],
                contentSource: 'tourism_authority',
                vrEnabled: true
            }
        ]
    }
];

// Export all additional city tours
export const additionalCityTours = [
    ...medinaAudioTours,
    ...dammamAudioTours,
    ...abhaAudioTours,
    ...taifAudioTours
];
