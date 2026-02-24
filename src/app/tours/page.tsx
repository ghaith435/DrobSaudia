"use client";

import { useState } from "react";
import Link from "next/link";
import { tours } from "@/data/tours";
import styles from "./tours.module.css";

const categoryMapAr: Record<string, string> = {
    'Cultural': 'ثقافي',
    'Historical': 'تاريخي',
    'History': 'تاريخي',
    'Adventure': 'مغامرات',
    'Nature': 'طبيعة',
    'Food': 'طعام',
    'Shopping': 'تسوق',
    'Entertainment': 'ترفيه',
    'Religious': 'ديني',
    'Family': 'عائلي',
    'Romantic': 'رومانسي',
    'Photography': 'تصوير',
    'Art': 'فنون',
    'Relaxation': 'استرخاء',
    'Architecture': 'عمارة',
    'Luxury': 'فاخر',
    'Modern': 'حديث',
};

export default function ToursPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    const categories = ['all', ...new Set(tours.flatMap(t => t.category))];
    const difficulties = ['all', 'easy', 'moderate', 'challenging'];

    const filteredTours = tours.filter(tour => {
        const categoryMatch = selectedCategory === 'all' || tour.category.includes(selectedCategory);
        const difficultyMatch = selectedDifficulty === 'all' || tour.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#22c55e';
            case 'moderate': return '#f59e0b';
            case 'challenging': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'سهل';
            case 'moderate': return 'متوسط';
            case 'challenging': return 'صعب';
            default: return difficulty;
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>🗺️ الرحلات المتكاملة</h1>
                    <p>اكتشف الرياض من خلال رحلات مصممة بعناية تأخذك في تجارب فريدة</p>
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>التصنيف:</label>
                    <div className={styles.filterButtons}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={selectedCategory === cat ? styles.active : ''}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === 'all' ? 'الكل' : (categoryMapAr[cat] || cat)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label>المستوى:</label>
                    <div className={styles.filterButtons}>
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                className={selectedDifficulty === diff ? styles.active : ''}
                                onClick={() => setSelectedDifficulty(diff)}
                                style={{
                                    borderColor: diff !== 'all' ? getDifficultyColor(diff) : undefined,
                                }}
                            >
                                {diff === 'all' ? 'الكل' : getDifficultyLabel(diff)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tours Grid */}
            <section className={styles.toursGrid}>
                {filteredTours.map(tour => (
                    <Link key={tour.id} href={`/tours/${tour.id}`} className={styles.tourCard}>
                        <div className={styles.cardImage}>
                            <img src={tour.image} alt={tour.nameAr} />
                            <div className={styles.overlay}>
                                <div className={styles.badge} style={{ background: getDifficultyColor(tour.difficulty) }}>
                                    {getDifficultyLabel(tour.difficulty)}
                                </div>
                                <div className={styles.xpBadge}>
                                    {tour.badge.icon} +{tour.badge.xp} XP
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{tour.nameAr}</h3>
                            <p className={styles.subtitle}>{tour.subtitleAr}</p>
                            <p className={styles.description}>{tour.descriptionAr.slice(0, 100)}...</p>

                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span>⏱️</span>
                                    <span>{Math.floor(tour.duration / 60)} ساعات</span>
                                </div>
                                <div className={styles.stat}>
                                    <span>📍</span>
                                    <span>{tour.waypoints.length} نقاط</span>
                                </div>
                                <div className={styles.stat}>
                                    <span>🚶</span>
                                    <span>{tour.distance} كم</span>
                                </div>
                            </div>

                            <div className={styles.categories}>
                                {tour.categoryAr.map((cat, idx) => (
                                    <span key={idx} className={styles.category}>
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.startPoint}>
                                <span>📍 نقطة البداية:</span>
                                <span>{tour.startPoint.nameAr}</span>
                            </div>
                        </div>
                        <div className={styles.cardFooter}>
                            <button className={styles.startBtn}>
                                ابدأ الرحلة →
                            </button>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Empty State */}
            {filteredTours.length === 0 && (
                <div className={styles.empty}>
                    <span>🔍</span>
                    <h3>لا توجد رحلات</h3>
                    <p>جرب تغيير معايير البحث</p>
                </div>
            )}
        </div>
    );
}
