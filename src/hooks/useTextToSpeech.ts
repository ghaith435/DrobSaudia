"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface VoiceSettings {
    language: string;
    rate: number; // 0.1 - 10
    pitch: number; // 0 - 2
    volume: number; // 0 - 1
    voiceName?: string;
}

export interface TTSState {
    isSupported: boolean;
    isSpeaking: boolean;
    isPaused: boolean;
    availableVoices: SpeechSynthesisVoice[];
    currentVoice: SpeechSynthesisVoice | null;
    error: string | null;
}

interface UseTextToSpeechReturn extends TTSState {
    speak: (text: string, settings?: Partial<VoiceSettings>) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    setVoice: (voice: SpeechSynthesisVoice) => void;
    getVoicesForLanguage: (langCode: string) => SpeechSynthesisVoice[];
}

// Language codes and their display names
export const supportedLanguages = [
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' },
];

const defaultSettings: VoiceSettings = {
    language: 'ar-SA',
    rate: 0.9,
    pitch: 1,
    volume: 1,
};

export function useTextToSpeech(
    initialSettings: Partial<VoiceSettings> = {}
): UseTextToSpeechReturn {
    const settings = { ...defaultSettings, ...initialSettings };

    const [state, setState] = useState<TTSState>({
        isSupported: false,
        isSpeaking: false,
        isPaused: false,
        availableVoices: [],
        currentVoice: null,
        error: null,
    });

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const currentSettingsRef = useRef<VoiceSettings>(settings);

    // Check browser support and load voices
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const synth = window.speechSynthesis;

        if (!synth) {
            setState(prev => ({
                ...prev,
                isSupported: false,
                error: 'المتصفح لا يدعم تحويل النص إلى كلام',
            }));
            return;
        }

        setState(prev => ({ ...prev, isSupported: true }));

        const loadVoices = () => {
            const voices = synth.getVoices();
            if (voices.length > 0) {
                // Find the best voice for the default language
                const preferredVoice = voices.find(v =>
                    v.lang.startsWith(settings.language.split('-')[0])
                ) || voices[0];

                setState(prev => ({
                    ...prev,
                    availableVoices: voices,
                    currentVoice: preferredVoice,
                }));
            }
        };

        loadVoices();

        // Some browsers load voices asynchronously
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }

        // Fallback for browsers that don't fire onvoiceschanged
        setTimeout(loadVoices, 100);

        return () => {
            synth.cancel();
        };
    }, [settings.language]);

    const getVoicesForLanguage = useCallback(
        (langCode: string): SpeechSynthesisVoice[] => {
            return state.availableVoices.filter(voice =>
                voice.lang.startsWith(langCode.split('-')[0])
            );
        },
        [state.availableVoices]
    );

    const speak = useCallback(
        (text: string, customSettings?: Partial<VoiceSettings>) => {
            if (!state.isSupported) {
                setState(prev => ({
                    ...prev,
                    error: 'تحويل النص إلى كلام غير مدعوم',
                }));
                return;
            }

            const synth = window.speechSynthesis;

            // Stop any current speech
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance;

            const mergedSettings = {
                ...currentSettingsRef.current,
                ...customSettings,
            };
            currentSettingsRef.current = mergedSettings;

            // Apply settings
            utterance.rate = mergedSettings.rate;
            utterance.pitch = mergedSettings.pitch;
            utterance.volume = mergedSettings.volume;
            utterance.lang = mergedSettings.language;

            // Find and set voice
            if (mergedSettings.voiceName) {
                const voice = state.availableVoices.find(
                    v => v.name === mergedSettings.voiceName
                );
                if (voice) utterance.voice = voice;
            } else if (state.currentVoice) {
                utterance.voice = state.currentVoice;
            } else {
                // Try to find a voice for the language
                const langVoices = getVoicesForLanguage(mergedSettings.language);
                if (langVoices.length > 0) {
                    // Prefer natural/premium voices
                    const naturalVoice = langVoices.find(v =>
                        v.name.toLowerCase().includes('natural') ||
                        v.name.toLowerCase().includes('premium') ||
                        v.name.toLowerCase().includes('enhanced')
                    );
                    utterance.voice = naturalVoice || langVoices[0];
                }
            }

            // Event handlers
            utterance.onstart = () => {
                setState(prev => ({
                    ...prev,
                    isSpeaking: true,
                    isPaused: false,
                    error: null,
                }));
            };

            utterance.onend = () => {
                setState(prev => ({
                    ...prev,
                    isSpeaking: false,
                    isPaused: false,
                }));
            };

            utterance.onerror = (event) => {
                if (event.error !== 'interrupted') {
                    setState(prev => ({
                        ...prev,
                        isSpeaking: false,
                        isPaused: false,
                        error: `خطأ في النطق: ${event.error}`,
                    }));
                }
            };

            utterance.onpause = () => {
                setState(prev => ({ ...prev, isPaused: true }));
            };

            utterance.onresume = () => {
                setState(prev => ({ ...prev, isPaused: false }));
            };

            // Start speaking
            synth.speak(utterance);
        },
        [state.isSupported, state.availableVoices, state.currentVoice, getVoicesForLanguage]
    );

    const pause = useCallback(() => {
        if (state.isSupported && state.isSpeaking) {
            window.speechSynthesis.pause();
        }
    }, [state.isSupported, state.isSpeaking]);

    const resume = useCallback(() => {
        if (state.isSupported && state.isPaused) {
            window.speechSynthesis.resume();
        }
    }, [state.isSupported, state.isPaused]);

    const stop = useCallback(() => {
        if (state.isSupported) {
            window.speechSynthesis.cancel();
            setState(prev => ({
                ...prev,
                isSpeaking: false,
                isPaused: false,
            }));
        }
    }, [state.isSupported]);

    const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
        setState(prev => ({ ...prev, currentVoice: voice }));
    }, []);

    return {
        ...state,
        speak,
        pause,
        resume,
        stop,
        setVoice,
        getVoicesForLanguage,
    };
}

