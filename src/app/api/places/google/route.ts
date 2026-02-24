import { NextRequest, NextResponse } from "next/server";

// Google Places API proxy endpoint
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('placeId');

    if (!placeId) {
        return NextResponse.json(
            { error: 'Place ID is required' },
            { status: 400 }
        );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        // Return mock data if API key is not configured
        return NextResponse.json(getMockPlaceDetails(placeId));
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,formatted_phone_number,website,rating,user_ratings_total,photos,reviews&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('Google Places API error');
        }

        const data = await response.json();

        if (data.status !== 'OK') {
            return NextResponse.json(getMockPlaceDetails(placeId));
        }

        return NextResponse.json(data.result);
    } catch (error) {
        console.error('Google Places API error:', error);
        return NextResponse.json(getMockPlaceDetails(placeId));
    }
}

// Mock place details for development/fallback
function getMockPlaceDetails(placeId: string) {
    // Realistic mock data based on typical Saudi businesses
    const now = new Date();
    const hour = now.getHours();
    const isOpen = hour >= 9 && hour < 23;

    return {
        opening_hours: {
            open_now: isOpen,
            weekday_text: [
                'الأحد: 9:00 ص – 11:00 م',
                'الاثنين: 9:00 ص – 11:00 م',
                'الثلاثاء: 9:00 ص – 11:00 م',
                'الأربعاء: 9:00 ص – 11:00 م',
                'الخميس: 9:00 ص – 12:00 ص',
                'الجمعة: 4:00 م – 12:00 ص',
                'السبت: 9:00 ص – 12:00 ص',
            ],
        },
        formatted_phone_number: '+966 11 xxx xxxx',
        website: 'https://example.com',
        rating: 4.5 + Math.random() * 0.4,
        user_ratings_total: Math.floor(1000 + Math.random() * 5000),
        photos: [],
        reviews: [
            {
                author_name: 'أحمد السعيد',
                rating: 5,
                text: 'مكان رائع وتجربة مميزة!',
                time: Date.now() / 1000 - 86400,
            },
            {
                author_name: 'سارة العتيبي',
                rating: 4,
                text: 'تجربة جيدة، أنصح بالزيارة',
                time: Date.now() / 1000 - 172800,
            },
        ],
    };
}
