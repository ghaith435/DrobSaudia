export interface Place {
    id: string;
    name: string;
    nameAr?: string;
    category: 'History' | 'Modern' | 'Shopping' | 'Dining' | 'Entertainment' | 'Nature';
    description: string;
    descriptionAr?: string;
    image: string;
    gallery?: string[];
    rating: number;
    reviewCount?: number;
    price: 'Free' | '$$' | '$$$' | '$$$$';
    location: { lat: number; lng: number; address: string };
    openingHours?: string;
    website?: string;
    phone?: string;
    features?: string[];
}

export const places: Place[] = [
    {
        id: '1',
        name: 'At-Turaif, Diriyah',
        nameAr: 'حي الطريف، الدرعية',
        category: 'History',
        description: 'The birthplace of the first Saudi state, a UNESCO World Heritage site featuring mud-brick palaces and winding alleyways. Explore the historic district where the Al Saud dynasty began.',
        image: '/images/places/diriyah_turaif.png',
        gallery: [
            '/images/places/diriyah_turaif.png',
        ],
        rating: 4.9,
        reviewCount: 2847,
        price: '$$',
        location: { lat: 24.7333, lng: 46.5750, address: 'Diriyah, Riyadh' },
        openingHours: 'Daily 8:00 AM - 11:00 PM',
        features: ['UNESCO Site', 'Guided Tours', 'Photography', 'Cultural Events']
    },
    {
        id: '2',
        name: 'Kingdom Centre Tower',
        nameAr: 'برج المملكة',
        category: 'Modern',
        description: 'An iconic 99-story skyscraper featuring the Sky Bridge observation deck, luxury shopping mall, and the prestigious Four Seasons Hotel. The distinctive opening at the top is one of Riyadh\'s most recognizable landmarks.',
        image: '/images/places/kingdom_tower.png',
        rating: 4.7,
        reviewCount: 5234,
        price: 'Free',
        location: { lat: 24.7114, lng: 46.6744, address: 'King Fahd Rd, Olaya District, Riyadh' },
        openingHours: 'Mall: 10:00 AM - 12:00 AM | Sky Bridge: 10:00 AM - 11:00 PM',
        website: 'https://kingdomcentre.com.sa',
        features: ['Sky Bridge', 'Luxury Shopping', 'Fine Dining', 'Four Seasons Hotel']
    },
    {
        id: '3',
        name: 'Boulevard World',
        nameAr: 'بوليفارد وورلد',
        category: 'Entertainment',
        description: 'A massive entertainment zone bringing cultures from around the world to Riyadh. Experience immersive themed zones from different countries, concerts, shows, and world-class attractions.',
        image: '/images/places/boulevard_world.png',
        rating: 4.8,
        reviewCount: 12453,
        price: '$$$',
        location: { lat: 24.7890, lng: 46.6110, address: 'Hittin District, Riyadh' },
        openingHours: 'Sun-Thu 4:00 PM - 2:00 AM | Fri-Sat 4:00 PM - 3:00 AM',
        website: 'https://riyadhseason.sa',
        features: ['Theme Zones', 'Live Shows', 'Restaurants', 'Rides']
    },
    {
        id: '4',
        name: 'Riyadh Park Mall',
        nameAr: 'رياض بارك مول',
        category: 'Shopping',
        description: 'One of Riyadh\'s most popular shopping destinations featuring a stunning glass-roofed arcade, premium cinema, diverse dining options, and over 350 retail stores.',
        image: '/images/places/riyadh_park_mall.png',
        rating: 4.6,
        reviewCount: 8765,
        price: '$$',
        location: { lat: 24.7550, lng: 46.6300, address: 'Northern Ring Branch Rd, Al Aqiq, Riyadh' },
        openingHours: 'Daily 10:00 AM - 12:00 AM',
        features: ['350+ Stores', 'IMAX Cinema', 'Food Court', 'Kids Zone']
    },
    {
        id: '5',
        name: 'Najd Village Restaurant',
        nameAr: 'مطعم قرية نجد',
        category: 'Dining',
        description: 'Experience authentic traditional Saudi Najdi cuisine served in a beautifully restored heritage setting. Famous for kabsa, jareesh, and traditional Arabic hospitality.',
        image: '/images/places/najd_village.png',
        rating: 4.5,
        reviewCount: 3421,
        price: '$$$',
        location: { lat: 24.6800, lng: 46.7000, address: 'King Abdulaziz Rd, Riyadh' },
        openingHours: 'Daily 12:30 PM - 12:00 AM',
        phone: '+966 11 478 5599',
        features: ['Traditional Cuisine', 'Heritage Decor', 'Private Rooms', 'Valet Parking']
    },
    {
        id: '6',
        name: 'Edge of the World',
        nameAr: 'حافة العالم',
        category: 'Nature',
        description: 'A breathtaking natural wonder on the edge of the Tuwaiq Escarpment, offering dramatic cliff views over an ancient seabed. Perfect for hiking, camping, and photography.',
        image: '/images/places/edge_of_world.png',
        rating: 4.9,
        reviewCount: 6543,
        price: 'Free',
        location: { lat: 24.8361, lng: 46.2158, address: 'Tuwaiq Escarpment, 90km from Riyadh' },
        openingHours: 'Open 24 hours (Best at sunrise/sunset)',
        features: ['Hiking', 'Camping', 'Photography', 'Stargazing']
    },
    {
        id: '7',
        name: 'The National Museum',
        nameAr: 'المتحف الوطني',
        category: 'History',
        description: 'Saudi Arabia\'s premier museum showcasing the Kingdom\'s rich history from prehistoric times to the modern era. Features 8 galleries and stunning architectural design.',
        image: '/images/places/national_museum.png',
        rating: 4.7,
        reviewCount: 4521,
        price: '$$',
        location: { lat: 24.6476, lng: 46.7102, address: 'King Abdulaziz Historical Center, Riyadh' },
        openingHours: 'Sat-Thu 8:00 AM - 8:00 PM',
        website: 'https://nationalmuseum.org.sa',
        features: ['8 Galleries', 'Audio Guide', 'Gift Shop', 'Guided Tours']
    },
    {
        id: '8',
        name: 'Panorama Mall',
        nameAr: 'بانوراما مول',
        category: 'Shopping',
        description: 'A premium shopping destination featuring luxury brands, gourmet restaurants, and entertainment options including a state-of-the-art cinema and indoor snow city.',
        image: '/images/places/panorama_mall.png',
        rating: 4.4,
        reviewCount: 5678,
        price: '$$$',
        location: { lat: 24.7685, lng: 46.6890, address: 'Tahlia Street, Al Olaya, Riyadh' },
        openingHours: 'Daily 10:00 AM - 11:00 PM',
        features: ['Luxury Brands', 'Snow City', 'VIP Lounge', 'Valet Parking']
    },
    {
        id: '9',
        name: 'Via Riyadh',
        nameAr: 'فيا الرياض',
        category: 'Entertainment',
        description: 'An upscale outdoor entertainment destination featuring restaurants, cafes, boutique shops, and beautiful walking areas. Perfect for evening strolls and fine dining.',
        image: '/images/places/via_riyadh.png',
        rating: 4.6,
        reviewCount: 3245,
        price: '$$$',
        location: { lat: 24.7234, lng: 46.6678, address: 'King Abdullah Rd, Al Olaya, Riyadh' },
        openingHours: 'Daily 4:00 PM - 2:00 AM',
        features: ['Fine Dining', 'Outdoor Seating', 'Live Music', 'Shopping']
    },
    {
        id: '10',
        name: 'Wadi Hanifa',
        nameAr: 'وادي حنيفة',
        category: 'Nature',
        description: 'A rehabilitated natural valley offering scenic walking and cycling paths, picnic areas, and beautiful landscapes. A green oasis in the heart of the city.',
        image: '/images/places/wadi_hanifa.png',
        rating: 4.5,
        reviewCount: 7890,
        price: 'Free',
        location: { lat: 24.5500, lng: 46.6200, address: 'Wadi Hanifa, Riyadh' },
        openingHours: 'Open 24 hours',
        features: ['Walking Trails', 'Cycling', 'Picnic Areas', 'Bird Watching']
    }
];

export const categories = [
    { id: 'history', name: 'History', nameAr: 'التاريخ', icon: '🏛️', count: 2 },
    { id: 'modern', name: 'Modern', nameAr: 'حديث', icon: '🏙️', count: 1 },
    { id: 'shopping', name: 'Shopping', nameAr: 'تسوق', icon: '🛍️', count: 2 },
    { id: 'dining', name: 'Dining', nameAr: 'مطاعم', icon: '🍽️', count: 1 },
    { id: 'entertainment', name: 'Entertainment', nameAr: 'ترفيه', icon: '🎭', count: 2 },
    { id: 'nature', name: 'Nature', nameAr: 'طبيعة', icon: '🌿', count: 2 },
];

