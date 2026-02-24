"use client";

import { useState, useEffect } from "react";
import styles from "./crowd-indicator.module.css";

interface CrowdLevel {
    level: 'low' | 'moderate' | 'high' | 'very_high';
    percentage: number;
    label: string;
    labelAr: string;
    color: string;
    recommendation: string;
    recommendationAr: string;
}

interface CrowdIndicatorProps {
    placeId: string;
    placeName: string;
    className?: string;
    compact?: boolean;
}

const crowdLevels: Record<CrowdLevel['level'], Omit<CrowdLevel, 'percentage'>> = {
    low: {
        level: 'low',
        label: 'Low Crowd',
        labelAr: 'ازدحام منخفض',
        color: '#22c55e',
        recommendation: 'Perfect time to visit!',
        recommendationAr: 'وقت مثالي للزيارة!',
    },
    moderate: {
        level: 'moderate',
        label: 'Moderate Crowd',
        labelAr: 'ازدحام متوسط',
        color: '#f59e0b',
        recommendation: 'Good time to visit',
        recommendationAr: 'وقت جيد للزيارة',
    },
    high: {
        level: 'high',
        label: 'High Crowd',
        labelAr: 'ازدحام عالي',
        color: '#ef4444',
        recommendation: 'Consider visiting later',
        recommendationAr: 'فكر في الزيارة لاحقاً',
    },
    very_high: {
        level: 'very_high',
        label: 'Very Crowded',
        labelAr: 'مزدحم جداً',
        color: '#dc2626',
        recommendation: 'Peak hours - expect long waits',
        recommendationAr: 'ساعات الذروة - توقع انتظاراً طويلاً',
    },
};

// Simulated crowd prediction based on time of day and day of week
function predictCrowdLevel(placeId: string, time: Date): CrowdLevel {
    const hour = time.getHours();
    const day = time.getDay();
    const isWeekend = day === 5 || day === 6; // Friday & Saturday

    // Base crowd patterns
    let percentage: number;

    // Morning (6-10)
    if (hour >= 6 && hour < 10) {
        percentage = isWeekend ? 25 : 15;
    }
    // Mid-morning (10-12)
    else if (hour >= 10 && hour < 12) {
        percentage = isWeekend ? 45 : 35;
    }
    // Lunch (12-14)
    else if (hour >= 12 && hour < 14) {
        percentage = isWeekend ? 55 : 50;
    }
    // Afternoon (14-16)
    else if (hour >= 14 && hour < 16) {
        percentage = isWeekend ? 40 : 30;
    }
    // Evening (16-20)
    else if (hour >= 16 && hour < 20) {
        percentage = isWeekend ? 85 : 70;
    }
    // Night (20-24)
    else if (hour >= 20 && hour < 24) {
        percentage = isWeekend ? 95 : 75;
    }
    // Late night / early morning
    else {
        percentage = 10;
    }

    // Add some randomness based on placeId
    const placeModifier = (parseInt(placeId, 10) || 1) * 3 % 20 - 10;
    percentage = Math.max(5, Math.min(100, percentage + placeModifier));

    // Determine level
    let level: CrowdLevel['level'];
    if (percentage < 30) level = 'low';
    else if (percentage < 55) level = 'moderate';
    else if (percentage < 80) level = 'high';
    else level = 'very_high';

    return {
        ...crowdLevels[level],
        percentage,
    };
}

