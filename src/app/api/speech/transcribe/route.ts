export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Piper/Whisper transcription endpoint
// Uses browser Web Speech API as fallback since local Whisper requires additional setup

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const language = formData.get('language') as string || 'ar';

        if (!audioFile) {
            return NextResponse.json(
                { error: 'Audio file is required' },
                { status: 400 }
            );
        }

        // Try local Whisper server first
        const whisperUrl = process.env.WHISPER_URL || 'http://localhost:9000';

        try {
            const whisperFormData = new FormData();
            whisperFormData.append('audio', audioFile);
            whisperFormData.append('language', language);

            const whisperResponse = await fetch(`${whisperUrl}/transcribe`, {
                method: 'POST',
                body: whisperFormData,
            });

            if (whisperResponse.ok) {
                const result = await whisperResponse.json();
                return NextResponse.json({
                    text: result.text,
                    language,
                    source: 'whisper'
                });
            }
        } catch (whisperError) {
            console.warn('Local Whisper not available:', whisperError);
        }

        // Fallback: Return instructions to use browser Speech Recognition
        return NextResponse.json({
            text: '',
            language,
            source: 'browser',
            fallback: true,
            message: 'Use browser Web Speech API for transcription',
            code: `
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = '${language === 'ar' ? 'ar-SA' : 'en-US'}';
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.start();
            `
        });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
        );
    }
}
