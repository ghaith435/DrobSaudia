"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./audio-tours-admin.module.css";

interface AudioStop {
    id?: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    documentaryScript?: string;
    documentaryScriptAr?: string;
    narrativeScript?: string;
    narrativeScriptAr?: string;
    duration: string;
    audioUrl?: string;
    image?: string;
    order: number;
}

interface AudioTour {
    id: string;
    cityId: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    fullDescription: string;
    fullDescriptionAr: string;
    duration: string;
    durationAr?: string;
    stops: number;
    image: string;
    category: string;
    categoryAr: string;
    rating: number;
    reviews?: number;
    isFeatured: boolean;
    pointsCost: number;
    hasSubTours: boolean;
    vrSupported: boolean;
    contentSource: 'ai_generated' | 'manual' | 'tourism_authority';
    playlist: AudioStop[];
    isActive?: boolean;
    lastUpdated?: string;
}

const CITIES = [
    { id: 'riyadh', name: 'Riyadh', nameAr: 'الرياض' },
    { id: 'jeddah', name: 'Jeddah', nameAr: 'جدة' },
    { id: 'mecca', name: 'Mecca', nameAr: 'مكة' },
    { id: 'medina', name: 'Medina', nameAr: 'المدينة' },
    { id: 'alula', name: 'AlUla', nameAr: 'العلا' },
    { id: 'dammam', name: 'Dammam', nameAr: 'الدمام' },
    { id: 'abha', name: 'Abha', nameAr: 'أبها' },
    { id: 'taif', name: 'Taif', nameAr: 'الطائف' },
];

const CATEGORIES = [
    { id: 'Historical', nameAr: 'تاريخي' },
    { id: 'Religious', nameAr: 'ديني' },
    { id: 'Modern', nameAr: 'حديث' },
    { id: 'Nature', nameAr: 'طبيعة' },
    { id: 'Heritage', nameAr: 'تراثي' },
    { id: 'Archaeological', nameAr: 'أثري' },
    { id: 'Lifestyle', nameAr: 'أسلوب حياة' },
];

const CONTENT_SOURCES = [
    { id: 'tourism_authority', name: 'Tourism Authority', nameAr: 'هيئة السياحة' },
    { id: 'ai_generated', name: 'AI Generated', nameAr: 'توليد ذكي' },
    { id: 'manual', name: 'Manual', nameAr: 'يدوي' },
];

const STORAGE_KEY = 'audio_tours_data';

