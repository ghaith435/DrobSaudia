"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./time-machine.module.css";

interface TimeMachineProps {
    placeId: string;
    placeName: string;
    currentImage: string;
    historicalData: {
        year: number;
        description: string;
        descriptionAr: string;
        overlayOpacity?: number;
    };
}

// Historical AR data for specific landmarks
export const historicalPlacesData: Record<string, TimeMachineProps['historicalData']> = {
    '1': { // At-Turaif
        year: 1818,
        description: 'At-Turaif during the First Saudi State, when it served as the capital of the Emirate of Diriyah. The mud-brick palaces housed the ruling Al Saud family.',
        descriptionAr: 'حي الطريف خلال الدولة السعودية الأولى، عندما كان عاصمة إمارة الدرعية. كانت القصور الطينية مقراً لعائلة آل سعود الحاكمة.',
    },
    '7': { // National Museum
        year: 1950,
        description: 'The historical area before the museum was built, showing traditional Najdi architecture and marketplaces.',
        descriptionAr: 'المنطقة التاريخية قبل بناء المتحف، تظهر العمارة النجدية التقليدية والأسواق.',
    },
    '2': { // Kingdom Tower
        year: 1990,
        description: 'The area before Kingdom Tower was built, showing the transformation of Olaya district from residential to commercial.',
        descriptionAr: 'المنطقة قبل بناء برج المملكة، تُظهر تحول حي العليا من سكني إلى تجاري.',
    },
};

export default function TimeMachine({
    placeId,
    placeName,
    currentImage,
    historicalData,
}: TimeMachineProps) {
    const [isActive, setIsActive] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isVideoMode, setIsVideoMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle camera for AR mode
    useEffect(() => {
        if (isVideoMode && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error('Camera access denied:', err);
                    setIsVideoMode(false);
                });
        }

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isVideoMode]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, x)));
    };

    const toggleARMode = async () => {
        if (!isActive) {
            // Check camera permission
            try {
                const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                if (permission.state === 'denied') {
                    alert('يرجى السماح بالوصول للكاميرا لاستخدام العدسة التاريخية');
                    return;
                }
            } catch (e) {
                // Permission API not supported, try directly
            }
        }
        setIsActive(!isActive);
    };

    return (
        <div className={styles.container}>
            {/* Toggle Button */}
            <button
                onClick={toggleARMode}
                className={`${styles.toggleBtn} ${isActive ? styles.active : ''}`}
            >
                <span className={styles.icon}>🔮</span>
                <span className={styles.label}>
                    {isActive ? 'إغلاق العدسة التاريخية' : 'العدسة التاريخية'}
                </span>
            </button>

            {/* AR View */}
            {isActive && (
                <div className={styles.arView}>
                    <div className={styles.arHeader}>
                        <h3>🏛️ العدسة التاريخية - {placeName}</h3>
                        <div className={styles.modeToggle}>
                            <button
                                className={!isVideoMode ? styles.activeMode : ''}
                                onClick={() => setIsVideoMode(false)}
                            >
                                🖼️ صورة
                            </button>
                            <button
                                className={isVideoMode ? styles.activeMode : ''}
                                onClick={() => setIsVideoMode(true)}
                            >
                                📷 كاميرا
                            </button>
                        </div>
                    </div>

                    {/* Image Comparison Mode */}
                    {!isVideoMode && (
                        <div
                            ref={containerRef}
                            className={styles.comparison}
                            onMouseMove={handleMouseMove}
                        >
                            {/* Current Image (Background) */}
                            <div className={styles.currentImage}>
                                <img src={currentImage} alt="الحاضر" />
                                <span className={styles.yearLabel}>٢٠٢٦</span>
                            </div>

                            {/* Historical Overlay */}
                            <div
                                className={styles.historicalImage}
                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                            >
                                {/* Sepia filter to simulate old photo */}
                                <img
                                    src={currentImage}
                                    alt={`سنة ${historicalData.year}`}
                                    style={{
                                        filter: 'sepia(80%) contrast(90%) brightness(85%)',
                                    }}
                                />
                                <div className={styles.historicalOverlay}>
                                    {/* Historic elements overlay - in real app, this would be an actual historical image */}
                                    <div className={styles.vintageEffect} />
                                </div>
                                <span className={styles.yearLabel}>{historicalData.year}</span>
                            </div>

                            {/* Slider */}
                            <div
                                className={styles.slider}
                                style={{ left: `${sliderPosition}%` }}
                            >
                                <div className={styles.sliderHandle}>
                                    <span>◀</span>
                                    <span>▶</span>
                                </div>
                            </div>

                            {/* Slider Input (for accessibility) */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderPosition}
                                onChange={handleSliderChange}
                                className={styles.sliderInput}
                            />
                        </div>
                    )}

                    {/* Camera AR Mode */}
                    {isVideoMode && (
                        <div className={styles.cameraView}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={styles.cameraFeed}
                            />
                            <div className={styles.arOverlay}>
                                <div className={styles.scanningEffect}>
                                    <span>🔍</span>
                                    <p>وجّه الكاميرا نحو المعلم</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Historical Description */}
                    <div className={styles.description}>
                        <div className={styles.yearBadge}>
                            {historicalData.year} م
                        </div>
                        <p>{historicalData.descriptionAr}</p>
                    </div>

                    {/* Timeline */}
                    <div className={styles.timeline}>
                        <span className={styles.timelineStart}>{historicalData.year}</span>
                        <div className={styles.timelineLine}>
                            <div
                                className={styles.timelineProgress}
                                style={{ width: `${sliderPosition}%` }}
                            />
                        </div>
                        <span className={styles.timelineEnd}>2026</span>
                    </div>

                    {/* Info Note */}
                    <div className={styles.infoNote}>
                        <span>ℹ️</span>
                        <p>
                            العدسة التاريخية تعرض تقريباً كيف كان المكان في الماضي.
                            الصور التاريخية الفعلية قيد الإضافة.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Widget for place detail pages
export function TimeMachineWidget({ placeId, placeName, currentImage }: {
    placeId: string;
    placeName: string;
    currentImage: string;
}) {
    const historicalData = historicalPlacesData[placeId];

    if (!historicalData) {
        return null; // No historical data for this place
    }

    return (
        <TimeMachine
            placeId={placeId}
            placeName={placeName}
            currentImage={currentImage}
            historicalData={historicalData}
        />
    );
}
