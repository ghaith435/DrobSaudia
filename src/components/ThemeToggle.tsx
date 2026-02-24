"use client";

import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    if (!mounted) return null;

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
            id="theme-toggle"
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
            <div className={`${styles.iconWrapper} ${theme === 'light' ? styles.light : ''}`}>
                <span className={styles.sunIcon}>☀️</span>
                <span className={styles.moonIcon}>🌙</span>
            </div>
        </button>
    );
}