export default function CrowdIndicator({
    placeId,
    placeName,
    className = '',
    compact = false,
}: CrowdIndicatorProps) {
    const [crowdData, setCrowdData] = useState<CrowdLevel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [hourlyPrediction, setHourlyPrediction] = useState<{ hour: number; percentage: number }[]>([]);

    useEffect(() => {
        // Simulate API call to get crowd data
        const fetchCrowdData = async () => {
            setIsLoading(true);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const now = new Date();
            const crowd = predictCrowdLevel(placeId, now);
            setCrowdData(crowd);

            // Generate hourly prediction
            const hourly = [];
            for (let h = 6; h <= 23; h++) {
                const futureTime = new Date();
                futureTime.setHours(h, 0, 0, 0);
                const prediction = predictCrowdLevel(placeId, futureTime);
                hourly.push({ hour: h, percentage: prediction.percentage });
            }
            setHourlyPrediction(hourly);

            setIsLoading(false);
        };

        fetchCrowdData();

        // Update every 5 minutes
        const interval = setInterval(() => {
            const now = new Date();
            const crowd = predictCrowdLevel(placeId, now);
            setCrowdData(crowd);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [placeId]);

    if (isLoading) {
        return (
            <div className={`${styles.container} ${className} ${compact ? styles.compact : ''}`}>
                <div className={styles.loading}>
                    <div className={styles.loadingDot} />
                    <span>جاري تحليل الازدحام...</span>
                </div>
            </div>
        );
    }

    if (!crowdData) return null;

    const currentHour = new Date().getHours();

    return (
        <div
            className={`${styles.container} ${className} ${compact ? styles.compact : ''}`}
            onClick={() => !compact && setShowDetails(!showDetails)}
        >
            {/* Main Indicator */}
            <div className={styles.indicator}>
                <div
                    className={styles.levelBadge}
                    style={{ background: crowdData.color }}
                >
                    <span className={styles.levelIcon}>
                        {crowdData.level === 'low' && '😊'}
                        {crowdData.level === 'moderate' && '🙂'}
                        {crowdData.level === 'high' && '😟'}
                        {crowdData.level === 'very_high' && '😰'}
                    </span>
                    <span className={styles.levelText}>{crowdData.labelAr}</span>
                </div>

                {!compact && (
                    <div className={styles.percentageBar}>
                        <div
                            className={styles.percentageFill}
                            style={{
                                width: `${crowdData.percentage}%`,
                                background: crowdData.color,
                            }}
                        />
                        <span className={styles.percentageText}>
                            {crowdData.percentage}%
                        </span>
                    </div>
                )}
            </div>

            {/* Details Panel */}
            {!compact && showDetails && (
                <div className={styles.details}>
                    <div className={styles.recommendation}>
                        <span className={styles.recommendationIcon}>💡</span>
                        <span>{crowdData.recommendationAr}</span>
                    </div>

                    {/* Hourly Chart */}
                    <div className={styles.hourlyChart}>
                        <h4>توقعات الازدحام اليوم</h4>
                        <div className={styles.chartBars}>
                            {hourlyPrediction.map(({ hour, percentage }) => {
                                let barColor = '#22c55e';
                                if (percentage >= 80) barColor = '#dc2626';
                                else if (percentage >= 55) barColor = '#ef4444';
                                else if (percentage >= 30) barColor = '#f59e0b';

                                return (
                                    <div
                                        key={hour}
                                        className={`${styles.chartBar} ${hour === currentHour ? styles.currentHour : ''}`}
                                    >
                                        <div
                                            className={styles.bar}
                                            style={{
                                                height: `${percentage}%`,
                                                background: barColor,
                                            }}
                                        />
                                        <span className={styles.hourLabel}>
                                            {hour > 12 ? hour - 12 : hour}
                                            {hour >= 12 ? 'م' : 'ص'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Best Times */}
                    <div className={styles.bestTimes}>
                        <h4>أفضل أوقات الزيارة</h4>
                        <div className={styles.timeSuggestions}>
                            {hourlyPrediction
                                .filter(h => h.percentage < 30)
                                .slice(0, 3)
                                .map(({ hour }) => (
                                    <span key={hour} className={styles.timeBadge}>
                                        {hour > 12 ? hour - 12 : hour}:00
                                        {hour >= 12 ? ' م' : ' ص'}
                                    </span>
                                ))
                            }
                            {hourlyPrediction.filter(h => h.percentage < 30).length === 0 && (
                                <span className={styles.noLowCrowd}>
                                    اليوم مزدحم - حاول الزيارة في يوم آخر
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Live Data Notice */}
                    <div className={styles.liveNotice}>
                        <span className={styles.liveDot} />
                        بيانات محدثة كل 5 دقائق
                    </div>
                </div>
            )}

            {/* Compact Tooltip */}
            {compact && (
                <div className={styles.tooltip}>
                    <div className={styles.tooltipContent}>
                        <strong>{crowdData.labelAr}</strong>
                        <p>{crowdData.recommendationAr}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Hook for getting crowd data
export function useCrowdLevel(placeId: string) {
    const [crowdLevel, setCrowdLevel] = useState<CrowdLevel | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const crowd = predictCrowdLevel(placeId, new Date());
        setCrowdLevel(crowd);
        setIsLoading(false);

        const interval = setInterval(() => {
            const newCrowd = predictCrowdLevel(placeId, new Date());
            setCrowdLevel(newCrowd);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [placeId]);

    return { crowdLevel, isLoading };
}
