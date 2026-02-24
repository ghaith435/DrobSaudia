"use client";

import { useState, useEffect } from 'react';
import { places, Place } from '@/data/places';
import PlaceCard from '@/components/PlaceCard';

const categoryMap: Record<string, string> = {
    'All': 'الكل',
    'History': 'تاريخي',
    'Modern': 'حديث',
    'Shopping': 'تسوق',
    'Dining': 'مطاعم',
    'Entertainment': 'ترفيه',
    'Nature': 'طبيعة',
};

export default function AllPlaces() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const isRTL = locale === 'ar';

    const filteredPlaces = selectedCategory === 'All'
        ? places
        : places.filter(p => p.category === selectedCategory);

    const t = {
        ar: { title: 'جميع', titleHighlight: 'الوجهات', subtitle: `استكشف ${places.length} وجهة سياحية` },
        en: { title: 'All', titleHighlight: 'Places', subtitle: `Explore ${places.length} destinations` },
    };

    const labels = t[locale];
    const categories = ['All', 'History', 'Modern', 'Shopping', 'Dining', 'Entertainment'];

    return (
        <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '3rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {labels.title} <span style={{ color: 'var(--accent-gold)' }}>{labels.titleHighlight}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                        {labels.subtitle}
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '9999px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'transparent',
                                color: selectedCategory === cat ? 'black' : 'var(--text-secondary)',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isRTL ? categoryMap[cat] || cat : cat}
                        </button>
                    ))}
                </div>

                {/* Places Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {filteredPlaces.map((place) => (
                        <PlaceCard key={place.id} place={place} locale={locale} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredPlaces.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '3rem' }}>🔍</span>
                        <h3 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>
                            {isRTL ? 'لا توجد وجهات في هذا التصنيف' : 'No places found in this category'}
                        </h3>
                    </div>
                )}
            </div>
        </main>
    );
}
