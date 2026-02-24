const CACHE_NAME = 'riyadh-guide-v1';
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/favicon.ico',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API routes - always go to network
    if (url.pathname.startsWith('/api/')) return;

    // Cache strategy: Network first, cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        // Cache map tiles
                        if (url.hostname.includes('tile.openstreetmap.org')) {
                            cache.put(request, responseClone);
                        }
                        // Cache images
                        if (request.destination === 'image') {
                            cache.put(request, responseClone);
                        }
                        // Cache pages
                        if (request.destination === 'document') {
                            cache.put(request, responseClone);
                        }
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;

                    // Fallback to offline page for HTML requests
                    if (request.destination === 'document') {
                        return caches.match('/offline');
                    }

                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Push notification handling
self.addEventListener('push', (event) => {
    let data = { title: 'دليل الرياض', body: 'لديك إشعار جديد', icon: '/favicon.ico' };

    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        // Use default data
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/favicon.ico',
            badge: '/favicon.ico',
            dir: 'rtl',
            lang: 'ar',
            vibrate: [200, 100, 200],
            tag: data.tag || 'default',
            data: data.url || '/',
            actions: data.actions || [
                { action: 'open', title: 'فتح' },
                { action: 'dismiss', title: 'تجاهل' },
            ],
        })
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Focus existing window
            for (const client of clients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            return self.clients.openWindow(event.notification.data || '/');
        })
    );
});
