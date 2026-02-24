import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // Disable in development if no DSN
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Filter sensitive data
    beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
            delete event.request.headers['authorization'];
            delete event.request.headers['cookie'];
        }
        return event;
    },

    // Ignore common browser errors
    ignoreErrors: [
        'ResizeObserver loop',
        'Non-Error promise rejection',
        'Network request failed',
        'Load failed',
        'ChunkLoadError',
        'Failed to fetch',
    ],
});
