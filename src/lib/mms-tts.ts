// MMS-TTS - Text to Speech using Facebook's MMS-TTS model
// https://huggingface.co/facebook/mms-tts-ara

export interface TTSVoice {
    id: string;
    name: string;
    language: string;
    languageCode: string;
    model: string;
}

// Available MMS-TTS voices for different languages
export const MMS_TTS_VOICES: Record<string, TTSVoice> = {
    'ar': {
        id: 'ar',
        name: 'Arabic (MMS)',
        language: 'Arabic',
        languageCode: 'ar',
        model: 'facebook/mms-tts-ara'
    },
    'en': {
        id: 'en',
        name: 'English (MMS)',
        language: 'English',
        languageCode: 'en',
        model: 'facebook/mms-tts-eng'
    },
    'fr': {
        id: 'fr',
        name: 'French (MMS)',
        language: 'French',
        languageCode: 'fr',
        model: 'facebook/mms-tts-fra'
    },
    'de': {
        id: 'de',
        name: 'German (MMS)',
        language: 'German',
        languageCode: 'de',
        model: 'facebook/mms-tts-deu'
    },
    'es': {
        id: 'es',
        name: 'Spanish (MMS)',
        language: 'Spanish',
        languageCode: 'es',
        model: 'facebook/mms-tts-spa'
    },
    'zh': {
        id: 'zh',
        name: 'Chinese (MMS)',
        language: 'Chinese',
        languageCode: 'zh',
        model: 'facebook/mms-tts-cmn'
    },
    'ja': {
        id: 'ja',
        name: 'Japanese (MMS)',
        language: 'Japanese',
        languageCode: 'ja',
        model: 'facebook/mms-tts-jpn'
    },
    'ko': {
        id: 'ko',
        name: 'Korean (MMS)',
        language: 'Korean',
        languageCode: 'ko',
        model: 'facebook/mms-tts-kor'
    },
    'ru': {
        id: 'ru',
        name: 'Russian (MMS)',
        language: 'Russian',
        languageCode: 'ru',
        model: 'facebook/mms-tts-rus'
    },
    'hi': {
        id: 'hi',
        name: 'Hindi (MMS)',
        language: 'Hindi',
        languageCode: 'hi',
        model: 'facebook/mms-tts-hin'
    }
};

// MMS-TTS server base URL
const MMS_TTS_BASE_URL = process.env.MMS_TTS_URL || 'http://localhost:5000';

export interface TTSRequest {
    text: string;
    language: string;
}

export interface TTSResponse {
    audioBuffer: Buffer;
    format: string;
}

/**
 * Generate speech from text using MMS-TTS
 */
export async function generateSpeech(request: TTSRequest): Promise<Buffer> {
    const voice = MMS_TTS_VOICES[request.language] || MMS_TTS_VOICES['ar'];

    const response = await fetch(`${MMS_TTS_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: request.text,
            language: voice.languageCode,
            format: 'wav'
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MMS-TTS error: ${response.statusText} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
}

/**
 * Generate speech using Web Speech API (Browser fallback)
 * Returns JavaScript code for client-side execution
 */
export function generateBrowserTTSCode(text: string, language: string): string {
    const voice = MMS_TTS_VOICES[language] || MMS_TTS_VOICES['ar'];
    const langCode = voice.languageCode;

    return `
(function() {
    const utterance = new SpeechSynthesisUtterance(${JSON.stringify(text)});
    utterance.lang = '${langCode}';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Find the best matching voice
    const voices = speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith('${langCode}'));
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
 * Check if MMS-TTS server is available
 */
export async function checkTTSStatus(): Promise<{
    available: boolean;
    voices: TTSVoice[];
    error?: string;
}> {
    try {
        const response = await fetch(`${MMS_TTS_BASE_URL}/api/health`, {
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (!response.ok) {
            return {
                available: false,
                voices: Object.values(MMS_TTS_VOICES),
                error: 'MMS-TTS server not responding'
            };
        }

        const data = await response.json();

        return {
            available: true,
            voices: Object.values(MMS_TTS_VOICES),
        };
    } catch (error) {
        // If MMS-TTS is not available, we'll use browser TTS as fallback
        return {
            available: false,
            voices: Object.values(MMS_TTS_VOICES),
            error: `MMS-TTS not available, using browser fallback: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * Get voice information for a language
 */
export function getVoiceForLanguage(language: string): TTSVoice {
    return MMS_TTS_VOICES[language] || MMS_TTS_VOICES['ar'];
}

/**
 * Split long text into chunks for TTS processing
 */
export function splitTextForTTS(text: string, maxLength: number = 500): string[] {
    // Split by sentences (Arabic and English punctuation)
    const sentences = text.match(/[^.!?،؟]+[.!?،؟]+/g) || [text];
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

/**
 * Preload model for a specific language (for faster first request)
 */
export async function preloadModel(language: string = 'ar'): Promise<boolean> {
    try {
        const response = await fetch(`${MMS_TTS_BASE_URL}/api/preload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language }),
            signal: AbortSignal.timeout(60000) // 60 second timeout for model loading
        });

        return response.ok;
    } catch {
        return false;
    }
}

export default {
    generateSpeech,
    generateBrowserTTSCode,
    checkTTSStatus,
    getVoiceForLanguage,
    splitTextForTTS,
    preloadModel,
    MMS_TTS_VOICES
};
