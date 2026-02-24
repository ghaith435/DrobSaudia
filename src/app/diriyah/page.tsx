"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { diriyahAttractions, DIRIYAH_CENTER, DiriyahAttraction } from "@/data/diriyah";
import styles from "./diriyah.module.css";

export default function DiriyahPage() {
    const { data: session } = useSession();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAttraction, setSelectedAttraction] = useState<DiriyahAttraction | null>(null);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const t = {
        ar: {
            title: "اكتشف الدرعية",
            subtitle: "مهد الحضارة السعودية وموقع التراث العالمي لليونسكو",
            heroDesc: "استكشف المعالم التاريخية والثقافية في الدرعية، العاصمة الأولى للدولة السعودية",
            exploreMap: "استكشف الخريطة",
            planVisit: "خطط زيارتك",
            categories: {
                all: "الكل",
                heritage: "التراث",
                museum: "المتاحف",
                shopping: "التسوق",
                dining: "المطاعم",
                entertainment: "الترفيه",
            },
            attractionsTitle: "المعالم السياحية",
            viewDetails: "عرض التفاصيل",
            openHours: "ساعات العمل",
            entryFee: "رسوم الدخول",
            free: "مجاني",
            features: "المميزات",
            close: "إغلاق",
            getDirections: "احصل على الاتجاهات",
            listenGuide: "استمع للدليل",
            quickFacts: {
                title: "حقائق سريعة",
                founded: "تأسست: 1446م",
                unesco: "موقع تراث عالمي: 2010",
                firstState: "عاصمة الدولة السعودية الأولى",
                area: "المساحة: 7 كم²",
            },
        },
        en: {
            title: "Discover Diriyah",
            subtitle: "Birthplace of Saudi Civilization and UNESCO World Heritage Site",
            heroDesc: "Explore the historical and cultural landmarks in Diriyah, the first capital of the Saudi State",
            exploreMap: "Explore Map",
            planVisit: "Plan Your Visit",
            categories: {
                all: "All",
                heritage: "Heritage",
                museum: "Museums",
                shopping: "Shopping",
                dining: "Dining",
                entertainment: "Entertainment",
            },
            attractionsTitle: "Tourist Attractions",
            viewDetails: "View Details",
            openHours: "Opening Hours",
            entryFee: "Entry Fee",
            free: "Free",
            features: "Features",
            close: "Close",
            getDirections: "Get Directions",
            listenGuide: "Listen to Guide",
            quickFacts: {
                title: "Quick Facts",
                founded: "Founded: 1446 AD",
                unesco: "UNESCO Heritage: 2010",
                firstState: "First Saudi State Capital",
                area: "Area: 7 km²",
            },
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    const categoryIcons: Record<string, string> = {
        all: "🌟",
        heritage: "🏛️",
        museum: "🏺",
        shopping: "🛍️",
        dining: "🍽️",
        entertainment: "🎭",
    };

    const filteredAttractions = selectedCategory === 'all'
        ? diriyahAttractions
        : diriyahAttractions.filter(a => a.category === selectedCategory);

    const openGoogleMaps = (coords: { lat: number; lng: number }) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className={styles.page} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <Image
                        src="https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1920"
                        alt="Diriyah"
                        fill
                        className={styles.heroImage}
                        priority
                        unoptimized
                    />
                    <div className={styles.heroOverlay} />
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>🏛️ UNESCO World Heritage</span>
                    <h1 className={styles.heroTitle}>{labels.title}</h1>
                    <p className={styles.heroSubtitle}>{labels.subtitle}</p>
                    <p className={styles.heroDesc}>{labels.heroDesc}</p>

                    <div className={styles.heroButtons}>
                        <Link href="/diriyah/map" className={styles.primaryBtn}>
                            🗺️ {labels.exploreMap}
                        </Link>
                        {session ? (
                            <Link href="/planner?destination=diriyah" className={styles.secondaryBtn}>
                                📅 {labels.planVisit}
                            </Link>
                        ) : (
                            <Link href="/auth/register" className={styles.secondaryBtn}>
                                📅 {labels.planVisit}
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Facts */}
            <section className={styles.factsSection}>
                <div className={styles.container}>
                    <h2 className={styles.factsTitle}>{labels.quickFacts.title}</h2>
                    <div className={styles.factsGrid}>
                        <div className={styles.factCard}>
                            <span className={styles.factIcon}>📅</span>
                            <span className={styles.factText}>{labels.quickFacts.founded}</span>
                        </div>
                        <div className={styles.factCard}>
                            <span className={styles.factIcon}>🌍</span>
                            <span className={styles.factText}>{labels.quickFacts.unesco}</span>
                        </div>
                        <div className={styles.factCard}>
                            <span className={styles.factIcon}>👑</span>
                            <span className={styles.factText}>{labels.quickFacts.firstState}</span>
                        </div>
                        <div className={styles.factCard}>
                            <span className={styles.factIcon}>📐</span>
                            <span className={styles.factText}>{labels.quickFacts.area}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Attractions Section */}
            <section className={styles.attractionsSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{labels.attractionsTitle}</h2>

                    {/* Category Filter */}
                    <div className={styles.categoryFilter}>
                        {Object.entries(labels.categories).map(([key, value]) => (
                            <button
                                key={key}
                                className={`${styles.categoryBtn} ${selectedCategory === key ? styles.active : ''}`}
                                onClick={() => setSelectedCategory(key)}
                            >
                                {categoryIcons[key]} {value}
                            </button>
                        ))}
                    </div>

                    {/* Attractions Grid */}
                    <div className={styles.attractionsGrid}>
                        {filteredAttractions.map((attraction) => (
                            <div key={attraction.id} className={styles.attractionCard}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src={attraction.images[0]}
                                        alt={isRTL ? attraction.nameAr : attraction.name}
                                        fill
                                        className={styles.image}
                                        unoptimized
                                    />
                                    <div className={styles.cardBadge}>
                                        ⭐ {attraction.rating}
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>
                                        {isRTL ? attraction.nameAr : attraction.name}
                                    </h3>
                                    <p className={styles.cardDesc}>
                                        {isRTL
                                            ? attraction.descriptionAr.slice(0, 100) + '...'
                                            : attraction.description.slice(0, 100) + '...'}
                                    </p>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.cardReviews}>
                                            📝 {attraction.reviewCount} {isRTL ? 'تقييم' : 'reviews'}
                                        </span>
                                        <span className={styles.cardFee}>
                                            {attraction.entryFee.adult === 0
                                                ? `🆓 ${labels.free}`
                                                : `💰 ${attraction.entryFee.adult} ${attraction.entryFee.currency}`}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.detailsBtn}
                                        onClick={() => setSelectedAttraction(attraction)}
                                    >
                                        {labels.viewDetails} →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Attraction Modal */}
            {selectedAttraction && (
                <div className={styles.modal} onClick={() => setSelectedAttraction(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.modalClose}
                            onClick={() => setSelectedAttraction(null)}
                        >
                            ✕
                        </button>

                        <div className={styles.modalImage}>
                            <Image
                                src={selectedAttraction.images[0]}
                                alt={isRTL ? selectedAttraction.nameAr : selectedAttraction.name}
                                fill
                                className={styles.image}
                                unoptimized
                            />
                        </div>

                        <div className={styles.modalBody}>
                            <h2 className={styles.modalTitle}>
                                {isRTL ? selectedAttraction.nameAr : selectedAttraction.name}
                            </h2>

                            <div className={styles.modalRating}>
                                ⭐ {selectedAttraction.rating} ({selectedAttraction.reviewCount})
                            </div>

                            <p className={styles.modalDesc}>
                                {isRTL ? selectedAttraction.descriptionAr : selectedAttraction.description}
                            </p>

                            <div className={styles.modalHistory}>
                                <h4>{isRTL ? 'التاريخ' : 'History'}</h4>
                                <p>{isRTL ? selectedAttraction.historyAr : selectedAttraction.history}</p>
                            </div>

                            <div className={styles.modalInfo}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>🕐 {labels.openHours}</span>
                                    <span>{isRTL ? selectedAttraction.openingHours.daysAr : selectedAttraction.openingHours.days}</span>
                                    <span>{selectedAttraction.openingHours.hours}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>💰 {labels.entryFee}</span>
                                    <span>
                                        {selectedAttraction.entryFee.adult === 0
                                            ? labels.free
                                            : `${selectedAttraction.entryFee.adult} ${selectedAttraction.entryFee.currency}`}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.modalFeatures}>
                                <h4>{labels.features}</h4>
                                <div className={styles.featuresList}>
                                    {(isRTL ? selectedAttraction.featuresAr : selectedAttraction.features).map((feature, i) => (
                                        <span key={i} className={styles.featureTag}>✓ {feature}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Accessibility */}
                            <div className={styles.accessibilityInfo}>
                                {selectedAttraction.accessibility.wheelchairAccessible && (
                                    <span className={styles.accessBadge}>♿ {isRTL ? 'متاح للكراسي المتحركة' : 'Wheelchair Accessible'}</span>
                                )}
                                {selectedAttraction.accessibility.audioGuide && (
                                    <span className={styles.accessBadge}>🎧 {isRTL ? 'دليل صوتي' : 'Audio Guide'}</span>
                                )}
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => openGoogleMaps(selectedAttraction.coordinates)}
                                >
                                    🗺️ {labels.getDirections}
                                </button>
                                <button className={styles.actionBtnSecondary}>
                                    🎧 {labels.listenGuide}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
