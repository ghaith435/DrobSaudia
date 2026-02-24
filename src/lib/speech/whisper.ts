/**
 * Whisper API Integration for Speech-to-Text
 * Converts voice commands to text for the smart tourism assistant
 */

interface TranscriptionResult {
    text: string;
    language: string;
    duration: number;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(
    audioBlob: Blob,
    options: {
        language?: 'ar' | 'en';
        prompt?: string;
    } = {}
): Promise<TranscriptionResult> {
    const formData = new FormData();

    // Convert blob to file
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    if (options.language) {
        formData.append('language', options.language);
    }

    if (options.prompt) {
        formData.append('prompt', options.prompt);
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
        text: result.text,
        language: result.language || options.language || 'unknown',
        duration: result.duration || 0,
    };
}

/**
 * Transcribe audio with automatic language detection
 */
export async function transcribeWithDetection(
    audioBlob: Blob
): Promise<TranscriptionResult> {
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type });

    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
        text: result.text,
        language: result.language,
        duration: result.duration,
    };
}

/**
 * Tourism-specific voice command prompts
 * These help Whisper better understand tourism-related vocabulary
 */
export const TOURISM_PROMPTS = {
    ar: `
الدرعية، حي الطريف، البجيري، متحف الدرعية، سوق الدرعية،
الرياض، قصر المصمك، المملكة العربية السعودية،
مرشد سياحي، جولة، معلم تاريخي، تراث عالمي، يونسكو،
أين، كيف أصل، ما هي ساعات العمل، احجز لي،
خذني إلى، أريد زيارة، ما هي المعالم القريبة
`,
    en: `
Diriyah, At-Turaif District, Bujairi, Diriyah Museum, Diriyah Souq,
Riyadh, Masmak Fortress, Kingdom of Saudi Arabia,
tour guide, tour, historical landmark, world heritage, UNESCO,
where is, how do I get to, what are the opening hours, book for me,
take me to, I want to visit, what are the nearby attractions
`,
};

/**
 * Get the appropriate prompt for language
 */
export function getTourismPrompt(locale: 'ar' | 'en'): string {
    return TOURISM_PROMPTS[locale];
}
