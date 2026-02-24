'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Locale, localeNames } from '@/lib/i18n';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    const toggleLocale = () => {
        const newLocale: Locale = locale === 'ar' ? 'en' : 'ar';
        setLocale(newLocale);
    };

    return (
        <button
            onClick={toggleLocale}
            className={styles.switcher}
            aria-label={`Switch to ${locale === 'ar' ? 'English' : 'Arabic'}`}
        >
            <span className={styles.icon}>🌐</span>
            <span className={styles.label}>{localeNames[locale === 'ar' ? 'en' : 'ar']}</span>
        </button>
    );
}