// Pre-defined audio guide texts for places
export const placeAudioGuides: Record<string, { en: string; ar: string }> = {
    '1': {
        en: "Welcome to At-Turaif, Diriyah. You are standing at the birthplace of the first Saudi state, a UNESCO World Heritage site. These mud-brick palaces and winding alleyways tell the story of the Al Saud dynasty that began here over 300 years ago. Take a moment to appreciate the remarkable Najdi architecture that has stood the test of time.",
        ar: "مرحباً بك في حي الطريف بالدرعية. أنت تقف في مهد الدولة السعودية الأولى، وهو موقع مسجل في قائمة التراث العالمي لليونسكو. هذه القصور الطينية والأزقة المتعرجة تروي قصة أسرة آل سعود التي بدأت هنا منذ أكثر من 300 عام. خذ لحظة لتقدير العمارة النجدية الرائعة التي صمدت أمام اختبار الزمن.",
    },
    '2': {
        en: "Welcome to Kingdom Centre Tower, one of Riyadh's most iconic landmarks. This 99-story skyscraper features the famous Sky Bridge observation deck at its peak. The distinctive opening at the top has become synonymous with Riyadh's modern skyline. Inside, you'll find luxury shopping and the prestigious Four Seasons Hotel.",
        ar: "مرحباً بك في برج المملكة، أحد أبرز معالم الرياض. يضم هذا الناطحة المكونة من 99 طابقاً الجسر السماوي الشهير في قمته. أصبحت الفتحة المميزة في الأعلى رمزاً لأفق الرياض الحديث. بداخله ستجد تجربة تسوق فاخرة وفندق الفورسيزونز الراقي.",
    },
    '10': {
        en: "Welcome to Wadi Hanifa, a rehabilitated natural valley that serves as Riyadh's green lung. This 120-kilometer corridor offers scenic walking and cycling paths, picnic areas, and beautiful landscapes. The valley has been transformed through an award-winning environmental rehabilitation project.",
        ar: "مرحباً بك في وادي حنيفة، الوادي الطبيعي المُعاد تأهيله الذي يُعتبر رئة الرياض الخضراء. يوفر هذا الممر الممتد 120 كيلومتراً مسارات مشي وركوب دراجات ومناطق نزهة ومناظر طبيعية خلابة. تم تحويل الوادي من خلال مشروع إعادة تأهيل بيئي حائز على جوائز عالمية.",
    },
};

export default useTextToSpeech;
