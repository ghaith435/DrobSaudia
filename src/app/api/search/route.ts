export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, withRateLimit, searchLimiter, apiSuccess } from '@/lib/security';

// Static data search (until DB is connected)
import { places as placesData } from '@/data/places';
import { tours as toursData } from '@/data/tours';
import { events as eventsData } from '@/data/events';

interface SearchResult {
    id: string;
    type: 'place' | 'tour' | 'event' | 'experience';
    title: string;
    titleAr?: string;
    description: string;
    image?: string;
    rating?: number;
    category?: string;
    url: string;
}

function searchInText(text: string, query: string): boolean {
    if (!text) return false;
    return text.toLowerCase().includes(query.toLowerCase());
}

async function handler(req: NextRequest) {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (q.length < 1) {
        return apiSuccess([]);
    }

    const results: SearchResult[] = [];

    // Search Places
    if (type === 'all' || type === 'place') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchedPlaces = (placesData || []).filter((p: any) =>
            searchInText(p.name || '', q) ||
            searchInText(p.nameAr || '', q) ||
            searchInText(p.description || '', q) ||
            searchInText(p.descriptionAr || '', q) ||
            searchInText(p.address || '', q)
        ).slice(0, limit);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matchedPlaces.forEach((p: any) => {
            results.push({
                id: String(p.id || p.slug || ''),
                type: 'place',
                title: String(p.name || ''),
                titleAr: p.nameAr ? String(p.nameAr) : undefined,
                description: String(p.description || '').slice(0, 100),
                image: p.image ? String(p.image) : undefined,
                rating: typeof p.rating === 'number' ? p.rating : undefined,
                category: p.category ? String(p.category) : undefined,
                url: `/place/${p.slug || p.id}`,
            });
        });
    }

    // Search Tours
    if (type === 'all' || type === 'tour') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchedTours = (toursData || []).filter((t: any) =>
            searchInText(t.name || '', q) ||
            searchInText(t.nameAr || '', q) ||
            searchInText(t.description || '', q)
        ).slice(0, limit);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matchedTours.forEach((t: any) => {
            results.push({
                id: String(t.id || ''),
                type: 'tour',
                title: String(t.name || ''),
                titleAr: t.nameAr ? String(t.nameAr) : undefined,
                description: String(t.description || '').slice(0, 100),
                image: t.image ? String(t.image) : undefined,
                rating: typeof t.rating === 'number' ? t.rating : undefined,
                url: `/tours/${t.id}`,
            });
        });
    }

    // Search Events
    if (type === 'all' || type === 'event') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchedEvents = (eventsData || []).filter((e: any) =>
            searchInText(e.name || '', q) ||
            searchInText(e.nameAr || '', q) ||
            searchInText(e.description || '', q)
        ).slice(0, limit);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matchedEvents.forEach((e: any) => {
            results.push({
                id: String(e.id || ''),
                type: 'event',
                title: String(e.name || ''),
                titleAr: e.nameAr ? String(e.nameAr) : undefined,
                description: String(e.description || '').slice(0, 100),
                image: e.image ? String(e.image) : undefined,
                url: `/events`,
            });
        });
    }

    return apiSuccess(results.slice(0, limit));
}

export const GET = withRateLimit(withErrorHandler(handler), searchLimiter);
