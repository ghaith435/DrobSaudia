'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './dashboard.module.css';

interface UserStats {
    placesVisited: number;
    reviewsWritten: number;
    tripsPlanned: number;
    points: number;
    level: number;
    totalXp: number;
    xpToNextLevel: number;
}

interface PointsPackage {
    id: string;
    name: string;
    nameAr: string;
    points: number;
    price: number;
    bonus: number;
    popular?: boolean;
}

interface Service {
    id: string;
    icon: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    link: string;
    pointsCost: number;
    available: boolean;
}

interface Transaction {
    id: string;
    type: 'EARNED' | 'SPENT' | 'PURCHASED';
    amount: number;
    description: string;
    descriptionAr: string;
    createdAt: string;
}

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<UserStats>({
        placesVisited: 0,
        reviewsWritten: 0,
        tripsPlanned: 0,
        points: 0,
        level: 1,
        totalXp: 0,
        xpToNextLevel: 100,
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PointsPackage | null>(null);
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');

    // Points packages
    const pointsPackages: PointsPackage[] = [
        { id: '1', name: 'Starter', nameAr: 'مبتدئ', points: 100, price: 10, bonus: 0 },
        { id: '2', name: 'Explorer', nameAr: 'مستكشف', points: 300, price: 25, bonus: 50, popular: true },
        { id: '3', name: 'Adventurer', nameAr: 'مغامر', points: 500, price: 40, bonus: 100 },
        { id: '4', name: 'Legend', nameAr: 'أسطوري', points: 1000, price: 75, bonus: 250 },
    ];

    // Available services
    const services: Service[] = [
        {
            id: 'planner',
            icon: '🤖',
            title: 'AI Trip Planner',
            titleAr: 'مخطط الرحلات الذكي',
            description: 'Get personalized trip plans using AI',
            descriptionAr: 'احصل على خطط سفر مخصصة بالذكاء الاصطناعي',
            link: '/planner',
            pointsCost: 50,
            available: true,
        },
        {
            id: 'audio-tours',
            icon: '🎧',
            title: 'Audio Tours',
            titleAr: 'الجولات الصوتية',
            description: 'Listen to guided audio tours',
            descriptionAr: 'استمع للجولات الصوتية المرشدة',
            link: '/audio-tours',
            pointsCost: 30,
            available: true,
        },
        {
            id: 'ai-guide',
            icon: '👤',
            title: 'Virtual Guide',
            titleAr: 'المرشد الافتراضي',
            description: '24/7 AI-powered tour guide',
            descriptionAr: 'مرشد سياحي ذكي متاح على مدار الساعة',
            link: '/ai-guide',
            pointsCost: 20,
            available: true,
        },
        {
            id: 'tours',
            icon: '🗺️',
            title: 'Guided Tours',
            titleAr: 'الجولات السياحية',
            description: 'Browse and join guided tours',
            descriptionAr: 'تصفح وانضم للجولات السياحية',
            link: '/tours',
            pointsCost: 0,
            available: true,
        },
        {
            id: 'events',
            icon: '🎪',
            title: 'Events',
            titleAr: 'الفعاليات',
            description: 'Discover latest events',
            descriptionAr: 'اكتشف أحدث الفعاليات',
            link: '/events',
            pointsCost: 0,
            available: true,
        },
        {
            id: 'compare',
            icon: '🔄',
            title: 'Compare Places',
            titleAr: 'مقارنة الأماكن',
            description: 'Compare tourist destinations',
            descriptionAr: 'قارن بين الوجهات السياحية',
            link: '/compare',
            pointsCost: 10,
            available: true,
        },
    ];

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login?redirect=/dashboard');
            return;
        }

        if (status === 'authenticated') {
            // Fetch user stats
            fetchUserStats();
        }
    }, [status, router]);

    const fetchUserStats = async () => {
        try {
            // Simulate API call - replace with actual endpoint
            setStats({
                placesVisited: 15,
                reviewsWritten: 8,
                tripsPlanned: 3,
                points: 1250,
                level: 5,
                totalXp: 2500,
                xpToNextLevel: 3000,
            });
            setTransactions([
                { id: '1', type: 'EARNED', amount: 50, description: 'Completed Diriyah Tour', descriptionAr: 'أكملت جولة الدرعية', createdAt: '2026-01-20' },
                { id: '2', type: 'SPENT', amount: -30, description: 'Used Audio Guide', descriptionAr: 'استخدمت الدليل الصوتي', createdAt: '2026-01-19' },
                { id: '3', type: 'PURCHASED', amount: 350, description: 'Purchased Explorer Package', descriptionAr: 'اشتريت باقة المستكشف', createdAt: '2026-01-15' },
                { id: '4', type: 'EARNED', amount: 100, description: 'Wrote 5 reviews', descriptionAr: 'كتبت 5 تقييمات', createdAt: '2026-01-14' },
            ]);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setIsLoading(false);
        }
    };

    const handleRecharge = async () => {
        if (!selectedPackage) return;

        // Simulate payment - replace with actual payment gateway
        alert(locale === 'ar'
            ? `سيتم إضافة ${selectedPackage.points + selectedPackage.bonus} نقطة بعد الدفع`
            : `${selectedPackage.points + selectedPackage.bonus} points will be added after payment`
        );

        setShowRechargeModal(false);
        setSelectedPackage(null);
    };

    const t = {
        ar: {
            dashboard: 'لوحة التحكم',
            welcome: 'مرحباً',
            overview: 'نظرة عامة',
            services: 'الخدمات',
            points: 'النقاط',
            profile: 'الملف الشخصي',
            history: 'السجل',
            settings: 'الإعدادات',
            placesVisited: 'الأماكن المزارة',
            reviewsWritten: 'التقييمات',
            tripsPlanned: 'الرحلات',
            currentPoints: 'نقاطك الحالية',
            level: 'المستوى',
            xpProgress: 'تقدم الخبرة',
            rechargePoints: 'شحن النقاط',
            availableServices: 'الخدمات المتاحة',
            pointsCost: 'التكلفة',
            free: 'مجاني',
            useService: 'استخدم الخدمة',
            recentTransactions: 'آخر المعاملات',
            earned: 'مكتسب',
            spent: 'مصروف',
            purchased: 'مشترى',
            selectPackage: 'اختر باقة النقاط',
            popular: 'الأكثر شعبية',
            bonus: 'مكافأة',
            total: 'المجموع',
            sar: 'ريال',
            buyNow: 'اشترِ الآن',
            cancel: 'إلغاء',
            logout: 'تسجيل الخروج',
            editProfile: 'تعديل الملف',
            email: 'البريد الإلكتروني',
            memberSince: 'عضو منذ',
            noTransactions: 'لا توجد معاملات',
        },
        en: {
            dashboard: 'Dashboard',
            welcome: 'Welcome',
            overview: 'Overview',
            services: 'Services',
            points: 'Points',
            profile: 'Profile',
            history: 'History',
            settings: 'Settings',
            placesVisited: 'Places Visited',
            reviewsWritten: 'Reviews',
            tripsPlanned: 'Trips',
            currentPoints: 'Current Points',
            level: 'Level',
            xpProgress: 'XP Progress',
            rechargePoints: 'Recharge Points',
            availableServices: 'Available Services',
            pointsCost: 'Cost',
            free: 'Free',
            useService: 'Use Service',
            recentTransactions: 'Recent Transactions',
            earned: 'Earned',
            spent: 'Spent',
            purchased: 'Purchased',
            selectPackage: 'Select Points Package',
            popular: 'Most Popular',
            bonus: 'Bonus',
            total: 'Total',
            sar: 'SAR',
            buyNow: 'Buy Now',
            cancel: 'Cancel',
            logout: 'Logout',
            editProfile: 'Edit Profile',
            email: 'Email',
            memberSince: 'Member since',
            noTransactions: 'No transactions yet',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    if (status === 'loading' || isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const xpPercentage = (stats.totalXp / stats.xpToNextLevel) * 100;

    return (
        <main className={styles.main} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.container}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.userCard}>
                        <div className={styles.avatar}>
                            {session.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || ''}
                                    width={80}
                                    height={80}
                                    className={styles.avatarImg}
                                />
                            ) : (
                                <span>{session.user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <h3 className={styles.userName}>{session.user?.name}</h3>
                        <p className={styles.userEmail}>{session.user?.email}</p>
                        <div className={styles.levelBadge}>
                            <span className={styles.levelIcon}>🏆</span>
                            {labels.level} {stats.level}
                        </div>
                    </div>

                    {/* Points Card */}
                    <div className={styles.pointsCard}>
                        <div className={styles.pointsHeader}>
                            <span className={styles.pointsIcon}>💎</span>
                            <span className={styles.pointsLabel}>{labels.currentPoints}</span>
                        </div>
                        <div className={styles.pointsValue}>{stats.points.toLocaleString()}</div>
                        <button
                            className={styles.rechargeBtn}
                            onClick={() => setShowRechargeModal(true)}
                        >
                            ⚡ {labels.rechargePoints}
                        </button>
                    </div>

                    <nav className={styles.nav}>
                        {[
                            { id: 'overview', icon: '📊', label: labels.overview },
                            { id: 'services', icon: '🚀', label: labels.services },
                            { id: 'points', icon: '💎', label: labels.points },
                            { id: 'profile', icon: '👤', label: labels.profile },
                            { id: 'history', icon: '📜', label: labels.history },
                            { id: 'settings', icon: '⚙️', label: labels.settings },
                        ].map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        className={styles.logoutBtn}
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <span>🚪</span>
                        <span>{labels.logout}</span>
                    </button>
                </aside>

                {/* Main Content */}
                <div className={styles.content}>
                    <header className={styles.header}>
                        <h1>{labels.welcome}، {session.user?.name?.split(' ')[0]}! 👋</h1>
                        <button
                            className={styles.langToggle}
                            onClick={() => {
                                const newLocale = locale === 'ar' ? 'en' : 'ar';
                                setLocale(newLocale);
                                localStorage.setItem('locale', newLocale);
                            }}
                        >
                            🌐 {locale === 'ar' ? 'EN' : 'ع'}
                        </button>
                    </header>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className={styles.overviewTab}>
                            {/* Stats Grid */}
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>📍</span>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>{stats.placesVisited}</span>
                                        <span className={styles.statLabel}>{labels.placesVisited}</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>⭐</span>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>{stats.reviewsWritten}</span>
                                        <span className={styles.statLabel}>{labels.reviewsWritten}</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>✈️</span>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>{stats.tripsPlanned}</span>
                                        <span className={styles.statLabel}>{labels.tripsPlanned}</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>💎</span>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>{stats.points.toLocaleString()}</span>
                                        <span className={styles.statLabel}>{labels.currentPoints}</span>
                                    </div>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div className={styles.xpProgressCard}>
                                <div className={styles.xpHeader}>
                                    <span>{labels.xpProgress}</span>
                                    <span className={styles.xpLevel}>{labels.level} {stats.level}</span>
                                </div>
                                <div className={styles.xpBar}>
                                    <div
                                        className={styles.xpFill}
                                        style={{ width: `${xpPercentage}%` }}
                                    />
                                </div>
                                <div className={styles.xpInfo}>
                                    <span>{stats.totalXp.toLocaleString()} XP</span>
                                    <span>{stats.xpToNextLevel.toLocaleString()} XP</span>
                                </div>
                            </div>

                            {/* Quick Services */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2>{labels.availableServices}</h2>
                                    <button
                                        className={styles.viewAllBtn}
                                        onClick={() => setActiveTab('services')}
                                    >
                                        {isRTL ? 'عرض الكل' : 'View All'}
                                    </button>
                                </div>
                                <div className={styles.quickServicesGrid}>
                                    {services.slice(0, 4).map((service) => (
                                        <Link
                                            href={service.link}
                                            key={service.id}
                                            className={styles.quickServiceCard}
                                        >
                                            <span className={styles.serviceIcon}>{service.icon}</span>
                                            <span className={styles.serviceTitle}>
                                                {isRTL ? service.titleAr : service.title}
                                            </span>
                                            <span className={styles.serviceCost}>
                                                {service.pointsCost > 0
                                                    ? `${service.pointsCost} 💎`
                                                    : labels.free
                                                }
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Recent Transactions */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2>{labels.recentTransactions}</h2>
                                    <button
                                        className={styles.viewAllBtn}
                                        onClick={() => setActiveTab('history')}
                                    >
                                        {isRTL ? 'عرض الكل' : 'View All'}
                                    </button>
                                </div>
                                <div className={styles.transactionsList}>
                                    {transactions.slice(0, 3).map((tx) => (
                                        <div key={tx.id} className={styles.transactionItem}>
                                            <div className={styles.txInfo}>
                                                <span className={`${styles.txType} ${styles[tx.type.toLowerCase()]}`}>
                                                    {tx.type === 'EARNED' ? '📈' : tx.type === 'SPENT' ? '📉' : '💳'}
                                                </span>
                                                <div>
                                                    <p className={styles.txDesc}>
                                                        {isRTL ? tx.descriptionAr : tx.description}
                                                    </p>
                                                    <span className={styles.txDate}>{tx.createdAt}</span>
                                                </div>
                                            </div>
                                            <span className={`${styles.txAmount} ${tx.amount > 0 ? styles.positive : styles.negative}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div className={styles.servicesTab}>
                            <h2>{labels.availableServices}</h2>
                            <div className={styles.servicesGrid}>
                                {services.map((service) => (
                                    <div key={service.id} className={styles.serviceCard}>
                                        <div className={styles.serviceCardIcon}>
                                            {service.icon}
                                        </div>
                                        <h3>{isRTL ? service.titleAr : service.title}</h3>
                                        <p>{isRTL ? service.descriptionAr : service.description}</p>
                                        <div className={styles.serviceCardFooter}>
                                            <span className={styles.serviceCostBadge}>
                                                {service.pointsCost > 0
                                                    ? `${service.pointsCost} 💎`
                                                    : `✅ ${labels.free}`
                                                }
                                            </span>
                                            <Link href={service.link} className={styles.useServiceBtn}>
                                                {labels.useService} →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Points Tab */}
                    {activeTab === 'points' && (
                        <div className={styles.pointsTab}>
                            <div className={styles.pointsOverview}>
                                <div className={styles.pointsBalanceCard}>
                                    <span className={styles.pointsBalanceIcon}>💎</span>
                                    <div className={styles.pointsBalanceInfo}>
                                        <span className={styles.pointsBalanceLabel}>{labels.currentPoints}</span>
                                        <span className={styles.pointsBalanceValue}>{stats.points.toLocaleString()}</span>
                                    </div>
                                    <button
                                        className={styles.rechargeMainBtn}
                                        onClick={() => setShowRechargeModal(true)}
                                    >
                                        ⚡ {labels.rechargePoints}
                                    </button>
                                </div>
                            </div>

                            <h3 className={styles.packagesTitle}>{labels.selectPackage}</h3>
                            <div className={styles.packagesGrid}>
                                {pointsPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}
                                        onClick={() => {
                                            setSelectedPackage(pkg);
                                            setShowRechargeModal(true);
                                        }}
                                    >
                                        {pkg.popular && (
                                            <span className={styles.popularBadge}>{labels.popular}</span>
                                        )}
                                        <h4>{isRTL ? pkg.nameAr : pkg.name}</h4>
                                        <div className={styles.packagePoints}>
                                            <span className={styles.packagePointsValue}>{pkg.points}</span>
                                            <span className={styles.packagePointsLabel}>💎</span>
                                        </div>
                                        {pkg.bonus > 0 && (
                                            <div className={styles.packageBonus}>
                                                +{pkg.bonus} {labels.bonus}
                                            </div>
                                        )}
                                        <div className={styles.packagePrice}>
                                            {pkg.price} {labels.sar}
                                        </div>
                                        <button className={styles.buyPackageBtn}>
                                            {labels.buyNow}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className={styles.profileTab}>
                            <div className={styles.profileCard}>
                                <div className={styles.profileHeader}>
                                    <div className={styles.profileAvatar}>
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || ''}
                                                width={120}
                                                height={120}
                                                className={styles.profileAvatarImg}
                                            />
                                        ) : (
                                            <span>{session.user?.name?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <div className={styles.profileInfo}>
                                        <h2>{session.user?.name}</h2>
                                        <p>{session.user?.email}</p>
                                        <div className={styles.profileBadges}>
                                            <span className={styles.profileLevelBadge}>
                                                🏆 {labels.level} {stats.level}
                                            </span>
                                            <span className={styles.profilePointsBadge}>
                                                💎 {stats.points.toLocaleString()} {isRTL ? 'نقطة' : 'points'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.profileStats}>
                                    <div className={styles.profileStatItem}>
                                        <span className={styles.profileStatValue}>{stats.placesVisited}</span>
                                        <span className={styles.profileStatLabel}>{labels.placesVisited}</span>
                                    </div>
                                    <div className={styles.profileStatItem}>
                                        <span className={styles.profileStatValue}>{stats.reviewsWritten}</span>
                                        <span className={styles.profileStatLabel}>{labels.reviewsWritten}</span>
                                    </div>
                                    <div className={styles.profileStatItem}>
                                        <span className={styles.profileStatValue}>{stats.tripsPlanned}</span>
                                        <span className={styles.profileStatLabel}>{labels.tripsPlanned}</span>
                                    </div>
                                </div>

                                <button className={styles.editProfileBtn}>
                                    ✏️ {labels.editProfile}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className={styles.historyTab}>
                            <h2>{labels.recentTransactions}</h2>
                            {transactions.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span>📜</span>
                                    <p>{labels.noTransactions}</p>
                                </div>
                            ) : (
                                <div className={styles.transactionsFullList}>
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className={styles.transactionFullItem}>
                                            <div className={styles.txFullInfo}>
                                                <span className={`${styles.txFullType} ${styles[tx.type.toLowerCase()]}`}>
                                                    {tx.type === 'EARNED' && `📈 ${labels.earned}`}
                                                    {tx.type === 'SPENT' && `📉 ${labels.spent}`}
                                                    {tx.type === 'PURCHASED' && `💳 ${labels.purchased}`}
                                                </span>
                                                <p className={styles.txFullDesc}>
                                                    {isRTL ? tx.descriptionAr : tx.description}
                                                </p>
                                            </div>
                                            <div className={styles.txFullRight}>
                                                <span className={`${styles.txFullAmount} ${tx.amount > 0 ? styles.positive : styles.negative}`}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount} 💎
                                                </span>
                                                <span className={styles.txFullDate}>{tx.createdAt}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className={styles.settingsTab}>
                            <h2>{labels.settings}</h2>
                            <div className={styles.settingsCard}>
                                <div className={styles.settingsGroup}>
                                    <label>{isRTL ? 'اللغة' : 'Language'}</label>
                                    <select
                                        value={locale}
                                        onChange={(e) => {
                                            setLocale(e.target.value as 'ar' | 'en');
                                            localStorage.setItem('locale', e.target.value);
                                        }}
                                        className={styles.settingsSelect}
                                    >
                                        <option value="ar">العربية</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recharge Modal */}
            {showRechargeModal && (
                <div className={styles.modalOverlay} onClick={() => setShowRechargeModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{labels.selectPackage}</h3>
                        <div className={styles.modalPackages}>
                            {pointsPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className={`${styles.modalPackage} ${selectedPackage?.id === pkg.id ? styles.selected : ''} ${pkg.popular ? styles.popular : ''}`}
                                    onClick={() => setSelectedPackage(pkg)}
                                >
                                    {pkg.popular && (
                                        <span className={styles.modalPopularBadge}>{labels.popular}</span>
                                    )}
                                    <div className={styles.modalPackageName}>{isRTL ? pkg.nameAr : pkg.name}</div>
                                    <div className={styles.modalPackagePoints}>
                                        {pkg.points} 💎
                                        {pkg.bonus > 0 && <span className={styles.modalBonus}>+{pkg.bonus}</span>}
                                    </div>
                                    <div className={styles.modalPackagePrice}>
                                        {pkg.price} {labels.sar}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedPackage && (
                            <div className={styles.modalSummary}>
                                <div className={styles.modalSummaryRow}>
                                    <span>{labels.total}</span>
                                    <span>{selectedPackage.points + selectedPackage.bonus} 💎</span>
                                </div>
                                <div className={styles.modalSummaryRow}>
                                    <span>{isRTL ? 'السعر' : 'Price'}</span>
                                    <span>{selectedPackage.price} {labels.sar}</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalCancelBtn}
                                onClick={() => setShowRechargeModal(false)}
                            >
                                {labels.cancel}
                            </button>
                            <button
                                className={styles.modalBuyBtn}
                                onClick={handleRecharge}
                                disabled={!selectedPackage}
                            >
                                {labels.buyNow}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
