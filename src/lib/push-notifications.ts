// Push Notifications Service
// Uses Web Push API for browsers and can integrate with Firebase for mobile

interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    data?: Record<string, unknown>;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

// VAPID keys for Web Push (generate with: npx web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@riyadhguide.com';

// Check if push notifications are supported
export function isPushSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!isPushSupported()) {
        return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!isPushSupported()) return null;

    try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        });

        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
        });

        return subscription.toJSON() as unknown as PushSubscription;
    } catch (error) {
        console.error('Failed to subscribe to push:', error);
        return null;
    }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
    if (!isPushSupported()) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();

            // Notify server
            await fetch('/api/notifications/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: subscription.endpoint }),
            });

            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to unsubscribe:', error);
        return false;
    }
}

// Check current subscription status
export async function getPushSubscription(): Promise<PushSubscription | null> {
    if (!isPushSupported()) return null;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription?.toJSON() as unknown as PushSubscription || null;
    } catch {
        return null;
    }
}

// Send notification (server-side)
// Note: Requires 'web-push' package: npm install web-push
export async function sendPushNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
): Promise<boolean> {
    if (!VAPID_PRIVATE_KEY) {
        console.error('VAPID keys not configured');
        return false;
    }

    try {
        // Dynamic import for server-side only
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const webpush = require('web-push');

        if (!webpush) {
            console.error('web-push package not installed. Run: npm install web-push');
            return false;
        }

        webpush.setVapidDetails(
            VAPID_SUBJECT,
            VAPID_PUBLIC_KEY,
            VAPID_PRIVATE_KEY
        );

        await webpush.sendNotification(
            {
                endpoint: subscription.endpoint,
                keys: subscription.keys,
            },
            JSON.stringify(payload)
        );

        return true;
    } catch (error) {
        console.error('Failed to send push notification:', error);
        return false;
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Notification types for Riyadh Guide
export const NotificationTypes = {
    NEARBY_PLACE: 'nearby_place',
    EVENT_REMINDER: 'event_reminder',
    TOUR_UPDATE: 'tour_update',
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up',
    SPECIAL_OFFER: 'special_offer',
    NEW_REVIEW: 'new_review',
} as const;

// Create notification payloads
export function createNotificationPayload(
    type: keyof typeof NotificationTypes,
    data: Record<string, unknown>
): NotificationPayload {
    switch (type) {
        case 'NEARBY_PLACE':
            return {
                title: '📍 Nearby Attraction',
                body: `You're near ${data.placeName}! Tap to explore.`,
                icon: '/icons/icon-192.png',
                badge: '/icons/badge-72.png',
                tag: 'nearby',
                data: { type, placeId: data.placeId },
                actions: [
                    { action: 'view', title: 'View Details' },
                    { action: 'navigate', title: 'Get Directions' },
                ],
            };

        case 'EVENT_REMINDER':
            return {
                title: '🎪 Event Starting Soon',
                body: `${data.eventName} starts in ${data.timeUntil}`,
                icon: '/icons/icon-192.png',
                tag: 'event',
                data: { type, eventId: data.eventId },
            };

        case 'BADGE_EARNED':
            return {
                title: '🏆 New Badge Earned!',
                body: `Congratulations! You earned the "${data.badgeName}" badge!`,
                icon: '/icons/icon-192.png',
                tag: 'badge',
                data: { type, badgeId: data.badgeId },
            };

        case 'LEVEL_UP':
            return {
                title: '⬆️ Level Up!',
                body: `You're now a ${data.levelName}! Keep exploring Riyadh.`,
                icon: '/icons/icon-192.png',
                tag: 'level',
                data: { type, level: data.level },
            };

        case 'SPECIAL_OFFER':
            return {
                title: '💰 Special Offer',
                body: `${data.partnerName}: ${data.discount} off!`,
                icon: '/icons/icon-192.png',
                tag: 'offer',
                data: { type, offerId: data.offerId },
            };

        default:
            return {
                title: 'Riyadh Guide',
                body: data.message as string || 'You have a new notification',
                icon: '/icons/icon-192.png',
            };
    }
}
