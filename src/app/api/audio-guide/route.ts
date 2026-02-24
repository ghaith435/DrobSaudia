/**
 * Enhanced Audio Guide Service
 * خدمة الدليل الصوتي المحسنة
 * 
 * Features:
 * - AI Content Generation (Gemini/Ollama)
 * - Manual Content Override
 * - Tourism Authority Sources
 * - TTS with Professional Recording Fallback
 * - VR Audio Integration
 */

import { NextResponse } from 'next/server';
import {
    allEnhancedAudioTours,
    getAudioTourById,
    EnhancedAudioStop,
    ContentSource
} from '@/data/audio-tours-enhanced';
import { places } from '@/data/places';
import { CITIES_DATA } from '@/data/cities';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
const AI_TIMEOUT_MS = 20000;

// Content style types
type ContentStyle = 'documentary' | 'narrative' | 'combined';

interface AudioGuideRequest {
    placeId?: string;
    tourId?: string;
    stopId?: string;
    language: string;
    style?: ContentStyle;
    includeVR?: boolean;
    contentSource?: ContentSource;
}

interface AudioGuideResponse {
    success: boolean;
    data?: {
        script: string;
        documentaryScript?: string;
        narrativeScript?: string;
        voiceConfig: {
            lang: string;
            rate: number;
            pitch: number;
        };
        audioUrl?: string;
        professionalAudioUrl?: string;
        ttsAudioUrl?: string;
        contentSource: ContentSource;
        sourceReference?: string;
        vrEnabled?: boolean;
        vrHotspots?: Array<{
            id: string;
            name: string;
            audioScript: string;
            position: { x: number; y: number; z: number };
        }>;
        subTours?: Array<{
            id: string;
            title: string;
            description: string;
            duration: string;
        }>;
    };
    error?: string;
}

// AI Script Generation
async function generateAIScript(
    prompt: string,
    style: ContentStyle = 'combined'
): Promise<{ script: string; documentary?: string; narrative?: string } | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

        const stylePrompt = style === 'documentary'
            ? 'Write in a factual, informative documentary style with dates, statistics, and historical facts.'
            : style === 'narrative'
                ? 'Write in an engaging storytelling style, making the listener feel transported to the location.'
                : 'Combine factual information with storytelling elements for an immersive yet informative experience.';

        const fullPrompt = `${prompt}\n\nStyle: ${stylePrompt}\n\nKeep the response between 100-150 words, suitable for audio narration.`;

        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'lfm2.5-thinking:latest',
                prompt: fullPrompt,
                stream: false,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`AI Service Error: ${response.statusText}`);
        }

        const data = await response.json();
        const script = data.response?.trim() || null;

        if (script) {
            return { script };
        }
        return null;
    } catch (error) {
        console.warn('AI generation failed:', error);
        return null;
    }
}

// Combine documentary and narrative scripts
function combineScripts(
    documentary: string | undefined,
    narrative: string | undefined,
    isArabic: boolean
): string {
    if (documentary && narrative) {
        return isArabic
            ? `${documentary}\n\n${narrative}`
            : `${documentary}\n\n${narrative}`;
    }
    return documentary || narrative || '';
}

