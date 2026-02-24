import { PrismaClient, PriceLevel } from '../src/generated/prisma';

const prisma = new PrismaClient();

const categories = [
    { name: 'History', nameAr: 'التاريخ', slug: 'history', icon: '🏛️', order: 1 },
    { name: 'Modern', nameAr: 'حديث', slug: 'modern', icon: '🏙️', order: 2 },
    { name: 'Shopping', nameAr: 'تسوق', slug: 'shopping', icon: '🛍️', order: 3 },
    { name: 'Dining', nameAr: 'مطاعم', slug: 'dining', icon: '🍽️', order: 4 },
    { name: 'Entertainment', nameAr: 'ترفيه', slug: 'entertainment', icon: '🎭', order: 5 },
    { name: 'Nature', nameAr: 'طبيعة', slug: 'nature', icon: '🌿', order: 6 },
];

const places = [
    {
        name: 'At-Turaif, Diriyah',
        nameAr: 'حي الطريف، الدرعية',
        slug: 'at-turaif-diriyah',
        categorySlug: 'history',
        description: 'The birthplace of the first Saudi state, a UNESCO World Heritage site featuring mud-brick palaces and winding alleyways. Explore the historic district where the Al Saud dynasty began.',
        descriptionAr: 'مهد الدولة السعودية الأولى، موقع تراث عالمي لليونسكو يضم قصورًا من الطوب اللبن وأزقة متعرجة.',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&h=600&fit=crop',
        rating: 4.9,
        reviewCount: 2847,
        price: PriceLevel.MODERATE,
        address: 'Diriyah, Riyadh',
        addressAr: 'الدرعية، الرياض',
        latitude: 24.7333,
        longitude: 46.5750,
        openingHours: 'Daily 8:00 AM - 11:00 PM',
        features: ['UNESCO Site', 'Guided Tours', 'Photography', 'Cultural Events'],
        isFeatured: true,
    },
    {
        name: 'Kingdom Centre Tower',
        nameAr: 'برج المملكة',
        slug: 'kingdom-centre-tower',
        categorySlug: 'modern',
        description: 'An iconic 99-story skyscraper featuring the Sky Bridge observation deck, luxury shopping mall, and the prestigious Four Seasons Hotel. The distinctive opening at the top is one of Riyadh\'s most recognizable landmarks.',
        descriptionAr: 'ناطحة سحاب أيقونية من 99 طابقًا تضم جسر السماء ومركز تسوق فاخر وفندق فور سيزونز.',
        image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop',
        rating: 4.7,
        reviewCount: 5234,
        price: PriceLevel.FREE,
        address: 'King Fahd Rd, Olaya District, Riyadh',
        addressAr: 'طريق الملك فهد، حي العليا، الرياض',
        latitude: 24.7114,
        longitude: 46.6744,
        openingHours: 'Mall: 10:00 AM - 12:00 AM | Sky Bridge: 10:00 AM - 11:00 PM',
        website: 'https://kingdomcentre.com.sa',
        features: ['Sky Bridge', 'Luxury Shopping', 'Fine Dining', 'Four Seasons Hotel'],
        isFeatured: true,
    },
    {
        name: 'Boulevard World',
        nameAr: 'بوليفارد وورلد',
        slug: 'boulevard-world',
        categorySlug: 'entertainment',
        description: 'A massive entertainment zone bringing cultures from around the world to Riyadh. Experience immersive themed zones from different countries, concerts, shows, and world-class attractions.',
        descriptionAr: 'منطقة ترفيهية ضخمة تجلب ثقافات من جميع أنحاء العالم إلى الرياض مع مناطق موضوعية غامرة.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
        rating: 4.8,
        reviewCount: 12453,
        price: PriceLevel.EXPENSIVE,
        address: 'Hittin District, Riyadh',
        addressAr: 'حي حطين، الرياض',
        latitude: 24.7890,
        longitude: 46.6110,
        openingHours: 'Sun-Thu 4:00 PM - 2:00 AM | Fri-Sat 4:00 PM - 3:00 AM',
        website: 'https://riyadhseason.sa',
        features: ['Theme Zones', 'Live Shows', 'Restaurants', 'Rides'],
        isFeatured: true,
    },
    {
        name: 'Riyadh Park Mall',
        nameAr: 'رياض بارك مول',
        slug: 'riyadh-park-mall',
        categorySlug: 'shopping',
        description: 'One of Riyadh\'s most popular shopping destinations featuring a stunning glass-roofed arcade, premium cinema, diverse dining options, and over 350 retail stores.',
        descriptionAr: 'أحد أشهر مراكز التسوق في الرياض مع ممر بسقف زجاجي مذهل وأكثر من 350 متجرًا.',
        image: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=800&h=600&fit=crop',
        rating: 4.6,
        reviewCount: 8765,
        price: PriceLevel.MODERATE,
        address: 'Northern Ring Branch Rd, Al Aqiq, Riyadh',
        addressAr: 'طريق الدائري الشمالي الفرعي، العقيق، الرياض',
        latitude: 24.7550,
        longitude: 46.6300,
        openingHours: 'Daily 10:00 AM - 12:00 AM',
        features: ['350+ Stores', 'IMAX Cinema', 'Food Court', 'Kids Zone'],
        isFeatured: false,
    },
    {
        name: 'Najd Village Restaurant',
        nameAr: 'مطعم قرية نجد',
        slug: 'najd-village-restaurant',
        categorySlug: 'dining',
        description: 'Experience authentic traditional Saudi Najdi cuisine served in a beautifully restored heritage setting. Famous for kabsa, jareesh, and traditional Arabic hospitality.',
        descriptionAr: 'تجربة المأكولات النجدية السعودية الأصيلة في بيئة تراثية مرممة بشكل جميل.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        rating: 4.5,
        reviewCount: 3421,
        price: PriceLevel.EXPENSIVE,
        address: 'King Abdulaziz Rd, Riyadh',
        addressAr: 'طريق الملك عبدالعزيز، الرياض',
        latitude: 24.6800,
        longitude: 46.7000,
        openingHours: 'Daily 12:30 PM - 12:00 AM',
        phone: '+966 11 478 5599',
        features: ['Traditional Cuisine', 'Heritage Decor', 'Private Rooms', 'Valet Parking'],
        isFeatured: false,
    },
    {
        name: 'Edge of the World',
        nameAr: 'حافة العالم',
        slug: 'edge-of-the-world',
        categorySlug: 'nature',
        description: 'A breathtaking natural wonder on the edge of the Tuwaiq Escarpment, offering dramatic cliff views over an ancient seabed. Perfect for hiking, camping, and photography.',
        descriptionAr: 'أعجوبة طبيعية خلابة على حافة جرف طويق توفر مناظر درامية للمنحدرات فوق قاع بحر قديم.',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        rating: 4.9,
        reviewCount: 6543,
        price: PriceLevel.FREE,
        address: 'Tuwaiq Escarpment, 90km from Riyadh',
        addressAr: 'جرف طويق، 90 كم من الرياض',
        latitude: 24.8361,
        longitude: 46.2158,
        openingHours: 'Open 24 hours (Best at sunrise/sunset)',
        features: ['Hiking', 'Camping', 'Photography', 'Stargazing'],
        isFeatured: true,
    },
    {
        name: 'The National Museum',
        nameAr: 'المتحف الوطني',
        slug: 'the-national-museum',
        categorySlug: 'history',
        description: 'Saudi Arabia\'s premier museum showcasing the Kingdom\'s rich history from prehistoric times to the modern era. Features 8 galleries and stunning architectural design.',
        descriptionAr: 'المتحف الرائد في المملكة العربية السعودية يعرض التاريخ الغني للمملكة من عصور ما قبل التاريخ إلى العصر الحديث.',
        image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&h=600&fit=crop',
        rating: 4.7,
        reviewCount: 4521,
        price: PriceLevel.MODERATE,
        address: 'King Abdulaziz Historical Center, Riyadh',
        addressAr: 'مركز الملك عبدالعزيز التاريخي، الرياض',
        latitude: 24.6476,
        longitude: 46.7102,
        openingHours: 'Sat-Thu 8:00 AM - 8:00 PM',
        website: 'https://nationalmuseum.org.sa',
        features: ['8 Galleries', 'Audio Guide', 'Gift Shop', 'Guided Tours'],
        isFeatured: false,
    },
    {
        name: 'Wadi Hanifa',
        nameAr: 'وادي حنيفة',
        slug: 'wadi-hanifa',
        categorySlug: 'nature',
        description: 'A rehabilitated natural valley offering scenic walking and cycling paths, picnic areas, and beautiful landscapes. A green oasis in the heart of the city.',
        descriptionAr: 'وادٍ طبيعي تم إعادة تأهيله يوفر مسارات مشي وركوب دراجات خلابة ومناطق للنزهات.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        rating: 4.5,
        reviewCount: 7890,
        price: PriceLevel.FREE,
        address: 'Wadi Hanifa, Riyadh',
        addressAr: 'وادي حنيفة، الرياض',
        latitude: 24.5500,
        longitude: 46.6200,
        openingHours: 'Open 24 hours',
        features: ['Walking Trails', 'Cycling', 'Picnic Areas', 'Bird Watching'],
        isFeatured: false,
    },
    {
        name: 'Panorama Mall',
        nameAr: 'بانوراما مول',
        slug: 'panorama-mall',
        categorySlug: 'shopping',
        description: 'A premium shopping destination featuring luxury brands, gourmet restaurants, and entertainment options including a state-of-the-art cinema and indoor snow city.',
        descriptionAr: 'وجهة تسوق فاخرة تضم علامات تجارية فاخرة ومطاعم ذواقة ومدينة ثلجية داخلية.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        rating: 4.4,
        reviewCount: 5678,
        price: PriceLevel.EXPENSIVE,
        address: 'Tahlia Street, Al Olaya, Riyadh',
        addressAr: 'شارع التحلية، العليا، الرياض',
        latitude: 24.7685,
        longitude: 46.6890,
        openingHours: 'Daily 10:00 AM - 11:00 PM',
        features: ['Luxury Brands', 'Snow City', 'VIP Lounge', 'Valet Parking'],
        isFeatured: false,
    },
    {
        name: 'Via Riyadh',
        nameAr: 'فيا الرياض',
        slug: 'via-riyadh',
        categorySlug: 'entertainment',
        description: 'An upscale outdoor entertainment destination featuring restaurants, cafes, boutique shops, and beautiful walking areas. Perfect for evening strolls and fine dining.',
        descriptionAr: 'وجهة ترفيهية راقية في الهواء الطلق تضم مطاعم ومقاهي ومتاجر بوتيك.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        rating: 4.6,
        reviewCount: 3245,
        price: PriceLevel.EXPENSIVE,
        address: 'King Abdullah Rd, Al Olaya, Riyadh',
        addressAr: 'طريق الملك عبدالله، العليا، الرياض',
        latitude: 24.7234,
        longitude: 46.6678,
        openingHours: 'Daily 4:00 PM - 2:00 AM',
        features: ['Fine Dining', 'Outdoor Seating', 'Live Music', 'Shopping'],
        isFeatured: false,
    },
];

