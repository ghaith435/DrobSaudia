'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './config';

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Ensure i18n is initialized on client
        if (i18n.isInitialized) {
            setIsInitialized(true);
        } else {
            i18n.on('initialized', () => {
                setIsInitialized(true);
            });
        }

        // Get stored language from localStorage
        const storedLang = localStorage.getItem('i18nextLng') || localStorage.getItem('locale');
        if (storedLang && (storedLang === 'ar' || storedLang === 'en')) {
            i18n.changeLanguage(storedLang);
        }
    }, []);

    if (!isInitialized && typeof window !== 'undefined') {
        // Return loading state while i18n initializes
        return null;
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

// Custom hook for translations with direction support
export function useLocale() {
    const [locale, setLocaleState] = useState<'ar' | 'en'>(i18n.language as 'ar' | 'en' || 'ar');
    const [isRTL, setIsRTL] = useState(true);

    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLocaleState(lng as 'ar' | 'en');
            setIsRTL(lng === 'ar');
            document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lng;
            localStorage.setItem('locale', lng);
        };

        i18n.on('languageChanged', handleLanguageChange);

        // Set initial direction
        if (typeof window !== 'undefined') {
            const currentLang = i18n.language || 'ar';
            setLocaleState(currentLang as 'ar' | 'en');
            setIsRTL(currentLang === 'ar');
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = currentLang;
        }

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const changeLocale = (newLocale: 'ar' | 'en') => {
        i18n.changeLanguage(newLocale);
    };

    const toggleLocale = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        changeLocale(newLocale);
    };

    return {
        locale,
        isRTL,
        changeLocale,
        toggleLocale,
        t: i18n.t.bind(i18n)
    };
}

export { i18n };
