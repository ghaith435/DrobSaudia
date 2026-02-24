'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './audio-tours.module.css';

const AUDIO_TOURS = [
    {
        id: '1',
        title: 'Historical Diriyah Tour',
        titleAr: 'جولة الدرعية التاريخية',
        description: 'Explore the birthplace of Saudi Arabia with our AI-powered audio guide',
        descriptionAr: 'اكتشف مهد المملكة العربية السعودية مع دليلنا الصوتي الذكي',
        duration: '45 min',
        durationAr: '45 دقيقة',
        stops: 8,
        image: '/images/tours/diriyah.jpg',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.9,
        reviews: 234,
        isFeatured: true,
    },
    {
        id: '2',
        title: 'Kingdom Tower & Boulevard',
        titleAr: 'برج المملكة والبوليفارد',
        description: 'Experience modern Riyadh\'s most iconic landmarks',
        descriptionAr: 'استمتع بأشهر معالم الرياض الحديثة',
        duration: '30 min',
        durationAr: '30 دقيقة',
        stops: 5,
        image: '/images/tours/kingdom-tower.jpg',
        category: 'Modern',
        categoryAr: 'حديث',
        rating: 4.7,
        reviews: 189,
        isFeatured: true,
    },
    {
        id: '3',
        title: 'Al-Masmak Fortress',
        titleAr: 'قصر المصمك',
        description: 'Discover the fortress that witnessed the unification of Saudi Arabia',
        descriptionAr: 'اكتشف القلعة التي شهدت توحيد المملكة',
        duration: '25 min',
        durationAr: '25 دقيقة',
        stops: 6,
        image: '/images/tours/masmak.jpg',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.8,
        reviews: 156,
        isFeatured: false,
    },
    {
        id: '4',
        title: 'National Museum Tour',
        titleAr: 'جولة المتحف الوطني',
        description: 'Journey through Saudi Arabia\'s rich heritage and culture',
        descriptionAr: 'رحلة عبر التراث والثقافة السعودية الغنية',
        duration: '60 min',
        durationAr: '60 دقيقة',
        stops: 12,
        image: '/images/tours/national-museum.jpg',
        category: 'Cultural',
        categoryAr: 'ثقافي',
        rating: 4.9,
        reviews: 312,
        isFeatured: true,
    },
    {
        id: '5',
        title: 'Old Riyadh Souks',
        titleAr: 'أسواق الرياض القديمة',
        description: 'Wander through traditional markets and hidden gems',
        descriptionAr: 'تجول في الأسواق التقليدية واكتشف الجواهر المخفية',
        duration: '40 min',
        durationAr: '40 دقيقة',
        stops: 7,
        image: '/images/tours/souks.jpg',
        category: 'Cultural',
        categoryAr: 'ثقافي',
        rating: 4.6,
        reviews: 98,
        isFeatured: false,
    },
    {
        id: '6',
        title: 'Edge of the World',
        titleAr: 'حافة العالم',
        description: 'Experience the breathtaking cliffs with our nature guide',
        descriptionAr: 'استمتع بالمنحدرات الخلابة مع دليلنا الطبيعي',
        duration: '35 min',
        durationAr: '35 دقيقة',
        stops: 4,
        image: '/images/tours/edge-of-world.jpg',
        category: 'Nature',
        categoryAr: 'طبيعة',
        rating: 4.8,
        reviews: 145,
        isFeatured: true,
    },
];

const CATEGORIES = [
    { id: 'all', name: 'All', nameAr: 'الكل' },
    { id: 'historical', name: 'Historical', nameAr: 'تاريخي' },
    { id: 'cultural', name: 'Cultural', nameAr: 'ثقافي' },
    { id: 'modern', name: 'Modern', nameAr: 'حديث' },
    { id: 'nature', name: 'Nature', nameAr: 'طبيعة' },
];

