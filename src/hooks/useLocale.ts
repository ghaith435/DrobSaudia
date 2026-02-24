'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Locale,
    translations,
    getTranslation,
    getDirection,
    TranslationKeys
} from '@/locales';

interface UseLocaleReturn {
    locale: Locale;
    isRTL: boolean;
    direction: 'rtl' | 'ltr';
    t: TranslationKeys;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
    getT: (path: string, fallback?: string) => string;
}

const LOCALE_STORAGE_KEY = 'locale';

export function useLocale(): UseLocaleReturn {
    const [locale, setLocaleState] = useState<Locale>('ar');
    const [isReady, setIsReady] = useState(false);

    // Initialize locale from localStorage on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        }
        setIsReady(true);
    }, []);

    // Update document direction and language when locale changes
    useEffect(() => {
        if (!isReady) return;

        const dir = getDirection(locale);
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;

        // Update body font family based on locale
        document.body.style.fontFamily = locale === 'ar'
            ? "'Tajawal', 'Outfit', sans-serif"
            : "'Outfit', 'Tajawal', sans-serif";
    }, [locale, isReady]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }, []);

    const toggleLocale = useCallback(() => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        setLocale(newLocale);
    }, [locale, setLocale]);

    const getT = useCallback((path: string, fallback?: string): string => {
        return getTranslation(locale, path, fallback);
    }, [locale]);

    const isRTL = locale === 'ar';
    const direction = getDirection(locale);
    const t = translations[locale];

    return {
        locale,
        isRTL,
        direction,
        t,
        setLocale,
        toggleLocale,
        getT,
    };
}

export default useLocale;
