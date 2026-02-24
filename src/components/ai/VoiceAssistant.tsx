"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./VoiceAssistant.module.css";

interface VoiceAssistantProps {
    locale: 'ar' | 'en';
    onTranscription?: (text: string) => void;
    onResponse?: (response: string) => void;
}

export default function VoiceAssistant({
    locale,
    onTranscription,
    onResponse,
}: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const t = {
        ar: {
            title: "المساعد الصوتي",
            listening: "جارٍ الاستماع...",
            processing: "جارٍ المعالجة...",
            speaking: "جارٍ التحدث...",
            tapToSpeak: "اضغط للتحدث",
            yourQuestion: "سؤالك:",
            aiResponse: "الرد:",
            error: "حدث خطأ. حاول مرة أخرى.",
            suggestions: [
                "أخبرني عن حي الطريف",
                "ما هي ساعات العمل؟",
                "كيف أصل إلى البجيري؟",
                "ما هي أفضل المطاعم القريبة؟",
            ],
        },
        en: {
            title: "Voice Assistant",
            listening: "Listening...",
            processing: "Processing...",
            speaking: "Speaking...",
            tapToSpeak: "Tap to speak",
            yourQuestion: "Your question:",
            aiResponse: "Response:",
            error: "An error occurred. Please try again.",
            suggestions: [
                "Tell me about At-Turaif",
                "What are the opening hours?",
                "How do I get to Bujairi?",
                "What are the best nearby restaurants?",
            ],
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsSpeaking(false);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const startListening = async () => {
        try {
            setError("");
            setTranscript("");
            setResponse("");

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError(labels.error);
        }
    };

    const stopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);

        try {
            // Send audio to transcription API
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', locale);

            const transcribeResponse = await fetch('/api/speech/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!transcribeResponse.ok) {
                throw new Error('Transcription failed');
            }

            const { text } = await transcribeResponse.json();
            setTranscript(text);
            onTranscription?.(text);

            // Get AI response
            const aiResponse = await fetch('/api/ai/spatial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text, locale }),
            });

            if (!aiResponse.ok) {
                throw new Error('AI response failed');
            }

            const { response: aiText, audioUrl } = await aiResponse.json();
            setResponse(aiText);
            onResponse?.(aiText);

            // Play audio response if available
            if (audioUrl && audioRef.current) {
                setIsSpeaking(true);
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        } catch (err) {
            console.error('Error processing audio:', err);
            setError(labels.error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        setTranscript(suggestion);
        setIsProcessing(true);
        setError("");

        try {
            const aiResponse = await fetch('/api/ai/spatial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: suggestion, locale }),
            });

            if (!aiResponse.ok) {
                throw new Error('AI response failed');
            }

            const { response: aiText } = await aiResponse.json();
            setResponse(aiText);
            onResponse?.(aiText);
        } catch (err) {
            console.error('Error:', err);
            setError(labels.error);
        } finally {
            setIsProcessing(false);
        }
    };

    const stopSpeaking = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
        }
    };

    return (
        <div className={`${styles.container} ${isExpanded ? styles.expanded : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Toggle Button */}
            <button
                className={styles.toggleButton}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
                {isExpanded ? '✕' : '🎙️'}
            </button>

            {isExpanded && (
                <div className={styles.panel}>
                    <h3 className={styles.title}>
                        <span className={styles.titleIcon}>🤖</span>
                        {labels.title}
                    </h3>

                    {/* Main Button */}
                    <button
                        className={`${styles.mainButton} ${isListening ? styles.listening : ''} ${isProcessing ? styles.processing : ''} ${isSpeaking ? styles.speaking : ''}`}
                        onClick={isListening ? stopListening : startListening}
                        disabled={isProcessing}
                    >
                        <span className={styles.buttonIcon}>
                            {isListening ? '⏹️' : isProcessing ? '⏳' : isSpeaking ? '🔊' : '🎤'}
                        </span>
                        <span className={styles.buttonText}>
                            {isListening
                                ? labels.listening
                                : isProcessing
                                    ? labels.processing
                                    : isSpeaking
                                        ? labels.speaking
                                        : labels.tapToSpeak}
                        </span>
                    </button>

                    {/* Stop Speaking Button */}
                    {isSpeaking && (
                        <button className={styles.stopButton} onClick={stopSpeaking}>
                            ⏹️ {isRTL ? 'إيقاف' : 'Stop'}
                        </button>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Transcript */}
                    {transcript && (
                        <div className={styles.transcript}>
                            <span className={styles.label}>{labels.yourQuestion}</span>
                            <p>{transcript}</p>
                        </div>
                    )}

                    {/* Response */}
                    {response && (
                        <div className={styles.response}>
                            <span className={styles.label}>{labels.aiResponse}</span>
                            <p>{response}</p>
                        </div>
                    )}

                    {/* Suggestions */}
                    {!transcript && !response && (
                        <div className={styles.suggestions}>
                            {labels.suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    className={styles.suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    disabled={isProcessing}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
