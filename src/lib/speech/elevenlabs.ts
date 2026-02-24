/**
 * ElevenLabs TTS Integration
 * Provides natural human-like voice for the tourism audio guide
 */

interface VoiceSettings {
    stability: number;
    similarityBoost: number;
    style?: number;
    useSpeakerBoost?: boolean;
}

interface TTSOptions {
    voiceId?: string;
    modelId?: string;
    voiceSettings?: VoiceSettings;
}

// Pre-configured Arabic and English voices
export const VOICES = {
    ar: {
        male: 'pNInz6obpgDQGcFmaJgB', // Arabic male voice
        female: 'EXAVITQu4vr4xnSDxMaL', // Arabic female voice
    },
    en: {
        male: 'VR6AewLTigWG4xSOukaG', // English male voice
        female: 'jBpfuIE2acCO8z3wKNLl', // English female voice
    },
};

// Default voice settings optimized for tourism narration
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
    useSpeakerBoost: true,
};

/**
 * Generate speech from text using ElevenLabs
 */
export async function generateSpeech(
    text: string,
    locale: 'ar' | 'en' = 'ar',
    options: TTSOptions = {}
): Promise<ArrayBuffer> {
    const voiceId = options.voiceId || VOICES[locale].male;
    const modelId = options.modelId || 'eleven_multilingual_v2';
    const voiceSettings = options.voiceSettings || DEFAULT_VOICE_SETTINGS;

    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: modelId,
                voice_settings: voiceSettings,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.arrayBuffer();
}

/**
 * Generate speech and return as Blob URL
 */
export async function generateSpeechUrl(
    text: string,
    locale: 'ar' | 'en' = 'ar',
    options: TTSOptions = {}
): Promise<string> {
    const audioBuffer = await generateSpeech(text, locale, options);
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
}

/**
 * Stream speech for real-time playback
 */
export async function streamSpeech(
    text: string,
    locale: 'ar' | 'en' = 'ar',
    options: TTSOptions = {}
): Promise<ReadableStream<Uint8Array>> {
    const voiceId = options.voiceId || VOICES[locale].male;
    const modelId = options.modelId || 'eleven_multilingual_v2';
    const voiceSettings = options.voiceSettings || DEFAULT_VOICE_SETTINGS;

    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: modelId,
                voice_settings: voiceSettings,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.body as ReadableStream<Uint8Array>;
}

/**
 * Get available voices list
 */
export async function getAvailableVoices(): Promise<Array<{
    voice_id: string;
    name: string;
    labels: Record<string, string>;
}>> {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
    });

    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
}

/**
 * Pre-made tourism guide phrases for quick playback
 */
export const GUIDE_PHRASES = {
    ar: {
        welcome: 'مرحباً بكم في جولتنا السياحية. أنا دليلكم الصوتي.',
        arrived: 'لقد وصلنا إلى وجهتنا. دعوني أخبركم المزيد عن هذا المكان.',
        nextStop: 'الوجهة التالية ستكون على بعد أمتار قليلة.',
        history: 'دعوني أخبركم عن تاريخ هذا الموقع الرائع.',
        thanks: 'شكراً لاستخدامكم دليل الرياض. نتمنى لكم زيارة سعيدة!',
    },
    en: {
        welcome: 'Welcome to our tour. I am your audio guide.',
        arrived: 'We have arrived at our destination. Let me tell you more about this place.',
        nextStop: 'The next stop will be just a few meters away.',
        history: 'Let me tell you about the history of this wonderful site.',
        thanks: 'Thank you for using Riyadh Guide. We wish you a pleasant visit!',
    },
};
