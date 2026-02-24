'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/data/places';

const categoryMapAr: Record<string, string> = {
    'History': 'تاريخي',
    'Modern': 'حديث',
    'Shopping': 'تسوق',
    'Dining': 'مطاعم',
    'Entertainment': 'ترفيه',
    'Nature': 'طبيعة',
};

const priceMapAr: Record<string, string> = {
    'Free': 'مجاني',
    '$$': '$$',
    '$$$': '$$$',
    '$$$$': '$$$$',
};

interface PlaceCardProps {
    place: Place;
    locale?: 'ar' | 'en';
}

export default function PlaceCard({ place, locale: propLocale }: PlaceCardProps) {
    const [locale, setLocale] = useState<'ar' | 'en'>(propLocale || 'ar');

    useEffect(() => {
        if (!propLocale) {
            const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
            if (savedLocale) setLocale(savedLocale);
        }
    }, [propLocale]);

    useEffect(() => {
        if (propLocale) setLocale(propLocale);
    }, [propLocale]);

    const isRTL = locale === 'ar';
    const name = isRTL ? (place.nameAr || place.name) : place.name;
    const description = isRTL ? (place.descriptionAr || place.description) : place.description;
    const category = isRTL ? (categoryMapAr[place.category] || place.category) : place.category;
    const price = isRTL ? (priceMapAr[place.price] || place.price) : place.price;
    const viewDetails = isRTL ? 'عرض التفاصيل' : 'View Details';

    return (
        <div className="glass-panel rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-[var(--primary-glow)] transition duration-500" dir={isRTL ? 'rtl' : 'ltr'}>
            <div style={{ position: 'relative', height: '16rem', width: '100%' }}>
                <Image
                    src={place.image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] to-transparent opacity-80" />

                {/* Category Badge - top right */}
                <div className="absolute top-4 right-4">
                    <span className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] text-xs font-bold px-3 py-1 rounded-full text-[var(--accent-gold)]">
                        {category}
                    </span>
                </div>

                {/* Rating Badge - top left */}
                <div className="absolute top-4 left-4">
                    <span className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] text-xs font-bold px-3 py-1 rounded-full text-white">
                        ⭐ {place.rating}
                    </span>
                </div>
            </div>

            <div className="p-6 relative z-10 -mt-10">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent-gold)] transition">{name}</h3>
                <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4">{description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{place.location.address}</span>
                    <span className="text-[var(--accent-gold)] font-bold">{price}</span>
                </div>

                <Link href={`/place/${place.id}`} className="block mt-6 text-center w-full py-3 rounded-xl bg-[var(--accent-gold)] text-black font-bold hover:bg-[var(--accent-gold-dim)] transition">
                    {viewDetails}
                </Link>
            </div>
        </div>
    );
}
