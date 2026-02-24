import arTranslations from './ar.json';
import enTranslations from './en.json';

export type Locale = 'ar' | 'en';

export const translations = {
    ar: arTranslations,
    en: enTranslations,
};

export type TranslationKeys = typeof arTranslations;

/**
 * Get nested translation value by dot notation path
 */
export function getTranslation(
    locale: Locale,
    path: string,
    fallback?: string
): string {
    const keys = path.split('.');
    let value: unknown = translations[locale];

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = (value as Record<string, unknown>)[key];
        } else {
            return fallback || path;
        }
    }

    return typeof value === 'string' ? value : fallback || path;
}

/**
 * Get the direction based on locale
 */
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
    return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Get the font family based on locale
 */
export function getFontFamily(locale: Locale): string {
    return locale === 'ar'
        ? "'Tajawal', 'Outfit', sans-serif"
        : "'Outfit', 'Tajawal', sans-serif";
}

export { arTranslations, enTranslations };
