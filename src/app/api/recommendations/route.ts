import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess } from '@/lib/security';

// Recommendation engine - uses collaborative + content-based filtering
interface RecommendationInput {
    userId?: string;
    currentPlaceId?: string;
    latitude?: number;
    longitude?: number;
    preferences?: string[];
    limit?: number;
}

// Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Simple scoring algorithm
function scorePlace(place: Record<string, unknown>, input: RecommendationInput): number {
    let score = 0;

    // Rating weight (40%)
    const rating = typeof place.rating === 'number' ? place.rating : 0;
    score += (rating / 5) * 40;

    // Proximity weight (30%)
    if (input.latitude && input.longitude && typeof place.latitude === 'number' && typeof place.longitude === 'number') {
        const dist = getDistance(input.latitude, input.longitude, place.latitude, place.longitude);
        score += Math.max(0, (1 - dist / 50)) * 30; // Within 50km
    }

    // Featured bonus (10%)
    if (place.isFeatured) score += 10;

    // Category match (20%)
    if (input.preferences && Array.isArray(input.preferences)) {
        const category = String(place.category || '').toLowerCase();
        const features = Array.isArray(place.features) ? place.features.map(String) : [];
        const allTags = [category, ...features].map(t => t.toLowerCase());
        const matchCount = input.preferences.filter(p => allTags.some(t => t.includes(p.toLowerCase()))).length;
        score += (matchCount / Math.max(input.preferences.length, 1)) * 20;
    }

    return score;
}

// Static placeholder data
const samplePlaces = [
    { id: "1", name: "Kingdom Centre Tower", nameAr: "برج المملكة", rating: 4.7, latitude: 24.7113, longitude: 46.6741, category: "landmarks", image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400", features: ["observation", "shopping"], isFeatured: true },
    { id: "2", name: "Diriyah", nameAr: "الدرعية", rating: 4.8, latitude: 24.7347, longitude: 46.5769, category: "historical", image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400", features: ["heritage", "culture"], isFeatured: true },
    { id: "3", name: "Boulevard Riyadh City", nameAr: "بوليفارد الرياض", rating: 4.5, latitude: 24.7682, longitude: 46.6472, category: "entertainment", image: "https://images.unsplash.com/photo-1568849676085-51415703900f?w=400", features: ["restaurants", "events"], isFeatured: true },
    { id: "4", name: "National Museum", nameAr: "المتحف الوطني", rating: 4.6, latitude: 24.6483, longitude: 46.7108, category: "museum", image: "https://images.unsplash.com/photo-1505832018823-50331d70d237?w=400", features: ["history", "culture"], isFeatured: false },
    { id: "5", name: "Al Masmak Fortress", nameAr: "قصر المصمك", rating: 4.4, latitude: 24.6311, longitude: 46.7136, category: "historical", image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400", features: ["heritage", "history"], isFeatured: false },
    { id: "6", name: "Edge of the World", nameAr: "حافة العالم", rating: 4.9, latitude: 24.8447, longitude: 46.1739, category: "nature", image: "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=400", features: ["hiking", "nature", "adventure"], isFeatured: true },
    { id: "7", name: "Riyadh Season Boulevard", nameAr: "بوليفارد موسم الرياض", rating: 4.6, latitude: 24.7468, longitude: 46.6428, category: "entertainment", image: "https://images.unsplash.com/photo-1568849676085-51415703900f?w=400", features: ["food", "shopping", "events"], isFeatured: true },
    { id: "8", name: "Wadi Hanifah", nameAr: "وادي حنيفة", rating: 4.3, latitude: 24.6525, longitude: 46.6087, category: "nature", image: "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=400", features: ["nature", "picnic", "relaxation"], isFeatured: false },
];

async function handler(req: NextRequest) {
    const url = new URL(req.url);
    const input: RecommendationInput = {
        userId: url.searchParams.get('userId') || undefined,
        currentPlaceId: url.searchParams.get('placeId') || undefined,
        latitude: url.searchParams.get('lat') ? parseFloat(url.searchParams.get('lat')!) : undefined,
        longitude: url.searchParams.get('lng') ? parseFloat(url.searchParams.get('lng')!) : undefined,
        preferences: url.searchParams.get('preferences')?.split(',') || undefined,
        limit: parseInt(url.searchParams.get('limit') || '6'),
    };

    // Filter out current place
    let candidates = samplePlaces.filter(p => p.id !== input.currentPlaceId);

    // Score and sort
    const scored = candidates.map(place => ({
        ...place,
        score: scorePlace(place, input),
        distanceKm: input.latitude && input.longitude
            ? Math.round(getDistance(input.latitude, input.longitude, place.latitude, place.longitude) * 10) / 10
            : undefined,
    })).sort((a, b) => b.score - a.score);

    return apiSuccess(scored.slice(0, input.limit));
}

export const GET = withRateLimit(withErrorHandler(handler), apiLimiter);
