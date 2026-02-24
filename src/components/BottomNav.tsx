"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./BottomNav.module.css";

const navItems = {
    ar: [
        { href: "/", icon: "🏠", label: "الرئيسية" },
        { href: "/maps", icon: "🗺️", label: "الخريطة" },
        { href: "/audio-tours", icon: "🎧", label: "جولات صوتية" },
        { href: "/planner", icon: "📅", label: "التخطيط" },
        { href: "/rewards", icon: "🏆", label: "المكافآت" },
    ],
    en: [
        { href: "/", icon: "🏠", label: "Home" },
        { href: "/maps", icon: "🗺️", label: "Map" },
        { href: "/audio-tours", icon: "🎧", label: "Audio" },
        { href: "/planner", icon: "📅", label: "Plan" },
        { href: "/rewards", icon: "🏆", label: "Rewards" },
    ],
};

export default function BottomNav() {
    const pathname = usePathname();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    // Don't show on admin pages
    if (pathname?.startsWith("/admin")) return null;

    const items = navItems[locale];

    return (
        <nav className={styles.bottomNav} id="bottom-navigation">
            {items.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                        {isActive && <div className={styles.activeIndicator} />}
                    </Link>
                );
            })}
        </nav>
    );
}
