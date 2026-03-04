'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { data: session, status } = useSession();
    const { selectedCity, setSelectedCity, cities } = useCity();
    const pathname = usePathname();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCityMenu, setShowCityMenu] = useState(false);
    const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) {
            setLocale(savedLocale);
            document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = savedLocale;
        }
    }, []);

    const toggleLocale = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    };

    const handleCityChange = (city: typeof cities[0]) => {
        setSelectedCity(city);
        setShowCityMenu(false);
    };

    const t = {
        ar: {
            home: 'الرئيسية',
            discover: 'اكتشف',
            audioTours: 'الجولات الصوتية',
            aiGuide: 'المرشد الذكي',
            rewards: 'المكافآت',
            // Discover sub-items
            places: 'الأماكن',
            tours: 'الرحلات',
            experiences: 'التجارب',
            events: 'الفعاليات',
            arExperience: 'الواقع المعزز',
            maps: 'الخرائط',
            // User menu
            login: 'تسجيل الدخول',
            registerGuide: 'سجل كمرشد',
            logout: 'تسجيل الخروج',
            dashboard: 'لوحة التحكم',
            guideDashboard: 'لوحة المرشد',
            requests: 'الطلبات',
            favorites: 'المفضلة',
            selectCity: 'اختر المدينة',
        },
        en: {
            home: 'Home',
            discover: 'Discover',
            audioTours: 'Audio Tours',
            aiGuide: 'AI Guide',
            rewards: 'Rewards',
            // Discover sub-items
            places: 'Places',
            tours: 'Tours',
            experiences: 'Experiences',
            events: 'Events',
            arExperience: 'AR Experience',
            maps: 'Maps',
            // User menu
            login: 'Login',
            registerGuide: 'Become a Guide',
            logout: 'Logout',
            dashboard: 'Dashboard',
            guideDashboard: 'Guide Dashboard',
            requests: 'Requests',
            favorites: 'Favorites',
            selectCity: 'Select City',
        },
    };

    const labels = t[locale];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname?.startsWith(href);
    };

    const discoverItems = [
        { href: '/places', icon: '📍', label: labels.places },
        { href: '/tours', icon: '🗺️', label: labels.tours },
        { href: '/experiences', icon: '✨', label: labels.experiences },
        { href: '/events', icon: '🎪', label: labels.events },
        { href: '/ar', icon: '📸', label: labels.arExperience },
        { href: '/maps', icon: '🧭', label: labels.maps },
    ];

    const isDiscoverActive = discoverItems.some(item => isActive(item.href));

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo_duroob.png"
                        alt="شعار دروب"
                        width={200}
                        height={65}
                        className={styles.logoImage}
                        priority
                        quality={100}
                        unoptimized={true}
                    />
                </Link>

                {/* City Selector */}
                <div className={styles.citySelector}>
                    <button
                        className={styles.citySelectorBtn}
                        onClick={() => setShowCityMenu(!showCityMenu)}
                        aria-label={labels.selectCity}
                    >
                        <span className={styles.cityIcon}>📍</span>
                        <span className={styles.cityName}>
                            {locale === 'ar' ? selectedCity.nameAr : selectedCity.name}
                        </span>
                        <span className={styles.cityArrow}>{showCityMenu ? '▲' : '▼'}</span>
                    </button>

                    {showCityMenu && (
                        <div className={styles.cityDropdown}>
                            <div className={styles.cityDropdownHeader}>
                                {labels.selectCity}
                            </div>
                            {cities.map((city) => (
                                <button
                                    key={city.id}
                                    className={`${styles.cityOption} ${selectedCity.id === city.id ? styles.selected : ''}`}
                                    onClick={() => handleCityChange(city)}
                                >
                                    <span>{locale === 'ar' ? city.nameAr : city.name}</span>
                                    {selectedCity.id === city.id && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {/* Desktop Links - Condensed to 5 */}
                <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                    <Link
                        href="/"
                        className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
                    >
                        {labels.home}
                    </Link>

                    {/* Discover Dropdown */}
                    <div
                        className={styles.discoverWrapper}
                    >
                        <button
                            className={`${styles.navLink} ${styles.discoverBtn} ${isDiscoverActive ? styles.navLinkActive : ''}`}
                            onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}
                        >
                            🔍 {labels.discover}
                            <span className={styles.discoverArrow}>{showDiscoverMenu ? '▲' : '▼'}</span>
                        </button>

                        {showDiscoverMenu && (
                            <div className={styles.discoverDropdown}>
                                {discoverItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.discoverItem} ${isActive(item.href) ? styles.discoverItemActive : ''}`}
                                        onClick={() => {
                                            setShowDiscoverMenu(false);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <span className={styles.discoverIcon}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/audio-tours"
                        className={`${styles.navLink} ${isActive('/audio-tours') ? styles.navLinkActive : ''}`}
                    >
                        🎧 {labels.audioTours}
                    </Link>

                    <Link
                        href="/ai-guide"
                        className={`${styles.navLink} ${isActive('/ai-guide') ? styles.navLinkActive : ''}`}
                    >
                        🤖 {labels.aiGuide}
                    </Link>

                    <Link
                        href="/rewards"
                        className={`${styles.navLink} ${isActive('/rewards') ? styles.navLinkActive : ''}`}
                    >
                        🏆 {labels.rewards}
                    </Link>
                </div>

                {/* Right Actions */}
                <div className={styles.actions}>
                    {/* Language Switcher */}
                    <button
                        className={styles.langBtn}
                        onClick={toggleLocale}
                        aria-label="Switch language"
                    >
                        🌐 {locale === 'ar' ? 'EN' : 'ع'}
                    </button>

                    {/* User Section */}
                    {status === 'loading' ? (
                        <div className={styles.userLoading}></div>
                    ) : session?.user ? (
                        <div className={styles.userSection}>
                            {/* User Menu Toggle */}
                            <button
                                className={styles.userBtn}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-label="User menu"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt=""
                                        className={styles.userAvatar}
                                    />
                                ) : (
                                    <span className={styles.userIcon}>👤</span>
                                )}
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserMenu && (
                                <div className={styles.userMenu}>
                                    <div className={styles.userInfo}>
                                        <strong>{session.user.name}</strong>
                                        <span>{session.user.email}</span>
                                    </div>
                                    <div className={styles.menuDivider}></div>
                                    <Link href="/dashboard" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                        📊 {labels.dashboard}
                                    </Link>
                                    <Link href="/guide-dashboard" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                        🎯 {labels.guideDashboard}
                                    </Link>
                                    <Link href="/requests" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                        💬 {labels.requests}
                                    </Link>
                                    <Link href="/favorites" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                        ❤️ {labels.favorites}
                                    </Link>
                                    <div className={styles.menuDivider}></div>
                                    <button className={styles.logoutBtn} onClick={handleLogout}>
                                        🚪 {labels.logout}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/auth/login" className={styles.loginBtn}>
                                {labels.login}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for menus */}
            {(showUserMenu || showCityMenu || showDiscoverMenu) && (
                <div
                    className={styles.backdrop}
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowCityMenu(false);
                        setShowDiscoverMenu(false);
                    }}
                ></div>
            )}
        </nav>
    );
}
