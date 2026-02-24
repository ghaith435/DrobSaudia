'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { activitiesData, Activity } from './activities';
import styles from './planner.module.css';
import Link from 'next/link';

// Import map dynamically
const InteractiveMap = dynamic(
    () => import('@/components/maps/InteractiveMap'),
    { ssr: false, loading: () => <div className={styles.mapLoading}><div className={styles.spinner}></div></div> }
);

interface TripPreferences {
    duration: number; // days
    interests: string[];
    budget: 'budget' | 'moderate' | 'luxury';
    pace: 'relaxed' | 'moderate' | 'active';
    travelWith: 'solo' | 'couple' | 'family' | 'friends';
    startDate?: string;
}

interface GeneratedItinerary {
    day: number;
    title: string;
    activities: (Activity & {
        time: string;
        tips?: string;
    })[];
}

const interestOptions = [
    { id: 'history', label: 'التاريخ والتراث', icon: '🏛️' },
    { id: 'nature', label: 'الطبيعة والمغامرة', icon: '🌿' },
    { id: 'shopping', label: 'التسوق', icon: '🛍️' },
    { id: 'food', label: 'الطعام والمطاعم', icon: '🍽️' },
    { id: 'entertainment', label: 'الترفيه والفعاليات', icon: '🎭' },
    { id: 'architecture', label: 'العمارة الحديثة', icon: '🏙️' },
];

