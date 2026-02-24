'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './admin.module.css';

interface Place {
    id: string;
    name: string;
    name_ar: string;
    category: string;
    has_reference_images: boolean;
    reference_count: number;
}

export default function ARAdminPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // تحميل قائمة الأماكن
    useEffect(() => {
        async function loadPlaces() {
            try {
                const response = await fetch('/api/ar/reference');
                const data = await response.json();
                if (data.success) {
                    setPlaces(data.places);
                }
            } catch (error) {
                console.error('خطأ في تحميل الأماكن:', error);
            }
        }
        loadPlaces();
    }, []);

    // معالجة اختيار الملف
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // رفع الصورة المرجعية
    const handleUpload = async () => {
        if (!selectedPlace || !previewImage) {
            setMessage({ type: 'error', text: 'يرجى اختيار مكان وصورة' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/ar/reference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    place_id: selectedPlace,
                    image: previewImage
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: result.message || 'تم رفع الصورة بنجاح!' });
                setPreviewImage(null);
                setSelectedPlace('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // تحديث القائمة
                const updatedResponse = await fetch('/api/ar/reference');
                const updatedData = await updatedResponse.json();
                if (updatedData.success) {
                    setPlaces(updatedData.places);
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'فشل في رفع الصورة' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
        } finally {
            setUploading(false);
        }
    };

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

    return (
        <div className={styles.container} dir="rtl">
            {/* Header */}
            <header className={styles.header}>
                <a href="/admin" className={styles.backBtn}>→</a>
                <h1>إدارة الواقع المعزز</h1>
                <a href="/ar" className={styles.testBtn}>
                    📸 اختبار AR
                </a>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Upload Section */}
                <section className={styles.uploadSection}>
                    <h2>📤 رفع صورة مرجعية</h2>
                    <p className={styles.sectionDesc}>
                        ارفع صور للأماكن السياحية لتدريب نظام التعرف بالذكاء الاصطناعي
                    </p>

                    <div className={styles.uploadForm}>
                        {/* اختيار المكان */}
                        <div className={styles.formGroup}>
                            <label>اختر المكان</label>
                            <select
                                value={selectedPlace}
                                onChange={(e) => setSelectedPlace(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">-- اختر مكان --</option>
                                {places.map((place) => (
                                    <option key={place.id} value={place.id}>
                                        {getCategoryIcon(place.category)} {place.name_ar} ({place.reference_count} صور)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* منطقة الرفع */}
                        <div className={styles.formGroup}>
                            <label>اختر صورة</label>
                            <div
                                className={styles.dropZone}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewImage ? (
                                    <img src={previewImage} alt="معاينة" className={styles.preview} />
                                ) : (
                                    <div className={styles.dropContent}>
                                        <span className={styles.dropIcon}>📷</span>
                                        <p>اضغط لاختيار صورة</p>
                                        <span className={styles.dropHint}>JPG, PNG - حتى 10MB</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                hidden
                            />
                        </div>

                        {/* رسالة */}
                        {message && (
                            <div className={`${styles.message} ${styles[message.type]}`}>
                                {message.type === 'success' ? '✓' : '⚠'} {message.text}
                            </div>
                        )}

                        {/* زر الرفع */}
                        <button
                            className={styles.uploadBtn}
                            onClick={handleUpload}
                            disabled={uploading || !selectedPlace || !previewImage}
                        >
                            {uploading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    جاري الرفع...
                                </>
                            ) : (
                                <>📤 رفع الصورة</>
                            )}
                        </button>
                    </div>
                </section>

                {/* Places List */}
                <section className={styles.placesSection}>
                    <h2>📍 الأماكن المسجلة</h2>
                    <div className={styles.placesList}>
                        {places.map((place) => (
                            <div
                                key={place.id}
                                className={`${styles.placeCard} ${place.has_reference_images ? styles.hasImages : ''}`}
                            >
                                <span className={styles.placeIcon}>{getCategoryIcon(place.category)}</span>
                                <div className={styles.placeInfo}>
                                    <h3>{place.name_ar}</h3>
                                    <span className={styles.placeName}>{place.name}</span>
                                </div>
                                <div className={styles.placeStats}>
                                    <span className={styles.refCount}>
                                        {place.reference_count}
                                        <small>صور</small>
                                    </span>
                                    <span className={`${styles.status} ${place.has_reference_images ? styles.active : styles.inactive}`}>
                                        {place.has_reference_images ? '✓ مدرّب' : '○ غير مدرّب'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Info Section */}
                <section className={styles.infoSection}>
                    <h3>💡 نصائح لتحسين دقة التعرف</h3>
                    <ul>
                        <li>ارفع عدة صور من زوايا مختلفة لكل مكان</li>
                        <li>استخدم صور بجودة عالية ووضوح جيد</li>
                        <li>تأكد من ظهور المعالم الرئيسية في الصور</li>
                        <li>تجنب الصور المعتمة أو الضبابية</li>
                        <li>يُفضل رفع 5-10 صور لكل مكان للحصول على أفضل نتائج</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
