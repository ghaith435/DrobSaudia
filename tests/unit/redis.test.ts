import { describe, it, expect } from '@jest/globals';

describe('Redis Cache', () => {
    // These tests work with the in-memory fallback when Redis is not available
    // Mock ioredis to ensure we test the fallback mechanism and avoid real connection attempts
    jest.mock('ioredis', () => {
        return class Redis {
            constructor() { }
            on() { return this; }
            async get() { throw new Error('Redis connection failed'); }
            async setex() { throw new Error('Redis connection failed'); }
            async del() { throw new Error('Redis connection failed'); }
        };
    });

    let cache: any;

    beforeAll(async () => {
        cache = await import('@/lib/redis');
    });

    it('should set and get cache values', async () => {
        await cache.cacheSet('test:key1', { message: 'hello' }, 60);
        const result = await cache.cacheGet('test:key1');
        expect(result).toEqual({ message: 'hello' });
    });

    it('should return null for non-existent keys', async () => {
        const result = await cache.cacheGet('test:nonexistent');
        expect(result).toBeNull();
    });

    it('should delete cache entries', async () => {
        await cache.cacheSet('test:key2', 'value', 60);
        await cache.cacheDel('test:key2');
        const result = await cache.cacheGet('test:key2');
        expect(result).toBeNull();
    });

    it('should build proper cache keys', () => {
        expect(cache.CACHE_KEYS.place('123')).toBe('place:123');
        expect(cache.CACHE_KEYS.search('coffee', 'place')).toBe('search:coffee:place');
        expect(cache.CACHE_KEYS.leaderboard()).toBe('leaderboard');
    });

    it('should have correct TTL constants', () => {
        expect(cache.CACHE_TTL.SHORT).toBe(60);
        expect(cache.CACHE_TTL.MEDIUM).toBe(300);
        expect(cache.CACHE_TTL.LONG).toBe(3600);
    });
});
