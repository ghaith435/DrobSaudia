import { NextRequest, NextResponse } from 'next/server';
import { generateVRHistoricalView, VRHistoricalRequest } from '@/lib/ollama';

export async function POST(request: NextRequest) {
    try {
        const body: VRHistoricalRequest = await request.json();

        // Validate required fields
        if (!body.placeName || !body.currentDescription) {
            return NextResponse.json(
                { error: 'Missing required fields: placeName, currentDescription' },
                { status: 400 }
            );
        }

        const vrRequest: VRHistoricalRequest = {
            placeName: body.placeName,
            currentDescription: body.currentDescription,
            yearRange: body.yearRange,
            language: body.language || 'ar'
        };

        const historicalView = await generateVRHistoricalView(vrRequest);

        return NextResponse.json({
            success: true,
            history: historicalView
        });
    } catch (error) {
        console.error('VR history generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate VR historical view', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
