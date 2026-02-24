'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './creator.module.css';

interface ExperienceForm {
    // Basic Info
    title: string;
    titleAr: string;
    subtitle: string;
    description: string;
    descriptionAr: string;

    // Category & Tags
    category: string;
    subcategory: string;
    tags: string[];

    // Duration & Capacity
    minDuration: number;
    maxDuration: number;
    minGuests: number;
    maxGuests: number;
    dynamicDuration: boolean;

    // Pricing
    pricingTier: string;
    basePrice: number;
    pricePerPerson: number | null;
    childPrice: number | null;
    groupDiscount: number | null;

    // Location
    meetingPoint: string;
    meetingPointAr: string;
    latitude: number | null;
    longitude: number | null;

    // Requirements
    requirements: string[];
    includedItems: string[];
    excludedItems: string[];
    languages: string[];

    // Media
    coverImage: string;
    gallery: string[];
    videoUrl: string;
}

const CATEGORIES = [
    { id: 'CULTURAL', name: 'Cultural', icon: '🏛️' },
    { id: 'CULINARY', name: 'Culinary', icon: '🍽️' },
    { id: 'ADVENTURE', name: 'Adventure', icon: '🏜️' },
    { id: 'WELLNESS', name: 'Wellness', icon: '🧘' },
    { id: 'ART', name: 'Art', icon: '🎨' },
    { id: 'HISTORY', name: 'History', icon: '📜' },
    { id: 'NATURE', name: 'Nature', icon: '🌿' },
    { id: 'PHOTOGRAPHY', name: 'Photography', icon: '📷' },
];

const PRICING_TIERS = [
    { id: 'ECONOMY', name: 'Economy', description: 'Budget-friendly', commission: '12%' },
    { id: 'STANDARD', name: 'Standard', description: 'Best value', commission: '15%' },
    { id: 'PREMIUM', name: 'Premium', description: 'Enhanced quality', commission: '18%' },
    { id: 'LUXURY', name: 'Luxury', description: 'Exclusive', commission: '20%' },
];

