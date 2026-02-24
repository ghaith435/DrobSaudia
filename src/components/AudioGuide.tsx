"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./audio-guide.module.css";

interface AudioGuideProps {
    placeId: string;
    placeName: string;
}

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export default function AudioGuide({ placeId, placeName }: AudioGuideProps) {
    const [selectedLanguage, setSelectedLanguage] = useState("ar");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [script, setScript] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showLanguages, setShowLanguages] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Load voices on mount
    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    setVoicesLoaded(true);
                }
            };

            // Try loading immediately
            loadVoices();

            // Also listen for voiceschanged event (needed for some browsers)
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            // Cleanup: stop any ongoing speech when component unmounts
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const fetchAudioGuide = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/audio-guide?placeId=${placeId}&language=${selectedLanguage}&includeReviews=true&useAI=false`
            );
            const data = await response.json();

            if (data.success) {
                setScript(data.data.script);
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

    // TTS Proxy Fallback (uses server-side proxy to bypass CORS)
    const playProxyTTS = (textToSpeak: string, language: string) => {
        const langCode = language === 'ar' ? 'ar' : language.substring(0, 2);
        const maxChars = 200;
        const chunks: string[] = [];

        let remaining = textToSpeak;
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

        let currentChunk = 0;
        const audioEl = new Audio();

        const playNextChunk = () => {
            if (currentChunk >= chunks.length) {
                setIsPlaying(false);
                setProgress(100);
                return;
            }

            // Use local proxy API to bypass CORS
            audioEl.src = `/api/tts?text=${encodeURIComponent(chunks[currentChunk])}&lang=${langCode}`;

            audioEl.onended = () => {
                currentChunk++;
                setProgress(Math.round((currentChunk / chunks.length) * 100));
                playNextChunk();
            };

            audioEl.onerror = () => {
                console.log('TTS API unavailable');
                setError(selectedLanguage === "ar"
                    ? "خدمة الصوت غير متوفرة حالياً"
                    : "Audio service unavailable");
                setIsPlaying(false);
            };

            audioEl.play().catch(() => {
                setError(selectedLanguage === "ar"
                    ? "فشل تشغيل الصوت"
                    : "Failed to play audio");
                setIsPlaying(false);
            });
        };

        setIsPlaying(true);
        setProgress(0);
        playNextChunk();
    };

    const startPlaying = async () => {
        setError(null);

        const data = await fetchAudioGuide();
        if (!data) return;

        // Check browser support for Web Speech API
        if (!("speechSynthesis" in window)) {
            // Use Google TTS directly
            playProxyTTS(data.script, selectedLanguage);
            setScript(data.script);
            return;
        }

        // Cancel any previous speech
        window.speechSynthesis.cancel();

        // Wait for voices to be available
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            voices = window.speechSynthesis.getVoices();
        }

        // If no voices, use Google TTS
        if (voices.length === 0) {
            console.log("No voices available, using Google TTS");
            playProxyTTS(data.script, selectedLanguage);
            setScript(data.script);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(data.script);
        utterance.lang = data.voiceConfig.lang;
        utterance.rate = data.voiceConfig.rate || 1;
        utterance.pitch = data.voiceConfig.pitch || 1;

        // Find the best voice
        const langCode = selectedLanguage === "ar" ? "ar" : selectedLanguage;
        let matchingVoice = voices.find((v) => v.lang.startsWith(langCode));
        if (!matchingVoice && voices.length > 0) {
            matchingVoice = voices[0];
        }
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setError(null);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
        };

        utterance.onpause = () => setIsPaused(true);
        utterance.onresume = () => setIsPaused(false);

        utterance.onerror = (event) => {
            console.warn("Web Speech API error, falling back to Google TTS:", event.error);
            // Fallback to Google TTS
            playProxyTTS(data.script, selectedLanguage);
        };

        utterance.onboundary = (event) => {
            if (event.name === "word") {
                const percentage = Math.round((event.charIndex / data.script.length) * 100);
                setProgress(percentage);
            }
        };

        speechRef.current = utterance;

        try {
            window.speechSynthesis.speak(utterance);

            // Check after 500ms if speech actually started
            setTimeout(() => {
                if (!window.speechSynthesis.speaking) {
                    console.log("Web Speech didn't start, using Google TTS");
                    playProxyTTS(data.script, selectedLanguage);
                }
            }, 500);
        } catch (err) {
            console.error("Speak error:", err);
            playProxyTTS(data.script, selectedLanguage);
        }
    };

    const togglePlayPause = () => {
        if (!isPlaying && !isPaused) {
            startPlaying();
        } else if (isPaused) {
            window.speechSynthesis.resume();
        } else {
            window.speechSynthesis.pause();
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
    };

    const selectedLang = LANGUAGES.find((l) => l.code === selectedLanguage);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.icon}>🎧</div>
                <div className={styles.titleGroup}>
                    <h3 className={styles.title}>
                        {selectedLanguage === "ar" ? "الدليل الصوتي" : "AI Audio Guide"}
                    </h3>
                    <p className={styles.subtitle}>
                        {selectedLanguage === "ar"
                            ? "استمع لوصف المكان بصوت المتصفح"
                            : "Listen to place description"}
                    </p>
                </div>
            </div>

            {/* Language Selector */}
            <div className={styles.languageSelector}>
                <button
                    className={styles.languageButton}
                    onClick={() => setShowLanguages(!showLanguages)}
                    disabled={isPlaying}
                >
                    <span className={styles.flag}>{selectedLang?.flag}</span>
                    <span>{selectedLang?.name}</span>
                    <span className={styles.chevron}>▼</span>
                </button>

                {showLanguages && (
                    <div className={styles.languageDropdown}>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                className={`${styles.languageOption} ${selectedLanguage === lang.code ? styles.selected : ""
                                    }`}
                                onClick={() => {
                                    setSelectedLanguage(lang.code);
                                    setShowLanguages(false);
                                    setScript(null);
                                    setError(null);
                                }}
                            >
                                <span className={styles.flag}>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <div className={styles.error}>{error}</div>}

            {/* Progress Bar */}
            {isPlaying && (
                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
                <button
                    className={`${styles.controlButton} ${styles.mainButton}`}
                    onClick={togglePlayPause}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.spinner}>⏳</span>
                    ) : isPlaying && !isPaused ? (
                        selectedLanguage === "ar" ? "⏸️ إيقاف مؤقت" : "⏸️ Pause"
                    ) : isPaused ? (
                        selectedLanguage === "ar" ? "▶️ استئناف" : "▶️ Resume"
                    ) : (
                        selectedLanguage === "ar" ? "▶️ تشغيل" : "▶️ Play Guide"
                    )}
                </button>

                {(isPlaying || isPaused) && (
                    <button
                        className={`${styles.controlButton} ${styles.stopButton}`}
                        onClick={stop}
                    >
                        {selectedLanguage === "ar" ? "⏹️ إيقاف" : "⏹️ Stop"}
                    </button>
                )}
            </div>

            {/* Script Preview */}
            {script && (
                <div className={styles.scriptPreview}>
                    <h4>{selectedLanguage === "ar" ? "📜 معاينة النص" : "📜 Script Preview"}</h4>
                    <p>{script.substring(0, 200)}...</p>
                </div>
            )}

            {/* Features */}
            <div className={styles.features}>
                <div className={styles.feature}>
                    <span>🔊</span>
                    <span>{selectedLanguage === "ar" ? "صوت المتصفح" : "Browser TTS"}</span>
                </div>
                <div className={styles.feature}>
                    <span>⭐</span>
                    <span>{selectedLanguage === "ar" ? "معلومات شاملة" : "Full Info"}</span>
                </div>
                <div className={styles.feature}>
                    <span>🌍</span>
                    <span>{selectedLanguage === "ar" ? "10 لغات" : "10 Languages"}</span>
                </div>
            </div>
        </div>
    );
}
