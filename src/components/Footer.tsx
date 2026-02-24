'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const t = {
        ar: {
            brand: { name: 'دليل', highlight: 'السعودية', desc: 'دليلك الذكي لاكتشاف المملكة العربية السعودية. رفيقك المثالي لاستكشاف التراث والحداثة في جميع مدن المملكة.' },
            explore: {
                title: 'استكشف', items: [
                    { href: '/places', label: 'الوجهات السياحية' },
                    { href: '/tours', label: 'الرحلات' },
                    { href: '/events', label: 'الفعاليات' },
                    { href: '/audio-tours', label: 'الجولات الصوتية' },
                ]
            },
            company: {
                title: 'الشركة', items: [
                    { href: '/about', label: 'من نحن' },
                    { href: '/contact', label: 'تواصل معنا' },
                    { href: '/privacy', label: 'سياسة الخصوصية' },
                    { href: '/terms', label: 'الشروط والأحكام' },
                ]
            },
            newsletter: { title: 'ابقَ على اطلاع', placeholder: 'بريدك الإلكتروني', button: 'اشترك' },
            copyright: `© ${new Date().getFullYear()} دليل السعودية. جميع الحقوق محفوظة.`,
        },
        en: {
            brand: { name: 'Saudi', highlight: 'Guide', desc: 'Your smart guide to discovering Saudi Arabia. The perfect companion for exploring heritage and modernity across all cities of the Kingdom.' },
            explore: {
                title: 'Explore', items: [
                    { href: '/places', label: 'Destinations' },
                    { href: '/tours', label: 'Tours' },
                    { href: '/events', label: 'Events' },
                    { href: '/audio-tours', label: 'Audio Tours' },
                ]
            },
            company: {
                title: 'Company', items: [
                    { href: '/about', label: 'About Us' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/privacy', label: 'Privacy Policy' },
                    { href: '/terms', label: 'Terms & Conditions' },
                ]
            },
            newsletter: { title: 'Stay Updated', placeholder: 'Email address', button: 'Join' },
            copyright: `© ${new Date().getFullYear()} Saudi Guide. All rights reserved.`,
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    return (
        <footer style={{ borderTop: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)', marginTop: '5rem', padding: '3rem 1.5rem 1.5rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {labels.brand.name}<span style={{ color: 'var(--accent-gold)' }}>{labels.brand.highlight}</span>
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            {labels.brand.desc}
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{labels.explore.title}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {labels.explore.items.map((item) => (
                                <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                                    <Link href={item.href} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{labels.company.title}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {labels.company.items.map((item) => (
                                <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                                    <Link href={item.href} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{labels.newsletter.title}</h4>
                        <div style={{ display: 'flex', direction: isRTL ? 'rtl' : 'ltr' }}>
                            <input
                                type="email"
                                placeholder={labels.newsletter.placeholder}
                                style={{
                                    backgroundColor: 'var(--bg-deep)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: isRTL ? '0 0.5rem 0.5rem 0' : '0.5rem 0 0 0.5rem',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    flex: 1,
                                    outline: 'none',
                                    color: 'var(--text-primary)',
                                }}
                            />
                            <button style={{
                                backgroundColor: 'var(--accent-gold)',
                                color: 'black',
                                padding: '0.5rem 1rem',
                                borderRadius: isRTL ? '0.5rem 0 0 0.5rem' : '0 0.5rem 0.5rem 0',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}>
                                {labels.newsletter.button}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    {labels.copyright}
                </div>
            </div>
        </footer>
    );
}