// Generate unique ID
const generateId = () => `tour-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function AudioToursAdmin() {
    const [tours, setTours] = useState<AudioTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTour, setEditingTour] = useState<AudioTour | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const [filterCity, setFilterCity] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null);

    // Empty form state
    const getEmptyForm = (): AudioTour => ({
        id: generateId(),
        cityId: 'riyadh',
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        fullDescription: '',
        fullDescriptionAr: '',
        duration: '30 min',
        durationAr: '30 دقيقة',
        stops: 0,
        image: '',
        category: 'Historical',
        categoryAr: 'تاريخي',
        rating: 4.5,
        reviews: 0,
        isFeatured: false,
        pointsCost: 50,
        hasSubTours: false,
        vrSupported: false,
        contentSource: 'manual',
        playlist: [],
        lastUpdated: new Date().toISOString().split('T')[0],
    });

    // Form state
    const [formData, setFormData] = useState<AudioTour>(getEmptyForm());

    // Current stop being edited
    const [currentStop, setCurrentStop] = useState<AudioStop>({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        documentaryScript: '',
        documentaryScriptAr: '',
        narrativeScript: '',
        narrativeScriptAr: '',
        duration: '05:00',
        audioUrl: '',
        image: '',
        order: 0,
    });

    // Load tours from localStorage or default data
    const loadTours = useCallback(async () => {
        try {
            setLoading(true);

            // Try to load from localStorage first
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setTours(parsedData);
            } else {
                // Load default data from file
                const { allEnhancedAudioTours } = await import('@/data/audio-tours-enhanced');
                const toursWithIds = allEnhancedAudioTours.map((tour, index) => ({
                    ...tour,
                    id: tour.id || `tour-${index}`,
                    playlist: tour.playlist?.map((stop, stopIndex) => ({
                        ...stop,
                        order: stopIndex,
                    })) || [],
                }));
                setTours(toursWithIds as AudioTour[]);
                // Save to localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(toursWithIds));
            }
        } catch (error) {
            console.error('Error loading tours:', error);
            showNotification('error', 'فشل في تحميل الرحلات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTours();
    }, [loadTours]);

    // Save tours to localStorage
    const saveTours = (updatedTours: AudioTour[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTours));
            setTours(updatedTours);
            return true;
        } catch (error) {
            console.error('Error saving tours:', error);
            return false;
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleInputChange = (field: keyof AudioTour, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-update Arabic category when category changes
        if (field === 'category') {
            const cat = CATEGORIES.find(c => c.id === value);
            if (cat) {
                setFormData(prev => ({ ...prev, categoryAr: cat.nameAr }));
            }
        }
    };

    const handleStopChange = (field: keyof AudioStop, value: string | number) => {
        setCurrentStop(prev => ({ ...prev, [field]: value }));
    };

    const addStop = () => {
        if (!currentStop.title || !currentStop.titleAr) {
            showNotification('error', 'يرجى إدخال عنوان المحطة بالعربي والإنجليزي');
            return;
        }

        if (editingStopIndex !== null) {
            // Update existing stop
            const updatedPlaylist = [...formData.playlist];
            updatedPlaylist[editingStopIndex] = { ...currentStop, order: editingStopIndex };
            setFormData(prev => ({
                ...prev,
                playlist: updatedPlaylist,
            }));
            setEditingStopIndex(null);
            showNotification('success', 'تم تحديث المحطة');
        } else {
            // Add new stop
            setFormData(prev => ({
                ...prev,
                playlist: [...prev.playlist, { ...currentStop, order: prev.playlist.length }],
                stops: prev.playlist.length + 1,
            }));
            showNotification('success', 'تمت إضافة المحطة');
        }

        // Reset current stop
        resetCurrentStop();
    };

    const resetCurrentStop = () => {
        setCurrentStop({
            title: '',
            titleAr: '',
            description: '',
            descriptionAr: '',
            documentaryScript: '',
            documentaryScriptAr: '',
            narrativeScript: '',
            narrativeScriptAr: '',
            duration: '05:00',
            audioUrl: '',
            image: '',
            order: 0,
        });
        setEditingStopIndex(null);
    };

    const editStop = (index: number) => {
        const stop = formData.playlist[index];
        setCurrentStop({ ...stop });
        setEditingStopIndex(index);
    };

    const removeStop = (index: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه المحطة؟')) return;

        setFormData(prev => ({
            ...prev,
            playlist: prev.playlist.filter((_, i) => i !== index).map((stop, i) => ({ ...stop, order: i })),
            stops: prev.playlist.length - 1,
        }));
        showNotification('success', 'تم حذف المحطة');
    };

    const moveStop = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= formData.playlist.length) return;

        const updatedPlaylist = [...formData.playlist];
        [updatedPlaylist[index], updatedPlaylist[newIndex]] = [updatedPlaylist[newIndex], updatedPlaylist[index]];

        setFormData(prev => ({
            ...prev,
            playlist: updatedPlaylist.map((stop, i) => ({ ...stop, order: i })),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.titleAr) {
            showNotification('error', 'يرجى إدخال عنوان الرحلة بالعربي والإنجليزي');
            return;
        }

        if (!formData.image) {
            showNotification('error', 'يرجى إدخال رابط صورة الرحلة');
            return;
        }

        try {
            let updatedTours: AudioTour[];
            const tourData = {
                ...formData,
                stops: formData.playlist.length,
                lastUpdated: new Date().toISOString().split('T')[0],
            };

            if (editingTour) {
                // Update existing tour
                updatedTours = tours.map(t => t.id === editingTour.id ? tourData : t);
                showNotification('success', '✅ تم تحديث الرحلة بنجاح');
            } else {
                // Add new tour
                updatedTours = [...tours, tourData];
                showNotification('success', '✅ تمت إضافة الرحلة بنجاح');
            }

            if (saveTours(updatedTours)) {
                resetForm();
                setActiveTab('list');
            } else {
                showNotification('error', 'فشل في حفظ البيانات');
            }
        } catch (error) {
            console.error('Error saving tour:', error);
            showNotification('error', 'حدث خطأ أثناء الحفظ');
        }
    };

    const resetForm = () => {
        setFormData(getEmptyForm());
        setEditingTour(null);
        resetCurrentStop();
    };

    const editTour = (tour: AudioTour) => {
        setFormData({
            ...tour,
            playlist: tour.playlist || [],
        });
        setEditingTour(tour);
        setActiveTab('add');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const duplicateTour = (tour: AudioTour) => {
        const newTour: AudioTour = {
            ...tour,
            id: generateId(),
            title: `${tour.title} (نسخة)`,
            titleAr: `${tour.titleAr} (نسخة)`,
            lastUpdated: new Date().toISOString().split('T')[0],
        };

        const updatedTours = [...tours, newTour];
        if (saveTours(updatedTours)) {
            showNotification('success', 'تم نسخ الرحلة بنجاح');
        }
    };

    const deleteTour = async (tourId: string) => {
        if (!confirm('⚠️ هل أنت متأكد من حذف هذه الرحلة؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        try {
            const updatedTours = tours.filter(t => t.id !== tourId);
            if (saveTours(updatedTours)) {
                showNotification('success', 'تم حذف الرحلة');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            showNotification('error', 'فشل في حذف الرحلة');
        }
    };

    const generateAIContent = async () => {
        if (!formData.title) {
            showNotification('error', 'يرجى إدخال عنوان الرحلة أولاً');
            return;
        }

        try {
            showNotification('success', '🤖 جاري توليد المحتوى بالذكاء الاصطناعي...');

            const response = await fetch('/api/audio-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    placeName: formData.title,
                    placeDescription: formData.description,
                    language: 'ar',
                    style: 'combined',
                }),
            });

            const data = await response.json();
            if (data.success && data.data?.script) {
                setFormData(prev => ({
                    ...prev,
                    fullDescriptionAr: data.data.script,
                    contentSource: 'ai_generated',
                }));
                showNotification('success', '✅ تم توليد المحتوى بنجاح');
            } else {
                showNotification('error', 'فشل في توليد المحتوى');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            showNotification('error', 'حدث خطأ أثناء توليد المحتوى');
        }
    };

    const resetToDefaults = async () => {
        if (!confirm('⚠️ هل تريد إعادة تحميل البيانات الأصلية؟ سيتم فقدان جميع التعديلات.')) return;

        localStorage.removeItem(STORAGE_KEY);
        await loadTours();
        showNotification('success', 'تم إعادة تحميل البيانات الأصلية');
    };

    // Filter tours
    const filteredTours = tours.filter(tour => {
        if (filterCity !== 'all' && tour.cityId !== filterCity) return false;
        if (filterCategory !== 'all' && tour.category !== filterCategory) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return tour.title.toLowerCase().includes(query) ||
                tour.titleAr.includes(query) ||
                tour.description.toLowerCase().includes(query);
        }
        return true;
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backLink}>
                        ← العودة للوحة التحكم
                    </Link>
                    <h1 className={styles.title}>🎧 إدارة الرحلات الصوتية</h1>
                    <p className={styles.subtitle}>
                        إضافة وتعديل وحذف الرحلات الصوتية للمعالم السياحية
                    </p>
                </div>
                <div className={styles.headerStats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{tours.length}</span>
                        <span className={styles.statLabel}>رحلة</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{tours.reduce((acc, t) => acc + (t.playlist?.length || 0), 0)}</span>
                        <span className={styles.statLabel}>محطة</span>
                    </div>
                    <button onClick={resetToDefaults} className={styles.resetBtn} title="إعادة تحميل البيانات الأصلية">
                        🔄
                    </button>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
                    onClick={() => { setActiveTab('list'); resetForm(); }}
                >
                    📋 قائمة الرحلات ({tours.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'add' ? styles.active : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    {editingTour ? '✏️ تعديل الرحلة' : '➕ إضافة رحلة جديدة'}
                </button>
            </div>

            {/* List View */}
            {activeTab === 'list' && (
                <div className={styles.listSection}>
                    {/* Filters */}
                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="البحث في الرحلات..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className={styles.clearSearch}>✕</button>
                            )}
                        </div>

                        <select
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">🏙️ كل المدن</option>
                            {CITIES.map(city => (
                                <option key={city.id} value={city.id}>{city.nameAr}</option>
                            ))}
                        </select>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">🏷️ كل التصنيفات</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tours List */}
                    {loading ? (
                        <div className={styles.loading}>
                            <span className={styles.spinner}>⏳</span>
                            جاري التحميل...
                        </div>
                    ) : filteredTours.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span>📭</span>
                            <p>لا توجد رحلات مطابقة للبحث</p>
                            <button
                                className={styles.addFirstBtn}
                                onClick={() => setActiveTab('add')}
                            >
                                ➕ أضف أول رحلة
                            </button>
                        </div>
                    ) : (
                        <div className={styles.toursList}>
                            {filteredTours.map((tour) => (
                                <div key={tour.id} className={styles.tourCard}>
                                    <div className={styles.tourImage}>
                                        {tour.image ? (
                                            <img src={tour.image} alt={tour.title} onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }} />
                                        ) : null}
                                        <div className={styles.imagePlaceholder}>🎧</div>
                                        {tour.isFeatured && (
                                            <span className={styles.featuredBadge}>⭐ مميز</span>
                                        )}
                                    </div>

                                    <div className={styles.tourInfo}>
                                        <h3 className={styles.tourTitle}>{tour.titleAr}</h3>
                                        <p className={styles.tourTitleEn}>{tour.title}</p>
                                        <p className={styles.tourDesc}>{tour.descriptionAr || tour.description}</p>

                                        <div className={styles.tourMeta}>
                                            <span className={styles.metaItem}>
                                                📍 {CITIES.find(c => c.id === tour.cityId)?.nameAr || tour.cityId}
                                            </span>
                                            <span className={styles.metaItem}>
                                                🏷️ {tour.categoryAr}
                                            </span>
                                            <span className={styles.metaItem}>
                                                ⏱️ {tour.duration}
                                            </span>
                                            <span className={styles.metaItem}>
                                                🎧 {tour.playlist?.length || 0} محطة
                                            </span>
                                            <span className={styles.metaItem}>
                                                ⭐ {tour.rating}
                                            </span>
                                        </div>

                                        <div className={styles.tourTags}>
                                            {tour.vrSupported && <span className={styles.tag}>🥽 VR</span>}
                                            {tour.hasSubTours && <span className={styles.tag}>🗺️ جولات فرعية</span>}
                                            <span className={`${styles.tag} ${styles[tour.contentSource]}`}>
                                                {CONTENT_SOURCES.find(s => s.id === tour.contentSource)?.nameAr}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.tourActions}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => editTour(tour)}
                                            title="تعديل"
                                        >
                                            ✏️ تعديل
                                        </button>
                                        <button
                                            className={styles.duplicateBtn}
                                            onClick={() => duplicateTour(tour)}
                                            title="نسخ"
                                        >
                                            📋 نسخ
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => deleteTour(tour.id)}
                                            title="حذف"
                                        >
                                            🗑️ حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Form */}
            {activeTab === 'add' && (
                <form onSubmit={handleSubmit} className={styles.formSection}>
                    {/* Editing indicator */}
                    {editingTour && (
                        <div className={styles.editingBanner}>
                            ✏️ أنت تقوم بتعديل: <strong>{editingTour.titleAr}</strong>
                            <button type="button" onClick={resetForm} className={styles.cancelEditBtn}>
                                إلغاء التعديل
                            </button>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className={styles.formCard}>
                        <h2 className={styles.sectionTitle}>📝 المعلومات الأساسية</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>العنوان (عربي) *</label>
                                <input
                                    type="text"
                                    value={formData.titleAr}
                                    onChange={(e) => handleInputChange('titleAr', e.target.value)}
                                    placeholder="مثال: جولة الدرعية التاريخية"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>العنوان (إنجليزي) *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Diriyah Historical Tour"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>الوصف المختصر (عربي) *</label>
                                <textarea
                                    value={formData.descriptionAr}
                                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                                    placeholder="وصف مختصر للرحلة باللغة العربية..."
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>الوصف المختصر (إنجليزي) *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Short description in English..."
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>الوصف الكامل (عربي)</label>
                                <textarea
                                    value={formData.fullDescriptionAr}
                                    onChange={(e) => handleInputChange('fullDescriptionAr', e.target.value)}
                                    placeholder="وصف تفصيلي للرحلة..."
                                    rows={4}
                                />
                                <button
                                    type="button"
                                    className={styles.aiBtn}
                                    onClick={generateAIContent}
                                >
                                    🤖 توليد بالذكاء الاصطناعي
                                </button>
                            </div>

                            <div className={styles.formGroup}>
                                <label>الوصف الكامل (إنجليزي)</label>
                                <textarea
                                    value={formData.fullDescription}
                                    onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                                    placeholder="Full description in English..."
                                    rows={4}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>رابط الصورة الرئيسية *</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                                {formData.image && (
                                    <div className={styles.imagePreview}>
                                        <img src={formData.image} alt="معاينة" onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className={styles.formCard}>
                        <h2 className={styles.sectionTitle}>⚙️ الإعدادات</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>المدينة *</label>
                                <select
                                    value={formData.cityId}
                                    onChange={(e) => handleInputChange('cityId', e.target.value)}
                                    required
                                >
                                    {CITIES.map(city => (
                                        <option key={city.id} value={city.id}>{city.nameAr}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>التصنيف *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>مصدر المحتوى</label>
                                <select
                                    value={formData.contentSource}
                                    onChange={(e) => handleInputChange('contentSource', e.target.value)}
                                >
                                    {CONTENT_SOURCES.map(source => (
                                        <option key={source.id} value={source.id}>{source.nameAr}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>المدة</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    placeholder="مثال: 45 min"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>التقييم (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>تكلفة النقاط</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.pointsCost}
                                    onChange={(e) => handleInputChange('pointsCost', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                                />
                                <span>⭐ رحلة مميزة</span>
                            </label>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.vrSupported}
                                    onChange={(e) => handleInputChange('vrSupported', e.target.checked)}
                                />
                                <span>🥽 دعم VR</span>
                            </label>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={formData.hasSubTours}
                                    onChange={(e) => handleInputChange('hasSubTours', e.target.checked)}
                                />
                                <span>🗺️ تحتوي جولات فرعية</span>
                            </label>
                        </div>
                    </div>

                    {/* Audio Stops */}
                    <div className={styles.formCard}>
                        <h2 className={styles.sectionTitle}>🎧 محطات الرحلة ({formData.playlist.length})</h2>

                        {/* Existing stops */}
                        {formData.playlist.length > 0 && (
                            <div className={styles.stopsList}>
                                {formData.playlist.map((stop, index) => (
                                    <div key={index} className={`${styles.stopItem} ${editingStopIndex === index ? styles.editing : ''}`}>
                                        <span className={styles.stopOrder}>{index + 1}</span>
                                        <div className={styles.stopInfo}>
                                            <strong>{stop.titleAr}</strong>
                                            <span>{stop.title}</span>
                                        </div>
                                        <span className={styles.stopDuration}>⏱️ {stop.duration}</span>
                                        <div className={styles.stopActions}>
                                            <button
                                                type="button"
                                                className={styles.moveBtn}
                                                onClick={() => moveStop(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                ⬆️
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.moveBtn}
                                                onClick={() => moveStop(index, 'down')}
                                                disabled={index === formData.playlist.length - 1}
                                            >
                                                ⬇️
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.editStopBtn}
                                                onClick={() => editStop(index)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeStop(index)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add/Edit stop form */}
                        <div className={styles.addStopSection}>
                            <h3>{editingStopIndex !== null ? '✏️ تعديل المحطة' : '➕ إضافة محطة جديدة'}</h3>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>اسم المحطة (عربي) *</label>
                                    <input
                                        type="text"
                                        value={currentStop.titleAr}
                                        onChange={(e) => handleStopChange('titleAr', e.target.value)}
                                        placeholder="مثال: قصر سلوى"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>اسم المحطة (إنجليزي) *</label>
                                    <input
                                        type="text"
                                        value={currentStop.title}
                                        onChange={(e) => handleStopChange('title', e.target.value)}
                                        placeholder="e.g., Salwa Palace"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>الوصف (عربي)</label>
                                    <textarea
                                        value={currentStop.descriptionAr}
                                        onChange={(e) => handleStopChange('descriptionAr', e.target.value)}
                                        placeholder="وصف المحطة..."
                                        rows={2}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>الوصف (إنجليزي)</label>
                                    <textarea
                                        value={currentStop.description}
                                        onChange={(e) => handleStopChange('description', e.target.value)}
                                        placeholder="Stop description..."
                                        rows={2}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>📚 النص التوثيقي (عربي)</label>
                                    <textarea
                                        value={currentStop.documentaryScriptAr}
                                        onChange={(e) => handleStopChange('documentaryScriptAr', e.target.value)}
                                        placeholder="حقائق وتواريخ ومعلومات تاريخية..."
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>📚 النص التوثيقي (إنجليزي)</label>
                                    <textarea
                                        value={currentStop.documentaryScript}
                                        onChange={(e) => handleStopChange('documentaryScript', e.target.value)}
                                        placeholder="Facts, dates and historical information..."
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>📖 النص القصصي (عربي)</label>
                                    <textarea
                                        value={currentStop.narrativeScriptAr}
                                        onChange={(e) => handleStopChange('narrativeScriptAr', e.target.value)}
                                        placeholder="سرد قصصي غامر ينقل المستمع للمكان..."
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>📖 النص القصصي (إنجليزي)</label>
                                    <textarea
                                        value={currentStop.narrativeScript}
                                        onChange={(e) => handleStopChange('narrativeScript', e.target.value)}
                                        placeholder="Immersive narrative storytelling..."
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>المدة</label>
                                    <input
                                        type="text"
                                        value={currentStop.duration}
                                        onChange={(e) => handleStopChange('duration', e.target.value)}
                                        placeholder="05:00"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>رابط الصوت</label>
                                    <input
                                        type="text"
                                        value={currentStop.audioUrl}
                                        onChange={(e) => handleStopChange('audioUrl', e.target.value)}
                                        placeholder="/audio/tours/..."
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>رابط صورة المحطة</label>
                                    <input
                                        type="url"
                                        value={currentStop.image}
                                        onChange={(e) => handleStopChange('image', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className={styles.stopFormActions}>
                                <button
                                    type="button"
                                    className={styles.addStopBtn}
                                    onClick={addStop}
                                >
                                    {editingStopIndex !== null ? '💾 حفظ التعديلات' : '➕ إضافة المحطة'}
                                </button>
                                {editingStopIndex !== null && (
                                    <button
                                        type="button"
                                        className={styles.cancelStopBtn}
                                        onClick={resetCurrentStop}
                                    >
                                        ❌ إلغاء
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn}>
                            {editingTour ? '💾 حفظ التعديلات' : '✅ إضافة الرحلة'}
                        </button>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => { resetForm(); setActiveTab('list'); }}
                        >
                            ❌ إلغاء
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
