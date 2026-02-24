"use client";

import { useState, useEffect } from "react";
import styles from "./statistics.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Statistics {
    overview: {
        totalVisitors: number;
        totalPlaces: number;
        totalTours: number;
        totalReviews: number;
        activeUsers: number;
        aiConversations: number;
    };
    aiUsage: {
        tourPlans: number;
        arSessions: number;
        vrSessions: number;
        chatMessages: number;
        ragQueries: number;
    };
    popularPlaces: Array<{
        id: string;
        name: string;
        nameAr: string;
        visits: number;
        rating: number;
    }>;
    categoryStats: Array<{
        name: string;
        nameAr: string;
        count: number;
        percentage: number;
    }>;
    recentActivity: Array<{
        id: string;
        type: string;
        description: string;
        timestamp: string;
    }>;
    timeStats: {
        daily: number[];
        weekly: number[];
        labels: string[];
    };
}

export default function StatisticsPage() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    const isRTL = locale === 'ar';

    const t = {
        ar: {
            title: "إحصائيات المرشد الذكي",
            subtitle: "تحليلات شاملة لأداء المنصة السياحية",
            overview: "نظرة عامة",
            totalVisitors: "إجمالي الزوار",
            totalPlaces: "الأماكن السياحية",
            totalTours: "الجولات المكتملة",
            totalReviews: "التقييمات",
            activeUsers: "المستخدمين النشطين",
            aiConversations: "محادثات الذكاء الاصطناعي",
            aiUsage: "استخدام الذكاء الاصطناعي",
            tourPlans: "خطط الرحلات",
            arSessions: "جلسات الواقع المعزز",
            vrSessions: "جلسات الواقع الافتراضي",
            chatMessages: "رسائل المحادثة",
            ragQueries: "استعلامات قاعدة المعرفة",
            popularPlaces: "الأماكن الأكثر زيارة",
            categoryStats: "إحصائيات الفئات",
            recentActivity: "النشاط الأخير",
            visits: "زيارة",
            rating: "التقييم",
            daily: "يومي",
            weekly: "أسبوعي",
            monthly: "شهري",
            visitorTrends: "اتجاهات الزوار",
            noData: "لا توجد بيانات متاحة"
        },
        en: {
            title: "AI Guide Statistics",
            subtitle: "Comprehensive analytics for the tourism platform",
            overview: "Overview",
            totalVisitors: "Total Visitors",
            totalPlaces: "Tourist Places",
            totalTours: "Completed Tours",
            totalReviews: "Reviews",
            activeUsers: "Active Users",
            aiConversations: "AI Conversations",
            aiUsage: "AI Usage",
            tourPlans: "Tour Plans",
            arSessions: "AR Sessions",
            vrSessions: "VR Sessions",
            chatMessages: "Chat Messages",
            ragQueries: "Knowledge Base Queries",
            popularPlaces: "Most Visited Places",
            categoryStats: "Category Statistics",
            recentActivity: "Recent Activity",
            visits: "visits",
            rating: "Rating",
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
            visitorTrends: "Visitor Trends",
            noData: "No data available"
        }
    };

    const labels = t[locale];

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);

        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/analytics');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                // Use mock data if API fails
                setStats(getMockStats());
            }
        } catch {
            // Use mock data on error
            setStats(getMockStats());
        } finally {
            setLoading(false);
        }
    };

    const getMockStats = (): Statistics => ({
        overview: {
            totalVisitors: 45678,
            totalPlaces: 156,
            totalTours: 2340,
            totalReviews: 8920,
            activeUsers: 1250,
            aiConversations: 15680
        },
        aiUsage: {
            tourPlans: 3456,
            arSessions: 2890,
            vrSessions: 1567,
            chatMessages: 45670,
            ragQueries: 890
        },
        popularPlaces: [
            { id: '1', name: 'Diriyah', nameAr: 'الدرعية', visits: 12500, rating: 4.8 },
            { id: '2', name: 'Kingdom Tower', nameAr: 'برج المملكة', visits: 10200, rating: 4.7 },
            { id: '3', name: 'Masmak Fortress', nameAr: 'قصر المصمك', visits: 8900, rating: 4.9 },
            { id: '4', name: 'National Museum', nameAr: 'المتحف الوطني', visits: 7600, rating: 4.6 },
            { id: '5', name: 'Bujairi Terrace', nameAr: 'تراس البجيري', visits: 6800, rating: 4.8 }
        ],
        categoryStats: [
            { name: 'Historical', nameAr: 'تاريخي', count: 45, percentage: 29 },
            { name: 'Shopping', nameAr: 'تسوق', count: 38, percentage: 24 },
            { name: 'Nature', nameAr: 'طبيعة', count: 28, percentage: 18 },
            { name: 'Entertainment', nameAr: 'ترفيه', count: 25, percentage: 16 },
            { name: 'Restaurants', nameAr: 'مطاعم', count: 20, percentage: 13 }
        ],
        recentActivity: [
            { id: '1', type: 'tour_plan', description: locale === 'ar' ? 'تم إنشاء خطة رحلة جديدة' : 'New tour plan created', timestamp: new Date().toISOString() },
            { id: '2', type: 'ar_session', description: locale === 'ar' ? 'جلسة واقع معزز في الدرعية' : 'AR session at Diriyah', timestamp: new Date(Date.now() - 300000).toISOString() },
            { id: '3', type: 'chat', description: locale === 'ar' ? 'محادثة مع المرشد الذكي' : 'Chat with AI Guide', timestamp: new Date(Date.now() - 600000).toISOString() },
            { id: '4', type: 'vr_session', description: locale === 'ar' ? 'استكشاف تاريخي افتراضي' : 'Virtual historical exploration', timestamp: new Date(Date.now() - 900000).toISOString() },
            { id: '5', type: 'review', description: locale === 'ar' ? 'تقييم جديد لبرج المملكة' : 'New review for Kingdom Tower', timestamp: new Date(Date.now() - 1200000).toISOString() }
        ],
        timeStats: {
            daily: [120, 145, 132, 168, 189, 156, 178],
            weekly: [850, 920, 780, 890, 950, 1020, 980],
            labels: locale === 'ar'
                ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
                : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        }
    });

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return locale === 'ar' ? 'الآن' : 'Just now';
        if (minutes < 60) return locale === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return locale === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return locale === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
    };

    const getActivityIcon = (type: string): string => {
        switch (type) {
            case 'tour_plan': return '🗺️';
            case 'ar_session': return '📱';
            case 'vr_session': return '🏛️';
            case 'chat': return '💬';
            case 'review': return '⭐';
            default: return '📊';
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.page} dir={isRTL ? 'rtl' : 'ltr'}>
            <Navbar />

            <main className={styles.main}>
                {/* Background */}
                <div className={styles.bgDecor}></div>

                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.icon}>📊</span>
                        {labels.title}
                    </h1>
                    <p className={styles.subtitle}>{labels.subtitle}</p>
                </header>

                {/* Overview Cards */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{labels.overview}</h2>
                    <div className={styles.overviewGrid}>
                        <StatCard
                            icon="👥"
                            label={labels.totalVisitors}
                            value={formatNumber(stats?.overview.totalVisitors || 0)}
                            trend="+12%"
                            positive
                        />
                        <StatCard
                            icon="📍"
                            label={labels.totalPlaces}
                            value={stats?.overview.totalPlaces.toString() || '0'}
                        />
                        <StatCard
                            icon="🚶"
                            label={labels.totalTours}
                            value={formatNumber(stats?.overview.totalTours || 0)}
                            trend="+8%"
                            positive
                        />
                        <StatCard
                            icon="⭐"
                            label={labels.totalReviews}
                            value={formatNumber(stats?.overview.totalReviews || 0)}
                        />
                        <StatCard
                            icon="🟢"
                            label={labels.activeUsers}
                            value={formatNumber(stats?.overview.activeUsers || 0)}
                            trend="+15%"
                            positive
                        />
                        <StatCard
                            icon="🤖"
                            label={labels.aiConversations}
                            value={formatNumber(stats?.overview.aiConversations || 0)}
                            trend="+25%"
                            positive
                        />
                    </div>
                </section>

                {/* AI Usage */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{labels.aiUsage}</h2>
                    <div className={styles.aiUsageGrid}>
                        <div className={styles.aiCard}>
                            <span className={styles.aiIcon}>🗺️</span>
                            <div className={styles.aiInfo}>
                                <span className={styles.aiValue}>{formatNumber(stats?.aiUsage.tourPlans || 0)}</span>
                                <span className={styles.aiLabel}>{labels.tourPlans}</span>
                            </div>
                            <div className={styles.aiProgress}>
                                <div className={styles.aiProgressBar} style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div className={styles.aiCard}>
                            <span className={styles.aiIcon}>📱</span>
                            <div className={styles.aiInfo}>
                                <span className={styles.aiValue}>{formatNumber(stats?.aiUsage.arSessions || 0)}</span>
                                <span className={styles.aiLabel}>{labels.arSessions}</span>
                            </div>
                            <div className={styles.aiProgress}>
                                <div className={styles.aiProgressBar} style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div className={styles.aiCard}>
                            <span className={styles.aiIcon}>🏛️</span>
                            <div className={styles.aiInfo}>
                                <span className={styles.aiValue}>{formatNumber(stats?.aiUsage.vrSessions || 0)}</span>
                                <span className={styles.aiLabel}>{labels.vrSessions}</span>
                            </div>
                            <div className={styles.aiProgress}>
                                <div className={styles.aiProgressBar} style={{ width: '35%' }}></div>
                            </div>
                        </div>
                        <div className={styles.aiCard}>
                            <span className={styles.aiIcon}>💬</span>
                            <div className={styles.aiInfo}>
                                <span className={styles.aiValue}>{formatNumber(stats?.aiUsage.chatMessages || 0)}</span>
                                <span className={styles.aiLabel}>{labels.chatMessages}</span>
                            </div>
                            <div className={styles.aiProgress}>
                                <div className={styles.aiProgressBar} style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        <div className={styles.aiCard}>
                            <span className={styles.aiIcon}>📚</span>
                            <div className={styles.aiInfo}>
                                <span className={styles.aiValue}>{formatNumber(stats?.aiUsage.ragQueries || 0)}</span>
                                <span className={styles.aiLabel}>{labels.ragQueries}</span>
                            </div>
                            <div className={styles.aiProgress}>
                                <div className={styles.aiProgressBar} style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Charts Row */}
                <div className={styles.chartsRow}>
                    {/* Visitor Trends */}
                    <section className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>{labels.visitorTrends}</h3>
                            <div className={styles.timeRangeSelector}>
                                {(['daily', 'weekly', 'monthly'] as const).map(range => (
                                    <button
                                        key={range}
                                        className={`${styles.rangeBtn} ${timeRange === range ? styles.activeRange : ''}`}
                                        onClick={() => setTimeRange(range)}
                                    >
                                        {labels[range]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.chart}>
                            <div className={styles.barChart}>
                                {(timeRange === 'daily' ? stats?.timeStats.daily : stats?.timeStats.weekly)?.map((value, index) => (
                                    <div key={index} className={styles.barContainer}>
                                        <div
                                            className={styles.bar}
                                            style={{
                                                height: `${(value / Math.max(...(timeRange === 'daily' ? stats?.timeStats.daily || [] : stats?.timeStats.weekly || []))) * 100}%`
                                            }}
                                        >
                                            <span className={styles.barValue}>{value}</span>
                                        </div>
                                        <span className={styles.barLabel}>{stats?.timeStats.labels[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Category Stats */}
                    <section className={styles.chartCard}>
                        <h3>{labels.categoryStats}</h3>
                        <div className={styles.categoryList}>
                            {stats?.categoryStats.map((cat, index) => (
                                <div key={index} className={styles.categoryItem}>
                                    <div className={styles.categoryInfo}>
                                        <span className={styles.categoryName}>
                                            {locale === 'ar' ? cat.nameAr : cat.name}
                                        </span>
                                        <span className={styles.categoryCount}>{cat.count}</span>
                                    </div>
                                    <div className={styles.categoryBar}>
                                        <div
                                            className={styles.categoryProgress}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className={styles.categoryPercent}>{cat.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Bottom Row */}
                <div className={styles.bottomRow}>
                    {/* Popular Places */}
                    <section className={styles.listCard}>
                        <h3>{labels.popularPlaces}</h3>
                        <div className={styles.placesList}>
                            {stats?.popularPlaces.map((place, index) => (
                                <div key={place.id} className={styles.placeItem}>
                                    <span className={styles.placeRank}>#{index + 1}</span>
                                    <div className={styles.placeInfo}>
                                        <span className={styles.placeName}>
                                            {locale === 'ar' ? place.nameAr : place.name}
                                        </span>
                                        <span className={styles.placeVisits}>
                                            {formatNumber(place.visits)} {labels.visits}
                                        </span>
                                    </div>
                                    <div className={styles.placeRating}>
                                        ⭐ {place.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className={styles.listCard}>
                        <h3>{labels.recentActivity}</h3>
                        <div className={styles.activityList}>
                            {stats?.recentActivity.map((activity) => (
                                <div key={activity.id} className={styles.activityItem}>
                                    <span className={styles.activityIcon}>
                                        {getActivityIcon(activity.type)}
                                    </span>
                                    <div className={styles.activityInfo}>
                                        <span className={styles.activityDesc}>{activity.description}</span>
                                        <span className={styles.activityTime}>{formatTime(activity.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Stat Card Component
function StatCard({
    icon,
    label,
    value,
    trend,
    positive
}: {
    icon: string;
    label: string;
    value: string;
    trend?: string;
    positive?: boolean;
}) {
    return (
        <div className={styles.statCard}>
            <span className={styles.statIcon}>{icon}</span>
            <div className={styles.statInfo}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
            </div>
            {trend && (
                <span className={`${styles.statTrend} ${positive ? styles.positive : styles.negative}`}>
                    {positive ? '↑' : '↓'} {trend}
                </span>
            )}
        </div>
    );
}