export default function TripPlannerPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedItinerary[] | null>(null);
    const [activeDay, setActiveDay] = useState(1);
    const [preferences, setPreferences] = useState<TripPreferences>({
        duration: 3,
        interests: [],
        budget: 'moderate',
        pace: 'moderate',
        travelWith: 'solo',
    });

    const toggleInterest = (id: string) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id]
        }));
    };

    const generateItinerary = async () => {
        setIsGenerating(true);
        // Simulate API delay
        setTimeout(() => {
            setGeneratedPlan(generateSmartItinerary(preferences));
            setIsGenerating(false);
            setStep(4);
        }, 3000);
    };

    const nextStep = () => {
        if (step === 3) {
            generateItinerary();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const resetPlanner = () => {
        setStep(1);
        setGeneratedPlan(null);
        setActiveDay(1);
        setPreferences({
            duration: 3,
            interests: [],
            budget: 'moderate',
            pace: 'moderate',
            travelWith: 'solo',
        });
    };

    // Get current day markers
    const getDayMarkers = () => {
        if (!generatedPlan) return [];
        const dayPlan = generatedPlan.find(d => d.day === activeDay);
        if (!dayPlan) return [];

        return dayPlan.activities.map((activity, idx) => ({
            id: activity.id,
            position: activity.coordinates,
            title: activity.place,
            description: activity.time,
            icon: 'destination' as const,
        }));
    };

    // Get current day route
    const getDayRoute = () => {
        const markers = getDayMarkers();
        if (markers.length < 2) return undefined;
        return {
            coordinates: markers.map(m => m.position),
            color: '#10b981',
        };
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1>🤖 مخطط الرحلات الذكي</h1>
                        <p>دع الذكاء الاصطناعي يخطط لك رحلة مفصلة حسب رغباتك</p>
                    </div>
                    <Link href="/" className={styles.backBtn}>
                        ← الرئيسية
                    </Link>
                </div>
            </header>

            {/* Progress Bar */}
            {step < 4 && !isGenerating && (
                <div className={styles.progress}>
                    <div className={styles.progressSteps}>
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                className={`${styles.progressStep} ${s <= step ? styles.activeStep : ''}`}
                            >
                                <span className={styles.stepNumber}>{s}</span>
                                <div className={styles.stepLabelContainer}>
                                    <span className={styles.stepLabel}>
                                        {s === 1 ? 'المدة' : s === 2 ? 'الاهتمامات' : 'التفضيلات'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step Content */}
            <main className={styles.main}>
                {step === 1 && (
                    <div className={styles.stepContent}>
                        <h2>📅 كم يوماً ستقضي في الرياض؟</h2>

                        <div className={styles.durationSelector}>
                            {[1, 2, 3, 4, 5, 7].map(days => (
                                <button
                                    key={days}
                                    className={preferences.duration === days ? styles.selected : ''}
                                    onClick={() => setPreferences(prev => ({ ...prev, duration: days }))}
                                >
                                    <span className={styles.durationNumber}>{days}</span>
                                    <span className={styles.durationLabel}>
                                        {days === 1 ? 'يوم' : days === 2 ? 'يومان' : 'أيام'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.dateInputWrapper}>
                            <label>تاريخ الوصول (اختياري)</label>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={preferences.startDate || ''}
                                onChange={(e) => setPreferences(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <h2>✨ ما هي اهتماماتك؟</h2>
                        <p className={styles.stepHint}>اختر ما تحب لنقوم بتخصيص الرحلة لك</p>

                        <div className={styles.interestsGrid}>
                            {interestOptions.map(interest => (
                                <button
                                    key={interest.id}
                                    className={`${styles.interestCard} ${preferences.interests.includes(interest.id) ? styles.selected : ''}`}
                                    onClick={() => toggleInterest(interest.id)}
                                >
                                    <span className={styles.interestIcon}>{interest.icon}</span>
                                    <span className={styles.interestLabel}>{interest.label}</span>
                                    {preferences.interests.includes(interest.id) && (
                                        <span className={styles.checkmark}>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepContent}>
                        <h2>⚙️ تفضيلات إضافية</h2>

                        <div className={styles.preferencesGrid}>
                            <div className={styles.preferenceGroup}>
                                <label>👛 الميزانية</label>
                                <div className={styles.optionButtons}>
                                    {[
                                        { value: 'budget', label: 'اقتصادي', icon: '💵' },
                                        { value: 'moderate', label: 'متوسط', icon: '💳' },
                                        { value: 'luxury', label: 'فاخر', icon: '💎' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            className={preferences.budget === opt.value ? styles.selected : ''}
                                            onClick={() => setPreferences(prev => ({ ...prev, budget: opt.value as any }))}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.preferenceGroup}>
                                <label>🏃 وتيرة الرحلة</label>
                                <div className={styles.optionButtons}>
                                    {[
                                        { value: 'relaxed', label: 'مريحة', icon: '🧘' },
                                        { value: 'moderate', label: 'متوازنة', icon: '⚖️' },
                                        { value: 'active', label: 'نشيطة', icon: '🔥' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            className={preferences.pace === opt.value ? styles.selected : ''}
                                            onClick={() => setPreferences(prev => ({ ...prev, pace: opt.value as any }))}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.preferenceGroup}>
                                <label>👥 السفر مع</label>
                                <div className={styles.optionButtons}>
                                    {[
                                        { value: 'solo', label: 'منفرد', icon: '👤' },
                                        { value: 'couple', label: 'زوجين', icon: '💑' },
                                        { value: 'family', label: 'عائلة', icon: '👨‍👩‍👧‍👦' },
                                        { value: 'friends', label: 'أصدقاء', icon: '👫' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            className={preferences.travelWith === opt.value ? styles.selected : ''}
                                            onClick={() => setPreferences(prev => ({ ...prev, travelWith: opt.value as any }))}
                                        >
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && generatedPlan && (
                    <div className={styles.resultContainer}>
                        {/* Sidebar with timeline */}
                        <div className={styles.planSidebar}>
                            <div className={styles.planHeader}>
                                <h2>🎉 خطة رحلتك المقترحة</h2>
                                <p>{preferences.duration} أيام • {interestOptions.find(i => i.id === (preferences.interests[0] || 'history'))?.label || 'منوعة'}</p>
                            </div>

                            <div className={styles.dayTabs}>
                                {generatedPlan.map(day => (
                                    <button
                                        key={day.day}
                                        className={`${styles.dayTab} ${activeDay === day.day ? styles.active : ''}`}
                                        onClick={() => setActiveDay(day.day)}
                                    >
                                        اليوم {day.day}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.timelineScroll}>
                                {generatedPlan.find(d => d.day === activeDay)?.activities.map((activity, idx) => (
                                    <div key={idx} className={styles.timelineItem}>
                                        <div className={styles.timeColumn}>
                                            <span className={styles.time}>{activity.time}</span>
                                            <div className={styles.line}></div>
                                        </div>
                                        <div className={styles.activityCard}>
                                            <div className={styles.activityHeader}>
                                                <h4>{activity.place}</h4>
                                                <span className={styles.categoryBadge}>{activity.categoryAr}</span>
                                            </div>
                                            <p className={styles.activityDesc}>{activity.description}</p>
                                            <div className={styles.activityMeta}>
                                                <span title="المدة"><span className={styles.icon}>⏱️</span> {activity.duration}</span>
                                                <span title="السعر"><span className={styles.icon}>💵</span> {activity.priceLevel === 'free' ? 'مجاني' : activity.priceLevel === 'high' ? 'فاخر' : 'متوسط'}</span>
                                            </div>
                                            {activity.tips && (
                                                <div className={styles.tipBox}>
                                                    💡 {activity.tips}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.actions}>
                                <button onClick={resetPlanner} className={styles.resetBtn}>
                                    🔄 تصميم جديد
                                </button>
                                <button className={styles.saveBtn}>
                                    💾 حفظ الخطة
                                </button>
                            </div>
                        </div>

                        {/* Map View */}
                        <div className={styles.mapView}>
                            <InteractiveMap
                                markers={getDayMarkers()}
                                route={getDayRoute()}
                                fitBounds={true}
                                center={[24.7136, 46.6753]}
                                zoom={11}
                            />
                            <div className={styles.mapOverlay}>
                                <span>🗺️ خريطة اليوم {activeDay}</span>
                            </div>
                        </div>
                    </div>
                )}

                {isGenerating && (
                    <div className={styles.loadingState}>
                        <div className={styles.aiAvatar}>
                            <div className={styles.pulseRing}></div>
                            <span className={styles.aiEmoji}>🤖</span>
                        </div>
                        <h3>جاري تصميم خطة مثالية لك...</h3>
                        <p>نقوم بمطابقة اهتماماتك مع أفضل الوجهات في الرياض</p>
                        <div className={styles.loadingSteps}>
                            <span>تحليل التفضيلات...</span>
                            <span>اختيار الأماكن...</span>
                            <span>تحسين المسار...</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Navigation Buttons */}
            {step < 4 && !isGenerating && (
                <div className={styles.navigation}>
                    {step > 1 && (
                        <button onClick={prevStep} className={styles.prevBtn}>
                            رجوع
                        </button>
                    )}
                    <button
                        onClick={nextStep}
                        className={styles.nextBtn}
                        disabled={step === 2 && preferences.interests.length === 0}
                    >
                        {step === 3 ? '✨ إنشاء رحلتي' : 'التالي'}
                    </button>
                </div>
            )}
        </div>
    );
}

// Logic to generate smart itinerary
function generateSmartItinerary(prefs: TripPreferences): GeneratedItinerary[] {
    const days: GeneratedItinerary[] = [];
    const usedPlaceIds = new Set<string>();

    // Sort interests or default to general ones
    const interests = prefs.interests.length > 0
        ? [...prefs.interests]
        : ['history', 'nature', 'shopping', 'food']; // Default mix

    // Ensure we rotate through interests
    let interestIndex = 0;

    for (let d = 1; d <= prefs.duration; d++) {
        const dayActivities: GeneratedItinerary['activities'] = [];

        // Morning Activity (9:00 or 10:00)
        let morningInterest = interests[interestIndex % interests.length];
        let morningActivity = findActivity(morningInterest, 'morning', usedPlaceIds);

        if (!morningActivity) {
            // Fallback
            morningActivity = findActivity('history', 'morning', usedPlaceIds);
        }

        if (morningActivity) {
            dayActivities.push({
                ...morningActivity,
                time: '09:30',
                tips: getTipsForActivity(morningActivity)
            });
            usedPlaceIds.add(morningActivity.id);
        }

        // Lunch Break (Logic placeholder) 

        // Afternoon Activity (16:00)
        interestIndex++;
        let afternoonInterest = interests[interestIndex % interests.length];
        let afternoonActivity = findActivity(afternoonInterest, 'afternoon', usedPlaceIds);

        if (!afternoonActivity) {
            // Fallback to shopping or architecture as they are good for afternoon/indoors
            afternoonActivity = findActivity('shopping', undefined, usedPlaceIds);
        }

        if (afternoonActivity) {
            dayActivities.push({
                ...afternoonActivity,
                time: '16:00',
            });
            usedPlaceIds.add(afternoonActivity.id);
        }

        // Evening Activity (20:00)
        interestIndex++;
        let eveningInterest = interests[interestIndex % interests.length];
        // Prefer Food or Entertainment for evening
        if (!['food', 'entertainment', 'shopping'].includes(eveningInterest)) {
            eveningInterest = 'food';
        }

        let eveningActivity = findActivity(eveningInterest, 'evening', usedPlaceIds);

        if (eveningActivity) {
            dayActivities.push({
                ...eveningActivity,
                time: '20:00',
                tips: 'ينصح بالحجز المسبق'
            });
            usedPlaceIds.add(eveningActivity.id);
        }

        days.push({
            day: d,
            title: getDayTitle(d, prefs.duration),
            activities: dayActivities
        });
    }

    return days;
}

function findActivity(interest: string, time?: string, usedIds?: Set<string>): Activity | undefined {
    const list = activitiesData[interest];
    if (!list) return undefined;

    // Try to find matching time and unused
    let candidates = list.filter(a => !usedIds?.has(a.id));

    if (time) {
        const timeMatches = candidates.filter(a => a.bestTime === time);
        if (timeMatches.length > 0) return timeMatches[0];
    }

    return candidates[0];
}

function getTipsForActivity(activity: Activity): string {
    if (activity.category === 'nature') return 'ينصح بإحضار ماء وحذاء مريح';
    if (activity.category === 'history') return 'الدخول يحتاج تذكرة أحياناً';
    return '';
}

function getDayTitle(day: number, total: number): string {
    if (day === 1) return 'الوصول والاستكشاف';
    if (day === total) return 'جولة وداعية وتسوق';
    return `استكشاف عميق`;
}
