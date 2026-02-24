"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ai-guide.module.css";

interface Message {
    id: string;
    role: 'user' | 'guide';
    content: string;
    timestamp: Date;
    isPlaying?: boolean;
}

interface Location {
    latitude: number;
    longitude: number;
}

export default function AIGuidePage() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [currentPlace, setCurrentPlace] = useState<string>('');
    const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
    const [aiStatus, setAiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
    const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'ar' | 'vr'>('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isRTL = locale === 'ar';

    const t = {
        ar: {
            title: "المرشد السياحي الذكي",
            subtitle: "مرشدك الشخصي لاستكشاف الرياض",
            chat: "المحادثة",
            planner: "مُخطط الرحلات",
            ar: "الواقع المعزز",
            vr: "الواقع الافتراضي",
            placeholder: "اسأل المرشد عن أي شيء...",
            send: "إرسال",
            speak: "تحدث",
            stop: "إيقاف",
            thinking: "جاري التفكير...",
            welcome: "مرحباً بك! أنا مرشدك السياحي الذكي للرياض. كيف يمكنني مساعدتك اليوم؟",
            aiOnline: "المرشد متصل",
            aiOffline: "المرشد غير متصل",
            locationEnabled: "تم تفعيل الموقع",
            locationDisabled: "الموقع غير مفعل",
            suggestions: [
                "ما أفضل الأماكن للزيارة في الرياض؟",
                "أقترح لي خطة ليوم كامل",
                "أخبرني عن تاريخ الدرعية",
                "أين أجد أفضل المطاعم؟"
            ],
            // Trip Planner
            planTrip: "خطط رحلتك",
            interests: "الاهتمامات",
            duration: "المدة",
            budget: "الميزانية",
            travelStyle: "نمط السفر",
            groupType: "نوع المجموعة",
            generatePlan: "إنشاء الخطة",
            // AR Guide
            arTitle: "الواقع المعزز",
            arDesc: "وجّه الكاميرا نحو أي معلم للحصول على معلومات فورية",
            startAR: "تشغيل الكاميرا",
            // VR History
            vrTitle: "السفر عبر الزمن",
            vrDesc: "شاهد كيف كانت المعالم التاريخية في الماضي",
            selectPlace: "اختر المكان"
        },
        en: {
            title: "AI Tour Guide",
            subtitle: "Your personal guide to explore Riyadh",
            chat: "Chat",
            planner: "Trip Planner",
            ar: "AR Guide",
            vr: "VR History",
            placeholder: "Ask the guide anything...",
            send: "Send",
            speak: "Speak",
            stop: "Stop",
            thinking: "Thinking...",
            welcome: "Welcome! I'm your AI tour guide for Riyadh. How can I help you today?",
            aiOnline: "Guide Online",
            aiOffline: "Guide Offline",
            locationEnabled: "Location Enabled",
            locationDisabled: "Location Disabled",
            suggestions: [
                "What are the best places to visit in Riyadh?",
                "Suggest a full day plan for me",
                "Tell me about Diriyah's history",
                "Where can I find the best restaurants?"
            ],
            // Trip Planner
            planTrip: "Plan Your Trip",
            interests: "Interests",
            duration: "Duration",
            budget: "Budget",
            travelStyle: "Travel Style",
            groupType: "Group Type",
            generatePlan: "Generate Plan",
            // AR Guide
            arTitle: "Augmented Reality",
            arDesc: "Point your camera at any landmark for instant information",
            startAR: "Start Camera",
            // VR History
            vrTitle: "Time Travel",
            vrDesc: "See how historical landmarks looked in the past",
            selectPlace: "Select Place"
        }
    };

    const labels = t[locale];

    // Initialize
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);

        // Check AI status
        checkAIStatus();

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Location error:', error);
                }
            );
        }

        // Add welcome message
        setMessages([{
            id: 'welcome',
            role: 'guide',
            content: labels.welcome,
            timestamp: new Date()
        }]);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const checkAIStatus = async () => {
        try {
            const response = await fetch('/api/ai/status');
            const data = await response.json();
            setAiStatus(data.ollama?.available ? 'online' : 'offline');
        } catch {
            setAiStatus('offline');
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputText,
                    context: {
                        currentLocation,
                        currentPlace,
                        visitedPlaces,
                        userPreferences: {
                            interests: [],
                            language: locale
                        },
                        conversationHistory: messages.map(m => ({
                            role: m.role,
                            content: m.content,
                            timestamp: m.timestamp
                        }))
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                const guideMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'guide',
                    content: data.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, guideMessage]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'guide',
                content: locale === 'ar'
                    ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
                    : 'Sorry, an error occurred. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const speakMessage = useCallback(async (text: string, messageId: string) => {
        if (isSpeaking) {
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
            setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
            return;
        }

        setIsSpeaking(true);
        setMessages(prev => prev.map(m =>
            m.id === messageId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
        ));

        try {
            // Try Piper TTS first
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    language: locale,
                    browserFallback: true
                })
            });

            const data = await response.json();

            if (data.type === 'browser' && data.code) {
                // Use browser TTS
                eval(data.code);
            } else if (data.audio) {
                // Use Piper audio
                const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
                audio.onended = () => {
                    setIsSpeaking(false);
                    setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
                };
                audio.play();
                return;
            }
        } catch {
            // Fallback to browser TTS
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = locale === 'ar' ? 'ar-SA' : 'en-US';
                utterance.onend = () => {
                    setIsSpeaking(false);
                    setMessages(prev => prev.map(m => ({ ...m, isPlaying: false })));
                };
                window.speechSynthesis.speak(utterance);
            }
        }
    }, [isSpeaking, locale]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setInputText(suggestion);
    };

    return (
        <div className={styles.page} dir={isRTL ? 'rtl' : 'ltr'}>

            <main className={styles.main}>
                {/* Background */}
                <div className={styles.bgDecor}></div>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.icon}>🤖</span>
                            {labels.title}
                        </h1>
                        <p className={styles.subtitle}>{labels.subtitle}</p>
                        <div className={styles.statusBar}>
                            <span className={`${styles.status} ${styles[aiStatus]}`}>
                                {aiStatus === 'online' ? '🟢' : aiStatus === 'offline' ? '🔴' : '🟡'}
                                {aiStatus === 'online' ? labels.aiOnline : labels.aiOffline}
                            </span>
                            <span className={styles.status}>
                                {currentLocation ? '📍' : '📍'}
                                {currentLocation ? labels.locationEnabled : labels.locationDisabled}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        💬 {labels.chat}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'planner' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('planner')}
                    >
                        🗺️ {labels.planner}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'ar' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('ar')}
                    >
                        📱 {labels.ar}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'vr' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('vr')}
                    >
                        🏛️ {labels.vr}
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'chat' && (
                        <div className={styles.chatContainer}>
                            {/* Messages */}
                            <div className={styles.messagesContainer}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`${styles.message} ${styles[message.role]}`}
                                    >
                                        <div className={styles.messageContent}>
                                            <span className={styles.messageIcon}>
                                                {message.role === 'user' ? '👤' : '🤖'}
                                            </span>
                                            <div className={styles.messageText}>
                                                <p>{message.content}</p>
                                                <div className={styles.messageActions}>
                                                    <span className={styles.messageTime}>
                                                        {message.timestamp.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {message.role === 'guide' && (
                                                        <button
                                                            className={`${styles.speakBtn} ${message.isPlaying ? styles.playing : ''}`}
                                                            onClick={() => speakMessage(message.content, message.id)}
                                                        >
                                                            {message.isPlaying ? '⏹️' : '🔊'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className={`${styles.message} ${styles.guide}`}>
                                        <div className={styles.messageContent}>
                                            <span className={styles.messageIcon}>🤖</span>
                                            <div className={styles.thinking}>
                                                <span>{labels.thinking}</span>
                                                <div className={styles.dots}>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggestions */}
                            {messages.length <= 1 && (
                                <div className={styles.suggestions}>
                                    {labels.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className={styles.suggestion}
                                            onClick={() => selectSuggestion(suggestion)}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className={styles.inputContainer}>
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={labels.placeholder}
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button
                                    className={styles.sendBtn}
                                    onClick={sendMessage}
                                    disabled={!inputText.trim() || isLoading}
                                >
                                    {labels.send} {isRTL ? '←' : '→'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'planner' && (
                        <TripPlannerTab locale={locale} labels={labels} />
                    )}

                    {activeTab === 'ar' && (
                        <ARGuideTab locale={locale} labels={labels} currentLocation={currentLocation} />
                    )}

                    {activeTab === 'vr' && (
                        <VRHistoryTab locale={locale} labels={labels} />
                    )}
                </div>
            </main>
        </div>
    );
}

// Trip Planner Component
interface TripPlan {
    title?: string;
    summary?: string;
    days?: Array<{
        day: number;
        title: string;
        activities?: Array<{
            time: string;
            place: string;
            description: string;
            tips?: string[];
            estimatedCost?: string;
        }>;
        meals?: Array<{
            type: string;
            recommendation: string;
            cuisine: string;
        }>;
    }>;
    totalEstimatedCost?: string;
    generalTips?: string[];
}

function TripPlannerTab({ locale, labels }: { locale: 'ar' | 'en'; labels: Record<string, unknown> }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<TripPlan | null>(null);
    const [formData, setFormData] = useState({
        interests: [] as string[],
        duration: '1 day',
        budget: 'moderate' as 'budget' | 'moderate' | 'luxury',
        travelStyle: 'cultural' as 'relaxed' | 'active' | 'cultural' | 'adventure',
        groupType: 'solo' as 'solo' | 'couple' | 'family' | 'friends'
    });

    const interestOptions = [
        { id: 'history', label: locale === 'ar' ? 'التاريخ' : 'History', icon: '🏛️' },
        { id: 'culture', label: locale === 'ar' ? 'الثقافة' : 'Culture', icon: '🎭' },
        { id: 'food', label: locale === 'ar' ? 'الطعام' : 'Food', icon: '🍽️' },
        { id: 'shopping', label: locale === 'ar' ? 'التسوق' : 'Shopping', icon: '🛍️' },
        { id: 'nature', label: locale === 'ar' ? 'الطبيعة' : 'Nature', icon: '🌴' },
        { id: 'entertainment', label: locale === 'ar' ? 'الترفيه' : 'Entertainment', icon: '🎡' },
        { id: 'art', label: locale === 'ar' ? 'الفن' : 'Art', icon: '🎨' },
        { id: 'adventure', label: locale === 'ar' ? 'المغامرة' : 'Adventure', icon: '🏜️' }
    ];

    const toggleInterest = (id: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id]
        }));
    };

    const generatePlan = async () => {
        if (formData.interests.length === 0) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/tour-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    language: locale
                })
            });

            const data = await response.json();
            if (data.success) {
                setPlan(data.plan);
            }
        } catch (error) {
            console.error('Plan generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.plannerContainer}>
            <div className={styles.plannerForm}>
                <h2>{labels.planTrip as string}</h2>

                {/* Interests */}
                <div className={styles.formGroup}>
                    <label>{labels.interests as string}</label>
                    <div className={styles.interestGrid}>
                        {interestOptions.map(option => (
                            <button
                                key={option.id}
                                className={`${styles.interestBtn} ${formData.interests.includes(option.id) ? styles.selected : ''}`}
                                onClick={() => toggleInterest(option.id)}
                            >
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div className={styles.formGroup}>
                    <label>{labels.duration as string}</label>
                    <select
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    >
                        <option value="half day">{locale === 'ar' ? 'نصف يوم' : 'Half Day'}</option>
                        <option value="1 day">{locale === 'ar' ? 'يوم واحد' : '1 Day'}</option>
                        <option value="2 days">{locale === 'ar' ? 'يومين' : '2 Days'}</option>
                        <option value="3 days">{locale === 'ar' ? '3 أيام' : '3 Days'}</option>
                        <option value="1 week">{locale === 'ar' ? 'أسبوع' : '1 Week'}</option>
                    </select>
                </div>

                {/* Budget */}
                <div className={styles.formGroup}>
                    <label>{labels.budget as string}</label>
                    <div className={styles.radioGroup}>
                        {(['budget', 'moderate', 'luxury'] as const).map(option => (
                            <button
                                key={option}
                                className={`${styles.radioBtn} ${formData.budget === option ? styles.selected : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, budget: option }))}
                            >
                                {option === 'budget' && (locale === 'ar' ? '💰 اقتصادية' : '💰 Budget')}
                                {option === 'moderate' && (locale === 'ar' ? '💳 متوسطة' : '💳 Moderate')}
                                {option === 'luxury' && (locale === 'ar' ? '💎 فاخرة' : '💎 Luxury')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Group Type */}
                <div className={styles.formGroup}>
                    <label>{labels.groupType as string}</label>
                    <div className={styles.radioGroup}>
                        {(['solo', 'couple', 'family', 'friends'] as const).map(option => (
                            <button
                                key={option}
                                className={`${styles.radioBtn} ${formData.groupType === option ? styles.selected : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, groupType: option }))}
                            >
                                {option === 'solo' && (locale === 'ar' ? '👤 فردي' : '👤 Solo')}
                                {option === 'couple' && (locale === 'ar' ? '👫 زوجان' : '👫 Couple')}
                                {option === 'family' && (locale === 'ar' ? '👨‍👩‍👧 عائلة' : '👨‍👩‍👧 Family')}
                                {option === 'friends' && (locale === 'ar' ? '👥 أصدقاء' : '👥 Friends')}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.generateBtn}
                    onClick={generatePlan}
                    disabled={isGenerating || formData.interests.length === 0}
                >
                    {isGenerating ? (
                        <>
                            <span className={styles.spinner}></span>
                            {locale === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                        </>
                    ) : (
                        <>🗺️ {labels.generatePlan as string}</>
                    )}
                </button>
            </div>

            {/* Generated Plan */}
            {plan && (
                <div className={styles.planResult}>
                    <TripPlanDisplay plan={plan} locale={locale} />
                </div>
            )}
        </div>
    );
}

// Trip Plan Display Component
function TripPlanDisplay({ plan, locale }: { plan: TripPlan; locale: 'ar' | 'en' }) {

    return (
        <div className={styles.planDisplay}>
            <h3>{plan.title || (locale === 'ar' ? 'خطة رحلتك' : 'Your Trip Plan')}</h3>
            <p className={styles.planSummary}>{plan.summary}</p>

            {plan.days?.map((day, index) => (
                <div key={index} className={styles.dayCard}>
                    <h4>
                        {locale === 'ar' ? `اليوم ${day.day}` : `Day ${day.day}`}: {day.title}
                    </h4>
                    <div className={styles.activities}>
                        {day.activities?.map((activity, aIndex) => (
                            <div key={aIndex} className={styles.activity}>
                                <span className={styles.time}>{activity.time}</span>
                                <div className={styles.activityDetails}>
                                    <strong>{activity.place}</strong>
                                    <p>{activity.description}</p>
                                    {activity.estimatedCost && (
                                        <span className={styles.cost}>💰 {activity.estimatedCost}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {plan.totalEstimatedCost && (
                <div className={styles.totalCost}>
                    <strong>{locale === 'ar' ? 'التكلفة الإجمالية:' : 'Total Estimated Cost:'}</strong>
                    <span>{plan.totalEstimatedCost}</span>
                </div>
            )}

            {plan.generalTips && plan.generalTips.length > 0 && (
                <div className={styles.tips}>
                    <h4>{locale === 'ar' ? 'نصائح عامة' : 'General Tips'}</h4>
                    <ul>
                        {plan.generalTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// AR Data Interface
interface ARData {
    placeName?: string;
    description?: string;
    historicalFacts?: string[];
    interestingFacts?: string[];
    tips?: string[];
}

// AR Guide Component
function ARGuideTab({ locale, labels, currentLocation }: {
    locale: 'ar' | 'en';
    labels: Record<string, unknown>;
    currentLocation: Location | null;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [arData, setArData] = useState<ARData | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [useSimulation, setUseSimulation] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startCamera = async () => {
        setCameraError(null);

        // Basic check for API support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            const msg = locale === 'ar'
                ? 'متصفحك لا يدعم الوصول للكاميرا (قد يتطلب HTTPS).'
                : 'Browser does not support camera access (HTTPS required).';
            setCameraError(msg);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(e => console.error("Play error:", e));
                };
            }
            setCameraActive(true);
            setUseSimulation(false);
        } catch (error) {
            console.error('Camera error or denied:', error);
            const msg = locale === 'ar'
                ? 'تعذر الوصول للكاميرا. تأكد من الأذونات أو استخدم HTTPS.'
                : 'Could not access camera. Check permissions or use HTTPS.';
            setCameraError(msg);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setUseSimulation(false);
        setArData(null);
        setCameraError(null);
    };

    const enableSimulation = () => {
        setCameraError(null);
        setUseSimulation(true);
        setCameraActive(true);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (cameraActive && !useSimulation) {
                stopCamera();
            }
        };
    }, [cameraActive, useSimulation]);

    const analyzeScene = async () => {
        // Use default location if not available (for demo)
        const locationToUse = currentLocation || { latitude: 24.7136, longitude: 46.6753 }; // Riyadh

        setIsLoading(true);
        try {
            const response = await fetch('/api/ai/ar-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: locationToUse,
                    language: locale
                })
            });

            const data = await response.json();
            if (data.success) {
                setArData(data.scene);
            }
        } catch (error) {
            console.error('AR analysis error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.arContainer}>
            <div className={styles.arHeader}>
                <h2>{labels.arTitle as string}</h2>
                <p>{labels.arDesc as string}</p>
            </div>

            <div className={styles.cameraView}>
                {!cameraActive ? (
                    <div className={styles.cameraPlaceholder}>
                        <span className={styles.cameraIcon}>📷</span>
                        <p style={{ marginBottom: '1rem', color: '#aaa', textAlign: 'center' }}>
                            {locale === 'ar' ? 'قم بتوجيه الكاميرا نحو المعلم' : 'Point camera at a landmark'}
                        </p>

                        {cameraError && (
                            <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', maxWidth: '80%' }}>
                                ⚠️ {cameraError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={startCamera} className={styles.startCameraBtn}>
                                {labels.startAR as string}
                            </button>

                            <button
                                onClick={enableSimulation}
                                className={styles.startCameraBtn}
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                {locale === 'ar' ? 'تجربة المحاكاة' : 'Try Simulation'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.videoWrapper}>
                            {useSimulation ? (
                                <div className={styles.simulationOverlay} style={{
                                    backgroundImage: 'url(https://images.unsplash.com/photo-1570701123964-1e075c35b866)', // Placeholder Image (Masmak or similar)
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}>
                                    <div className={styles.simulationBadge}>
                                        {locale === 'ar' ? 'وضع المحاكاة' : 'Simulation Mode'}
                                    </div>
                                </div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={styles.cameraFeed}
                                />
                            )}

                            {/* Scanning Overlay Effect */}
                            {isLoading && <div className={styles.scanningLine}></div>}
                        </div>

                        <div className={styles.arControls}>
                            <button
                                onClick={analyzeScene}
                                className={styles.analyzeBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className={styles.spinner}></span>
                                ) : (
                                    '🔍 ' + (locale === 'ar' ? 'تحليل المشهد' : 'Scan Scene')
                                )}
                            </button>
                            <button onClick={stopCamera} className={styles.stopBtn}>
                                ❌
                            </button>
                        </div>
                    </>
                )}
            </div>

            {arData && (
                <ARInfoCard data={arData} locale={locale} />
            )}
        </div>
    );
}

// AR Info Card Component
function ARInfoCard({ data, locale }: { data: ARData; locale: 'ar' | 'en' }) {
    return (
        <div className={styles.arInfoCard}>
            <h3>{data.placeName}</h3>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{data.description}</p>

            {data.historicalFacts && data.historicalFacts.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>{locale === 'ar' ? 'حقائق تاريخية' : 'Historical Facts'}</h4>
                    <ul className={styles.tips}>
                        {data.historicalFacts.map((fact, index) => (
                            <li key={index}>{fact}</li>
                        ))}
                    </ul>
                </div>
            )}

            {data.tips && data.tips.length > 0 && (
                <div>
                    <h4 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>{locale === 'ar' ? 'نصائح' : 'Tips'}</h4>
                    <ul className={styles.tips}>
                        {data.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Placeholder for VR Tab
function VRHistoryTab({ locale, labels }: { locale: 'ar' | 'en'; labels: Record<string, unknown> }) {
    return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🏛️</span>
            <h3>{labels.vrTitle as string}</h3>
            <p>{locale === 'ar' ? 'قريباً...' : 'Coming soon...'}</p>
        </div>
    );
}
