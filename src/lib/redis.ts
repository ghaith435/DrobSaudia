import Redis from 'ioredis';

// Redis connection
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis;

try {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                console.warn('⚠️ Redis: Max retries reached. Using in-memory fallback.');
                return null; // Stop retrying
            }
            return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
        connectTimeout: 5000,
    });

    redis.on('error', (err) => {
        console.warn('⚠️ Redis connection error:', err.message);
    });

    redis.on('connect', () => {
        console.log('✅ Redis connected');
    });
} catch {
    console.warn('⚠️ Redis not available. Using in-memory cache fallback.');
    redis = null as any;
}

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiry: number }>();

// Cache helper functions
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        if (redis) {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        }
    } catch { }

    // Fallback to memory cache
    const entry = memoryCache.get(key);
    if (entry && entry.expiry > Date.now()) {
        return JSON.parse(entry.value);
    }
    memoryCache.delete(key);
    return null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(value);

    try {
        if (redis) {
            await redis.setex(key, ttlSeconds, serialized);
            return;
        }
    } catch { }

    // Fallback to memory cache
    memoryCache.set(key, {
        value: serialized,
        expiry: Date.now() + ttlSeconds * 1000,
    });
}

export async function cacheDel(key: string): Promise<void> {
    try {
        if (redis) {
            await redis.del(key);
        }
    } catch { }
    memoryCache.delete(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
    try {
        if (redis) {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
    } catch { }

    // Fallback: clear matching memory cache keys
    for (const key of memoryCache.keys()) {
        if (key.match(new RegExp(pattern.replace('*', '.*')))) {
            memoryCache.delete(key);
        }
    }
}

// Cache key builders
export const CACHE_KEYS = {
    place: (id: string) => `place:${id}`,
    placesList: (city: string, page: number) => `places:${city}:${page}`,
    tour: (id: string) => `tour:${id}`,
    toursList: (city: string) => `tours:${city}`,
    events: (city: string) => `events:${city}`,
    search: (query: string, type: string) => `search:${query}:${type}`,
    recommendations: (userId: string) => `recs:${userId}`,
    userProfile: (userId: string) => `user:${userId}`,
    analytics: (period: string) => `analytics:${period}`,
    leaderboard: () => `leaderboard`,
};

// Cache TTLs (in seconds)
export const CACHE_TTL = {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 3600,          // 1 hour
    VERY_LONG: 86400,    // 1 day
    SEARCH: 120,         // 2 minutes
    ANALYTICS: 600,      // 10 minutes
};

// Cached function wrapper
export function withCache<T>(
    keyFn: (...args: any[]) => string,
    fn: (...args: any[]) => Promise<T>,
    ttl = CACHE_TTL.MEDIUM
) {
    return async (...args: any[]): Promise<T> => {
        const key = keyFn(...args);
        const cached = await cacheGet<T>(key);
        if (cached !== null) return cached;

        const result = await fn(...args);
        await cacheSet(key, result, ttl);
        return result;
    };
}

export { redis };
