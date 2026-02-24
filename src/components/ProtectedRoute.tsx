'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useLanguage } from './LanguageProvider';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
    fallbackUrl?: string;
}

export function ProtectedRoute({
    children,
    requiredRoles,
    fallbackUrl = '/auth/login'
}: ProtectedRouteProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            // Store the current URL to redirect back after login
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            }
            router.push(fallbackUrl);
            return;
        }

        // Check role requirements
        if (requiredRoles && requiredRoles.length > 0) {
            const userRole = (session.user as { role?: string })?.role;
            if (!userRole || !requiredRoles.includes(userRole)) {
                router.push('/unauthorized');
            }
        }
    }, [session, status, router, fallbackUrl, requiredRoles]);

    // Loading state
    if (status === 'loading') {
        return (
            <div className={styles.loadingContainer} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>{t.common.loading}</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!session) {
        return (
            <div className={styles.authRequired} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className={styles.authCard}>
                    <span className={styles.icon}>🔒</span>
                    <h2>{t.auth.loginRequired}</h2>
                    <p>{isRTL ? 'جاري التحويل...' : 'Redirecting...'}</p>
                </div>
            </div>
        );
    }

    // Authorized - render children
    return <>{children}</>;
}

export default ProtectedRoute;