async function main() {
    console.log('🌱 Seeding database...\n');

    // Create categories
    console.log('Creating categories...');
    const categoryMap: Record<string, string> = {};

    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
        categoryMap[cat.slug] = created.id;
        console.log(`  ✓ ${cat.name}`);
    }

    console.log('\nCreating places...');
    for (const place of places) {
        const { categorySlug, ...placeData } = place;
        const categoryId = categoryMap[categorySlug];

        await prisma.place.upsert({
            where: { slug: place.slug },
            update: {
                ...placeData,
                categoryId,
            },
            create: {
                ...placeData,
                categoryId,
            },
        });
        console.log(`  ✓ ${place.name}`);
    }

    // Create admin user
    console.log('\nCreating admin user...');
    const bcrypt = await import('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@riyadhguide.com' },
        update: {},
        create: {
            email: 'admin@riyadhguide.com',
            name: 'Admin',
            nameAr: 'مدير النظام',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log(`  ✓ Admin user created: admin@riyadhguide.com`);
    console.log(`  ✓ Password: admin123`);

    // Create demo user
    const userPassword = await bcrypt.hash('user123', 12);
    await prisma.user.upsert({
        where: { email: 'user@riyadhguide.com' },
        update: {},
        create: {
            email: 'user@riyadhguide.com',
            name: 'Demo User',
            nameAr: 'مستخدم تجريبي',
            password: userPassword,
            role: 'USER',
        },
    });
    console.log(`  ✓ Demo user created: user@riyadhguide.com`);
    console.log(`  ✓ Password: user123`);

    console.log('\n✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
