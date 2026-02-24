/**
 * VR Audio Guide Integration Component
 * مكون دمج الواقع الافتراضي مع الإرشاد الصوتي
 * 
 * Features:
 * - Camera-based place recognition
 * - Audio narration when pointing at landmarks
 * - VR hotspots with audio descriptions
 * - Multi-language TTS support
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./vr-audio-guide.module.css";

interface VRHotspot {
    id: string;
    name: string;
    nameAr: string;
    audioScript: string;
    audioScriptAr: string;
    position: { x: number; y: number; z: number };
    detected?: boolean;
}

interface VRAudioGuideProps {
    tourId?: string;
    stopId?: string;
    hotspots?: VRHotspot[];
    language?: string;
    onHotspotDetected?: (hotspot: VRHotspot) => void;
}

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function VRAudioGuide({
    tourId,
    stopId,
    hotspots = [],
    language: initialLanguage = "ar",
    onHotspotDetected
}: VRAudioGuideProps) {
    const [language, setLanguage] = useState(initialLanguage);
    const [isActive, setIsActive] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [currentHotspot, setCurrentHotspot] = useState<VRHotspot | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const [detectedPlaces, setDetectedPlaces] = useState<VRHotspot[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isArabic = language === "ar";

    // Initialize camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: 1280, height: 720 }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setCameraPermission(true);
                setIsActive(true);
                setError(null);
            }
        } catch (err) {
            console.error("Camera error:", err);
            setCameraPermission(false);
            setError(isArabic ? "فشل في الوصول للكاميرا" : "Failed to access camera");
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsActive(false);
        stopScanning();
    };

    // Capture frame for analysis
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        return canvas.toDataURL("image/jpeg", 0.8);
    }, []);

    // Analyze frame to detect places
    const analyzeFrame = useCallback(async () => {
        if (!isActive || isPlaying) return;

        const frameData = captureFrame();
        if (!frameData) return;

        try {
            // Call AR recognition API
            const response = await fetch("/api/ar/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: frameData,
                    language
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.place) {
                    const matchedHotspot = hotspots.find(h =>
                        h.name.toLowerCase().includes(data.place.name.toLowerCase()) ||
                        h.nameAr.includes(data.place.nameAr)
                    );

                    if (matchedHotspot && matchedHotspot.id !== currentHotspot?.id) {
                        setCurrentHotspot(matchedHotspot);
                        setDetectedPlaces(prev => {
                            if (!prev.find(p => p.id === matchedHotspot.id)) {
                                return [...prev, matchedHotspot];
                            }
                            return prev;
                        });
                        onHotspotDetected?.(matchedHotspot);
                    }
                }
            }
        } catch (err) {
            console.warn("Frame analysis error:", err);
        }
    }, [isActive, isPlaying, captureFrame, hotspots, currentHotspot, language, onHotspotDetected]);

    // Start scanning
    const startScanning = () => {
        if (scanIntervalRef.current) return;

        setIsScanning(true);
        scanIntervalRef.current = setInterval(analyzeFrame, 2000); // Scan every 2 seconds
    };

    // Stop scanning
    const stopScanning = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        setIsScanning(false);
    };

    // Play audio for hotspot
    const playHotspotAudio = async (hotspot: VRHotspot) => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
        }

        const script = isArabic ? hotspot.audioScriptAr : hotspot.audioScript;

        if (!script) {
            // Fetch from API if no script
            try {
                const response = await fetch(
                    `/api/audio-guide?tourId=${tourId}&stopId=${stopId}&language=${language}&includeVR=true`
                );
                const data = await response.json();
                if (data.success && data.data.vrHotspots) {
                    const vrHotspot = data.data.vrHotspots.find((h: any) => h.id === hotspot.id);
                    if (vrHotspot) {
                        speakText(vrHotspot.audioScript);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch hotspot audio:", err);
            }
            return;
        }

        speakText(script);
    };

    // TTS function
    const speakText = (text: string) => {
        if (!("speechSynthesis" in window)) {
            playTTSFallback(text);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isArabic ? "ar-SA" : "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
            setIsPlaying(false);
            playTTSFallback(text);
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    // TTS fallback using API
    const playTTSFallback = async (text: string) => {
        try {
            const lang = isArabic ? "ar" : "en";
            const audio = new Audio(`/api/tts?text=${encodeURIComponent(text.substring(0, 200))}&lang=${lang}`);

            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => setIsPlaying(false);

            await audio.play();
        } catch (err) {
            console.error("TTS fallback error:", err);
            setIsPlaying(false);
        }
    };

    // Stop audio
    const stopAudio = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
            stopAudio();
        };
    }, []);

    // Toggle language
    const toggleLanguage = () => {
        setLanguage(prev => prev === "ar" ? "en" : "ar");
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <span className={styles.icon}>🎯</span>
                    <div>
                        <h3 className={styles.title}>
                            {isArabic ? "الإرشاد الصوتي بالواقع المعزز" : "VR Audio Guide"}
                        </h3>
                        <p className={styles.subtitle}>
                            {isArabic
                                ? "وجه الكاميرا نحو المعلم للحصول على معلومات صوتية"
                                : "Point camera at landmark for audio info"
                            }
                        </p>
                    </div>
                </div>

                <button className={styles.langBtn} onClick={toggleLanguage}>
                    {isArabic ? "🇸🇦" : "🇺🇸"}
                </button>
            </div>

            {/* Camera View */}
            {!isActive ? (
                <div className={styles.startSection}>
                    <div className={styles.startIcon}>📷</div>
                    <p>
                        {isArabic
                            ? "ابدأ الكاميرا لاكتشاف المعالم تلقائياً"
                            : "Start camera to automatically discover landmarks"
                        }
                    </p>
                    <button className={styles.primaryBtn} onClick={startCamera}>
                        {isArabic ? "🎥 بدء الكاميرا" : "🎥 Start Camera"}
                    </button>
                </div>
            ) : (
                <div className={styles.cameraSection}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={styles.video}
                    />
                    <canvas ref={canvasRef} className={styles.canvas} />

                    {/* Scan Overlay */}
                    {isScanning && (
                        <div className={styles.scanOverlay}>
                            <div className={styles.scanFrame}>
                                <div className={`${styles.corner} ${styles.topLeft}`} />
                                <div className={`${styles.corner} ${styles.topRight}`} />
                                <div className={`${styles.corner} ${styles.bottomLeft}`} />
                                <div className={`${styles.corner} ${styles.bottomRight}`} />
                                <div className={styles.scanLine} />
                            </div>
                        </div>
                    )}

                    {/* Current Detection */}
                    {currentHotspot && (
                        <div className={styles.detectionCard}>
                            <div className={styles.detectionHeader}>
                                <span className={styles.detectionIcon}>📍</span>
                                <div>
                                    <h4>{isArabic ? currentHotspot.nameAr : currentHotspot.name}</h4>
                                    <span className={styles.detectedLabel}>
                                        {isArabic ? "تم الكشف" : "Detected"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detectionActions}>
                                {!isPlaying ? (
                                    <button
                                        className={styles.playBtn}
                                        onClick={() => playHotspotAudio(currentHotspot)}
                                    >
                                        {isArabic ? "▶️ استمع" : "▶️ Listen"}
                                    </button>
                                ) : (
                                    <button
                                        className={styles.stopBtn}
                                        onClick={stopAudio}
                                    >
                                        {isArabic ? "⏹️ إيقاف" : "⏹️ Stop"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className={styles.controls}>
                        <button
                            className={`${styles.controlBtn} ${isScanning ? styles.active : ''}`}
                            onClick={isScanning ? stopScanning : startScanning}
                        >
                            {isScanning
                                ? (isArabic ? "⏸️ إيقاف المسح" : "⏸️ Stop Scan")
                                : (isArabic ? "🔍 بدء المسح" : "🔍 Start Scan")
                            }
                        </button>

                        <button
                            className={styles.closeBtn}
                            onClick={stopCamera}
                        >
                            {isArabic ? "❌ إغلاق" : "❌ Close"}
                        </button>
                    </div>
                </div>
            )}

            {/* Detected Places History */}
            {detectedPlaces.length > 0 && (
                <div className={styles.historySection}>
                    <h4>{isArabic ? "المعالم المكتشفة" : "Discovered Landmarks"}</h4>
                    <div className={styles.historyList}>
                        {detectedPlaces.map(place => (
                            <button
                                key={place.id}
                                className={`${styles.historyItem} ${currentHotspot?.id === place.id ? styles.active : ''}`}
                                onClick={() => {
                                    setCurrentHotspot(place);
                                    playHotspotAudio(place);
                                }}
                            >
                                <span>📍</span>
                                <span>{isArabic ? place.nameAr : place.name}</span>
                                {currentHotspot?.id === place.id && isPlaying && (
                                    <span className={styles.playingIndicator}>🔊</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className={styles.error}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Hotspots Grid (when camera not active) */}
            {!isActive && hotspots.length > 0 && (
                <div className={styles.hotspotsGrid}>
                    <h4>{isArabic ? "نقاط الاهتمام المتاحة" : "Available Points of Interest"}</h4>
                    <div className={styles.hotspotsContainer}>
                        {hotspots.map(hotspot => (
                            <button
                                key={hotspot.id}
                                className={styles.hotspotCard}
                                onClick={() => {
                                    setCurrentHotspot(hotspot);
                                    playHotspotAudio(hotspot);
                                }}
                            >
                                <span className={styles.hotspotIcon}>🎧</span>
                                <span className={styles.hotspotName}>
                                    {isArabic ? hotspot.nameAr : hotspot.name}
                                </span>
                                {isPlaying && currentHotspot?.id === hotspot.id && (
                                    <span className={styles.playingBadge}>🔊</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            <div className={styles.features}>
                <div className={styles.feature}>
                    <span>📸</span>
                    <span>{isArabic ? "كشف تلقائي" : "Auto Detect"}</span>
                </div>
                <div className={styles.feature}>
                    <span>🎧</span>
                    <span>{isArabic ? "صوت فوري" : "Instant Audio"}</span>
                </div>
                <div className={styles.feature}>
                    <span>🌐</span>
                    <span>{isArabic ? "متعدد اللغات" : "Multi-lang"}</span>
                </div>
            </div>
        </div>
    );
}
