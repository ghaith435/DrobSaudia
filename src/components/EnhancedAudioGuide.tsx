/**
 * Enhanced Audio Guide Component
 * مكون الدليل الصوتي المحسن
 * 
 * Features:
 * - Documentary + Narrative combined styles
 * - Sub-tours for large landmarks
 * - AI-generated + Manual content
 * - TTS with professional recording fallback
 * - VR integration for camera-based audio
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./enhanced-audio-guide.module.css";

type ContentStyle = 'documentary' | 'narrative' | 'combined';
type ContentSource = 'ai_generated' | 'manual' | 'tourism_authority';

interface SubTour {
    id: string;
    title: string;
    description: string;
    duration: string;
}

interface VRHotspot {
    id: string;
    name: string;
    audioScript: string;
    position: { x: number; y: number; z: number };
}

interface AudioGuideData {
    script: string;
    documentaryScript?: string;
    narrativeScript?: string;
    voiceConfig: {
        lang: string;
        rate: number;
        pitch: number;
    };
    audioUrl?: string;
    professionalAudioUrl?: string;
    ttsAudioUrl?: string;
    contentSource: ContentSource;
    sourceReference?: string;
    vrEnabled?: boolean;
    vrHotspots?: VRHotspot[];
    subTours?: SubTour[];
}

interface EnhancedAudioGuideProps {
    placeId?: string;
    tourId?: string;
    stopId?: string;
    placeName: string;
    placeNameAr?: string;
    showSubTours?: boolean;
    showVROption?: boolean;
    onVRRequest?: () => void;
}

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
];

const STYLES: { id: ContentStyle; name: string; nameAr: string; icon: string }[] = [
    { id: 'combined', name: 'Full Experience', nameAr: 'تجربة كاملة', icon: '🎭' },
    { id: 'documentary', name: 'Facts & History', nameAr: 'حقائق وتاريخ', icon: '📚' },
    { id: 'narrative', name: 'Storytelling', nameAr: 'سرد قصصي', icon: '✨' },
];

export default function EnhancedAudioGuide({
    placeId,
    tourId,
    stopId,
    placeName,
    placeNameAr,
    showSubTours = true,
    showVROption = true,
    onVRRequest
}: EnhancedAudioGuideProps) {
    const [language, setLanguage] = useState("ar");
    const [style, setStyle] = useState<ContentStyle>("combined");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioData, setAudioData] = useState<AudioGuideData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showStyles, setShowStyles] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentSubTour, setCurrentSubTour] = useState<SubTour | null>(null);
    const [audioSource, setAudioSource] = useState<'tts' | 'professional'>('tts');

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const isArabic = language === "ar";

    // Fetch audio guide data
    const fetchAudioGuide = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                language,
                style,
                includeVR: 'true'
            });

            if (tourId) {
                params.set('tourId', tourId);
                if (stopId) params.set('stopId', stopId);
            } else if (placeId) {
                params.set('placeId', placeId);
            }

            const response = await fetch(`/api/audio-guide?${params}`);
            const data = await response.json();

            if (data.success) {
                setAudioData(data.data);
                return data.data;
            } else {
                throw new Error(data.error || "Failed to fetch audio guide");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Play professional audio if available
    const playProfessionalAudio = async (data: AudioGuideData) => {
        const audioUrl = data.professionalAudioUrl || data.audioUrl;
        if (!audioUrl) return false;

        try {
            if (!audioRef.current) {
                audioRef.current = new Audio();
            }

            audioRef.current.src = audioUrl;
            audioRef.current.onplay = () => {
                setIsPlaying(true);
                setAudioSource('professional');
            };
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setProgress(100);
            };
            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    setProgress(prog);
                }
            };
            audioRef.current.onerror = () => {
                // Fallback to TTS
                playTTS(data.script);
            };

            await audioRef.current.play();
            return true;
        } catch (err) {
            console.warn("Professional audio failed, falling back to TTS");
            return false;
        }
    };

    // Play TTS
    const playTTS = (text: string) => {
        if (!("speechSynthesis" in window)) {
            playTTSFallback(text);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = audioData?.voiceConfig.lang || (isArabic ? 'ar-SA' : 'en-US');
        utterance.rate = audioData?.voiceConfig.rate || 1;
        utterance.pitch = audioData?.voiceConfig.pitch || 1;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setAudioSource('tts');
        };
        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
        };
        utterance.onpause = () => setIsPaused(true);
        utterance.onresume = () => setIsPaused(false);
        utterance.onerror = () => playTTSFallback(text);
        utterance.onboundary = (event) => {
            if (event.name === "word") {
                const percentage = Math.round((event.charIndex / text.length) * 100);
                setProgress(percentage);
            }
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    // TTS fallback via API
    const playTTSFallback = async (text: string) => {
        try {
            const lang = isArabic ? 'ar' : 'en';
            const chunks = splitTextIntoChunks(text, 200);
            let currentChunk = 0;

            const playNextChunk = async () => {
                if (currentChunk >= chunks.length) {
                    setIsPlaying(false);
                    setProgress(100);
                    return;
                }

                const audio = new Audio(`/api/tts?text=${encodeURIComponent(chunks[currentChunk])}&lang=${lang}`);
                audio.onended = () => {
                    currentChunk++;
                    setProgress(Math.round((currentChunk / chunks.length) * 100));
                    playNextChunk();
                };
                audio.onerror = () => {
                    setError(isArabic ? "خدمة الصوت غير متوفرة" : "Audio service unavailable");
                    setIsPlaying(false);
                };

                await audio.play();
            };

            setIsPlaying(true);
            setAudioSource('tts');
            setProgress(0);
            playNextChunk();
        } catch (err) {
            setError(isArabic ? "فشل تشغيل الصوت" : "Failed to play audio");
            setIsPlaying(false);
        }
    };

    // Split text into chunks for TTS
    const splitTextIntoChunks = (text: string, maxChars: number): string[] => {
        const chunks: string[] = [];
        let remaining = text;

        while (remaining.length > 0) {
            if (remaining.length <= maxChars) {
                chunks.push(remaining);
                break;
            }
            let splitAt = remaining.lastIndexOf('.', maxChars);
            if (splitAt === -1 || splitAt < 50) splitAt = remaining.lastIndexOf(' ', maxChars);
            if (splitAt === -1 || splitAt < 50) splitAt = maxChars;
            chunks.push(remaining.substring(0, splitAt + 1));
            remaining = remaining.substring(splitAt + 1).trim();
        }

        return chunks;
    };

    // Start playing
    const startPlaying = async () => {
        const data = await fetchAudioGuide();
        if (!data) return;

        // Try professional audio first
        const playedProfessional = await playProfessionalAudio(data);

        // Fallback to TTS if no professional audio
        if (!playedProfessional) {
            playTTS(data.script);
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        if (!isPlaying && !isPaused) {
            startPlaying();
        } else if (isPaused) {
            if (audioSource === 'professional' && audioRef.current) {
                audioRef.current.play();
            } else {
                window.speechSynthesis.resume();
            }
            setIsPaused(false);
        } else {
            if (audioSource === 'professional' && audioRef.current) {
                audioRef.current.pause();
            } else {
                window.speechSynthesis.pause();
            }
            setIsPaused(true);
        }
    };

    // Stop playback
    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
    };

    // Play sub-tour
    const playSubTour = async (subTour: SubTour) => {
        stop();
        setCurrentSubTour(subTour);

        // Fetch sub-tour specific content
        const params = new URLSearchParams({
            language,
            style,
            subTourId: subTour.id
        });
        if (tourId) params.set('tourId', tourId);
        if (stopId) params.set('stopId', stopId);

        try {
            const response = await fetch(`/api/audio-guide?${params}`);
            const data = await response.json();
            if (data.success) {
                setAudioData(data.data);
                playTTS(data.data.script);
            }
        } catch (err) {
            setError(isArabic ? "فشل تحميل الجولة الفرعية" : "Failed to load sub-tour");
        }
    };

    // Get content source label
    const getSourceLabel = () => {
        if (!audioData) return '';
        switch (audioData.contentSource) {
            case 'tourism_authority':
                return isArabic ? '📋 هيئة السياحة' : '📋 Tourism Authority';
            case 'ai_generated':
                return isArabic ? '🤖 محتوى ذكي' : '🤖 AI Generated';
            case 'manual':
                return isArabic ? '✍️ محتوى مكتوب' : '✍️ Manual Content';
            default:
                return '';
        }
    };

    const selectedLang = LANGUAGES.find(l => l.code === language);
    const selectedStyle = STYLES.find(s => s.id === style);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.icon}>🎧</div>
                <div className={styles.titleGroup}>
                    <h3 className={styles.title}>
                        {isArabic ? "الدليل الصوتي المتقدم" : "Enhanced Audio Guide"}
                    </h3>
                    <p className={styles.subtitle}>
                        {isArabic ? placeNameAr || placeName : placeName}
                    </p>
                </div>
            </div>

            {/* Selectors Row */}
            <div className={styles.selectorsRow}>
                {/* Language Selector */}
                <div className={styles.selectorWrapper}>
                    <button
                        className={styles.selectorBtn}
                        onClick={() => {
                            setShowLanguages(!showLanguages);
                            setShowStyles(false);
                        }}
                        disabled={isPlaying}
                    >
                        <span>{selectedLang?.flag}</span>
                        <span>{selectedLang?.name}</span>
                        <span className={styles.arrow}>▼</span>
                    </button>

                    {showLanguages && (
                        <div className={styles.dropdown}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`${styles.dropdownItem} ${language === lang.code ? styles.selected : ''}`}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setShowLanguages(false);
                                        setAudioData(null);
                                    }}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Style Selector */}
                <div className={styles.selectorWrapper}>
                    <button
                        className={styles.selectorBtn}
                        onClick={() => {
                            setShowStyles(!showStyles);
                            setShowLanguages(false);
                        }}
                        disabled={isPlaying}
                    >
                        <span>{selectedStyle?.icon}</span>
                        <span>{isArabic ? selectedStyle?.nameAr : selectedStyle?.name}</span>
                        <span className={styles.arrow}>▼</span>
                    </button>

                    {showStyles && (
                        <div className={styles.dropdown}>
                            {STYLES.map(s => (
                                <button
                                    key={s.id}
                                    className={`${styles.dropdownItem} ${style === s.id ? styles.selected : ''}`}
                                    onClick={() => {
                                        setStyle(s.id);
                                        setShowStyles(false);
                                        setAudioData(null);
                                    }}
                                >
                                    <span>{s.icon}</span>
                                    <span>{isArabic ? s.nameAr : s.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className={styles.error}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Progress Bar */}
            {(isPlaying || progress > 0) && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    <span className={styles.progressLabel}>
                        {audioSource === 'professional'
                            ? (isArabic ? '🎙️ تسجيل احترافي' : '🎙️ Professional')
                            : (isArabic ? '🔊 TTS' : '🔊 TTS')
                        }
                    </span>
                </div>
            )}

            {/* Main Controls */}
            <div className={styles.mainControls}>
                <button
                    className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
                    onClick={togglePlayPause}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.spinner}>⏳</span>
                    ) : isPlaying && !isPaused ? (
                        <>⏸️ {isArabic ? "إيقاف مؤقت" : "Pause"}</>
                    ) : isPaused ? (
                        <>▶️ {isArabic ? "استئناف" : "Resume"}</>
                    ) : (
                        <>▶️ {isArabic ? "تشغيل" : "Play Guide"}</>
                    )}
                </button>

                {(isPlaying || isPaused) && (
                    <button className={styles.stopBtn} onClick={stop}>
                        ⏹️ {isArabic ? "إيقاف" : "Stop"}
                    </button>
                )}

                {showVROption && (
                    <button className={styles.vrBtn} onClick={onVRRequest}>
                        📷 {isArabic ? "VR" : "VR"}
                    </button>
                )}
            </div>

            {/* Sub-Tours */}
            {showSubTours && audioData?.subTours && audioData.subTours.length > 0 && (
                <div className={styles.subToursSection}>
                    <h4>{isArabic ? "🗺️ الجولات الفرعية" : "🗺️ Sub-Tours"}</h4>
                    <div className={styles.subToursList}>
                        {audioData.subTours.map(subTour => (
                            <button
                                key={subTour.id}
                                className={`${styles.subTourCard} ${currentSubTour?.id === subTour.id ? styles.active : ''}`}
                                onClick={() => playSubTour(subTour)}
                            >
                                <span className={styles.subTourIcon}>📍</span>
                                <div className={styles.subTourInfo}>
                                    <span className={styles.subTourTitle}>{subTour.title}</span>
                                    <span className={styles.subTourDuration}>{subTour.duration}</span>
                                </div>
                                {currentSubTour?.id === subTour.id && isPlaying && (
                                    <span className={styles.playingBadge}>🔊</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Source */}
            {audioData && (
                <div className={styles.sourceInfo}>
                    <span>{getSourceLabel()}</span>
                    {audioData.sourceReference && (
                        <span className={styles.sourceRef}>{audioData.sourceReference}</span>
                    )}
                </div>
            )}

            {/* Features */}
            <div className={styles.features}>
                <div className={styles.feature}>
                    <span>📚</span>
                    <span>{isArabic ? "توثيقي" : "Documentary"}</span>
                </div>
                <div className={styles.feature}>
                    <span>✨</span>
                    <span>{isArabic ? "قصصي" : "Narrative"}</span>
                </div>
                <div className={styles.feature}>
                    <span>🌍</span>
                    <span>{isArabic ? "5 لغات" : "5 Languages"}</span>
                </div>
                <div className={styles.feature}>
                    <span>🎙️</span>
                    <span>{isArabic ? "صوت احترافي" : "Pro Audio"}</span>
                </div>
            </div>
        </div>
    );
}
