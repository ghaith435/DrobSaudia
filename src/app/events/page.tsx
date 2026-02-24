"use client";

import { useState, useMemo } from "react";
import { events, Event, getActiveEvents, getUpcomingEvents, eventCategoryIcons, formatEventDate } from "@/data/events";
import styles from "./events.module.css";

export default function EventsPage() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const currentDate = new Date();
    const activeEvents = getActiveEvents(currentDate);
    const upcomingEvents = getUpcomingEvents(currentDate);

    const categories = ['all', 'riyadh_season', 'cultural', 'sports', 'entertainment', 'food', 'music'];

    const filteredEvents = useMemo(() => {
        let filtered = events;

        // Filter by status
        if (activeFilter === 'active') {
            filtered = activeEvents;
        } else if (activeFilter === 'upcoming') {
            filtered = upcomingEvents;
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(e => e.category === selectedCategory);
        }

        return filtered;
    }, [activeFilter, selectedCategory, activeEvents, upcomingEvents]);

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            all: 'الكل',
            riyadh_season: 'موسم الرياض',
            cultural: 'ثقافي',
            sports: 'رياضي',
            entertainment: 'ترفيه',
            food: 'طعام',
            music: 'موسيقى',
        };
        return labels[category] || category;
    };

    const isActiveNow = (event: Event) => {
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return now >= start && now <= end;
    };

    return (
        <div className={styles.container}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>🎪 فعاليات الرياض</h1>
                    <p>اكتشف أحدث الفعاليات والمواسم في مدينة الرياض</p>

                    {/* Active Events Count */}
                    {activeEvents.length > 0 && (
                        <div className={styles.liveIndicator}>
                            <span className={styles.liveDot}></span>
                            {activeEvents.length} فعالية نشطة الآن
                        </div>
                    )}
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                {/* Status Filter */}
                <div className={styles.statusFilter}>
                    {[
                        { value: 'all', label: 'الكل' },
                        { value: 'active', label: '🟢 نشطة الآن' },
                        { value: 'upcoming', label: '📅 قادمة' },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            className={activeFilter === opt.value ? styles.active : ''}
                            onClick={() => setActiveFilter(opt.value as typeof activeFilter)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Category Filter */}
                <div className={styles.categoryFilter}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={selectedCategory === cat ? styles.active : ''}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat !== 'all' && eventCategoryIcons[cat as keyof typeof eventCategoryIcons]}
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>
            </section>

            {/* Events Grid */}
            <section className={styles.eventsGrid}>
                {filteredEvents.map(event => (
                    <div key={event.id} className={styles.eventCard}>
                        <div className={styles.cardImage}>
                            <img src={event.image} alt={event.nameAr} />

                            {isActiveNow(event) && (
                                <div className={styles.liveBadge}>
                                    <span className={styles.liveDot}></span>
                                    نشط الآن
                                </div>
                            )}

                            <div className={styles.categoryBadge}>
                                {eventCategoryIcons[event.category]}
                                {getCategoryLabel(event.category)}
                            </div>

                            <div className={styles.priceBadge}>
                                {event.price === 'free' ? 'مجاني' : event.priceRange || 'مدفوع'}
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <h3>{event.nameAr}</h3>
                            <p className={styles.description}>{event.descriptionAr}</p>

                            <div className={styles.eventMeta}>
                                <div className={styles.metaItem}>
                                    <span>📅</span>
                                    <span>{formatEventDate(event.startDate, event.endDate, 'ar')}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span>📍</span>
                                    <span>{event.location.nameAr}</span>
                                </div>
                            </div>

                            <div className={styles.tags}>
                                {event.tagsAr.slice(0, 3).map((tag, idx) => (
                                    <span key={idx}>{tag}</span>
                                ))}
                            </div>

                            <div className={styles.cardActions}>
                                {event.website && (
                                    <a
                                        href={event.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.websiteBtn}
                                    >
                                        🌐 الموقع الرسمي
                                    </a>
                                )}
                                <button className={styles.directionsBtn}>
                                    🧭 التوجه
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className={styles.empty}>
                    <span>🎭</span>
                    <h3>لا توجد فعاليات</h3>
                    <p>جرب تغيير معايير البحث</p>
                </div>
            )}

            {/* Subscribe Banner */}
            <section className={styles.subscribeBanner}>
                <div className={styles.bannerContent}>
                    <h3>🔔 لا تفوت أي فعالية!</h3>
                    <p>اشترك ليصلك إشعار بالفعاليات الجديدة</p>
                    <div className={styles.subscribeForm}>
                        <input type="email" placeholder="بريدك الإلكتروني" />
                        <button>اشترك</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
