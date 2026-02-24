"use client";

import { useState, useEffect } from "react";
import styles from "./info-card.module.css";
import { useTextToSpeech, supportedLanguages } from "@/hooks/useTextToSpeech";

interface Place {
    id: string;
    name: string;
    nameAr?: string;
    description: string;
    descriptionAr?: string;
    image: string;
    gallery?: string[];
    rating: number;
    reviewCount?: number;
    category: string;
    price: string;
    address?: string;
    latitude: number;
    longitude: number;
    openingHours?: string;
    phone?: string;
    website?: string;
    features?: string[];
    placeId?: string; // Google Place ID for live data
}

interface InfoCardProps {
    place: Place;
    isOpen: boolean;
    onClose: () => void;
    userLocation?: { lat: number; lng: number } | null;
    language?: 'en' | 'ar';
}

interface PlaceDetails {
    opening_hours?: {
        open_now: boolean;
        weekday_text: string[];
    };
    formatted_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    photos?: Array<{ photo_reference: string }>;
}

export default function InfoCard({
    place,
    isOpen,
    onClose,
    userLocation,
    language = 'ar',
}: InfoCardProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'reviews'>('info');
    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(language === 'ar' ? 'ar-SA' : 'en-US');

    const { speak, stop, isSpeaking, isPaused, pause, resume, isSupported } = useTextToSpeech();

    const images = [place.image, ...(place.gallery || [])];

    // Fetch live data from Google Places API
    useEffect(() => {
        if (!isOpen || !place.placeId) return;

        const fetchPlaceDetails = async () => {
            setIsLoadingDetails(true);
            try {
                const response = await fetch(`/api/places/google?placeId=${place.placeId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlaceDetails(data);
                }
            } catch (error) {
                console.error('Error fetching place details:', error);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchPlaceDetails();
    }, [isOpen, place.placeId]);

    // Calculate distance from user
    const calculateDistance = (): string | null => {
        if (!userLocation) return null;

        const R = 6371; // Earth's radius in km
        const dLat = ((place.latitude - userLocation.lat) * Math.PI) / 180;
        const dLon = ((place.longitude - userLocation.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLocation.lat * Math.PI) / 180) *
            Math.cos((place.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < 1) {
            return language === 'ar'
                ? `${Math.round(distance * 1000)} متر`
                : `${Math.round(distance * 1000)}m`;
        }
        return language === 'ar'
            ? `${distance.toFixed(1)} كم`
            : `${distance.toFixed(1)}km`;
    };

    // Handle directions
    const handleGetDirections = () => {
        const origin = userLocation
            ? `${userLocation.lat},${userLocation.lng}`
            : 'current+location';
        const destination = `${place.latitude},${place.longitude}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(url, '_blank');
    };

    // Handle audio guide
    const handleAudioGuide = () => {
        if (isSpeaking) {
            if (isPaused) {
                resume();
            } else {
                pause();
            }
            return;
        }

        const text = selectedLanguage.startsWith('ar')
            ? place.descriptionAr || place.description
            : place.description;

        const historicalContext = language === 'ar'
            ? `مرحباً بك في ${place.nameAr || place.name}. ${text}`
            : `Welcome to ${place.name}. ${text}`;

        speak(historicalContext, { language: selectedLanguage });
    };

    const stopAudio = () => {
        stop();
    };

    // Get opening status
    const getOpeningStatus = () => {
        if (placeDetails?.opening_hours) {
            return placeDetails.opening_hours.open_now;
        }
        return null;
    };

    if (!isOpen) return null;

    const distance = calculateDistance();
    const openStatus = getOpeningStatus();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.card} onClick={(e) => e.stopPropagation()}>
                {/* Header with Image Gallery */}
                <div className={styles.imageContainer}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    <img
                        src={images[currentImageIndex]}
                        alt={place.name}
                        className={styles.mainImage}
                    />

                    {/* Category Badge */}
                    <div className={styles.categoryBadge}>
                        {getCategoryIcon(place.category)} {place.category}
                    </div>

                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <div className={styles.imageNav}>
                            <button
                                onClick={() => setCurrentImageIndex(prev =>
                                    prev === 0 ? images.length - 1 : prev - 1
                                )}
                            >
                                ❮
                            </button>
                            <span>{currentImageIndex + 1} / {images.length}</span>
                            <button
                                onClick={() => setCurrentImageIndex(prev =>
                                    prev === images.length - 1 ? 0 : prev + 1
                                )}
                            >
                                ❯
                            </button>
                        </div>
                    )}

                    {/* Quick Info Overlay */}
                    <div className={styles.quickInfo}>
                        <h2>{language === 'ar' ? place.nameAr || place.name : place.name}</h2>
                        <div className={styles.meta}>
                            <span className={styles.rating}>⭐ {place.rating}</span>
                            {place.reviewCount && (
                                <span className={styles.reviews}>
                                    ({place.reviewCount.toLocaleString()} {language === 'ar' ? 'تقييم' : 'reviews'})
                                </span>
                            )}
                            <span className={styles.price}>{place.price}</span>
                            {distance && <span className={styles.distance}>📍 {distance}</span>}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'info' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('info')}
                    >
                        {language === 'ar' ? 'معلومات' : 'Info'}
                    </button>
                    <button
                        className={activeTab === 'photos' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('photos')}
                    >
                        {language === 'ar' ? 'صور' : 'Photos'}
                    </button>
                    <button
                        className={activeTab === 'reviews' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        {language === 'ar' ? 'تقييمات' : 'Reviews'}
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'info' && (
                        <div className={styles.infoContent}>
                            {/* Opening Status */}
                            <div className={styles.statusRow}>
                                {openStatus !== null && (
                                    <span className={openStatus ? styles.open : styles.closed}>
                                        {openStatus
                                            ? (language === 'ar' ? '🟢 مفتوح الآن' : '🟢 Open Now')
                                            : (language === 'ar' ? '🔴 مغلق' : '🔴 Closed')
                                        }
                                    </span>
                                )}
                                {place.openingHours && (
                                    <span className={styles.hours}>
                                        🕐 {place.openingHours}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className={styles.description}>
                                <h3>{language === 'ar' ? 'نبذة تاريخية' : 'Historical Summary'}</h3>
                                <p>{language === 'ar' ? place.descriptionAr || place.description : place.description}</p>
                            </div>

                            {/* Audio Guide Section */}
                            {isSupported && (
                                <div className={styles.audioGuide}>
                                    <h3>{language === 'ar' ? '🎧 الدليل الصوتي' : '🎧 Audio Guide'}</h3>
                                    <div className={styles.audioControls}>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className={styles.languageSelect}
                                        >
                                            {supportedLanguages.map(lang => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.flag} {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAudioGuide}
                                            className={styles.playBtn}
                                        >
                                            {isSpeaking
                                                ? (isPaused ? '▶️' : '⏸️')
                                                : '▶️'
                                            }
                                            {isSpeaking
                                                ? (isPaused
                                                    ? (language === 'ar' ? 'استئناف' : 'Resume')
                                                    : (language === 'ar' ? 'إيقاف مؤقت' : 'Pause')
                                                )
                                                : (language === 'ar' ? 'تشغيل' : 'Play')
                                            }
                                        </button>
                                        {isSpeaking && (
                                            <button onClick={stopAudio} className={styles.stopBtn}>
                                                ⏹️ {language === 'ar' ? 'إيقاف' : 'Stop'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {place.features && place.features.length > 0 && (
                                <div className={styles.features}>
                                    <h3>{language === 'ar' ? 'المميزات' : 'Features'}</h3>
                                    <div className={styles.featuresList}>
                                        {place.features.map((feature, idx) => (
                                            <span key={idx} className={styles.featureTag}>
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className={styles.contactInfo}>
                                {place.address && (
                                    <div className={styles.contactItem}>
                                        <span>📍</span>
                                        <span>{place.address}</span>
                                    </div>
                                )}
                                {(place.phone || placeDetails?.formatted_phone_number) && (
                                    <div className={styles.contactItem}>
                                        <span>📞</span>
                                        <a href={`tel:${placeDetails?.formatted_phone_number || place.phone}`}>
                                            {placeDetails?.formatted_phone_number || place.phone}
                                        </a>
                                    </div>
                                )}
                                {(place.website || placeDetails?.website) && (
                                    <div className={styles.contactItem}>
                                        <span>🌐</span>
                                        <a
                                            href={placeDetails?.website || place.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {language === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className={styles.photosGrid}>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${place.name} - ${idx + 1}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={currentImageIndex === idx ? styles.activePhoto : ''}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className={styles.reviewsSection}>
                            <div className={styles.ratingOverview}>
                                <div className={styles.bigRating}>
                                    {placeDetails?.rating || place.rating}
                                </div>
                                <div className={styles.stars}>
                                    {'⭐'.repeat(Math.floor(placeDetails?.rating || place.rating))}
                                </div>
                                <div className={styles.totalReviews}>
                                    {(placeDetails?.user_ratings_total || place.reviewCount || 0).toLocaleString()} {language === 'ar' ? 'تقييم' : 'reviews'}
                                </div>
                            </div>
                            <p className={styles.reviewsNote}>
                                {language === 'ar'
                                    ? 'التقييمات مقدمة من خرائط جوجل'
                                    : 'Reviews powered by Google Maps'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button onClick={handleGetDirections} className={styles.directionsBtn}>
                        🧭 {language === 'ar' ? 'ابدأ التوجه' : 'Get Directions'}
                    </button>
                    <button className={styles.saveBtn}>
                        ❤️ {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    <button className={styles.shareBtn}>
                        📤 {language === 'ar' ? 'مشاركة' : 'Share'}
                    </button>
                </div>

                {isLoadingDetails && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        'History': '🏛️',
        'Modern': '🏙️',
        'Shopping': '🛍️',
        'Dining': '🍽️',
        'Entertainment': '🎭',
        'Nature': '🌿',
    };
    return icons[category] || '📍';
}