export default function AudioToursPage() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const isRTL = locale === 'ar';

    const t = {
        ar: {
            title: 'الجولات الصوتية',
            subtitle: 'اكتشف السعودية مع مرشدك الصوتي الذكي',
            search: 'ابحث عن جولة...',
            featured: 'مميز',
            duration: 'المدة',
            stops: 'محطات',
            reviews: 'تقييم',
            startTour: 'ابدأ الجولة',
            listenNow: 'استمع الآن',
            downloadOffline: 'تحميل للاستخدام بدون انترنت',
            noResults: 'لا توجد نتائج',
            aiPowered: 'مدعوم بالذكاء الاصطناعي',
            multiLanguage: 'متعدد اللغات',
            offline: 'يعمل بدون انترنت',
        },
        en: {
            title: 'Audio Tours',
            subtitle: 'Discover Saudi Arabia with your AI-powered audio guide',
            search: 'Search for a tour...',
            featured: 'Featured',
            duration: 'Duration',
            stops: 'stops',
            reviews: 'reviews',
            startTour: 'Start Tour',
            listenNow: 'Listen Now',
            downloadOffline: 'Download for Offline Use',
            noResults: 'No results found',
            aiPowered: 'AI-Powered',
            multiLanguage: 'Multi-Language',
            offline: 'Works Offline',
        },
    };

    const labels = t[locale];

    const filteredTours = AUDIO_TOURS.filter(tour => {
        const matchesCategory = selectedCategory === 'all' ||
            tour.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.titleAr.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroIcon}>🎧</span>
                    <h1 className={styles.heroTitle}>{labels.title}</h1>
                    <p className={styles.heroSubtitle}>{labels.subtitle}</p>

                    {/* Features */}
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span>🤖</span>
                            <span>{labels.aiPowered}</span>
                        </div>
                        <div className={styles.feature}>
                            <span>🌍</span>
                            <span>{labels.multiLanguage}</span>
                        </div>
                        <div className={styles.feature}>
                            <span>📴</span>
                            <span>{labels.offline}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter */}
            <section className={styles.filterSection}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder={labels.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.categories}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {isRTL ? cat.nameAr : cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Tours */}
            {selectedCategory === 'all' && searchQuery === '' && (
                <section className={styles.featuredSection}>
                    <h2 className={styles.sectionTitle}>⭐ {labels.featured}</h2>
                    <div className={styles.featuredGrid}>
                        {AUDIO_TOURS.filter(t => t.isFeatured).slice(0, 3).map(tour => (
                            <Link href={`/audio-tours/${tour.id}`} key={tour.id} className={styles.featuredCard}>
                                <div className={styles.featuredImage}>
                                    <div className={styles.imagePlaceholder}>🎧</div>
                                    <span className={styles.featuredBadge}>{labels.featured}</span>
                                </div>
                                <div className={styles.featuredContent}>
                                    <h3>{isRTL ? tour.titleAr : tour.title}</h3>
                                    <p>{isRTL ? tour.descriptionAr : tour.description}</p>
                                    <div className={styles.tourMeta}>
                                        <span>⏱️ {isRTL ? tour.durationAr : tour.duration}</span>
                                        <span>📍 {tour.stops} {labels.stops}</span>
                                        <span>⭐ {tour.rating}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* All Tours Grid */}
            <section className={styles.toursSection}>
                <div className={styles.toursGrid}>
                    {filteredTours.length > 0 ? filteredTours.map(tour => (
                        <div key={tour.id} className={styles.tourCard}>
                            <div className={styles.tourImage}>
                                <div className={styles.imagePlaceholder}>🎧</div>
                                <span className={styles.categoryBadge}>
                                    {isRTL ? tour.categoryAr : tour.category}
                                </span>
                            </div>
                            <div className={styles.tourContent}>
                                <h3>{isRTL ? tour.titleAr : tour.title}</h3>
                                <p>{isRTL ? tour.descriptionAr : tour.description}</p>

                                <div className={styles.tourStats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statIcon}>⏱️</span>
                                        <span>{isRTL ? tour.durationAr : tour.duration}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statIcon}>📍</span>
                                        <span>{tour.stops} {labels.stops}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statIcon}>⭐</span>
                                        <span>{tour.rating} ({tour.reviews})</span>
                                    </div>
                                </div>

                                <div className={styles.tourActions}>
                                    <Link href={`/audio-tours/${tour.id}`} className={styles.primaryBtn}>
                                        🎧 {labels.listenNow}
                                    </Link>
                                    <button className={styles.secondaryBtn}>
                                        ⬇️
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className={styles.noResults}>
                            <span>🔍</span>
                            <p>{labels.noResults}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
