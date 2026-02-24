import { NextResponse } from 'next/server';
import { generateSpeech, checkTTSStatus, generateBrowserTTSCode, splitTextForTTS } from '@/lib/mms-tts';

export async function POST(req: Request) {
    try {
        const { text, language = 'ar', useBrowserFallback = false } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Check if client wants browser TTS code
        if (useBrowserFallback) {
            const ttsCode = generateBrowserTTSCode(text, language);
            return NextResponse.json({
                success: true,
                type: 'browser',
                code: ttsCode
            });
        }

        // Check MMS-TTS server status
        const ttsStatus = await checkTTSStatus();

        if (!ttsStatus.available) {
            // Return browser fallback code if server not available
            const ttsCode = generateBrowserTTSCode(text, language);
            return NextResponse.json({
                success: true,
                type: 'browser',
                code: ttsCode,
                message: 'MMS-TTS server not available, using browser TTS'
            });
        }

        // Generate speech using MMS-TTS
        try {
            // Split long text into chunks
            const chunks = splitTextForTTS(text, 500);

            if (chunks.length === 1) {
                // Single chunk - generate directly
                const audioBuffer = await generateSpeech({ text, language });

                return new NextResponse(new Uint8Array(audioBuffer), {
                    headers: {
                        'Content-Type': 'audio/wav',
                        'Content-Disposition': 'attachment; filename="speech.wav"'
                    }
                });
            } else {
                // Multiple chunks - return a list for client to handle
                return NextResponse.json({
                    success: true,
                    type: 'chunked',
                    chunks: chunks,
                    totalChunks: chunks.length,
                    message: 'Text split into chunks for TTS processing'
                });
            }
        } catch (ttsError) {
            console.error('MMS-TTS generation error:', ttsError);

            // Fallback to browser TTS
            const ttsCode = generateBrowserTTSCode(text, language);
            return NextResponse.json({
                success: true,
                type: 'browser',
                code: ttsCode,
                message: 'TTS generation failed, using browser fallback'
            });
        }
    } catch (error) {
        console.error('Speech API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return TTS status
    const status = await checkTTSStatus();

    return NextResponse.json({
        service: 'MMS-TTS (Facebook)',
        ...status
    });
}
