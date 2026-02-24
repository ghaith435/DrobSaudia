// Piper TTS - Text to Speech using Piper (Local TTS)
// https://github.com/rhasspy/piper

export interface PiperVoice {
    id: string;
    name: string;
    language: string;
    languageCode: string;
    quality: 'low' | 'medium' | 'high';
    sampleRate: number;
}

// Available Piper voices for different languages
export const PIPER_VOICES: Record<string, PiperVoice> = {
    'ar': {
        id: 'ar_JO-kareem-medium',
        name: 'Kareem',
        language: 'Arabic',
        languageCode: 'ar-JO',
        quality: 'medium',
        sampleRate: 22050
    },
    'en': {
        id: 'en_US-lessac-medium',
        name: 'Lessac',
        language: 'English',
        languageCode: 'en-US',
        quality: 'medium',
        sampleRate: 22050
    },
    'en-gb': {
        id: 'en_GB-alba-medium',
        name: 'Alba',
        language: 'English (UK)',
        languageCode: 'en-GB',
        quality: 'medium',
        sampleRate: 22050
    },
    'fr': {
        id: 'fr_FR-upmc-medium',
        name: 'UPMC',
        language: 'French',
        languageCode: 'fr-FR',
        quality: 'medium',
        sampleRate: 22050
    },
    'de': {
        id: 'de_DE-thorsten-medium',
        name: 'Thorsten',
        language: 'German',
        languageCode: 'de-DE',
        quality: 'medium',
        sampleRate: 22050
    },
    'es': {
        id: 'es_ES-davefx-medium',
        name: 'DaveFX',
        language: 'Spanish',
        languageCode: 'es-ES',
        quality: 'medium',
        sampleRate: 22050
    },
    'zh': {
        id: 'zh_CN-huayan-medium',
        name: 'Huayan',
        language: 'Chinese',
        languageCode: 'zh-CN',
        quality: 'medium',
        sampleRate: 22050
    },
    'ja': {
        id: 'ja_JP-kokoro-medium',
        name: 'Kokoro',
        language: 'Japanese',
        languageCode: 'ja-JP',
        quality: 'medium',
        sampleRate: 22050
    },
    'ko': {
        id: 'ko_KR-kss-medium',
        name: 'KSS',
        language: 'Korean',
        languageCode: 'ko-KR',
        quality: 'medium',
        sampleRate: 22050
    },
    'ru': {
        id: 'ru_RU-irina-medium',
        name: 'Irina',
        language: 'Russian',
        languageCode: 'ru-RU',
        quality: 'medium',
        sampleRate: 22050
    }
};

// Piper server base URL
const PIPER_BASE_URL = process.env.PIPER_TTS_URL || 'http://localhost:5000';

export interface TTSRequest {
    text: string;
    language: string;
    speed?: number; // 0.5 - 2.0, default 1.0
    pitch?: number; // 0.5 - 2.0, default 1.0
}

export interface TTSResponse {
    audioUrl: string;
    duration: number;
    format: string;
}

/**
 * Generate speech from text using Piper TTS
 */
export async function generateSpeech(request: TTSRequest): Promise<Buffer> {
    const voice = PIPER_VOICES[request.language] || PIPER_VOICES['ar'];

    const response = await fetch(`${PIPER_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: request.text,
            voice: voice.id,
            speed: request.speed || 1.0,
            pitch: request.pitch || 1.0,
            output_format: 'wav'
        }),
    });

    if (!response.ok) {
        throw new Error(`Piper TTS error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
}

/**
 * Generate speech using Web Speech API (Browser fallback)
 * Returns JavaScript code for client-side execution
 */
export function generateBrowserTTSCode(text: string, language: string): string {
    const voice = PIPER_VOICES[language] || PIPER_VOICES['ar'];

    return `
(function() {
    const utterance = new SpeechSynthesisUtterance(${JSON.stringify(text)});
    utterance.lang = '${voice.languageCode}';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Find the best matching voice
    const voices = speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith('${voice.languageCode.split('-')[0]}'));
    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }
    
    speechSynthesis.speak(utterance);
    
    return {
        pause: () => speechSynthesis.pause(),
        resume: () => speechSynthesis.resume(),
        cancel: () => speechSynthesis.cancel()
    };
})();
`;
}

/**
 * Check if Piper TTS server is available
 */
export async function checkPiperStatus(): Promise<{
    available: boolean;
    voices: PiperVoice[];
    error?: string;
}> {
    try {
        const response = await fetch(`${PIPER_BASE_URL}/api/voices`);
        if (!response.ok) {
            return {
                available: false,
                voices: [],
                error: 'Piper TTS server not responding'
            };
        }

        // Return available voices
        return {
            available: true,
            voices: Object.values(PIPER_VOICES)
        };
    } catch (error) {
        // If Piper is not available, we'll use browser TTS as fallback
        return {
            available: false,
            voices: Object.values(PIPER_VOICES),
            error: `Piper TTS not available, using browser fallback: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * Get voice information for a language
 */
export function getVoiceForLanguage(language: string): PiperVoice {
    return PIPER_VOICES[language] || PIPER_VOICES['ar'];
}

/**
 * Split long text into chunks for TTS processing
 */
export function splitTextForTTS(text: string, maxLength: number = 500): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
            currentChunk += sentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

export default {
    generateSpeech,
    generateBrowserTTSCode,
    checkPiperStatus,
    getVoiceForLanguage,
    splitTextForTTS,
    PIPER_VOICES
};