// Get voice configuration for language
function getVoiceConfig(language: string) {
    const configs: Record<string, { lang: string; rate: number; pitch: number }> = {
        ar: { lang: 'ar-SA', rate: 0.9, pitch: 1.0 },
        en: { lang: 'en-US', rate: 1.0, pitch: 1.0 },
        fr: { lang: 'fr-FR', rate: 1.0, pitch: 1.0 },
        es: { lang: 'es-ES', rate: 1.0, pitch: 1.0 },
        de: { lang: 'de-DE', rate: 1.0, pitch: 1.0 },
        zh: { lang: 'zh-CN', rate: 0.9, pitch: 1.0 },
        ja: { lang: 'ja-JP', rate: 0.9, pitch: 1.0 },
        ko: { lang: 'ko-KR', rate: 0.9, pitch: 1.0 },
        ru: { lang: 'ru-RU', rate: 1.0, pitch: 1.0 },
        hi: { lang: 'hi-IN', rate: 1.0, pitch: 1.0 },
    };
    return configs[language] || configs.en;
}

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const tourId = searchParams.get('tourId');
    const stopId = searchParams.get('stopId');
    const language = searchParams.get('language') || 'en';
    const style = (searchParams.get('style') || 'combined') as ContentStyle;
    const includeVR = searchParams.get('includeVR') === 'true';
    const contentSourceParam = searchParams.get('contentSource') as ContentSource | null;
    const useAI = searchParams.get('useAI') !== 'false';

    const isArabic = language.startsWith('ar');

    // Handle tour-specific requests
    if (tourId) {
        const tour = getAudioTourById(tourId);
        if (!tour) {
            return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
        }

        let stop: EnhancedAudioStop | undefined;
        if (stopId) {
            stop = tour.playlist.find(s => s.id === stopId);
            if (!stop) {
                return NextResponse.json({ success: false, error: 'Stop not found' }, { status: 404 });
            }
        } else {
            stop = tour.playlist[0]; // Default to first stop
        }

        // Get appropriate script based on style
        let script = '';
        let documentaryScript = isArabic ? stop.documentaryScriptAr : stop.documentaryScript;
        let narrativeScript = isArabic ? stop.narrativeScriptAr : stop.narrativeScript;

        if (style === 'documentary' && documentaryScript) {
            script = documentaryScript;
        } else if (style === 'narrative' && narrativeScript) {
            script = narrativeScript;
        } else {
            script = combineScripts(documentaryScript, narrativeScript, isArabic);
        }

        // Fallback to pre-written script
        if (!script) {
            script = isArabic ? (stop.scriptAr || stop.descriptionAr) : (stop.script || stop.description);
        }

        // Try AI generation if no script and AI is enabled
        if (!script && useAI) {
            const placeName = isArabic ? stop.titleAr : stop.title;
            const description = isArabic ? stop.descriptionAr : stop.description;
            const prompt = isArabic
                ? `أنت مرشد سياحي خبير. اكتب نصاً للدليل الصوتي عن "${placeName}": ${description}`
                : `You are an expert tour guide. Write an audio guide script about "${placeName}": ${description}`;

            const aiResult = await generateAIScript(prompt, style);
            if (aiResult) {
                script = aiResult.script;
            }
        }

        // Build response
        const responseData: AudioGuideResponse = {
            success: true,
            data: {
                script: script || (isArabic ? 'المحتوى غير متوفر' : 'Content not available'),
                documentaryScript: documentaryScript,
                narrativeScript: narrativeScript,
                voiceConfig: getVoiceConfig(language),
                audioUrl: stop.audioUrl,
                professionalAudioUrl: stop.professionalAudioUrl,
                ttsAudioUrl: stop.ttsAudioUrl,
                contentSource: stop.contentSource,
                sourceReference: stop.sourceReference,
                vrEnabled: includeVR && stop.vrEnabled,
                subTours: stop.subTours?.map(st => ({
                    id: st.id,
                    title: isArabic ? st.titleAr : st.title,
                    description: isArabic ? st.descriptionAr : st.description,
                    duration: st.duration
                }))
            }
        };

        if (includeVR && stop.vrEnabled && stop.vrHotspots) {
            responseData.data!.vrHotspots = stop.vrHotspots.map(h => ({
                id: h.id,
                name: isArabic ? h.nameAr : h.name,
                audioScript: isArabic ? h.audioScriptAr : h.audioScript,
                position: h.position
            }));
        }

        return NextResponse.json(responseData);
    }

    // Handle place-based requests (legacy support)
    if (placeId) {
        let place: any = places.find(p => p.id === placeId);

        if (!place) {
            for (const city of CITIES_DATA) {
                const cityPlace = city.places.find(p => p.id === placeId);
                if (cityPlace) {
                    place = cityPlace;
                    break;
                }
            }
        }

        if (!place) {
            return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
        }

        let script = '';
        let aiGenerated = false;

        // Try AI generation if enabled
        if (useAI) {
            const prompt = isArabic
                ? `أنت مرشد سياحي خبير. اكتب نصاً صوتياً جذاباً (100-150 كلمة) عن "${place.nameAr || place.name}": ${place.descriptionAr || place.description}. ادمج المعلومات التاريخية مع الأسلوب القصصي الممتع.`
                : `You are an expert tour guide. Write an engaging audio script (100-150 words) about "${place.name}": ${place.description}. Combine historical facts with narrative storytelling.`;

            const aiResult = await generateAIScript(prompt, style);
            if (aiResult) {
                script = aiResult.script;
                aiGenerated = true;
            }
        }

        // Fallback to static content
        if (!script) {
            if (isArabic) {
                script = `مرحباً بك في ${place.nameAr || place.name}. `;
                script += place.descriptionAr || place.description;
                if (place.rating) {
                    script += ` يتمتع هذا المكان بتقييم ${place.rating} من 5 نجوم.`;
                }
            } else {
                script = `Welcome to ${place.name}. `;
                script += place.description;
                if (place.rating) {
                    script += ` This place is rated ${place.rating} out of 5 stars.`;
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                script,
                voiceConfig: getVoiceConfig(language),
                contentSource: aiGenerated ? 'ai_generated' : 'manual',
                audioUrl: null,
                professionalAudioUrl: null,
                ttsAudioUrl: null
            }
        });
    }

    return NextResponse.json({ success: false, error: 'Place ID or Tour ID is required' }, { status: 400 });
}

// POST endpoint for generating custom content
export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const {
            placeName,
            placeDescription,
            language = 'en',
            style = 'combined',
            customPrompt
        } = body;

        if (!placeName) {
            return NextResponse.json({ success: false, error: 'Place name is required' }, { status: 400 });
        }

        const isArabic = language.startsWith('ar');

        let prompt: string;
        if (customPrompt) {
            prompt = customPrompt;
        } else {
            prompt = isArabic
                ? `أنت مرشد سياحي سعودي خبير. اكتب نصاً للدليل الصوتي عن "${placeName}"${placeDescription ? `: ${placeDescription}` : ''}. المصدر: هيئة السياحة السعودية.`
                : `You are an expert Saudi tour guide. Write an audio guide script about "${placeName}"${placeDescription ? `: ${placeDescription}` : ''}. Source: Saudi Tourism Authority.`;
        }

        const result = await generateAIScript(prompt, style as ContentStyle);

        if (result) {
            return NextResponse.json({
                success: true,
                data: {
                    script: result.script,
                    voiceConfig: getVoiceConfig(language),
                    contentSource: 'ai_generated' as ContentSource,
                    sourceReference: 'AI Generated - Saudi Tourism Context'
                }
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to generate content'
        }, { status: 500 });

    } catch (error) {
        console.error('Audio guide generation error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
