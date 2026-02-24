'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toursData, AudioTour, AudioStop } from '../data';
import styles from './tour-details.module.css';

export default function TourDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const tourId = params.id as string;
    const [tour, setTour] = useState<AudioTour | null>(null);
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [aiScripts, setAiScripts] = useState<Record<string, string>>({});
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);

        const foundTour = toursData.find(t => t.id === tourId);
        if (foundTour) {
            setTour(foundTour);
        } else {
            // Handle not found
            // router.push('/audio-tours');
        }
    }, [tourId, router]);

    const isRTL = locale === 'ar';

    // Web Speech API Handler with Google TTS Fallback
    const playBrowserTTS = (text: string, lang: string) => {
        // Fallback simulation function
        const startSimulation = (durationSec = 10) => {
            const intervalTime = 100;
            const step = 100 / (durationSec * 10);
            let currentProgress = 0;

            // Clear any existing interval
            if ((window as any).ttsInterval) clearInterval((window as any).ttsInterval);

            setIsPlaying(true);
            setDuration(formatTime(durationSec));

            const progressInterval = setInterval(() => {
                currentProgress += step;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(progressInterval);
                    handleTrackEnded();
                    return;
                }

                setProgress(currentProgress);
                setCurrentTime(formatTime((currentProgress / 100) * durationSec));
            }, intervalTime);

            (window as any).ttsInterval = progressInterval;
        };

        // Use local TTS Proxy API (bypasses CORS)
        const playProxyTTS = (textToSpeak: string, language: string) => {
            const langCode = language === 'ar' ? 'ar' : 'en';
            // Split text into chunks
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
            const wordCount = textToSpeak.split(/\s+/).length;
            const speed = langCode === 'ar' ? 100 : 130;
            const estimatedDuration = Math.ceil((wordCount / speed) * 60) || 10;

            // Start visual simulation
            startSimulation(estimatedDuration);

            const playNextChunk = () => {
                if (currentChunk >= chunks.length) {
                    return;
                }

                // Use local proxy API to bypass CORS
                const audioUrl = `/api/tts?text=${encodeURIComponent(chunks[currentChunk])}&lang=${langCode}`;

                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.onended = () => {
                        currentChunk++;
                        if (currentChunk < chunks.length) {
                            playNextChunk();
                        }
                    };
                    audioRef.current.onerror = () => {
                        console.log('TTS API unavailable, simulation mode active');
                        // Continue with visual simulation only
                    };
                    audioRef.current.play().catch(() => {
                        console.log('Audio play failed, visual simulation continues');
                    });
                }
            };

            playNextChunk();
        };

        // Try Web Speech API first
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if ((window as any).ttsInterval) clearInterval((window as any).ttsInterval);

            const utterance = new SpeechSynthesisUtterance(text);
            let voices = window.speechSynthesis.getVoices();

            const setVoice = () => {
                const preferredLang = lang === 'ar' ? 'ar' : 'en';
                let voice = voices.find(v => v.lang.startsWith(preferredLang));
                if (!voice && lang === 'ar') voice = voices.find(v => v.lang.includes('ar'));
                if (voice) utterance.voice = voice;
                utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
            };

            if (voices.length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                    setVoice();
                };
            } else {
                setVoice();
            }

            utterance.rate = 0.9;
            utterance.onstart = () => setIsPlaying(true);

            let ttsWorked = false;
            utterance.onend = () => { ttsWorked = true; };

            utterance.onerror = (e) => {
                console.warn("Web Speech API failed, trying Google TTS:", e.error);
                // Fallback to Google TTS
                playProxyTTS(text, lang);
            };

            const wordCount = text.split(/\s+/).length;
            const speed = lang === 'ar' ? 100 : 130;
            const estimatedDuration = Math.ceil((wordCount / speed) * 60) || 10;

            // Start visual simulation
            startSimulation(estimatedDuration);

            try {
                window.speechSynthesis.speak(utterance);

                // Check after 500ms if speech actually started
                setTimeout(() => {
                    if (!window.speechSynthesis.speaking && !ttsWorked) {
                        console.log("Web Speech API didn't start, using Google TTS");
                        playProxyTTS(text, lang);
                    }
                }, 500);
            } catch (err) {
                console.error("SpeechSynthesis error:", err);
                playProxyTTS(text, lang);
            }
        } else {
            // No Web Speech API, use Google TTS directly
            playProxyTTS(text, lang);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
                if ((window as any).ttsInterval) clearInterval((window as any).ttsInterval);
            }
        };
    }, []);

    const togglePlay = () => {
        if (typeof window === 'undefined') return;

        // Toggle TTS
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setIsPlaying(true);
            } else {
                window.speechSynthesis.pause();
                setIsPlaying(false);
            }
            return;
        }

        // Toggle Audio Element
        if (audioRef.current && audioRef.current.src && audioRef.current.src !== window.location.href) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => {
                    // Fallback
                });
            }
            setIsPlaying(!isPlaying);
            return; // Correct return
        }

        // Start TTS if nothing is playing
        if (!isPlaying && currentTrack) {
            const textToSpeak = isRTL ? currentTrack.descriptionAr : currentTrack.description;
            playBrowserTTS(textToSpeak, isRTL ? 'ar' : 'en');
        }
    };

    const playTrack = async (index: number) => {
        if (!isUnlocked) {
            alert(isRTL ? 'يجب فتح الجولة أولاً!' : 'You must unlock the tour first!');
            return;
        }

        // Stop updates
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            if ((window as any).ttsInterval) clearInterval((window as any).ttsInterval);
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.removeAttribute('src');
        }

        if (currentTrackIndex === index && isPlaying) {
            togglePlay();
            return;
        }

        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setProgress(0);

        const track = tour?.playlist[index];
        if (!track) return;

        // Priority 1: Use pre-written scripts from data if available
        const preWrittenScript = isRTL ? track.scriptAr : track.script;

        // Priority 2: Check cached AI-generated scripts
        const scriptKey = `${tour?.id}-${track.id}-${locale}`;
        let scriptToSpeak = preWrittenScript || aiScripts[scriptKey];

        // Priority 3: Generate new script using Gemini if not available
        if (!scriptToSpeak) {
            setIsGeneratingScript(true);
            try {
                const response = await fetch(
                    `/api/ai/generate-tour-script?place=${encodeURIComponent(track.title)}&placeAr=${encodeURIComponent(track.titleAr)}&lang=${locale}&context=${encodeURIComponent(tour?.title || '')}`
                );
                const data = await response.json();

                if (data.success && data.script) {
                    scriptToSpeak = data.script;
                    // Cache the generated script
                    setAiScripts(prev => ({ ...prev, [scriptKey]: data.script }));
                } else {
                    // Fallback to static description
                    scriptToSpeak = isRTL ? (track.descriptionAr || '') : (track.description || '');
                }
            } catch (error) {
                console.error('Error generating AI script:', error);
                scriptToSpeak = isRTL ? (track.descriptionAr || '') : (track.description || '');
            } finally {
                setIsGeneratingScript(false);
            }
        }

        // Play via TTS Proxy API
        if (scriptToSpeak) {
            setTimeout(() => {
                // Use TTS proxy for audio
                if (audioRef.current) {
                    const ttsUrl = `/api/tts?text=${encodeURIComponent(scriptToSpeak.substring(0, 500))}&lang=${locale}`;
                    audioRef.current.src = ttsUrl;
                    audioRef.current.play().catch(() => {
                        // Fallback to browser TTS
                        playBrowserTTS(scriptToSpeak, locale);
                    });
                } else {
                    playBrowserTTS(scriptToSpeak, locale);
                }
            }, 100);
        }
    };

    const handleTimeUpdate = () => {
        if (typeof window !== 'undefined' && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) return;

        if (audioRef.current && audioRef.current.duration && audioRef.current.duration !== Infinity) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;

            if (dur) {
                setProgress((current / dur) * 100);
                setCurrentTime(formatTime(current));
                setDuration(formatTime(dur));
            }
        }
    };

    const handleTrackEnded = () => {
        if (tour && currentTrackIndex < tour.playlist.length - 1) {
            setTimeout(() => {
                playTrack(currentTrackIndex + 1);
            }, 500);
        } else {
            setIsPlaying(false);
            setProgress(0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setProgress(val);

        if (audioRef.current && audioRef.current.duration && audioRef.current.duration !== Infinity) {
            audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
        }
    };

    const formatTime = (time: number) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const unlockTour = () => {
        const confirmUnlock = confirm(
            isRTL
                ? `هل تريد فتح هذه الجولة مقابل ${tour?.pointsCost} نقطة؟`
                : `Unlock this tour for ${tour?.pointsCost} points?`
        );

        if (confirmUnlock) {
            setIsUnlocked(true);
        }
    };

    if (!tour) return <div className={styles.loading}>Loading...</div>;

    const currentTrack = currentTrackIndex >= 0 ? tour.playlist[currentTrackIndex] : null;

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Audio Element with NO SRC initially */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnded}
                onError={(e) => {
                    // console.log("Audio load error:", e);
                }}
            />

            {/* Header / Hero */}
            <div className={styles.hero} style={{ backgroundImage: `url(${tour.image})` }}>
                <div className={styles.heroOverlay}>
                    <div className={styles.headerContent}>
                        <Link href="/audio-tours" className={styles.backBtn}>
                            ← {isRTL ? 'عودة' : 'Back'}
                        </Link>
                        <div className={styles.categories}>
                            <span className={styles.categoryBadge}>
                                {isRTL ? tour.categoryAr : tour.category}
                            </span>
                        </div>
                        <h1>{isRTL ? tour.titleAr : tour.title}</h1>
                        <div className={styles.stats}>
                            <span>⏱️ {isRTL ? tour.durationAr : tour.duration}</span>
                            <span>📍 {tour.stops} {isRTL ? 'محطات' : 'stops'}</span>
                            <span>⭐ {tour.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className={styles.main}>
                <div className={styles.contentGrid}>
                    {/* Left: Playlist */}
                    <div className={styles.playlistSection}>
                        <div className={styles.descriptionCard}>
                            <h3>{isRTL ? 'عن الجولة' : 'About this tour'}</h3>
                            <p>{isRTL ? tour.fullDescriptionAr : tour.fullDescription}</p>

                            {!isUnlocked && (
                                <div className={styles.lockedOverlay}>
                                    <button onClick={unlockTour} className={styles.unlockBtn}>
                                        🔓 {isRTL ? `فتح الجولة (${tour.pointsCost} نقطة)` : `Unlock Tour (${tour.pointsCost} pts)`}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.playlist}>
                            <h3>{isRTL ? 'قائمة المحطات' : 'Tour Stops'} ({tour.playlist.length})</h3>
                            {tour.playlist.map((track, idx) => (
                                <div
                                    key={track.id}
                                    className={`${styles.trackItem} ${currentTrackIndex === idx ? styles.activeTrack : ''} ${!isUnlocked ? styles.lockedTrack : ''}`}
                                    onClick={() => playTrack(idx)}
                                >
                                    <div className={styles.trackNum}>{idx + 1}</div>
                                    <div className={styles.trackInfo}>
                                        <h4>{isRTL ? track.titleAr : track.title}</h4>
                                        <p>{isRTL ? track.descriptionAr : track.description}</p>
                                    </div>
                                    <div className={styles.trackDuration}>{track.duration}</div>
                                    <div className={styles.playIcon}>
                                        {currentTrackIndex === idx && isPlaying ? '⏸️' : '▶️'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Player (Sticky) */}
                    <aside className={styles.playerSection}>
                        <div className={styles.playerCard}>
                            {currentTrack ? (
                                <>
                                    <div className={styles.nowPlayingImg}>
                                        <div
                                            className={styles.trackImage}
                                            style={{ backgroundImage: `url(${currentTrack.image})` }}
                                        />
                                    </div>
                                    <div className={styles.nowPlayingInfo}>
                                        <h3>{isRTL ? currentTrack.titleAr : currentTrack.title}</h3>
                                        <p>{isRTL ? tour.titleAr : tour.title}</p>
                                        {isGeneratingScript && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginTop: '8px',
                                                color: '#d9b063',
                                                fontSize: '14px'
                                            }}>
                                                <span style={{ animation: 'spin 1s linear infinite' }}>✨</span>
                                                {isRTL ? 'جاري توليد النص بالذكاء الاصطناعي...' : 'AI is generating script...'}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.progressBar}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progress}
                                            onChange={handleSeek}
                                            className={styles.rangeInput}
                                        />
                                        <div className={styles.timeInfo}>
                                            <span>{currentTime}</span>
                                            <span>{duration !== '00:00' ? duration : currentTrack.duration}</span>
                                        </div>
                                    </div>

                                    <div className={styles.controls}>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => currentTrackIndex > 0 && playTrack(currentTrackIndex - 1)}
                                            disabled={currentTrackIndex === 0}
                                        >
                                            ⏮️
                                        </button>
                                        <button
                                            className={styles.playBtn}
                                            onClick={togglePlay}
                                        >
                                            {isPlaying ? '⏸️' : '▶️'}
                                        </button>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => currentTrackIndex < tour.playlist.length - 1 && playTrack(currentTrackIndex + 1)}
                                            disabled={currentTrackIndex === tour.playlist.length - 1}
                                        >
                                            ⏭️
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.emptyPlayer}>
                                    <span className={styles.headphoneIcon}>🎧</span>
                                    <p>{isRTL ? 'اختر محطة للبدء' : 'Select a stop to start'}</p>
                                    {!isUnlocked && (
                                        <p className={styles.lockMsg}>
                                            🔒 {isRTL ? 'الجولة مقفلة' : 'Tour Locked'}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
