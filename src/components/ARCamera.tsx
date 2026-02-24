'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ar-camera.module.css';

interface Place {
    id: string;
    name: string;
    nameAr: string;
    confidence: number;
    matchedFeatures: number;
    description: string;
    descriptionAr: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
}

interface RecognitionResult {
    success: boolean;
    recognized: boolean;
    place?: Place;
    message?: string;
}

interface ARCameraProps {
    onPlaceRecognized?: (place: Place) => void;
    language?: 'en' | 'ar';
    autoScan?: boolean;
    scanInterval?: number;
}

export default function ARCamera({
    onPlaceRecognized,
    language = 'ar',
    autoScan = false,
    scanInterval = 3000
}: ARCameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [recognizedPlace, setRecognizedPlace] = useState<Place | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [scanHistory, setScanHistory] = useState<Place[]>([]);
    const autoScanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // بدء تشغيل الكاميرا
    const startCamera = useCallback(async () => {
        try {
            setError(null);

            // التحقق من دعم المتصفح للكاميرا
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraPermission('denied');
                setError(language === 'ar'
                    ? 'المتصفح لا يدعم الوصول للكاميرا. حاول استخدام HTTPS أو متصفح آخر.'
                    : 'Browser does not support camera access. Try using HTTPS or another browser.');
                return;
            }

            // إيقاف أي ستريم سابق قبل بدء واحد جديد
            if (videoRef.current && videoRef.current.srcObject) {
                const oldStream = videoRef.current.srcObject as MediaStream;
                oldStream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // انتظار تحميل البيانات الوصفية قبل التشغيل
                await new Promise<void>((resolve, reject) => {
                    const video = videoRef.current!;
                    const onLoaded = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        resolve();
                    };
                    const onError = (e: Event) => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        reject(e);
                    };
                    // إذا كانت البيانات محملة بالفعل
                    if (video.readyState >= 1) {
                        resolve();
                        return;
                    }
                    video.addEventListener('loadedmetadata', onLoaded);
                    video.addEventListener('error', onError);
                });

                await videoRef.current.play();
                setIsStreaming(true);
                setCameraPermission('granted');
            } else {
                // إيقاف الستريم إذا العنصر مو موجود
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (err) {
            console.error('خطأ في الوصول للكاميرا:', err);

            const error = err as DOMException;
            if (error.name === 'NotAllowedError') {
                setCameraPermission('denied');
                setError(language === 'ar'
                    ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول من إعدادات المتصفح.'
                    : 'Camera permission denied. Please allow access from browser settings.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                setCameraPermission('denied');
                setError(language === 'ar'
                    ? 'لا توجد كاميرا متصلة بالجهاز.'
                    : 'No camera found on this device.');
            } else {
                setCameraPermission('denied');
                setError(language === 'ar'
                    ? 'لا يمكن الوصول للكاميرا. يرجى السماح بإذن الكاميرا.'
                    : 'Cannot access camera. Please allow camera permission.');
            }
        }
    }, [facingMode, language]);

    // إيقاف الكاميرا
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    }, []);

    // التقاط صورة من الكاميرا
    const captureFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        return canvas.toDataURL('image/jpeg', 0.8);
    }, []);

    // إرسال الصورة للتعرف
    const recognizePlace = useCallback(async () => {
        if (!isStreaming || isScanning) return;

        setIsScanning(true);
        setError(null);

        try {
            const imageData = captureFrame();
            if (!imageData) {
                throw new Error('فشل في التقاط الصورة');
            }

            const response = await fetch('/api/ar/recognize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData,
                    min_confidence: 0.3
                }),
            });

            const result: RecognitionResult = await response.json();

            if (result.success && result.recognized && result.place) {
                setRecognizedPlace(result.place);
                setScanHistory(prev => {
                    const exists = prev.some(p => p.id === result.place!.id);
                    if (!exists) {
                        return [result.place!, ...prev].slice(0, 10);
                    }
                    return prev;
                });

                if (onPlaceRecognized) {
                    onPlaceRecognized(result.place);
                }
            } else {
                setRecognizedPlace(null);
            }
        } catch (err) {
            console.error('خطأ في التعرف:', err);
            setError(language === 'ar'
                ? 'فشل في الاتصال بخدمة التعرف'
                : 'Failed to connect to recognition service');
        } finally {
            setIsScanning(false);
        }
    }, [isStreaming, isScanning, captureFrame, onPlaceRecognized, language]);

    // تبديل الكاميرا الأمامية/الخلفية
    const toggleCamera = useCallback(async () => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }, [stopCamera]);

    // إغلاق نتيجة التعرف
    const dismissResult = useCallback(() => {
        setRecognizedPlace(null);
    }, []);

    // الحصول على أيقونة الفئة
    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            'History': '🏛️',
            'Modern': '🏙️',
            'Shopping': '🛍️',
            'Dining': '🍽️',
            'Entertainment': '🎭',
            'Nature': '🌿'
        };
        return icons[category] || '📍';
    };

    // بدء/إيقاف الفحص التلقائي
    useEffect(() => {
        if (autoScan && isStreaming && !autoScanIntervalRef.current) {
            autoScanIntervalRef.current = setInterval(recognizePlace, scanInterval);
        } else if (!autoScan && autoScanIntervalRef.current) {
            clearInterval(autoScanIntervalRef.current);
            autoScanIntervalRef.current = null;
        }

        return () => {
            if (autoScanIntervalRef.current) {
                clearInterval(autoScanIntervalRef.current);
            }
        };
    }, [autoScan, isStreaming, recognizePlace, scanInterval]);

    // بدء الكاميرا عند تغيير الوضع (فقط إذا كان الإذن ممنوح مسبقاً)
    useEffect(() => {
        if (cameraPermission === 'granted') {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, [facingMode, startCamera, stopCamera, cameraPermission]);

    return (
        <div className={styles.arContainer} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* منطقة الكاميرا */}
            <div className={styles.cameraWrapper}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className={styles.canvas} />

                {/* إطار المسح */}
                <div className={styles.scanFrame}>
                    <div className={styles.corner + ' ' + styles.topLeft}></div>
                    <div className={styles.corner + ' ' + styles.topRight}></div>
                    <div className={styles.corner + ' ' + styles.bottomLeft}></div>
                    <div className={styles.corner + ' ' + styles.bottomRight}></div>
                    {isScanning && (
                        <div className={styles.scanLine}></div>
                    )}
                </div>

                {/* حالة المسح */}
                {isScanning && (
                    <div className={styles.scanningOverlay}>
                        <div className={styles.scanningSpinner}></div>
                        <span>{language === 'ar' ? 'جاري التعرف...' : 'Recognizing...'}</span>
                    </div>
                )}

                {/* رسالة الخطأ */}
                {error && (
                    <div className={styles.errorMessage}>
                        <span>⚠️</span>
                        <p>{error}</p>
                        <button onClick={startCamera}>
                            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                        </button>
                    </div>
                )}

                {/* طلب إذن الكاميرا */}
                {cameraPermission === 'pending' && !isStreaming && (
                    <div className={styles.permissionPrompt}>
                        <div className={styles.permissionIcon}>📷</div>
                        <h3>{language === 'ar' ? 'إذن الكاميرا مطلوب' : 'Camera Permission Required'}</h3>
                        <p>
                            {language === 'ar'
                                ? 'نحتاج إلى الوصول للكاميرا للتعرف على الأماكن السياحية'
                                : 'We need camera access to recognize tourist places'}
                        </p>
                        <button onClick={startCamera} className={styles.permissionBtn}>
                            {language === 'ar' ? 'السماح بالكاميرا' : 'Allow Camera'}
                        </button>
                    </div>
                )}
            </div>

            {/* أزرار التحكم */}
            <div className={styles.controls}>
                <button
                    className={styles.controlBtn}
                    onClick={toggleCamera}
                    disabled={!isStreaming}
                    title={language === 'ar' ? 'تبديل الكاميرا' : 'Switch Camera'}
                >
                    🔄
                </button>

                <button
                    className={styles.scanBtn}
                    onClick={recognizePlace}
                    disabled={!isStreaming || isScanning}
                >
                    {isScanning ? (
                        <span className={styles.btnSpinner}></span>
                    ) : (
                        '🔍'
                    )}
                    <span>
                        {isScanning
                            ? (language === 'ar' ? 'جاري المسح...' : 'Scanning...')
                            : (language === 'ar' ? 'مسح المكان' : 'Scan Place')}
                    </span>
                </button>

                <button
                    className={styles.controlBtn}
                    onClick={() => setRecognizedPlace(null)}
                    disabled={!recognizedPlace}
                    title={language === 'ar' ? 'مسح النتيجة' : 'Clear Result'}
                >
                    ✖️
                </button>
            </div>

            {/* نتيجة التعرف */}
            {recognizedPlace && (
                <div className={styles.resultCard}>
                    <button className={styles.closeBtn} onClick={dismissResult}>×</button>

                    <div className={styles.resultHeader}>
                        <span className={styles.categoryIcon}>
                            {getCategoryIcon(recognizedPlace.category)}
                        </span>
                        <div className={styles.placeInfo}>
                            <h2>{language === 'ar' ? recognizedPlace.nameAr : recognizedPlace.name}</h2>
                            <span className={styles.category}>
                                {recognizedPlace.category}
                            </span>
                        </div>
                        <div className={styles.confidenceBadge}>
                            <span className={styles.confidenceValue}>{recognizedPlace.confidence}%</span>
                            <span className={styles.confidenceLabel}>
                                {language === 'ar' ? 'دقة' : 'Confidence'}
                            </span>
                        </div>
                    </div>

                    <p className={styles.description}>
                        {language === 'ar' ? recognizedPlace.descriptionAr : recognizedPlace.description}
                    </p>

                    <div className={styles.actions}>
                        <a
                            href={`/place/${recognizedPlace.id}`}
                            className={styles.actionBtn + ' ' + styles.primaryAction}
                        >
                            📖 {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </a>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${recognizedPlace.location.lat},${recognizedPlace.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn + ' ' + styles.secondaryAction}
                        >
                            🧭 {language === 'ar' ? 'اتجاهات' : 'Directions'}
                        </a>
                        <button
                            className={styles.actionBtn + ' ' + styles.secondaryAction}
                            onClick={() => {/* تشغيل الدليل الصوتي */ }}
                        >
                            🎧 {language === 'ar' ? 'دليل صوتي' : 'Audio Guide'}
                        </button>
                    </div>

                    <div className={styles.matchInfo}>
                        <span>🎯 {recognizedPlace.matchedFeatures} {language === 'ar' ? 'ميزات متطابقة' : 'matched features'}</span>
                    </div>
                </div>
            )}

            {/* سجل الفحص */}
            {scanHistory.length > 0 && !recognizedPlace && (
                <div className={styles.historyPanel}>
                    <h4>{language === 'ar' ? 'الأماكن المكتشفة' : 'Discovered Places'}</h4>
                    <div className={styles.historyList}>
                        {scanHistory.map((place) => (
                            <a
                                key={place.id}
                                href={`/place/${place.id}`}
                                className={styles.historyItem}
                            >
                                <span className={styles.historyIcon}>
                                    {getCategoryIcon(place.category)}
                                </span>
                                <span className={styles.historyName}>
                                    {language === 'ar' ? place.nameAr : place.name}
                                </span>
                                <span className={styles.historyConfidence}>
                                    {place.confidence}%
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* تعليمات الاستخدام */}
            {isStreaming && !recognizedPlace && !isScanning && (
                <div className={styles.instructions}>
                    <p>
                        {language === 'ar'
                            ? '📸 وجّه الكاميرا نحو معلم سياحي واضغط على "مسح المكان"'
                            : '📸 Point camera at a landmark and tap "Scan Place"'}
                    </p>
                </div>
            )}
        </div>
    );
}
