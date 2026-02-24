export interface AudioStop {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    script?: string;      // Pre-written audio script in English
    scriptAr?: string;    // Pre-written audio script in Arabic
    duration: string;
    audioUrl: string; // Placeholder relative path
    image: string;
    coordinates?: [number, number];
}

export interface AudioTour {
    id: string;
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
    pointsCost: number; // Cost in points to unlock
    playlist: AudioStop[];
}

export const toursData: AudioTour[] = [
    {
        id: '1',
        title: 'Historical Diriyah Tour',
        titleAr: 'جولة الدرعية التاريخية',
        description: 'Explore the birthplace of Saudi Arabia',
        descriptionAr: 'اكتشف مهد المملكة العربية السعودية',
        fullDescription: 'A comprehensive audio journey through the UNESCO World Heritage site of At-Turaif in Diriyah. Discover the rich history of the First Saudi State, explore the palaces of imams, and immerse yourself in the traditional Najdi architecture.',
        fullDescriptionAr: 'رحلة صوتية شاملة عبر موقع حي الطريف في الدرعية، المسجل في قائمة التراث العالمي لليونسكو. اكتشف التاريخ الغني للدولة السعودية الأولى، واستكشف قصور الأئمة، وانغمس في العمارة النجدية التقليدية.',
        duration: '45 min',
        durationAr: '45 دقيقة',
        stops: 5,
        image: 'https://images.unsplash.com/photo-1580824456770-4d8961314d64',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.9,
        reviews: 234,
        isFeatured: true,
        pointsCost: 50,
        playlist: [
            {
                id: '1-1',
                title: 'Welcome to Diriyah',
                titleAr: 'مرحباً بكم في الدرعية',
                description: 'Introduction to the jewel of the Kingdom',
                descriptionAr: 'مقدمة عن جوهرة المملكة',
                script: 'Welcome to Diriyah, the jewel of the Kingdom and the birthplace of Saudi Arabia. As you stand before these ancient mud-brick walls, you are witnessing over three centuries of rich history. Founded in 1446, Diriyah became the capital of the First Saudi State under Imam Muhammad ibn Saud. Today, this UNESCO World Heritage site welcomes visitors to explore its majestic palaces, winding alleyways, and the stories that shaped a nation. Let us begin this remarkable journey through time.',
                scriptAr: 'مرحباً بكم في الدرعية، جوهرة المملكة ومهد الدولة السعودية الأولى. وأنتم تقفون أمام هذه الجدران الطينية العريقة، فإنكم تشهدون أكثر من ثلاثة قرون من التاريخ الثري. تأسست الدرعية عام 1446، لتصبح عاصمة الدولة السعودية الأولى في عهد الإمام محمد بن سعود. اليوم، يستقبل هذا الموقع المسجل في قائمة التراث العالمي لليونسكو الزوار لاستكشاف قصوره المهيبة وأزقته المتعرجة والقصص التي شكلت أمة. لنبدأ معاً هذه الرحلة الاستثنائية عبر الزمن.',
                duration: '02:30',
                audioUrl: '/audio/diriyah-intro.mp3',
                image: 'https://images.unsplash.com/photo-1580824456770-4d8961314d64'
            },
            {
                id: '1-2',
                title: 'Salwa Palace',
                titleAr: 'قصر سلوى',
                description: 'The home of the imams and the seat of government',
                descriptionAr: 'منزل الأئمة ومقر الحكم',
                script: 'Before you stands Salwa Palace, the largest and most significant structure in At-Turaif district. This magnificent palace served as the residence of the ruling imams and the administrative heart of the First Saudi State. Notice the intricate geometric patterns carved into the mud walls, a testament to Najdi craftsmanship. The palace complex includes multiple courtyards, reception halls, and private quarters. Each room tells a story of diplomacy, governance, and daily life in 18th-century Arabia.',
                scriptAr: 'أمامكم يقف قصر سلوى، أكبر وأهم مبنى في حي الطريف. هذا القصر المهيب كان مقر إقامة الأئمة الحاكمين والقلب الإداري للدولة السعودية الأولى. لاحظوا الأنماط الهندسية المعقدة المنقوشة على الجدران الطينية، شهادة على براعة الحرفيين النجديين. يضم مجمع القصر عدة ساحات وقاعات استقبال وأجنحة خاصة. كل غرفة تروي قصة من قصص الدبلوماسية والحكم والحياة اليومية في شبه الجزيرة العربية في القرن الثامن عشر.',
                duration: '05:15',
                audioUrl: '/audio/salwa-palace.mp3',
                image: 'https://placehold.co/600x400'
            },
            {
                id: '1-3',
                title: 'Imam Mohammad bin Saud Mosque',
                titleAr: 'مسجد الإمام محمد بن سعود',
                description: 'A spiritual center of the first state',
                descriptionAr: 'المركز الروحي للدولة الأولى',
                script: 'The mosque before you was the spiritual heart of the First Saudi State. Here, Imam Muhammad ibn Saud and Sheikh Muhammad ibn Abd al-Wahhab forged the historic alliance that would shape the future of Arabia. This sacred space witnessed Friday prayers, scholarly discussions, and community gatherings. The simple yet elegant design reflects the authentic Najdi architectural tradition, where function and faith come together in perfect harmony.',
                scriptAr: 'كان المسجد الذي أمامكم القلب الروحي للدولة السعودية الأولى. هنا، أبرم الإمام محمد بن سعود والشيخ محمد بن عبد الوهاب التحالف التاريخي الذي شكل مستقبل الجزيرة العربية. شهد هذا المكان المقدس صلوات الجمعة والحلقات العلمية والتجمعات المجتمعية. يعكس التصميم البسيط والأنيق الطراز المعماري النجدي الأصيل، حيث تلتقي الوظيفة والإيمان في تناغم تام.',
                duration: '03:45',
                audioUrl: '/audio/mosque.mp3',
                image: 'https://placehold.co/600x400'
            },
            {
                id: '1-4',
                title: 'Traditional Farming',
                titleAr: 'الزراعة التقليدية',
                description: 'Life in Wadi Hanifa',
                descriptionAr: 'الحياة في وادي حنيفة',
                script: 'As we approach Wadi Hanifa, observe the ancient irrigation channels that sustained life in this valley for centuries. The ingenious water management systems allowed farmers to cultivate date palms, wheat, and vegetables in the heart of the Arabian Peninsula. This oasis was the lifeblood of Diriyah, providing food, water, and a gathering place for the community. Today, Wadi Hanifa has been beautifully restored as a natural park, where history meets modern conservation.',
                scriptAr: 'وبينما نقترب من وادي حنيفة، لاحظوا قنوات الري القديمة التي أمدت الحياة في هذا الوادي لقرون. أتاحت أنظمة إدارة المياه العبقرية للمزارعين زراعة النخيل والقمح والخضروات في قلب شبه الجزيرة العربية. كانت هذه الواحة شريان حياة الدرعية، توفر الطعام والماء ومكاناً للتجمع المجتمعي. اليوم، تم ترميم وادي حنيفة بشكل جميل كمنتزه طبيعي، حيث يلتقي التاريخ بالحفاظ الحديث على البيئة.',
                duration: '04:20',
                audioUrl: '/audio/farming.mp3',
                image: 'https://placehold.co/600x400'
            },
            {
                id: '1-5',
                title: 'The Future of Diriyah',
                titleAr: 'مستقبل الدرعية',
                description: 'Vision 2030 and preservation efforts',
                descriptionAr: 'رؤية 2030 وجهود الحفاظ على التراث',
                script: 'Our journey concludes with a glimpse into Diriyah\'s exciting future. Under Saudi Vision 2030, Diriyah Gate is transforming this historic site into one of the world\'s greatest gathering places. While preserving its precious heritage, new developments will include world-class museums, luxury hotels, and cultural venues. The careful balance between conservation and innovation ensures that future generations can experience the same wonder you have today. Thank you for joining us on this journey through time.',
                scriptAr: 'تنتهي رحلتنا بنظرة على مستقبل الدرعية المشرق. في إطار رؤية السعودية 2030، يتحول مشروع بوابة الدرعية هذا الموقع التاريخي إلى أحد أعظم وجهات التجمع في العالم. مع الحفاظ على تراثها الثمين، ستتضمن التطورات الجديدة متاحف عالمية وفنادق فاخرة ومرافق ثقافية. يضمن التوازن الدقيق بين الحفظ والابتكار أن الأجيال القادمة ستختبر نفس الدهشة التي عشتموها اليوم. شكراً لانضمامكم إلينا في هذه الرحلة عبر الزمن.',
                duration: '03:10',
                audioUrl: '/audio/future.mp3',
                image: 'https://placehold.co/600x400'
            }
        ]
    },
    {
        id: '2',
        title: 'Kingdom Tower & Boulevard',
        titleAr: 'برج المملكة والبوليفارد',
        description: 'Experience modern Riyadh\'s most iconic landmarks',
        descriptionAr: 'استمتع بأشهر معالم الرياض الحديثة',
        fullDescription: 'Discover the modern face of Riyadh. From the dizzying heights of the Kingdom Centre Sky Bridge to the vibrant energy of Riyadh Boulevard City.',
        fullDescriptionAr: 'اكتشف الوجه الحديث للرياض. من الارتفاعات المذهلة لجسر المشاهدة في برج المملكة إلى الطاقة النابضة بالحياة في بوليفارد رياض سيتي.',
        duration: '30 min',
        durationAr: '30 دقيقة',
        stops: 3,
        image: 'https://images.unsplash.com/photo-1570701123964-1e075c35b866',
        category: 'Modern',
        categoryAr: 'حديث',
        rating: 4.7,
        reviews: 189,
        isFeatured: true,
        pointsCost: 30,
        playlist: [
            {
                id: '2-1',
                title: 'The Kingdom Centre',
                titleAr: 'برج المملكة',
                description: 'An architectural icon',
                descriptionAr: 'أيقونة معمارية',
                script: 'Welcome to the Kingdom Centre, the crown jewel of modern Riyadh. Standing at 302 meters, this magnificent tower has defined the city\'s skyline since its completion in 2002. Designed by the legendary architects Ellerbe Becket and Omrania, its distinctive inverted parabolic arch at the top has become an unmistakable symbol of Saudi Arabia\'s economic rise. The tower houses luxury retail, corporate offices, and the prestigious Four Seasons Hotel. Our next stop takes us to the iconic Sky Bridge.',
                scriptAr: 'مرحباً بكم في برج المملكة، جوهرة الرياض الحديثة. يقف هذا البرج المهيب بارتفاع 302 متراً، ليحدد سماء المدينة منذ اكتماله عام 2002. صممه المهندسون الأسطوريون من إلير بكت وعمرانية، وقد أصبح القوس المقلوب المميز في قمته رمزاً لا يُخطئ للصعود الاقتصادي للمملكة العربية السعودية. يضم البرج متاجر فاخرة ومكاتب تجارية وفندق فورسيزونز المرموق. محطتنا التالية تأخذنا إلى الجسر المعلق الأيقوني.',
                duration: '04:00',
                audioUrl: '/audio/kingdom-tower.mp3',
                image: 'https://images.unsplash.com/photo-1570701123964-1e075c35b866'
            },
            {
                id: '2-2',
                title: 'Sky Bridge Views',
                titleAr: 'إطلالات الجسر المعلق',
                description: 'Riyadh from above',
                descriptionAr: 'الرياض من الأعلى',
                script: 'You have now reached the legendary Sky Bridge, 300 meters above the city. From this glass-enclosed observation deck, you can see all of Riyadh spread before you. To the east, the sprawling residential districts; to the west, the King Abdullah Financial District with its futuristic towers; and to the north, the endless desert horizon. On clear days, visibility extends over 50 kilometers. Take a moment to appreciate this breathtaking 360-degree view of a city that is rapidly transforming before the world\'s eyes.',
                scriptAr: 'لقد وصلتم الآن إلى الجسر المعلق الأسطوري، على ارتفاع 300 متر فوق المدينة. من منصة المراقبة الزجاجية هذه، يمكنكم رؤية الرياض بأكملها ممتدة أمامكم. إلى الشرق، الأحياء السكنية الممتدة؛ إلى الغرب، مركز الملك عبدالله المالي بأبراجه المستقبلية؛ وإلى الشمال، أفق الصحراء اللامتناهي. في الأيام الصافية، تمتد الرؤية لأكثر من 50 كيلومتراً. خذوا لحظة لتقدير هذا المنظر الخلاب بزاوية 360 درجة لمدينة تتحول بسرعة أمام أعين العالم.',
                duration: '03:30',
                audioUrl: '/audio/sky-bridge.mp3',
                image: 'https://placehold.co/600x400'
            },
            {
                id: '2-3',
                title: 'Boulevard World',
                titleAr: 'بوليفارد وورلد',
                description: 'Entertainment reimagined',
                descriptionAr: 'مفهوم جديد للترفيه',
                script: 'Welcome to Boulevard World, the heart of Riyadh Season and one of the largest entertainment destinations in the Middle East. Here, you can travel the world without leaving the city. From the romantic streets of Paris to the vibrant markets of India, from the futuristic landscapes of Japan to the festive atmosphere of Brazil, each zone offers an immersive cultural experience. With world-class restaurants, thrilling rides, and spectacular shows, Boulevard World represents the new spirit of Saudi entertainment. Thank you for joining us on this tour of modern Riyadh!',
                scriptAr: 'مرحباً بكم في بوليفارد وورلد، قلب موسم الرياض وإحدى أكبر وجهات الترفيه في الشرق الأوسط. هنا، يمكنكم السفر حول العالم دون مغادرة المدينة. من شوارع باريس الرومانسية إلى أسواق الهند النابضة بالحياة، ومن المناظر المستقبلية لليابان إلى الأجواء الاحتفالية للبرازيل، كل منطقة تقدم تجربة ثقافية غامرة. مع مطاعم عالمية المستوى وألعاب مثيرة وعروض مذهلة، يمثل بوليفارد وورلد الروح الجديدة للترفيه السعودي. شكراً لانضمامكم إلينا في جولة الرياض الحديثة!',
                duration: '05:00',
                audioUrl: '/audio/boulevard.mp3',
                image: 'https://placehold.co/600x400'
            }
        ]
    }
];
