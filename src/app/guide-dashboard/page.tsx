'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './dashboard.module.css';

interface GuideProfile {
    id: string;
    displayName: string;
    displayNameAr?: string;
    avatar?: string;
    certificationStatus: string;
    rating: number;
    totalReviews: number;
    totalExperiences: number;
    totalBookings: number;
    isVerified: boolean;
}

interface Booking {
    id: string;
    bookingNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    status: string;
    totalAmount: number;
    experience: {
        id: string;
        title: string;
        titleAr?: string;
        coverImage?: string;
    };
}

interface Experience {
    id: string;
    title: string;
    titleAr?: string;
    coverImage?: string;
    category: string;
    status: string;
    rating: number;
    totalBookings: number;
    basePrice: number;
}

// Mock data for demonstration
const mockProfile: GuideProfile = {
    id: '1',
    displayName: 'Ahmed Al-Rashid',
    displayNameAr: 'أحمد الراشد',
    avatar: '/images/guides/ahmed.jpg',
    certificationStatus: 'CERTIFIED',
    rating: 4.9,
    totalReviews: 127,
    totalExperiences: 8,
    totalBookings: 342,
    isVerified: true
};

const mockBookings: Booking[] = [
    {
        id: '1',
        bookingNumber: 'REXP-2026-A3F8K',
        date: '2026-01-25',
        startTime: '09:00',
        endTime: '12:00',
        guestCount: 4,
        status: 'PENDING',
        totalAmount: 600,
        experience: {
            id: 'exp1',
            title: 'Diriyah Heritage Walk',
            coverImage: '/images/diriyah.jpg'
        }
    },
    {
        id: '2',
        bookingNumber: 'REXP-2026-B7G2M',
        date: '2026-01-26',
        startTime: '14:00',
        endTime: '17:00',
        guestCount: 2,
        status: 'CONFIRMED',
        totalAmount: 350,
        experience: {
            id: 'exp2',
            title: 'Saudi Culinary Journey',
            coverImage: '/images/culinary.jpg'
        }
    },
    {
        id: '3',
        bookingNumber: 'REXP-2026-C9H4P',
        date: '2026-01-24',
        startTime: '10:00',
        endTime: '13:00',
        guestCount: 6,
        status: 'COMPLETED',
        totalAmount: 900,
        experience: {
            id: 'exp3',
            title: 'KAFD Modern Architecture Tour',
            coverImage: '/images/kafd.jpg'
        }
    }
];

const mockExperiences: Experience[] = [
    {
        id: 'exp1',
        title: 'Diriyah Heritage Walk',
        coverImage: '/images/diriyah.jpg',
        category: 'HISTORY',
        status: 'APPROVED',
        rating: 4.8,
        totalBookings: 156,
        basePrice: 150
    },
    {
        id: 'exp2',
        title: 'Saudi Culinary Journey',
        coverImage: '/images/culinary.jpg',
        category: 'CULINARY',
        status: 'APPROVED',
        rating: 4.9,
        totalBookings: 98,
        basePrice: 200
    },
    {
        id: 'exp3',
        title: 'KAFD Modern Architecture Tour',
        coverImage: '/images/kafd.jpg',
        category: 'CULTURAL',
        status: 'DRAFT',
        rating: 0,
        totalBookings: 0,
        basePrice: 180
    }
];