const LANGUAGES = [
    { id: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

const STEPS = [
    { id: 1, title: 'Basics', icon: '📝' },
    { id: 2, title: 'Details', icon: '📋' },
    { id: 3, title: 'Pricing', icon: '💰' },
    { id: 4, title: 'Media', icon: '📸' },
    { id: 5, title: 'Review', icon: '✓' },
];

export default function ExperienceCreator() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const [form, setForm] = useState<ExperienceForm>({
        title: '',
        titleAr: '',
        subtitle: '',
        description: '',
        descriptionAr: '',
        category: '',
        subcategory: '',
        tags: [],
        minDuration: 60,
        maxDuration: 180,
        minGuests: 1,
        maxGuests: 10,
        dynamicDuration: false,
        pricingTier: 'STANDARD',
        basePrice: 0,
        pricePerPerson: null,
        childPrice: null,
        groupDiscount: null,
        meetingPoint: '',
        meetingPointAr: '',
        latitude: null,
        longitude: null,
        requirements: [],
        includedItems: [],
        excludedItems: [],
        languages: ['ar', 'en'],
        coverImage: '',
        gallery: [],
        videoUrl: ''
    });

    const updateForm = (field: keyof ExperienceForm, value: unknown) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!form.tags.includes(tagInput.trim())) {
                updateForm('tags', [...form.tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        updateForm('tags', form.tags.filter(t => t !== tag));
    };

    const toggleLanguage = (lang: string) => {
        if (form.languages.includes(lang)) {
            if (form.languages.length > 1) {
                updateForm('languages', form.languages.filter(l => l !== lang));
            }
        } else {
            updateForm('languages', [...form.languages, lang]);
        }
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // In production, this would be an API call
            const response = await fetch('/api/experiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    guideId: 'current-guide-id' // Would come from session
                })
            });

            if (response.ok) {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error('Failed to create experience:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render functions for each step
    const renderStep1 = () => (
        <>
            <h2 className={styles.stepTitle}>📝 Basic Information</h2>
            <p className={styles.stepDescription}>
                Start with the essentials. Give your experience a compelling name and description.
            </p>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Experience Title <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Discover Historic Diriyah"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                />
                <p className={styles.inputHelper}>Make it catchy and descriptive</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Arabic Title</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="العنوان بالعربية"
                    value={form.titleAr}
                    onChange={(e) => updateForm('titleAr', e.target.value)}
                    dir="rtl"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Description <span className={styles.required}>*</span>
                </label>
                <textarea
                    className={styles.textarea}
                    placeholder="Describe what guests will experience, learn, and enjoy..."
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Category <span className={styles.required}>*</span>
                </label>
                <div className={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className={`${styles.categoryCard} ${form.category === cat.id ? styles.selected : ''}`}
                            onClick={() => updateForm('category', cat.id)}
                        >
                            <div className={styles.categoryIcon}>{cat.icon}</div>
                            <div className={styles.categoryName}>{cat.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <h2 className={styles.stepTitle}>📋 Experience Details</h2>
            <p className={styles.stepDescription}>
                Help guests know what to expect from your experience.
            </p>

            <div className={styles.formGroup}>
                <label className={styles.label}>Duration (minutes)</label>
                <div className={styles.formRow}>
                    <div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Minimum</p>
                        <div className={styles.rangeContainer}>
                            <input
                                type="range"
                                className={styles.rangeSlider}
                                min="30"
                                max="480"
                                step="30"
                                value={form.minDuration}
                                onChange={(e) => updateForm('minDuration', parseInt(e.target.value))}
                            />
                            <span className={styles.rangeValue}>{form.minDuration} min</span>
                        </div>
                    </div>
                    <div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Maximum</p>
                        <div className={styles.rangeContainer}>
                            <input
                                type="range"
                                className={styles.rangeSlider}
                                min="30"
                                max="480"
                                step="30"
                                value={form.maxDuration}
                                onChange={(e) => updateForm('maxDuration', parseInt(e.target.value))}
                            />
                            <span className={styles.rangeValue}>{form.maxDuration} min</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Min Guests</label>
                    <input
                        type="number"
                        className={styles.input}
                        min="1"
                        max="50"
                        value={form.minGuests}
                        onChange={(e) => updateForm('minGuests', parseInt(e.target.value))}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Max Guests</label>
                    <input
                        type="number"
                        className={styles.input}
                        min="1"
                        max="50"
                        value={form.maxGuests}
                        onChange={(e) => updateForm('maxGuests', parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Languages Offered</label>
                <div className={styles.checklist}>
                    {LANGUAGES.map((lang) => (
                        <div
                            key={lang.id}
                            className={styles.checklistItem}
                            onClick={() => toggleLanguage(lang.id)}
                        >
                            <div className={`${styles.checkbox} ${form.languages.includes(lang.id) ? styles.checked : ''}`}>
                                {form.languages.includes(lang.id) && '✓'}
                            </div>
                            <span className={styles.checklistLabel}>
                                {lang.flag} {lang.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Tags</label>
                <div className={styles.tagsContainer}>
                    {form.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                            <span className={styles.tagRemove} onClick={() => removeTag(tag)}>×</span>
                        </span>
                    ))}
                    <input
                        type="text"
                        className={styles.tagInput}
                        placeholder="Add tags and press Enter..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                    />
                </div>
                <p className={styles.inputHelper}>Press Enter to add each tag</p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Meeting Point</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Where will you meet guests?"
                    value={form.meetingPoint}
                    onChange={(e) => updateForm('meetingPoint', e.target.value)}
                />
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <h2 className={styles.stepTitle}>💰 Pricing</h2>
            <p className={styles.stepDescription}>
                Set your pricing tier and base price. Remember, you keep most of what you earn!
            </p>

            <div className={styles.formGroup}>
                <label className={styles.label}>Pricing Tier</label>
                <div className={styles.tierGrid}>
                    {PRICING_TIERS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`${styles.tierCard} ${form.pricingTier === tier.id ? styles.selected : ''}`}
                            onClick={() => updateForm('pricingTier', tier.id)}
                        >
                            <div className={styles.tierName}>{tier.name}</div>
                            <div className={styles.tierDescription}>{tier.description}</div>
                            <div className={styles.tierCommission}>{tier.commission} commission</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Base Price (SAR) <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="number"
                        className={styles.input}
                        min="0"
                        placeholder="0"
                        value={form.basePrice || ''}
                        onChange={(e) => updateForm('basePrice', parseInt(e.target.value) || 0)}
                    />
                    <p className={styles.inputHelper}>Total price for the experience</p>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Per Person Price (optional)</label>
                    <input
                        type="number"
                        className={styles.input}
                        min="0"
                        placeholder="Leave empty if not per-person"
                        value={form.pricePerPerson || ''}
                        onChange={(e) => updateForm('pricePerPerson', parseInt(e.target.value) || null)}
                    />
                    <p className={styles.inputHelper}>For group pricing</p>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Child Price (optional)</label>
                    <input
                        type="number"
                        className={styles.input}
                        min="0"
                        placeholder="Discounted child rate"
                        value={form.childPrice || ''}
                        onChange={(e) => updateForm('childPrice', parseInt(e.target.value) || null)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Group Discount % (4+ guests)</label>
                    <input
                        type="number"
                        className={styles.input}
                        min="0"
                        max="50"
                        placeholder="e.g., 10"
                        value={form.groupDiscount ? form.groupDiscount * 100 : ''}
                        onChange={(e) => updateForm('groupDiscount', parseInt(e.target.value) / 100 || null)}
                    />
                </div>
            </div>

            {form.basePrice > 0 && (
                <div style={{
                    background: 'var(--gray-750)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginTop: '1rem'
                }}>
                    <h4 style={{ color: 'white', marginBottom: '1rem' }}>💡 Earnings Preview</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--gray-400)' }}>Base Price</span>
                        <span style={{ color: 'white' }}>{form.basePrice} SAR</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--gray-400)' }}>
                            Commission ({PRICING_TIERS.find(t => t.id === form.pricingTier)?.commission})
                        </span>
                        <span style={{ color: '#EF4444' }}>
                            -{Math.round(form.basePrice * (PRICING_TIERS.findIndex(t => t.id === form.pricingTier) * 0.03 + 0.12))} SAR
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--gray-600)'
                    }}>
                        <span style={{ color: 'var(--gold-400)', fontWeight: '600' }}>Your Earnings</span>
                        <span style={{ color: 'var(--gold-400)', fontWeight: '700', fontSize: '1.25rem' }}>
                            {Math.round(form.basePrice * (1 - (PRICING_TIERS.findIndex(t => t.id === form.pricingTier) * 0.03 + 0.12)))} SAR
                        </span>
                    </div>
                </div>
            )}
        </>
    );

    const renderStep4 = () => (
        <>
            <h2 className={styles.stepTitle}>📸 Media</h2>
            <p className={styles.stepDescription}>
                Great photos make a big difference! Upload eye-catching images of your experience.
            </p>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Cover Image <span className={styles.required}>*</span>
                </label>
                <div className={styles.uploadZone}>
                    <div className={styles.uploadIcon}>📷</div>
                    <p className={styles.uploadText}>
                        Click or drag to upload your main image
                    </p>
                    <p className={styles.uploadHint}>
                        Recommended: 1200x800px, JPG or PNG, max 5MB
                    </p>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Gallery Images (up to 10)</label>
                <div className={styles.uploadZone}>
                    <div className={styles.uploadIcon}>🖼️</div>
                    <p className={styles.uploadText}>
                        Add more photos to showcase your experience
                    </p>
                    <p className={styles.uploadHint}>
                        Show different moments, locations, and activities
                    </p>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Video URL (optional)</label>
                <input
                    type="url"
                    className={styles.input}
                    placeholder="YouTube or Vimeo link"
                    value={form.videoUrl}
                    onChange={(e) => updateForm('videoUrl', e.target.value)}
                />
                <p className={styles.inputHelper}>A short video can increase bookings by 30%!</p>
            </div>
        </>
    );

    const renderStep5 = () => (
        <>
            <h2 className={styles.stepTitle}>✓ Review & Submit</h2>
            <p className={styles.stepDescription}>
                Take a final look at your experience before publishing.
            </p>

            <div className={styles.previewCard}>
                <div className={styles.previewImage}>
                    {form.coverImage ? (
                        <img src={form.coverImage} alt={form.title} />
                    ) : (
                        <span>📷 No cover image</span>
                    )}
                </div>
                <div className={styles.previewContent}>
                    <div className={styles.previewCategory}>
                        {CATEGORIES.find(c => c.id === form.category)?.icon} {form.category || 'No category'}
                    </div>
                    <h3 className={styles.previewTitle}>
                        {form.title || 'Untitled Experience'}
                    </h3>
                    <p className={styles.previewDescription}>
                        {form.description || 'No description provided'}
                    </p>
                    <div className={styles.previewMeta}>
                        <span>⏱️ {form.minDuration}-{form.maxDuration} min</span>
                        <span>👥 {form.minGuests}-{form.maxGuests} guests</span>
                        <span>🗣️ {form.languages.join(', ')}</span>
                    </div>
                    <div className={styles.previewPrice}>
                        {form.basePrice} <small>SAR</small>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <div className={styles.checklist}>
                    <div className={styles.checklistItem}>
                        <div className={`${styles.checkbox} ${form.title ? styles.checked : ''}`}>
                            {form.title && '✓'}
                        </div>
                        <span className={styles.checklistLabel}>Title provided</span>
                    </div>
                    <div className={styles.checklistItem}>
                        <div className={`${styles.checkbox} ${form.description ? styles.checked : ''}`}>
                            {form.description && '✓'}
                        </div>
                        <span className={styles.checklistLabel}>Description provided</span>
                    </div>
                    <div className={styles.checklistItem}>
                        <div className={`${styles.checkbox} ${form.category ? styles.checked : ''}`}>
                            {form.category && '✓'}
                        </div>
                        <span className={styles.checklistLabel}>Category selected</span>
                    </div>
                    <div className={styles.checklistItem}>
                        <div className={`${styles.checkbox} ${form.basePrice > 0 ? styles.checked : ''}`}>
                            {form.basePrice > 0 && '✓'}
                        </div>
                        <span className={styles.checklistLabel}>Pricing set</span>
                    </div>
                </div>
            </div>
        </>
    );

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <div className={styles.formCard}>
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>🎉</div>
                        <h2 className={styles.successTitle}>Experience Created!</h2>
                        <p className={styles.successMessage}>
                            Your experience has been submitted for review.<br />
                            We&apos;ll notify you once it&apos;s approved and live.
                        </p>
                        <div className={styles.successActions}>
                            <button
                                className={`${styles.btn} ${styles.btnNext}`}
                                onClick={() => router.push('/guide-dashboard')}
                            >
                                Go to Dashboard
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnBack}`}
                                onClick={() => {
                                    setIsSuccess(false);
                                    setCurrentStep(1);
                                    setForm({
                                        title: '', titleAr: '', subtitle: '', description: '', descriptionAr: '',
                                        category: '', subcategory: '', tags: [],
                                        minDuration: 60, maxDuration: 180, minGuests: 1, maxGuests: 10, dynamicDuration: false,
                                        pricingTier: 'STANDARD', basePrice: 0, pricePerPerson: null, childPrice: null, groupDiscount: null,
                                        meetingPoint: '', meetingPointAr: '', latitude: null, longitude: null,
                                        requirements: [], includedItems: [], excludedItems: [], languages: ['ar', 'en'],
                                        coverImage: '', gallery: [], videoUrl: ''
                                    });
                                }}
                            >
                                Create Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Create an Experience</h1>
                <p className={styles.subtitle}>Share your passion and earn by hosting guests</p>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                {STEPS.map((step, index) => (
                    <div key={step.id} className={styles.progressStep}>
                        <div
                            className={`${styles.stepCircle} ${currentStep === step.id ? styles.active :
                                    currentStep > step.id ? styles.completed : styles.inactive
                                }`}
                        >
                            {currentStep > step.id ? '✓' : step.icon}
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className={`${styles.stepConnector} ${currentStep > step.id ? styles.completed : ''}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}

                {/* Actions */}
                <div className={styles.formActions}>
                    {currentStep > 1 ? (
                        <button className={`${styles.btn} ${styles.btnBack}`} onClick={prevStep}>
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < STEPS.length ? (
                        <button className={`${styles.btn} ${styles.btnNext}`} onClick={nextStep}>
                            Continue →
                        </button>
                    ) : (
                        <button
                            className={`${styles.btn} ${styles.btnSubmit}`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : '✓ Submit for Review'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
