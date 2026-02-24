import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // Disable in development if no DSN
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
