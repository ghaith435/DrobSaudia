'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './experiences.module.css';

interface Experience {
    id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    coverImage?: string;
    category: string;
    pricingTier: string;
    basePrice: number;
    minDuration: number;
    maxGuests: number;
    rating: number;
    totalReviews: number;
    languages: string[];
    guide: {
        id: string;
        displayName: string;
        displayNameAr?: string;
        avatar?: string;
        rating: number;
        certificationStatus: string;
    };
}

const CATEGORIES = [
    { id: 'ALL', name: 'All', nameAr: 'الكل', icon: '✨' },
    { id: 'CULTURAL', name: 'Cultural', nameAr: 'ثقافي', icon: '🏛️' },
    { id: 'CULINARY', name: 'Culinary', nameAr: 'طهي', icon: '🍽️' },
    { id: 'ADVENTURE', name: 'Adventure', nameAr: 'مغامرة', icon: '🏜️' },
    { id: 'WELLNESS', name: 'Wellness', nameAr: 'عافية', icon: '🧘' },
    { id: 'ART', name: 'Art', nameAr: 'فن', icon: '🎨' },
    { id: 'HISTORY', name: 'History', nameAr: 'تاريخ', icon: '📜' },
    { id: 'NATURE', name: 'Nature', nameAr: 'طبيعة', icon: '🌿' },
    { id: 'PHOTOGRAPHY', name: 'Photography', nameAr: 'تصوير', icon: '📷' },
];

const PRICING_TIERS: Record<string, { label: string; color: string }> = {
    ECONOMY: { label: 'Economy', color: 'badgeEconomy' },
    STANDARD: { label: 'Standard', color: 'badgeEconomy' },
    PREMIUM: { label: 'Premium', color: 'badgePremium' },
    LUXURY: { label: 'Luxury', color: 'badgeLuxury' },
};

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchExperiences();
    }, [selectedCategory, page]);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                status: 'APPROVED'
            });

            if (selectedCategory !== 'ALL') {
                params.append('category', selectedCategory);
            }

            const res = await fetch(`/api/experiences?${params}`);
            const data = await res.json();

            if (data.success) {
                setExperiences(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const filteredExperiences = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Discover Unique Experiences
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Connect with local guides and cultural spaces for unforgettable moments in Riyadh.
                        From culinary adventures to historical journeys.
                    </p>
                </div>
            </section>

            {/* Search & Filters */}
            <section className={styles.searchSection}>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {/* Categories */}
            <section className={styles.categories}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.categoryCard} ${selectedCategory === cat.id ? styles.active : ''}`}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setPage(1);
                        }}
                    >
                        <div className={styles.categoryIcon}>{cat.icon}</div>
                        <div className={styles.categoryName}>{cat.name}</div>
                    </button>
                ))}
            </section>

            {/* Featured Section */}
            <section className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {selectedCategory === 'ALL' ? 'All Experiences' : CATEGORIES.find(c => c.id === selectedCategory)?.name + ' Experiences'}
                    </h2>
                    <span className={styles.viewAll}>
                        {filteredExperiences.length} experiences found
                    </span>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Loading experiences...</p>
                    </div>
                ) : filteredExperiences.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔭</div>
                        <h3 className={styles.emptyTitle}>No experiences found</h3>
                        <p className={styles.emptyText}>
                            Try adjusting your filters or search query
                        </p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredExperiences.map((experience) => (
                            <Link
                                key={experience.id}
                                href={`/experiences/${experience.id}`}
                                className={styles.experienceCard}
                            >
                                <div className={styles.cardImage}>
                                    <Image
                                        src={experience.coverImage || '/images/placeholder-experience.jpg'}
                                        alt={experience.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 320px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <span className={`${styles.cardBadge} ${styles[PRICING_TIERS[experience.pricingTier].color]}`}>
                                        {PRICING_TIERS[experience.pricingTier].label}
                                    </span>
                                    {experience.rating > 0 && (
                                        <div className={styles.cardRating}>
                                            ⭐ {experience.rating.toFixed(1)}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.cardCategory}>
                                        {CATEGORIES.find(c => c.id === experience.category)?.icon} {experience.category}
                                    </div>
                                    <h3 className={styles.cardTitle}>{experience.title}</h3>
                                    <p className={styles.cardDescription}>{experience.description}</p>

                                    <div className={styles.cardMeta}>
                                        <span>⏱️ {formatDuration(experience.minDuration)}</span>
                                        <span>👥 Up to {experience.maxGuests}</span>
                                        <span>🗣️ {experience.languages.slice(0, 2).join(', ')}</span>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.guideInfo}>
                                            <Image
                                                src={experience.guide.avatar || '/images/default-avatar.png'}
                                                alt={experience.guide.displayName}
                                                width={36}
                                                height={36}
                                                className={styles.guideAvatar}
                                            />
                                            <span className={styles.guideName}>
                                                {experience.guide.displayName}
                                                {experience.guide.certificationStatus === 'CERTIFIED' && ' ✓'}
                                            </span>
                                        </div>
                                        <div className={styles.cardPrice}>
                                            <div className={styles.priceLabel}>From</div>
                                            <div className={styles.priceValue}>
                                                {experience.basePrice} <small>SAR</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
