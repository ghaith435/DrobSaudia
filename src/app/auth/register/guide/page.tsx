"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./guide-register.module.css";

interface TourData {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    duration: number;
    durationUnit: 'hours' | 'days';
    languages: string[];
    images: string[]; // base64 previews
    imageFiles: File[];
}

const AVAILABLE_LANGUAGES = [
    { code: 'ar', name: 'العربية', nameEn: 'Arabic', flag: '🇸🇦' },
    { code: 'en', name: 'English', nameEn: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', nameEn: 'French', flag: '🇫🇷' },
    { code: 'es', name: 'Español', nameEn: 'Spanish', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', nameEn: 'German', flag: '🇩🇪' },
    { code: 'zh', name: '中文', nameEn: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', nameEn: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', nameEn: 'Korean', flag: '🇰🇷' },
    { code: 'tr', name: 'Türkçe', nameEn: 'Turkish', flag: '🇹🇷' },
    { code: 'ur', name: 'اردو', nameEn: 'Urdu', flag: '🇵🇰' },
    { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi', flag: '🇮🇳' },
    { code: 'id', name: 'Indonesia', nameEn: 'Indonesian', flag: '🇮🇩' },
];

const MAX_TOURS = 3;
const MAX_IMAGES_PER_TOUR = 5;

function createEmptyTour(): TourData {
    return {
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        duration: 1,
        durationUnit: 'hours',
        languages: ['ar'],
        images: [],
        imageFiles: [],
    };
}

export default function GuideRegisterPage() {
    const router = useRouter();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Step 1: Personal Info
    const [personalData, setPersonalData] = useState({
        name: "",
        nameAr: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        bio: "",
        bioAr: "",
        yearsExperience: 0,
        languages: ["ar"] as string[],
        acceptTerms: false,
    });

    // Step 2: Tours (max 3)
    const [tours, setTours] = useState<TourData[]>([createEmptyTour()]);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const t = {
        ar: {
            title: 'دليل الرياض',
            badge: '🎯 تسجيل المرشدين',
            welcome: 'انضم كمرشد سياحي!',
            subtitle: 'شارك خبرتك مع السياح واربح من رحلاتك',
            // Steps
            step1: 'المعلومات الشخصية',
            step2: 'الرحلات السياحية',
            step3: 'المراجعة',
            // Personal Info
            name: 'الاسم الكامل',
            namePlaceholder: 'أدخل اسمك الكامل',
            nameAr: 'الاسم بالعربية',
            nameArPlaceholder: 'أدخل اسمك بالعربية',
            email: 'البريد الإلكتروني',
            emailPlaceholder: 'أدخل بريدك الإلكتروني',
            phone: 'رقم الجوال',
            phonePlaceholder: '+966 5XX XXX XXXX',
            password: 'كلمة المرور',
            passwordPlaceholder: '6 أحرف على الأقل',
            confirmPassword: 'تأكيد كلمة المرور',
            confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
            bio: 'نبذة تعريفية',
            bioPlaceholder: 'تحدث عن خبرتك وتخصصك في الإرشاد السياحي...',
            bioAr: 'النبذة بالعربية',
            bioArPlaceholder: 'أضف نبذة تعريفية بالعربية...',
            yearsExperience: 'سنوات الخبرة',
            spokenLanguages: 'اللغات التي تتحدثها',
            acceptTerms: 'أوافق على شروط وأحكام المرشدين وسياسة الخصوصية',
            // Tours
            toursTitle: '🗺️ رحلاتك السياحية',
            toursDesc: 'أضف حتى 3 رحلات سياحية من تجاربك (رحلة واحدة على الأقل مطلوبة)',
            tourNumber: 'رحلة',
            tourTitle: 'عنوان الرحلة',
            tourTitlePlaceholder: 'مثال: جولة في الدرعية التاريخية',
            tourTitleAr: 'العنوان بالعربية',
            tourTitleArPlaceholder: 'أدخل عنوان الرحلة بالعربية',
            tourDescription: 'وصف الرحلة',
            tourDescPlaceholder: 'صف هذه الرحلة بالتفصيل: ما يشملها، المسار، الأنشطة...',
            tourDescAr: 'الوصف بالعربية',
            tourDescArPlaceholder: 'أضف وصف الرحلة بالعربية...',
            tourDuration: 'مدة الرحلة',
            hours: 'ساعات',
            days: 'أيام',
            tourLanguages: 'لغات الرحلة',
            tourImages: 'صور من الرحلة',
            uploadImages: 'اسحب الصور أو انقر للتحميل',
            uploadHint: 'حتى 5 صور (JPG, PNG)',
            addTour: '+ إضافة رحلة جديدة',
            removeTour: 'حذف',
            tourCount: 'رحلات',
            // Review
            reviewTitle: '📋 مراجعة البيانات',
            reviewDesc: 'تأكد من صحة بياناتك قبل الإرسال',
            personalInfo: 'المعلومات الشخصية',
            tourInfo: 'الرحلات السياحية',
            // Actions
            next: 'التالي',
            prev: 'السابق',
            submit: 'إرسال الطلب',
            submitting: 'جاري الإرسال...',
            // Validation
            passwordMismatch: 'كلمات المرور غير متطابقة',
            passwordLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
            termsRequired: 'يجب الموافقة على الشروط والأحكام',
            emailExists: 'البريد الإلكتروني مستخدم بالفعل',
            genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
            tourRequired: 'يجب إضافة رحلة واحدة على الأقل بمعلومات كاملة',
            // Links
            hasTouristAccount: 'تسجيل كسائح بدلاً من ذلك؟',
            hasAccount: 'لديك حساب بالفعل؟',
            signIn: 'تسجيل الدخول',
            // Benefits
            whyJoin: 'لماذا تصبح مرشد سياحي؟',
            whyJoinDesc: 'انضم لمجتمعنا من المرشدين المحترفين وابدأ في مشاركة شغفك بالسياحة',
            benefit1: '💰 اكسب دخل إضافي من رحلاتك',
            benefit2: '🌍 تواصل مع سياح من جميع أنحاء العالم',
            benefit3: '📈 نظام تقييمات يبرز مهاراتك',
            benefit4: '🎓 فرص تدريب وتطوير مهني',
            benefit5: '📱 أدوات إدارة متقدمة',
            benefit6: '🏅 شارات وشهادات معتمدة',
        },
        en: {
            title: 'Riyadh Guide',
            badge: '🎯 Guide Registration',
            welcome: 'Join as a Tour Guide!',
            subtitle: 'Share your expertise with tourists and earn from your tours',
            step1: 'Personal Info',
            step2: 'Tour Experiences',
            step3: 'Review',
            name: 'Full Name',
            namePlaceholder: 'Enter your full name',
            nameAr: 'Name in Arabic',
            nameArPlaceholder: 'Enter your name in Arabic',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            phone: 'Phone Number',
            phonePlaceholder: '+966 5XX XXX XXXX',
            password: 'Password',
            passwordPlaceholder: 'At least 6 characters',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter your password',
            bio: 'Bio / About You',
            bioPlaceholder: 'Tell us about your experience and specialization in tourism...',
            bioAr: 'Bio in Arabic',
            bioArPlaceholder: 'Add your bio in Arabic...',
            yearsExperience: 'Years of Experience',
            spokenLanguages: 'Languages You Speak',
            acceptTerms: 'I accept the Guide Terms & Conditions and Privacy Policy',
            toursTitle: '🗺️ Your Tour Experiences',
            toursDesc: 'Add up to 3 tour experiences (at least 1 required)',
            tourNumber: 'Tour',
            tourTitle: 'Tour Title',
            tourTitlePlaceholder: 'e.g., Historical Diriyah Walking Tour',
            tourTitleAr: 'Title in Arabic',
            tourTitleArPlaceholder: 'Enter tour title in Arabic',
            tourDescription: 'Tour Description',
            tourDescPlaceholder: 'Describe this tour in detail: what it includes, the route, activities...',
            tourDescAr: 'Description in Arabic',
            tourDescArPlaceholder: 'Add tour description in Arabic...',
            tourDuration: 'Tour Duration',
            hours: 'hours',
            days: 'days',
            tourLanguages: 'Tour Languages',
            tourImages: 'Tour Photos',
            uploadImages: 'Drag images or click to upload',
            uploadHint: 'Up to 5 images (JPG, PNG)',
            addTour: '+ Add New Tour',
            removeTour: 'Remove',
            tourCount: 'tours',
            reviewTitle: '📋 Review Your Information',
            reviewDesc: 'Make sure all information is correct before submitting',
            personalInfo: 'Personal Information',
            tourInfo: 'Tour Experiences',
            next: 'Next',
            prev: 'Previous',
            submit: 'Submit Application',
            submitting: 'Submitting...',
            passwordMismatch: 'Passwords do not match',
            passwordLength: 'Password must be at least 6 characters',
            termsRequired: 'You must accept the terms and conditions',
            emailExists: 'Email already in use',
            genericError: 'An error occurred. Please try again.',
            fillRequired: 'Please fill in all required fields',
            tourRequired: 'At least one complete tour is required',
            hasTouristAccount: 'Register as a tourist instead?',
            hasAccount: 'Already have an account?',
            signIn: 'Sign in',
            whyJoin: 'Why Become a Tour Guide?',
            whyJoinDesc: 'Join our community of professional guides and start sharing your passion for tourism',
            benefit1: '💰 Earn extra income from your tours',
            benefit2: '🌍 Connect with tourists from around the world',
            benefit3: '📈 Rating system to showcase your skills',
            benefit4: '🎓 Training and development opportunities',
            benefit5: '📱 Advanced management tools',
            benefit6: '🏅 Verified badges and certificates',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    // --- Tour management ---
    const addTour = () => {
        if (tours.length < MAX_TOURS) {
            setTours([...tours, createEmptyTour()]);
        }
    };

    const removeTour = (index: number) => {
        if (tours.length > 1) {
            setTours(tours.filter((_, i) => i !== index));
        }
    };

    const updateTour = (index: number, field: keyof TourData, value: unknown) => {
        setTours(tours.map((tour, i) => i === index ? { ...tour, [field]: value } : tour));
    };

    const toggleTourLanguage = (tourIndex: number, langCode: string) => {
        const tour = tours[tourIndex];
        const langs = tour.languages.includes(langCode)
            ? tour.languages.filter(l => l !== langCode)
            : [...tour.languages, langCode];
        updateTour(tourIndex, 'languages', langs);
    };

    const handleTourImages = (tourIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const tour = tours[tourIndex];
        const remainingSlots = MAX_IMAGES_PER_TOUR - tour.images.length;
        const newFiles = Array.from(files).slice(0, remainingSlots);

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setTours(prev => prev.map((t, i) => {
                    if (i !== tourIndex) return t;
                    return {
                        ...t,
                        images: [...t.images, ev.target?.result as string],
                        imageFiles: [...t.imageFiles, file],
                    };
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeTourImage = (tourIndex: number, imageIndex: number) => {
        setTours(prev => prev.map((t, i) => {
            if (i !== tourIndex) return t;
            return {
                ...t,
                images: t.images.filter((_, j) => j !== imageIndex),
                imageFiles: t.imageFiles.filter((_, j) => j !== imageIndex),
            };
        }));
    };

    const togglePersonalLanguage = (langCode: string) => {
        setPersonalData(prev => ({
            ...prev,
            languages: prev.languages.includes(langCode)
                ? prev.languages.filter(l => l !== langCode)
                : [...prev.languages, langCode],
        }));
    };

    // --- Validation ---
    const validateStep1 = (): boolean => {
        setError("");
        if (!personalData.name || !personalData.email || !personalData.password) {
            setError(labels.fillRequired);
            return false;
        }
        if (personalData.password.length < 6) {
            setError(labels.passwordLength);
            return false;
        }
        if (personalData.password !== personalData.confirmPassword) {
            setError(labels.passwordMismatch);
            return false;
        }
        if (!personalData.acceptTerms) {
            setError(labels.termsRequired);
            return false;
        }
        return true;
    };

    const validateStep2 = (): boolean => {
        setError("");
        const hasValidTour = tours.some(tour =>
            tour.title.trim() && tour.description.trim() && tour.duration > 0 && tour.languages.length > 0
        );
        if (!hasValidTour) {
            setError(labels.tourRequired);
            return false;
        }
        return true;
    };

    // --- Navigation ---
    const goNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            setError("");
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            setError("");
        }
    };

    const goPrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError("");
        }
    };

    // --- Submit ---
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            // Filter valid tours only
            const validTours = tours.filter(tour =>
                tour.title.trim() && tour.description.trim()
            ).map(tour => ({
                title: tour.title,
                titleAr: tour.titleAr || tour.title,
                description: tour.description,
                descriptionAr: tour.descriptionAr || tour.description,
                duration: tour.duration,
                durationUnit: tour.durationUnit,
                languages: tour.languages,
                images: tour.images, // base64
            }));

            const response = await fetch("/api/auth/register/guide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: personalData.name,
                    nameAr: personalData.nameAr || undefined,
                    email: personalData.email,
                    phone: personalData.phone || undefined,
                    password: personalData.password,
                    bio: personalData.bio,
                    bioAr: personalData.bioAr || undefined,
                    yearsExperience: personalData.yearsExperience,
                    languages: personalData.languages,
                    tours: validTours,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === "Email already exists") {
                    setError(labels.emailExists);
                } else {
                    setError(data.error || labels.genericError);
                }
            } else {
                router.push("/auth/login?guide_registered=true");
            }
        } catch {
            setError(labels.genericError);
        } finally {
            setLoading(false);
        }
    };

    // --- Step rendering ---
    const getStepClass = (step: number) => {
        if (step === currentStep) return `${styles.step} ${styles.active}`;
        if (step < currentStep) return `${styles.step} ${styles.completed}`;
        return styles.step;
    };

    const getConnectorClass = (afterStep: number) => {
        if (afterStep < currentStep) return `${styles.stepConnector} ${styles.active}`;
        return styles.stepConnector;
    };

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background */}
            <div className={styles.bgDecor}></div>
            <div className={styles.bgOrb1}></div>
            <div className={styles.bgOrb2}></div>

            <div className={styles.wrapper}>
                {/* Benefits Side */}
                <div className={styles.benefitsSection}>
                    <h2 className={styles.benefitsTitle}>{labels.whyJoin}</h2>
                    <p className={styles.benefitsSubtitle}>{labels.whyJoinDesc}</p>
                    <ul className={styles.benefitsList}>
                        <li>{labels.benefit1}</li>
                        <li>{labels.benefit2}</li>
                        <li>{labels.benefit3}</li>
                        <li>{labels.benefit4}</li>
                        <li>{labels.benefit5}</li>
                        <li>{labels.benefit6}</li>
                    </ul>
                    <div className={styles.illustration}>
                        <span className={styles.bigEmoji}>🧭</span>
                    </div>
                </div>

                {/* Registration Card */}
                <div className={styles.card}>
                    {/* Language Toggle */}
                    <button
                        className={styles.langToggle}
                        onClick={() => {
                            const newLocale = locale === 'ar' ? 'en' : 'ar';
                            setLocale(newLocale);
                            localStorage.setItem('locale', newLocale);
                        }}
                    >
                        🌐 {locale === 'ar' ? 'EN' : 'ع'}
                    </button>

                    {/* Header */}
                    <div className={styles.header}>
                        <h1 className={styles.logo}>
                            <span className={styles.logoGold}>{isRTL ? 'دليل' : 'Riyadh'}</span>
                            {isRTL ? ' الرياض' : ' Guide'}
                        </h1>
                        <div className={styles.badge}>{labels.badge}</div>
                        <h2 className={styles.welcome}>{labels.welcome}</h2>
                        <p className={styles.subtitle}>{labels.subtitle}</p>
                    </div>

                    {/* Steps Progress */}
                    <div className={styles.stepsProgress}>
                        <div className={getStepClass(1)} onClick={() => currentStep > 1 && setCurrentStep(1)}>
                            <span className={styles.stepNumber}>{currentStep > 1 ? '✓' : '1'}</span>
                            <span className={styles.stepLabel}>{labels.step1}</span>
                        </div>
                        <div className={getConnectorClass(1)}></div>
                        <div className={getStepClass(2)} onClick={() => currentStep > 2 && setCurrentStep(2)}>
                            <span className={styles.stepNumber}>{currentStep > 2 ? '✓' : '2'}</span>
                            <span className={styles.stepLabel}>{labels.step2}</span>
                        </div>
                        <div className={getConnectorClass(2)}></div>
                        <div className={getStepClass(3)}>
                            <span className={styles.stepNumber}>3</span>
                            <span className={styles.stepLabel}>{labels.step3}</span>
                        </div>
                    </div>

                    {error && <div className={styles.error}>⚠️ {error}</div>}

                    {/* ============ STEP 1: Personal Info ============ */}
                    {currentStep === 1 && (
                        <div className={styles.form}>
                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>{labels.name} *</label>
                                    <input
                                        type="text"
                                        value={personalData.name}
                                        onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                                        placeholder={labels.namePlaceholder}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{labels.nameAr}</label>
                                    <input
                                        type="text"
                                        value={personalData.nameAr}
                                        onChange={(e) => setPersonalData({ ...personalData, nameAr: e.target.value })}
                                        placeholder={labels.nameArPlaceholder}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>{labels.email} *</label>
                                    <input
                                        type="email"
                                        value={personalData.email}
                                        onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                                        placeholder={labels.emailPlaceholder}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{labels.phone}</label>
                                    <input
                                        type="tel"
                                        value={personalData.phone}
                                        onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                                        placeholder={labels.phonePlaceholder}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>{labels.password} *</label>
                                    <input
                                        type="password"
                                        value={personalData.password}
                                        onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                                        placeholder={labels.passwordPlaceholder}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{labels.confirmPassword} *</label>
                                    <input
                                        type="password"
                                        value={personalData.confirmPassword}
                                        onChange={(e) => setPersonalData({ ...personalData, confirmPassword: e.target.value })}
                                        placeholder={labels.confirmPasswordPlaceholder}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroupFull}>
                                <label>{labels.bio}</label>
                                <textarea
                                    value={personalData.bio}
                                    onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                                    placeholder={labels.bioPlaceholder}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.inputRow}>
                                <div className={styles.inputGroup}>
                                    <label>{labels.yearsExperience}</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={personalData.yearsExperience}
                                        onChange={(e) => setPersonalData({ ...personalData, yearsExperience: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroupFull}>
                                <label>{labels.spokenLanguages}</label>
                                <div className={styles.languageChips}>
                                    {AVAILABLE_LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            className={`${styles.languageChip} ${personalData.languages.includes(lang.code) ? styles.selected : ''}`}
                                            onClick={() => togglePersonalLanguage(lang.code)}
                                        >
                                            {lang.flag} {locale === 'ar' ? lang.name : lang.nameEn}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={personalData.acceptTerms}
                                        onChange={(e) => setPersonalData({ ...personalData, acceptTerms: e.target.checked })}
                                    />
                                    {labels.acceptTerms}
                                </label>
                            </div>

                            <div className={styles.navButtons}>
                                <button className={styles.nextBtn} onClick={goNext}>
                                    {labels.next} →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 2: Tours ============ */}
                    {currentStep === 2 && (
                        <div className={styles.form}>
                            <div className={styles.sectionTitle}>{labels.toursTitle}</div>
                            <p className={styles.sectionDesc}>{labels.toursDesc}</p>

                            <div className={styles.tourCards}>
                                {tours.map((tour, index) => (
                                    <div key={index} className={styles.tourCard}>
                                        <div className={styles.tourCardHeader}>
                                            <span className={styles.tourCardTitle}>
                                                🗺️ {labels.tourNumber} {index + 1}
                                            </span>
                                            {tours.length > 1 && (
                                                <button
                                                    type="button"
                                                    className={styles.removeTourBtn}
                                                    onClick={() => removeTour(index)}
                                                >
                                                    ✕ {labels.removeTour}
                                                </button>
                                            )}
                                        </div>

                                        <div className={styles.tourFields}>
                                            {/* Tour Title */}
                                            <div className={styles.tourRow}>
                                                <div className={styles.inputGroup}>
                                                    <label>{labels.tourTitle} *</label>
                                                    <input
                                                        type="text"
                                                        value={tour.title}
                                                        onChange={(e) => updateTour(index, 'title', e.target.value)}
                                                        placeholder={labels.tourTitlePlaceholder}
                                                    />
                                                </div>
                                                <div className={styles.inputGroup}>
                                                    <label>{labels.tourTitleAr}</label>
                                                    <input
                                                        type="text"
                                                        value={tour.titleAr}
                                                        onChange={(e) => updateTour(index, 'titleAr', e.target.value)}
                                                        placeholder={labels.tourTitleArPlaceholder}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tour Descriptions */}
                                            <div className={styles.inputGroupFull}>
                                                <label>{labels.tourDescription} *</label>
                                                <textarea
                                                    value={tour.description}
                                                    onChange={(e) => updateTour(index, 'description', e.target.value)}
                                                    placeholder={labels.tourDescPlaceholder}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className={styles.inputGroupFull}>
                                                <label>{labels.tourDescAr}</label>
                                                <textarea
                                                    value={tour.descriptionAr}
                                                    onChange={(e) => updateTour(index, 'descriptionAr', e.target.value)}
                                                    placeholder={labels.tourDescArPlaceholder}
                                                    rows={2}
                                                />
                                            </div>

                                            {/* Duration */}
                                            <div className={styles.tourRow}>
                                                <div className={styles.inputGroup}>
                                                    <label>{labels.tourDuration} *</label>
                                                    <div className={styles.durationInputGroup}>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={30}
                                                            value={tour.duration}
                                                            onChange={(e) => updateTour(index, 'duration', parseInt(e.target.value) || 1)}
                                                        />
                                                        <select
                                                            value={tour.durationUnit}
                                                            onChange={(e) => updateTour(index, 'durationUnit', e.target.value)}
                                                        >
                                                            <option value="hours">{labels.hours}</option>
                                                            <option value="days">{labels.days}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Languages */}
                                            <div className={styles.inputGroupFull}>
                                                <label>{labels.tourLanguages} *</label>
                                                <div className={styles.languageChips}>
                                                    {AVAILABLE_LANGUAGES.map(lang => (
                                                        <button
                                                            key={lang.code}
                                                            type="button"
                                                            className={`${styles.languageChip} ${tour.languages.includes(lang.code) ? styles.selected : ''}`}
                                                            onClick={() => toggleTourLanguage(index, lang.code)}
                                                        >
                                                            {lang.flag} {locale === 'ar' ? lang.name : lang.nameEn}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Images */}
                                            <div className={styles.inputGroupFull}>
                                                <label>{labels.tourImages}</label>
                                                <div className={styles.imageUploadArea}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handleTourImages(index, e)}
                                                        disabled={tour.images.length >= MAX_IMAGES_PER_TOUR}
                                                    />
                                                    <div className={styles.uploadIcon}>📷</div>
                                                    <div className={styles.uploadText}>{labels.uploadImages}</div>
                                                    <div className={styles.uploadHint}>{labels.uploadHint} ({tour.images.length}/{MAX_IMAGES_PER_TOUR})</div>
                                                </div>
                                                {tour.images.length > 0 && (
                                                    <div className={styles.imagePreviews}>
                                                        {tour.images.map((img, imgIndex) => (
                                                            <div key={imgIndex} className={styles.imagePreview}>
                                                                <img src={img} alt={`Tour ${index + 1} - ${imgIndex + 1}`} />
                                                                <button
                                                                    type="button"
                                                                    className={styles.removeImage}
                                                                    onClick={() => removeTourImage(index, imgIndex)}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add tour button */}
                            {tours.length < MAX_TOURS && (
                                <button type="button" className={styles.addTourBtn} onClick={addTour}>
                                    {labels.addTour}
                                </button>
                            )}
                            <div className={styles.tourCounter}>
                                {tours.length}/{MAX_TOURS} {labels.tourCount}
                            </div>

                            <div className={styles.navButtons}>
                                <button className={styles.prevBtn} onClick={goPrev}>
                                    ← {labels.prev}
                                </button>
                                <button className={styles.nextBtn} onClick={goNext}>
                                    {labels.next} →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 3: Review ============ */}
                    {currentStep === 3 && (
                        <div className={styles.form}>
                            <div className={styles.sectionTitle}>{labels.reviewTitle}</div>
                            <p className={styles.sectionDesc}>{labels.reviewDesc}</p>

                            {/* Personal Info Summary */}
                            <div className={styles.tourCard}>
                                <div className={styles.tourCardHeader}>
                                    <span className={styles.tourCardTitle}>👤 {labels.personalInfo}</span>
                                </div>
                                <div className={styles.tourFields}>
                                    <div className={styles.tourRow}>
                                        <div className={styles.inputGroup}>
                                            <label>{labels.name}</label>
                                            <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>{personalData.name}</div>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>{labels.email}</label>
                                            <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>{personalData.email}</div>
                                        </div>
                                    </div>
                                    {personalData.phone && (
                                        <div className={styles.inputGroup}>
                                            <label>{labels.phone}</label>
                                            <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>{personalData.phone}</div>
                                        </div>
                                    )}
                                    {personalData.bio && (
                                        <div className={styles.inputGroupFull}>
                                            <label>{labels.bio}</label>
                                            <div style={{ color: 'var(--text-secondary)', padding: '0.5rem 0', fontSize: '0.9rem' }}>{personalData.bio}</div>
                                        </div>
                                    )}
                                    <div className={styles.inputGroup}>
                                        <label>{labels.yearsExperience}</label>
                                        <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>{personalData.yearsExperience}</div>
                                    </div>
                                    <div className={styles.inputGroupFull}>
                                        <label>{labels.spokenLanguages}</label>
                                        <div className={styles.languageChips}>
                                            {personalData.languages.map(code => {
                                                const lang = AVAILABLE_LANGUAGES.find(l => l.code === code);
                                                return lang ? (
                                                    <span key={code} className={`${styles.languageChip} ${styles.selected}`}>
                                                        {lang.flag} {locale === 'ar' ? lang.name : lang.nameEn}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tours Summary */}
                            {tours.filter(t => t.title.trim()).map((tour, index) => (
                                <div key={index} className={styles.tourCard}>
                                    <div className={styles.tourCardHeader}>
                                        <span className={styles.tourCardTitle}>
                                            🗺️ {labels.tourNumber} {index + 1}: {tour.title}
                                        </span>
                                    </div>
                                    <div className={styles.tourFields}>
                                        <div className={styles.inputGroupFull}>
                                            <label>{labels.tourDescription}</label>
                                            <div style={{ color: 'var(--text-secondary)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                                {tour.description}
                                            </div>
                                        </div>
                                        <div className={styles.tourRow}>
                                            <div className={styles.inputGroup}>
                                                <label>{labels.tourDuration}</label>
                                                <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>
                                                    {tour.duration} {tour.durationUnit === 'hours' ? labels.hours : labels.days}
                                                </div>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>{labels.tourLanguages}</label>
                                                <div style={{ color: 'var(--text-primary)', padding: '0.5rem 0' }}>
                                                    {tour.languages.length} {locale === 'ar' ? 'لغات' : 'languages'}
                                                </div>
                                            </div>
                                        </div>
                                        {tour.images.length > 0 && (
                                            <div className={styles.inputGroupFull}>
                                                <label>{labels.tourImages} ({tour.images.length})</label>
                                                <div className={styles.imagePreviews}>
                                                    {tour.images.map((img, imgIndex) => (
                                                        <div key={imgIndex} className={styles.imagePreview}>
                                                            <img src={img} alt={`Tour ${index + 1} - ${imgIndex + 1}`} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className={styles.navButtons}>
                                <button className={styles.prevBtn} onClick={goPrev}>
                                    ← {labels.prev}
                                </button>
                                <button
                                    className={styles.submitButton}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? labels.submitting : `✅ ${labels.submit}`}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <p className={styles.signupLink}>
                        {labels.hasTouristAccount}{" "}
                        <Link href="/auth/register">{locale === 'ar' ? 'تسجيل كسائح' : 'Tourist Registration'}</Link>
                    </p>
                    <p className={styles.signupLink}>
                        {labels.hasAccount}{" "}
                        <Link href="/auth/login">{labels.signIn}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
