import { NextRequest, NextResponse } from 'next/server';
import { fetchSpatialData } from '@/lib/open-data';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const dataset = searchParams.get('dataset');
    const version = searchParams.get('version') ? parseInt(searchParams.get('version')!) : -1;

    if (!dataset) {
        return NextResponse.json(
            { error: 'Missing required parameter: dataset' },
            { status: 400 }
        );
    }

    try {
        const data = await fetchSpatialData(dataset, version);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch spatial data' },
            { status: 500 }
        );
    }
}
