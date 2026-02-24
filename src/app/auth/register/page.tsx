"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [formData, setFormData] = useState({
        name: "",
        nameAr: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);
    }, []);

    const t = {
        ar: {
            title: 'دليل الرياض',
            welcome: 'انضم إلينا!',
            subtitle: 'أنشئ حسابك للاستمتاع بجميع الميزات',
            name: 'الاسم الكامل',
            namePlaceholder: 'أدخل اسمك الكامل',
            nameAr: 'الاسم بالعربية (اختياري)',
            nameArPlaceholder: 'أدخل اسمك بالعربية',
            email: 'البريد الإلكتروني',
            emailPlaceholder: 'أدخل بريدك الإلكتروني',
            phone: 'رقم الجوال (اختياري)',
            phonePlaceholder: '+966 5XX XXX XXXX',
            password: 'كلمة المرور',
            passwordPlaceholder: 'أدخل كلمة المرور (6 أحرف على الأقل)',
            confirmPassword: 'تأكيد كلمة المرور',
            confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
            acceptTerms: 'أوافق على الشروط والأحكام وسياسة الخصوصية',
            signUp: 'إنشاء حساب',
            signingUp: 'جاري الإنشاء...',
            orContinue: 'أو المتابعة عبر',
            google: 'المتابعة عبر Google',
            hasAccount: 'لديك حساب بالفعل؟',
            signIn: 'تسجيل الدخول',
            passwordMismatch: 'كلمات المرور غير متطابقة',
            passwordLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
            emailExists: 'البريد الإلكتروني مستخدم بالفعل',
            termsRequired: 'يجب الموافقة على الشروط والأحكام',
            genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            success: 'تم إنشاء الحساب بنجاح!',
            whyJoin: 'لماذا تنضم إلينا؟',
            benefit1: '🗺️ تخطيط رحلات ذكية بالذكاء الاصطناعي',
            benefit2: '🎧 أدلة صوتية احترافية',
            benefit3: '🏆 اكسب النقاط والمكافآت',
            benefit4: '⭐ شارك تجاربك وتقييماتك',
            guideRegister: '🎯 هل أنت مرشد سياحي؟',
            guideRegisterLink: 'سجل كمرشد',
        },
        en: {
            title: 'Riyadh Guide',
            welcome: 'Join Us!',
            subtitle: 'Create your account to enjoy all features',
            name: 'Full Name',
            namePlaceholder: 'Enter your full name',
            nameAr: 'Name in Arabic (optional)',
            nameArPlaceholder: 'Enter your name in Arabic',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            phone: 'Phone Number (optional)',
            phonePlaceholder: '+966 5XX XXX XXXX',
            password: 'Password',
            passwordPlaceholder: 'Enter password (at least 6 characters)',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter your password',
            acceptTerms: 'I accept the Terms & Conditions and Privacy Policy',
            signUp: 'Sign Up',
            signingUp: 'Creating account...',
            orContinue: 'or continue with',
            google: 'Continue with Google',
            hasAccount: 'Already have an account?',
            signIn: 'Sign in',
            passwordMismatch: 'Passwords do not match',
            passwordLength: 'Password must be at least 6 characters',
            emailExists: 'Email is already in use',
            termsRequired: 'You must accept the terms and conditions',
            genericError: 'An error occurred. Please try again.',
            success: 'Account created successfully!',
            whyJoin: 'Why Join Us?',
            benefit1: '🗺️ AI-powered smart trip planning',
            benefit2: '🎧 Professional audio guides',
            benefit3: '🏆 Earn points and rewards',
            benefit4: '⭐ Share your experiences and reviews',
            guideRegister: '🎯 Are you a tour guide?',
            guideRegisterLink: 'Register as Guide',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (!formData.acceptTerms) {
            setError(labels.termsRequired);
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(labels.passwordMismatch);
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError(labels.passwordLength);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    nameAr: formData.nameAr || undefined,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === "Email already exists") {
                    setError(labels.emailExists);
                } else {
                    setError(labels.genericError);
                }
            } else {
                // Redirect to login
                router.push("/auth/login?registered=true");
            }
        } catch {
            setError(labels.genericError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background decoration */}
            <div className={styles.bgDecor}></div>
            <div className={styles.bgOrb1}></div>
            <div className={styles.bgOrb2}></div>

            <div className={styles.wrapper}>
                {/* Benefits Section */}
                <div className={styles.benefitsSection}>
                    <h2 className={styles.benefitsTitle}>{labels.whyJoin}</h2>
                    <ul className={styles.benefitsList}>
                        <li>{labels.benefit1}</li>
                        <li>{labels.benefit2}</li>
                        <li>{labels.benefit3}</li>
                        <li>{labels.benefit4}</li>
                    </ul>
                    <div className={styles.illustration}>
                        <span className={styles.bigEmoji}>🕌</span>
                    </div>
                </div>

                {/* Register Card */}
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

                    <div className={styles.header}>
                        <h1 className={styles.logo}>
                            <span className={styles.logoGold}>{isRTL ? 'دليل' : 'Riyadh'}</span>
                            {isRTL ? ' الرياض' : ' Guide'}
                        </h1>
                        <h2 className={styles.welcome}>{labels.welcome}</h2>
                        <p className={styles.subtitle}>{labels.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>⚠️ {error}</div>}

                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">{labels.name} *</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder={labels.namePlaceholder}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="nameAr">{labels.nameAr}</label>
                                <input
                                    type="text"
                                    id="nameAr"
                                    value={formData.nameAr}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nameAr: e.target.value })
                                    }
                                    placeholder={labels.nameArPlaceholder}
                                />
                            </div>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">{labels.email} *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder={labels.emailPlaceholder}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">{labels.phone}</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder={labels.phonePlaceholder}
                                />
                            </div>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">{labels.password} *</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    placeholder={labels.passwordPlaceholder}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">{labels.confirmPassword} *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    placeholder={labels.confirmPasswordPlaceholder}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={(e) =>
                                        setFormData({ ...formData, acceptTerms: e.target.checked })
                                    }
                                />
                                <span className={styles.checkmark}></span>
                                {labels.acceptTerms}
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? labels.signingUp : labels.signUp}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>{labels.orContinue}</span>
                    </div>

                    <button
                        onClick={() => {
                            import("next-auth/react").then(({ signIn }) => {
                                signIn("google", { callbackUrl: "/dashboard" });
                            });
                        }}
                        className={styles.googleButton}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        {labels.google}
                    </button>

                    <p className={styles.signupLink}>
                        {labels.hasAccount}{" "}
                        <Link href="/auth/login">{labels.signIn}</Link>
                    </p>
                    <p className={styles.signupLink}>
                        {labels.guideRegister}{" "}
                        <Link href="/auth/register/guide">{labels.guideRegisterLink}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
