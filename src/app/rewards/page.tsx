"use client";

import { useState, useEffect } from "react";
import { badges, Badge, levels, getLevelForXp, getNextLevel, getXpProgress, getRarityColor } from "@/data/badges";
import styles from "./rewards.module.css";

// Simulated user data (in real app, this would come from API/database)
const mockUserData = {
    xp: 850,
    earnedBadges: ['first-steps', 'riyadh-explorer', 'nature-lover'],
    visitedPlaces: 8,
    completedTours: 1,
    reviewsWritten: 3,
    points: 1250, // Convertible points for discounts
};

export default function RewardsPage() {
    const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard' | 'wallet'>('badges');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [userData] = useState(mockUserData);

    const currentLevel = getLevelForXp(userData.xp);
    const nextLevel = getNextLevel(userData.xp);
    const xpProgress = getXpProgress(userData.xp);

    const categories = ['all', 'exploration', 'history', 'nature', 'social', 'special', 'seasonal'];

    const filteredBadges = badges.filter(badge =>
        selectedCategory === 'all' || badge.category === selectedCategory
    );

    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, name: 'أحمد السعيد', xp: 4500, level: 7, badges: 15 },
        { rank: 2, name: 'سارة الحربي', xp: 3200, level: 6, badges: 12 },
        { rank: 3, name: 'محمد العتيبي', xp: 2800, level: 6, badges: 11 },
        { rank: 4, name: 'نورة القحطاني', xp: 2100, level: 5, badges: 9 },
        { rank: 5, name: 'أنت', xp: userData.xp, level: currentLevel.level, badges: userData.earnedBadges.length, isCurrentUser: true },
        { rank: 6, name: 'فهد الشمري', xp: 750, level: 4, badges: 6 },
        { rank: 7, name: 'رنا العنزي', xp: 600, level: 3, badges: 5 },
        { rank: 8, name: 'خالد المطيري', xp: 450, level: 3, badges: 4 },
        { rank: 9, name: 'لينا الدوسري', xp: 300, level: 2, badges: 3 },
        { rank: 10, name: 'عمر الزهراني', xp: 150, level: 2, badges: 2 },
    ].sort((a, b) => b.xp - a.xp).map((user, idx) => ({ ...user, rank: idx + 1 }));

    const isBadgeEarned = (badgeId: string) => userData.earnedBadges.includes(badgeId);

    const getBadgeProgress = (badge: Badge): number => {
        // Simplified progress calculation
        if (isBadgeEarned(badge.id)) return 100;

        switch (badge.requirement.type) {
            case 'visit_count':
                return Math.min((userData.visitedPlaces / badge.requirement.target) * 100, 99);
            case 'tour_complete':
                return Math.min((userData.completedTours / badge.requirement.target) * 100, 99);
            default:
                return Math.random() * 60; // Placeholder
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.levelCard}>
                    <div className={styles.levelIcon}>{currentLevel.icon}</div>
                    <div className={styles.levelInfo}>
                        <h2>{currentLevel.nameAr}</h2>
                        <p>المستوى {currentLevel.level}</p>
                    </div>
                    <div className={styles.xpDisplay}>
                        <span className={styles.xpValue}>{userData.xp}</span>
                        <span className={styles.xpLabel}>XP</span>
                    </div>
                </div>

                {nextLevel && (
                    <div className={styles.progressSection}>
                        <div className={styles.progressHeader}>
                            <span>التقدم للمستوى التالي</span>
                            <span>{nextLevel.icon} {nextLevel.nameAr}</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                        <div className={styles.progressMeta}>
                            <span>{userData.xp} / {nextLevel.minXp} XP</span>
                            <span>{Math.round(xpProgress)}%</span>
                        </div>
                    </div>
                )}

                <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{userData.earnedBadges.length}</span>
                        <span className={styles.statLabel}>أوسمة</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{userData.visitedPlaces}</span>
                        <span className={styles.statLabel}>زيارات</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{userData.completedTours}</span>
                        <span className={styles.statLabel}>رحلات</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statValue}>{userData.points}</span>
                        <span className={styles.statLabel}>نقاط</span>
                    </div>
                </div>

                {/* Perks */}
                <div className={styles.perks}>
                    <h3>مزايا المستوى الحالي:</h3>
                    <div className={styles.perksList}>
                        {currentLevel.perksAr.map((perk, idx) => (
                            <span key={idx} className={styles.perk}>✓ {perk}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={activeTab === 'badges' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('badges')}
                >
                    🏅 الأوسمة
                </button>
                <button
                    className={activeTab === 'leaderboard' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    🏆 لوحة الصدارة
                </button>
                <button
                    className={activeTab === 'wallet' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('wallet')}
                >
                    💰 المحفظة
                </button>
            </div>

            {/* Content */}
            <main className={styles.main}>
                {activeTab === 'badges' && (
                    <div className={styles.badgesContent}>
                        {/* Category Filter */}
                        <div className={styles.categoryFilter}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={selectedCategory === cat ? styles.activeCat : ''}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {getCategoryLabel(cat)}
                                </button>
                            ))}
                        </div>

                        {/* Badges Grid */}
                        <div className={styles.badgesGrid}>
                            {filteredBadges.map(badge => {
                                const earned = isBadgeEarned(badge.id);
                                const progress = getBadgeProgress(badge);

                                return (
                                    <div
                                        key={badge.id}
                                        className={`${styles.badgeCard} ${earned ? styles.earned : styles.locked}`}
                                    >
                                        <div
                                            className={styles.badgeRarity}
                                            style={{ background: getRarityColor(badge.rarity) }}
                                        >
                                            {getRarityLabel(badge.rarity)}
                                        </div>

                                        <div className={styles.badgeIcon}>
                                            {earned ? badge.icon : '🔒'}
                                        </div>

                                        <h4>{badge.nameAr}</h4>
                                        <p>{badge.descriptionAr}</p>

                                        <div className={styles.badgeXp}>
                                            +{badge.xpReward} XP
                                        </div>

                                        {!earned && (
                                            <div className={styles.badgeProgress}>
                                                <div
                                                    className={styles.badgeProgressFill}
                                                    style={{ width: `${progress}%` }}
                                                />
                                                <span>{Math.round(progress)}%</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className={styles.leaderboardContent}>
                        <h2>🏆 أكثر السياح استكشافاً للرياض</h2>

                        {/* Top 3 */}
                        <div className={styles.topThree}>
                            {leaderboard.slice(0, 3).map((user, idx) => (
                                <div
                                    key={user.rank}
                                    className={`${styles.topUser} ${styles[`top${idx + 1}`]}`}
                                >
                                    <div className={styles.topRank}>
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                    </div>
                                    <div className={styles.topAvatar}>
                                        {levels.find(l => l.level === user.level)?.icon}
                                    </div>
                                    <h4>{user.name}</h4>
                                    <span className={styles.topXp}>{user.xp.toLocaleString()} XP</span>
                                    <span className={styles.topBadges}>{user.badges} أوسمة</span>
                                </div>
                            ))}
                        </div>

                        {/* Full List */}
                        <div className={styles.leaderList}>
                            {leaderboard.map(user => (
                                <div
                                    key={user.rank}
                                    className={`${styles.leaderRow} ${user.isCurrentUser ? styles.currentUser : ''}`}
                                >
                                    <div className={styles.leaderRank}>
                                        {user.rank <= 3
                                            ? (user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉')
                                            : `#${user.rank}`
                                        }
                                    </div>
                                    <div className={styles.leaderInfo}>
                                        <span className={styles.leaderLevel}>
                                            {levels.find(l => l.level === user.level)?.icon}
                                        </span>
                                        <span className={styles.leaderName}>{user.name}</span>
                                    </div>
                                    <div className={styles.leaderStats}>
                                        <span className={styles.leaderXp}>{user.xp.toLocaleString()} XP</span>
                                        <span className={styles.leaderBadges}>{user.badges} 🏅</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'wallet' && (
                    <WalletTab userData={userData} />
                )}
            </main>
        </div>
    );
}

// Wallet Tab Component
function WalletTab({ userData }: { userData: typeof mockUserData }) {
    const [showQR, setShowQR] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);

    const offers = [
        {
            id: 1,
            partner: 'قرية نجد',
            discount: '15%',
            points: 200,
            description: 'خصم على الوجبة الرئيسية',
            category: 'مطاعم',
            logo: '🍽️',
        },
        {
            id: 2,
            partner: 'متحف الرياض',
            discount: '20%',
            points: 300,
            description: 'خصم على تذكرة الدخول',
            category: 'معالم',
            logo: '🏛️',
        },
        {
            id: 3,
            partner: 'رحلات الوادي',
            discount: '25%',
            points: 500,
            description: 'خصم على جولة وادي حنيفة',
            category: 'جولات',
            logo: '🗺️',
        },
        {
            id: 4,
            partner: 'كافيه بوليفارد',
            discount: '10%',
            points: 100,
            description: 'خصم على المشروبات',
            category: 'مقاهي',
            logo: '☕',
        },
        {
            id: 5,
            partner: 'سبا الرياض',
            discount: '30%',
            points: 800,
            description: 'خصم على جلسة استرخاء',
            category: 'استجمام',
            logo: '🧖',
        },
    ];

    const handleRedeem = (offer: typeof offers[0]) => {
        if (userData.points >= offer.points) {
            setSelectedOffer(offer);
            setShowQR(true);
        }
    };

    const generateQRCode = (offerId: number) => {
        // In real app, this would generate an actual QR code
        return `RIYADH-GUIDE-${offerId}-${Date.now()}`;
    };

    return (
        <div className={styles.walletContent}>
            {/* Balance Card */}
            <div className={styles.balanceCard}>
                <div className={styles.balanceHeader}>
                    <span>💰</span>
                    <h3>رصيد النقاط</h3>
                </div>
                <div className={styles.balanceValue}>
                    {userData.points.toLocaleString()}
                    <span>نقطة</span>
                </div>
                <p className={styles.balanceNote}>
                    اجمع النقاط من زيارة المعالم وإكمال الرحلات
                </p>
            </div>

            {/* Offers */}
            <h3 className={styles.offersTitle}>🎁 العروض المتاحة</h3>
            <div className={styles.offersList}>
                {offers.map(offer => (
                    <div key={offer.id} className={styles.offerCard}>
                        <div className={styles.offerLogo}>{offer.logo}</div>
                        <div className={styles.offerInfo}>
                            <h4>{offer.partner}</h4>
                            <p>{offer.description}</p>
                            <span className={styles.offerCategory}>{offer.category}</span>
                        </div>
                        <div className={styles.offerRight}>
                            <span className={styles.offerDiscount}>{offer.discount}</span>
                            <span className={styles.offerPoints}>{offer.points} نقطة</span>
                            <button
                                onClick={() => handleRedeem(offer)}
                                disabled={userData.points < offer.points}
                                className={styles.redeemBtn}
                            >
                                {userData.points >= offer.points ? 'استبدال' : 'نقاط غير كافية'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* How to Earn */}
            <div className={styles.howToEarn}>
                <h3>💡 كيف تجمع النقاط؟</h3>
                <ul>
                    <li>🏛️ زيارة معلم سياحي = 50 نقطة</li>
                    <li>🗺️ إكمال رحلة = 200 نقطة</li>
                    <li>⭐ كتابة تقييم = 30 نقطة</li>
                    <li>📸 إضافة صور = 20 نقطة</li>
                    <li>🏅 الحصول على وسام = نقاط الوسام</li>
                </ul>
            </div>

            {/* QR Code Modal */}
            {showQR && selectedOffer && (
                <div className={styles.qrModal} onClick={() => setShowQR(false)}>
                    <div className={styles.qrCard} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeQR} onClick={() => setShowQR(false)}>✕</button>
                        <h3>🎉 كود الخصم الخاص بك</h3>
                        <p>{selectedOffer.partner} - {selectedOffer.discount} خصم</p>

                        <div className={styles.qrCode}>
                            {/* Simulated QR Code - in real app use a QR library */}
                            <div className={styles.fakeQR}>
                                <div className={styles.qrPattern}>
                                    {Array(64).fill(0).map((_, i) => (
                                        <span key={i} style={{
                                            background: Math.random() > 0.5 ? '#0f172a' : 'transparent'
                                        }} />
                                    ))}
                                </div>
                            </div>
                            <p className={styles.qrCodeText}>{generateQRCode(selectedOffer.id)}</p>
                        </div>

                        <p className={styles.qrNote}>
                            قدم هذا الكود للشريك للحصول على خصمك
                        </p>
                        <p className={styles.qrExpiry}>
                            صالح لمدة 24 ساعة
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        all: 'الكل',
        exploration: 'استكشاف',
        history: 'تاريخ',
        nature: 'طبيعة',
        social: 'اجتماعي',
        special: 'خاص',
        seasonal: 'موسمي',
    };
    return labels[category] || category;
}

function getRarityLabel(rarity: string): string {
    const labels: Record<string, string> = {
        common: 'عادي',
        rare: 'نادر',
        epic: 'ملحمي',
        legendary: 'أسطوري',
    };
    return labels[rarity] || rarity;
}
