'use client';

import React, { useState, useEffect } from 'react';
import ARCamera from '@/components/ARCamera';
import styles from './ar.module.css';

interface Place {
    id: string;
    name: string;
    nameAr: string;
    confidence: number;
    matchedFeatures: number;
    description: string;
    descriptionAr: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
}

interface ServiceStatus {
    status: 'online' | 'offline';
    service: string;
    fallback: boolean;
    message?: string;
}

export default function ARExperiencePage() {
    const [language, setLanguage] = useState<'en' | 'ar'>('ar');
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
    const [showInfo, setShowInfo] = useState(true);
    const [discoveredPlaces, setDiscoveredPlaces] = useState<Place[]>([]);
    const [totalScans, setTotalScans] = useState(0);

    // فحص حالة الخدمة
    useEffect(() => {
        async function checkServiceStatus() {
            try {
                const response = await fetch('/api/ar/recognize');
                const status = await response.json();
                setServiceStatus(status);
            } catch {
                setServiceStatus({
                    status: 'offline',
                    service: 'Unknown',
                    fallback: true
                });
            }
        }

        checkServiceStatus();
    }, []);

    // معالجة المكان المعترف به
    const handlePlaceRecognized = (place: Place) => {
        setTotalScans(prev => prev + 1);
        setDiscoveredPlaces(prev => {
            const exists = prev.some(p => p.id === place.id);
            if (!exists) {
                return [...prev, place];
            }
            return prev;
        });
    };

    // إخفاء نافذة المعلومات
    const dismissInfo = () => {
        setShowInfo(false);
    };

    return (
        <div className={styles.container} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className={styles.header}>
                <a href="/" className={styles.backBtn}>
                    {language === 'ar' ? '→' : '←'}
                </a>
                <h1 className={styles.title}>
                    {language === 'ar' ? 'الواقع المعزز' : 'AR Experience'}
                </h1>
                <button
                    className={styles.langBtn}
                    onClick={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
                >
                    {language === 'ar' ? 'EN' : 'عربي'}
                </button>
            </header>

            {/* Service Status Badge */}
            {serviceStatus && (
                <div className={`${styles.statusBadge} ${serviceStatus.status === 'online' ? styles.online : styles.offline}`}>
                    <span className={styles.statusDot}></span>
                    <span>
                        {serviceStatus.status === 'online'
                            ? (language === 'ar' ? 'OpenCV متصل' : 'OpenCV Connected')
                            : (language === 'ar' ? 'وضع تجريبي' : 'Demo Mode')
                        }
                    </span>
                </div>
            )}

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{totalScans}</span>
                    <span className={styles.statLabel}>
                        {language === 'ar' ? 'عمليات المسح' : 'Scans'}
                    </span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{discoveredPlaces.length}</span>
                    <span className={styles.statLabel}>
                        {language === 'ar' ? 'أماكن مكتشفة' : 'Discovered'}
                    </span>
                </div>
            </div>

            {/* AR Camera */}
            <ARCamera
                onPlaceRecognized={handlePlaceRecognized}
                language={language}
                autoScan={false}
                scanInterval={3000}
            />

            {/* Info Modal */}
            {showInfo && (
                <div className={styles.infoModal}>
                    <div className={styles.infoContent}>
                        <button className={styles.closeInfo} onClick={dismissInfo}>×</button>
                        <div className={styles.infoIcon}>📸</div>
                        <h2>
                            {language === 'ar'
                                ? 'مرحباً بك في الواقع المعزز!'
                                : 'Welcome to AR Experience!'}
                        </h2>
                        <p>
                            {language === 'ar'
                                ? 'وجّه كاميرا هاتفك نحو المعالم السياحية في الرياض للحصول على معلومات فورية عنها.'
                                : 'Point your camera at Riyadh landmarks to get instant information about them.'}
                        </p>
                        <div className={styles.infoSteps}>
                            <div className={styles.step}>
                                <span>1</span>
                                <p>{language === 'ar' ? 'وجّه الكاميرا' : 'Point camera'}</p>
                            </div>
                            <div className={styles.step}>
                                <span>2</span>
                                <p>{language === 'ar' ? 'اضغط مسح' : 'Tap scan'}</p>
                            </div>
                            <div className={styles.step}>
                                <span>3</span>
                                <p>{language === 'ar' ? 'استكشف المكان' : 'Explore place'}</p>
                            </div>
                        </div>
                        <button className={styles.startBtn} onClick={dismissInfo}>
                            {language === 'ar' ? 'ابدأ الآن!' : 'Start Now!'}
                        </button>
                    </div>
                </div>
            )}

            {/* Features */}
            <div className={styles.features}>
                <div className={styles.feature}>
                    <span className={styles.featureIcon}>🔍</span>
                    <span>{language === 'ar' ? 'تعرف فوري' : 'Instant Recognition'}</span>
                </div>
                <div className={styles.feature}>
                    <span className={styles.featureIcon}>🗣️</span>
                    <span>{language === 'ar' ? 'دليل صوتي' : 'Audio Guide'}</span>
                </div>
                <div className={styles.feature}>
                    <span className={styles.featureIcon}>🧭</span>
                    <span>{language === 'ar' ? 'اتجاهات' : 'Directions'}</span>
                </div>
            </div>
        </div>
    );
}
