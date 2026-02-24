import { NextResponse } from 'next/server';

// TTS Proxy - bypasses CORS by fetching audio server-side
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const lang = searchParams.get('lang') || 'ar';

    if (!text) {
        return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Limit text length
    const cleanText = text.substring(0, 200);
    const langCode = lang === 'ar' ? 'ar' : lang.substring(0, 2);

    // Try multiple TTS sources
    const ttsSources = [
        // Method 1: Google Translate TTS (different client)
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=gtx&q=${encodeURIComponent(cleanText)}`,
        // Method 2: Alternative Google endpoint
        `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=${langCode}&client=gtx&q=${encodeURIComponent(cleanText)}`,
    ];

    for (const ttsUrl of ttsSources) {
        try {
            const response = await fetch(ttsUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'audio/mpeg, audio/*',
                    'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
                },
            });

            if (response.ok) {
                const audioBuffer = await response.arrayBuffer();

                // Check if we got actual audio data
                if (audioBuffer.byteLength > 100) {
                    return new NextResponse(audioBuffer, {
                        status: 200,
                        headers: {
                            'Content-Type': 'audio/mpeg',
                            'Cache-Control': 'public, max-age=86400',
                        },
                    });
                }
            }
        } catch (error) {
            console.log(`TTS source failed: ${ttsUrl}`, error);
            continue;
        }
    }

    // All sources failed - return error for client to use browser TTS
    console.error('All TTS sources failed');
    return NextResponse.json(
        {
            error: 'TTS service unavailable',
            fallback: 'browser',
            message: 'Please use browser text-to-speech',
            text: cleanText,  // Send text back for browser TTS
            lang: langCode,
        },
        { status: 503 }
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, lang = 'ar' } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Split long text into chunks
        const maxChars = 200;
        const chunks: string[] = [];
        let remaining = text;

        while (remaining.length > 0) {
            if (remaining.length <= maxChars) {
                chunks.push(remaining);
                break;
            }
            let splitAt = remaining.lastIndexOf('.', maxChars);
            if (splitAt === -1 || splitAt < 50) splitAt = remaining.lastIndexOf(' ', maxChars);
            if (splitAt === -1 || splitAt < 50) splitAt = maxChars;
            chunks.push(remaining.substring(0, splitAt + 1));
            remaining = remaining.substring(splitAt + 1).trim();
        }

        // Generate URLs for each chunk
        const audioUrls = chunks.map((chunk, index) => ({
            index,
            url: `/api/tts?text=${encodeURIComponent(chunk)}&lang=${lang}`,
            text: chunk,
        }));

        return NextResponse.json({
            success: true,
            chunks: audioUrls,
            totalChunks: chunks.length,
        });
    } catch (error) {
        console.error('TTS POST error:', error);
        return NextResponse.json({ error: 'Failed to process TTS request' }, { status: 500 });
    }
}
