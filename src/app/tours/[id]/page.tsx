"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { tours, Tour, TourWaypoint } from "@/data/tours";
import { useGeolocation, formatDistance } from "@/hooks/useGeolocation";
import { useTextToSpeech, supportedLanguages } from "@/hooks/useTextToSpeech";
import styles from "./tour-detail.module.css";

export default function TourDetailPage() {
    const params = useParams();
    const tourId = params.id as string;

    const tour = tours.find(t => t.id === tourId);

    const [isStarted, setIsStarted] = useState(false);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [visitedWaypoints, setVisitedWaypoints] = useState<Set<string>>(new Set());
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('ar-SA');
    const [showMap, setShowMap] = useState(true);

    const {
        location,
        error: locationError,
        isLoading: isLoadingLocation,
        isWatching,
        startTracking,
        stopTracking,
        calculateDistance,
        getDirections,
    } = useGeolocation({ watchPosition: isStarted, geofenceRadius: 50 });

    const {
        speak,
        stop,
        isSpeaking,
        isSupported: isTTSSupported,
    } = useTextToSpeech();

    const currentWaypoint = tour?.waypoints[currentWaypointIndex];

    // Check if user is near the current waypoint (50m radius)
    const checkProximity = useCallback(() => {
        if (!location || !currentWaypoint || !isStarted) return;

        const distance = calculateDistance(
            location.latitude,
            location.longitude,
            currentWaypoint.latitude,
            currentWaypoint.longitude
        );

        if (distance <= 50 && !visitedWaypoints.has(currentWaypoint.id)) {
            // User arrived at waypoint
            setVisitedWaypoints(prev => new Set([...prev, currentWaypoint.id]));

            // Auto-play audio guide
            const text = selectedLanguage.startsWith('ar')
                ? currentWaypoint.descriptionAr
                : currentWaypoint.description;
            speak(text, { language: selectedLanguage });

            // Check if tour is completed
            if (currentWaypointIndex === (tour?.waypoints.length ?? 0) - 1) {
                setIsCompleted(true);
                // Award badge (in real app, this would call an API)
                console.log('Tour completed! Badge earned:', tour?.badge);
            }
        }
    }, [location, currentWaypoint, isStarted, visitedWaypoints, calculateDistance, speak, selectedLanguage, currentWaypointIndex, tour]);

    useEffect(() => {
        checkProximity();
    }, [checkProximity]);

    const handleStartTour = () => {
        setIsStarted(true);
        startTracking();

        // Speak welcome message
        const welcomeText = selectedLanguage.startsWith('ar')
            ? `مرحباً بك في ${tour?.nameAr}. توجه إلى نقطة البداية: ${tour?.startPoint.nameAr}`
            : `Welcome to ${tour?.name}. Head to the starting point: ${tour?.startPoint.name}`;
        speak(welcomeText, { language: selectedLanguage });
    };

    const handleEndTour = () => {
        setIsStarted(false);
        stopTracking();
        stop();
    };

    const handleNextWaypoint = () => {
        if (tour && currentWaypointIndex < tour.waypoints.length - 1) {
            setCurrentWaypointIndex(prev => prev + 1);
        }
    };

    const handlePrevWaypoint = () => {
        if (currentWaypointIndex > 0) {
            setCurrentWaypointIndex(prev => prev - 1);
        }
    };

    const handleNavigate = () => {
        if (currentWaypoint) {
            getDirections({ lat: currentWaypoint.latitude, lng: currentWaypoint.longitude });
        }
    };

    const handlePlayAudio = () => {
        if (!currentWaypoint) return;

        if (isSpeaking) {
            stop();
            return;
        }

        const text = selectedLanguage.startsWith('ar')
            ? currentWaypoint.descriptionAr
            : currentWaypoint.description;
        speak(text, { language: selectedLanguage });
    };

    const getDistanceToWaypoint = () => {
        if (!location || !currentWaypoint) return null;
        const distance = calculateDistance(
            location.latitude,
            location.longitude,
            currentWaypoint.latitude,
            currentWaypoint.longitude
        );
        return formatDistance(distance, selectedLanguage.startsWith('ar') ? 'ar' : 'en');
    };

    if (!tour) {
        return (
            <div className={styles.notFound}>
                <h1>الرحلة غير موجودة</h1>
                <Link href="/tours">العودة للرحلات</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/tours" className={styles.backBtn}>
                    ← العودة
                </Link>
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className={styles.langSelect}
                >
                    {supportedLanguages.slice(0, 6).map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </header>

            {/* Hero */}
            <section className={styles.hero} style={{ backgroundImage: `url(${tour.image})` }}>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <div className={styles.tourBadge}>
                            {tour.badge.icon} {tour.badge.nameAr}
                        </div>
                        <h1>{tour.nameAr}</h1>
                        <p>{tour.subtitleAr}</p>
                        <div className={styles.tourMeta}>
                            <span>⏱️ {Math.floor(tour.duration / 60)} ساعات</span>
                            <span>📍 {tour.waypoints.length} نقاط</span>
                            <span>🚶 {tour.distance} كم</span>
                            <span className={styles.xp}>⭐ +{tour.badge.xp} XP</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Progress Bar */}
            {isStarted && (
                <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(visitedWaypoints.size / tour.waypoints.length) * 100}%` }}
                        />
                    </div>
                    <span>{visitedWaypoints.size} / {tour.waypoints.length} نقاط</span>
                </div>
            )}

            {/* Tour Content */}
            <main className={styles.main}>
                {!isStarted ? (
                    // Tour Overview
                    <div className={styles.overview}>
                        <section className={styles.section}>
                            <h2>📖 عن الرحلة</h2>
                            <p>{tour.descriptionAr}</p>
                        </section>

                        <section className={styles.section}>
                            <h2>✨ أبرز المعالم</h2>
                            <ul className={styles.highlights}>
                                {tour.highlightsAr.map((highlight, idx) => (
                                    <li key={idx}>{highlight}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>🗺️ نقاط الرحلة</h2>
                            <div className={styles.waypointsList}>
                                {tour.waypoints.map((wp, idx) => (
                                    <div key={wp.id} className={styles.waypointPreview}>
                                        <div className={styles.waypointNumber}>{idx + 1}</div>
                                        <div className={styles.waypointInfo}>
                                            <h4>{wp.nameAr}</h4>
                                            <p>{wp.descriptionAr.slice(0, 80)}...</p>
                                            <span>⏱️ {wp.duration} دقيقة</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>💡 نصائح</h2>
                            <ul className={styles.tips}>
                                {tour.tipsAr.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2>⏰ أفضل وقت للزيارة</h2>
                            <p className={styles.bestTime}>{tour.bestTimeAr}</p>
                        </section>

                        <button onClick={handleStartTour} className={styles.startTourBtn}>
                            🚀 ابدأ الرحلة
                        </button>
                    </div>
                ) : isCompleted ? (
                    // Tour Completed
                    <div className={styles.completed}>
                        <div className={styles.completedIcon}>🎉</div>
                        <h2>مبروك!</h2>
                        <p>لقد أكملت رحلة {tour.nameAr}</p>

                        <div className={styles.earnedBadge}>
                            <span className={styles.badgeIcon}>{tour.badge.icon}</span>
                            <div className={styles.badgeInfo}>
                                <h3>{tour.badge.nameAr}</h3>
                                <p>+{tour.badge.xp} نقطة خبرة</p>
                            </div>
                        </div>

                        <div className={styles.completedActions}>
                            <Link href="/rewards" className={styles.rewardsBtn}>
                                🏆 عرض المكافآت
                            </Link>
                            <Link href="/tours" className={styles.moreToursBtn}>
                                🗺️ المزيد من الرحلات
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Active Tour
                    <div className={styles.activeTour}>
                        {/* Current Waypoint Card */}
                        {currentWaypoint && (
                            <div className={styles.currentWaypoint}>
                                <div className={styles.waypointHeader}>
                                    <span className={styles.waypointStep}>
                                        النقطة {currentWaypointIndex + 1} من {tour.waypoints.length}
                                    </span>
                                    {location && (
                                        <span className={styles.distanceTag}>
                                            📍 {getDistanceToWaypoint()}
                                        </span>
                                    )}
                                </div>

                                <img
                                    src={currentWaypoint.image}
                                    alt={currentWaypoint.nameAr}
                                    className={styles.waypointImage}
                                />

                                <div className={styles.waypointDetails}>
                                    <h2>{currentWaypoint.nameAr}</h2>
                                    <p>{currentWaypoint.descriptionAr}</p>

                                    <div className={styles.activities}>
                                        <h4>الأنشطة:</h4>
                                        <div className={styles.activityTags}>
                                            {currentWaypoint.activitiesAr.map((activity, idx) => (
                                                <span key={idx}>{activity}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.duration}>
                                        ⏱️ الوقت المقترح: {currentWaypoint.duration} دقيقة
                                    </div>
                                </div>

                                {/* Audio Guide */}
                                {isTTSSupported && (
                                    <button
                                        onClick={handlePlayAudio}
                                        className={`${styles.audioBtn} ${isSpeaking ? styles.playing : ''}`}
                                    >
                                        {isSpeaking ? '⏸️ إيقاف الصوت' : '🎧 تشغيل الدليل الصوتي'}
                                    </button>
                                )}

                                {/* Navigation */}
                                <div className={styles.waypointActions}>
                                    <button
                                        onClick={handlePrevWaypoint}
                                        disabled={currentWaypointIndex === 0}
                                        className={styles.navBtn}
                                    >
                                        ← السابق
                                    </button>
                                    <button
                                        onClick={handleNavigate}
                                        className={styles.directionsBtn}
                                    >
                                        🧭 توجه الآن
                                    </button>
                                    <button
                                        onClick={handleNextWaypoint}
                                        disabled={currentWaypointIndex === tour.waypoints.length - 1}
                                        className={styles.navBtn}
                                    >
                                        التالي →
                                    </button>
                                </div>

                                {/* Mark as visited button */}
                                {!visitedWaypoints.has(currentWaypoint.id) && (
                                    <button
                                        onClick={() => {
                                            setVisitedWaypoints(prev => new Set([...prev, currentWaypoint.id]));
                                            if (currentWaypointIndex === tour.waypoints.length - 1) {
                                                setIsCompleted(true);
                                            }
                                        }}
                                        className={styles.markVisitedBtn}
                                    >
                                        ✓ وصلت
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Location Status */}
                        {locationError && (
                            <div className={styles.locationError}>
                                ⚠️ {locationError}
                            </div>
                        )}

                        {isLoadingLocation && (
                            <div className={styles.locationLoading}>
                                📍 جاري تحديد موقعك...
                            </div>
                        )}

                        {/* End Tour Button */}
                        <button onClick={handleEndTour} className={styles.endTourBtn}>
                            إنهاء الرحلة
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