export default function GuideDashboard() {
    const [profile] = useState<GuideProfile>(mockProfile);
    const [bookings] = useState<Booking[]>(mockBookings);
    const [experiences] = useState<Experience[]>(mockExperiences);
    const [earnings] = useState({
        thisMonth: 12450,
        pending: 2800,
        withdrawn: 9650,
        commission: 1868
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PENDING': return styles.pending;
            case 'CONFIRMED': return styles.confirmed;
            case 'COMPLETED': return styles.completed;
            case 'CANCELLED': return styles.cancelled;
            default: return '';
        }
    };

    const getExperienceStatusClass = (status: string) => {
        switch (status) {
            case 'APPROVED': return styles.active;
            case 'DRAFT': return styles.draft;
            case 'PENDING_REVIEW': return styles.pending;
            default: return '';
        }
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Image
                            src={profile.avatar || '/images/default-avatar.png'}
                            alt={profile.displayName}
                            width={80}
                            height={80}
                            className={styles.avatar}
                        />
                        <div className={styles.headerInfo}>
                            <h1>
                                {profile.displayName}
                                {profile.isVerified && (
                                    <span className={styles.verifiedBadge}>
                                        ✓ Verified Guide
                                    </span>
                                )}
                            </h1>
                            <div className={styles.headerStatus}>
                                <span className={`${styles.statusItem} ${styles.gold}`}>
                                    ⭐ {profile.rating.toFixed(1)} ({profile.totalReviews} reviews)
                                </span>
                                <span className={styles.statusItem}>
                                    🎯 {profile.totalExperiences} experiences
                                </span>
                                <span className={styles.statusItem}>
                                    📅 {profile.totalBookings} bookings
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <Link href="/experience-creator" className={`${styles.btn} ${styles.btnPrimary}`}>
                            ✨ Create Experience
                        </Link>
                        <button className={`${styles.btn} ${styles.btnSecondary}`}>
                            ⚙️ Settings
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.blue}`}>📅</div>
                        <div className={styles.statValue}>
                            {bookings.filter(b => b.status === 'PENDING').length}
                        </div>
                        <div className={styles.statLabel}>Pending Bookings</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            ↑ 2 from yesterday
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.green}`}>✓</div>
                        <div className={styles.statValue}>
                            {bookings.filter(b => b.status === 'CONFIRMED').length}
                        </div>
                        <div className={styles.statLabel}>Confirmed This Week</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            ↑ 12% vs last week
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.gold}`}>⭐</div>
                        <div className={styles.statValue}>{profile.rating}</div>
                        <div className={styles.statLabel}>Average Rating</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            Top 5% of guides
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.purple}`}>👁️</div>
                        <div className={styles.statValue}>1.2K</div>
                        <div className={styles.statLabel}>Profile Views</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            ↑ 23% this month
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className={styles.mainGrid}>
                    {/* Main Content */}
                    <div>
                        {/* Bookings Section */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    📋 Recent Bookings
                                </h2>
                                <Link href="/guide-dashboard/bookings" className={styles.sectionAction}>
                                    View All →
                                </Link>
                            </div>

                            <div className={styles.bookingsList}>
                                {bookings.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>📭</div>
                                        <p className={styles.emptyText}>No bookings yet</p>
                                    </div>
                                ) : (
                                    bookings.map((booking) => (
                                        <div key={booking.id} className={styles.bookingCard}>
                                            <div className={styles.bookingHeader}>
                                                <div>
                                                    <h3 className={styles.bookingTitle}>
                                                        {booking.experience.title}
                                                    </h3>
                                                    <p className={styles.bookingDate}>
                                                        {formatDate(booking.date)} • {booking.startTime} - {booking.endTime}
                                                    </p>
                                                </div>
                                                <span className={`${styles.bookingStatus} ${getStatusClass(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className={styles.bookingMeta}>
                                                <span>👥 {booking.guestCount} guests</span>
                                                <span>💰 {booking.totalAmount} SAR</span>
                                                <span>🎫 {booking.bookingNumber}</span>
                                            </div>

                                            {booking.status === 'PENDING' && (
                                                <div className={styles.bookingActions}>
                                                    <button className={`${styles.actionBtn} ${styles.accept}`}>
                                                        ✓ Accept
                                                    </button>
                                                    <button className={`${styles.actionBtn} ${styles.decline}`}>
                                                        ✕ Decline
                                                    </button>
                                                    <button className={`${styles.actionBtn} ${styles.message}`}>
                                                        💬 Message
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Experiences Section */}
                        <section className={styles.section} style={{ marginTop: '2rem' }}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    🎯 My Experiences
                                </h2>
                                <Link href="/experience-creator" className={styles.sectionAction}>
                                    + Create New
                                </Link>
                            </div>

                            <div className={styles.experiencesList}>
                                {experiences.map((exp) => (
                                    <div key={exp.id} className={styles.experienceCard}>
                                        <Image
                                            src={exp.coverImage || '/images/placeholder-experience.jpg'}
                                            alt={exp.title}
                                            width={80}
                                            height={80}
                                            className={styles.experienceImage}
                                        />
                                        <div className={styles.experienceContent}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 className={styles.experienceTitle}>{exp.title}</h3>
                                                    <p className={styles.experienceCategory}>{exp.category}</p>
                                                </div>
                                                <span className={`${styles.experienceStatus} ${getExperienceStatusClass(exp.status)}`}>
                                                    {exp.status === 'APPROVED' ? 'Active' : exp.status}
                                                </span>
                                            </div>
                                            <div className={styles.experienceStats}>
                                                <span>⭐ {exp.rating > 0 ? exp.rating.toFixed(1) : 'New'}</span>
                                                <span>📅 {exp.totalBookings} bookings</span>
                                                <span>💰 {exp.basePrice} SAR</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        {/* Earnings Card */}
                        <div className={styles.earningsCard}>
                            <p className={styles.earningsHeader}>This Month&apos;s Earnings</p>
                            <h2 className={styles.earningsValue}>
                                {earnings.thisMonth.toLocaleString()} <small>SAR</small>
                            </h2>
                            <p className={styles.earningsPeriod}>January 2026</p>

                            <div className={styles.earningsBreakdown}>
                                <div className={styles.breakdownItem}>
                                    <span>Pending Payout</span>
                                    <span>{earnings.pending.toLocaleString()} SAR</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span>Withdrawn</span>
                                    <span>{earnings.withdrawn.toLocaleString()} SAR</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span>Platform Fee (15%)</span>
                                    <span>-{earnings.commission.toLocaleString()} SAR</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Widget */}
                        <div className={styles.calendarWidget}>
                            <div className={styles.calendarHeader}>
                                <h3 className={styles.calendarTitle}>📅 Upcoming</h3>
                                <div className={styles.calendarNav}>
                                    <button>‹</button>
                                    <button>›</button>
                                </div>
                            </div>

                            <div className={styles.upcomingList}>
                                {bookings
                                    .filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED')
                                    .slice(0, 3)
                                    .map((booking) => {
                                        const date = new Date(booking.date);
                                        return (
                                            <div key={booking.id} className={styles.upcomingItem}>
                                                <div className={styles.upcomingDate}>
                                                    <div className={styles.upcomingDay}>{date.getDate()}</div>
                                                    <div className={styles.upcomingMonth}>
                                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                                    </div>
                                                </div>
                                                <div className={styles.upcomingInfo}>
                                                    <div className={styles.upcomingTitle}>{booking.experience.title}</div>
                                                    <div className={styles.upcomingTime}>
                                                        {booking.startTime} • {booking.guestCount} guests
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>⚡ Quick Actions</h3>
                            <div className={styles.quickActions}>
                                <Link href="/experience-creator" className={styles.quickAction}>
                                    <span>✨</span>
                                    <span>New Experience</span>
                                </Link>
                                <button className={styles.quickAction}>
                                    <span>📊</span>
                                    <span>Analytics</span>
                                </button>
                                <button className={styles.quickAction}>
                                    <span>💬</span>
                                    <span>Messages</span>
                                </button>
                                <button className={styles.quickAction}>
                                    <span>📸</span>
                                    <span>Upload Media</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
