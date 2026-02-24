"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRedirectNotice, setShowRedirectNotice] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) setLocale(savedLocale);

        // Show notice if redirected from a service
        if (searchParams.get('redirect')) {
            setShowRedirectNotice(true);
        }
    }, [searchParams]);

    const t = {
        ar: {
            title: 'دليل الرياض',
            welcome: 'مرحباً بعودتك!',
            subtitle: 'سجل دخولك للمتابعة',
            email: 'البريد الإلكتروني',
            emailPlaceholder: 'أدخل بريدك الإلكتروني',
            password: 'كلمة المرور',
            passwordPlaceholder: 'أدخل كلمة المرور',
            signIn: 'تسجيل الدخول',
            signingIn: 'جاري التسجيل...',
            orContinue: 'أو المتابعة عبر',
            google: 'المتابعة عبر Google',
            noAccount: 'ليس لديك حساب؟',
            signUp: 'إنشاء حساب',
            error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            requiredLogin: 'يجب تسجيل الدخول للوصول للخدمة المطلوبة',
        },
        en: {
            title: 'Riyadh Guide',
            welcome: 'Welcome back!',
            subtitle: 'Sign in to continue',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            signIn: 'Sign In',
            signingIn: 'Signing in...',
            orContinue: 'or continue with',
            google: 'Continue with Google',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            error: 'Invalid email or password',
            genericError: 'An error occurred. Please try again.',
            requiredLogin: 'Please sign in to access the requested service',
        },
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(labels.error);
            } else {
                router.push(redirectUrl);
                router.refresh();
            }
        } catch {
            setError(labels.genericError);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await signIn("google", { callbackUrl: redirectUrl });
    };

    return (
        <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background decoration */}
            <div className={styles.bgDecor}></div>

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
                    <div className={styles.logoContainer}>
                        <span className={styles.logoIcon}>🕌</span>
                    </div>
                    <h1 className={styles.logo}>
                        <span className={styles.logoGold}>{isRTL ? 'دليل' : 'Riyadh'}</span>
                        {isRTL ? ' الرياض' : ' Guide'}
                    </h1>
                    <h2 className={styles.welcome}>{labels.welcome}</h2>
                    <p className={styles.subtitle}>{labels.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {showRedirectNotice && (
                        <div className={styles.notice}>
                            🔐 {labels.requiredLogin}
                        </div>
                    )}
                    {error && <div className={styles.error}>⚠️ {error}</div>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{labels.email}</label>
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
                        <label htmlFor="password">{labels.password}</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder={labels.passwordPlaceholder}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? labels.signingIn : labels.signIn}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>{labels.orContinue}</span>
                </div>

                <button
                    onClick={handleGoogleLogin}
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
                    {labels.noAccount}{" "}
                    <Link href="/auth/register">{labels.signUp}</Link>
                </p>
            </div>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        <span className={styles.logoIcon}>🕌</span>
                    </div>
                    <h1 className={styles.logo}>
                        <span className={styles.logoGold}>دليل</span>
                        {' الرياض'}
                    </h1>
                    <p style={{ color: '#999', marginTop: '1rem' }}>جاري التحميل...</p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    );
}
