'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, getDirection, TranslationKeys } from '@/locales';

interface LanguageContextType {
    locale: Locale;
    isRTL: boolean;
    direction: 'rtl' | 'ltr';
    t: TranslationKeys;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'locale';

interface LanguageProviderProps {
    children: ReactNode;
    defaultLocale?: Locale;
}

export function LanguageProvider({
    children,
    defaultLocale = 'ar'
}: LanguageProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);
    const [mounted, setMounted] = useState(false);

    // Initialize locale from localStorage
    useEffect(() => {
        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        }
        setMounted(true);
    }, []);

    // Update document attributes when locale changes
    useEffect(() => {
        if (!mounted) return;

        const dir = getDirection(locale);
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;

        // Update font family
        document.body.style.fontFamily = locale === 'ar'
            ? "'Tajawal', 'Outfit', sans-serif"
            : "'Outfit', 'Tajawal', sans-serif";
    }, [locale, mounted]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    };

    const toggleLocale = () => {
        setLocale(locale === 'ar' ? 'en' : 'ar');
    };

    const value: LanguageContextType = {
        locale,
        isRTL: locale === 'ar',
        direction: getDirection(locale),
        t: translations[locale],
        setLocale,
        toggleLocale,
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ ...value, locale: defaultLocale, t: translations[defaultLocale] }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageProvider;
