export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// Helper function to retry with delay
async function generateWithRetry(model: any, prompt: string, maxRetries = 3): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error: any) {
            if (error?.status === 429 && i < maxRetries - 1) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000));
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

interface TourStop {
    title: string;
    titleAr: string;
    description?: string;
}

interface GenerateRequest {
    tourTitle: string;
    tourTitleAr: string;
    stops: TourStop[];
    language: 'ar' | 'en';
}

export async function POST(request: Request) {
    try {
        const body: GenerateRequest = await request.json();
        const { tourTitle, tourTitleAr, stops, language = 'ar' } = body;

        if (!tourTitle || !stops || stops.length === 0) {
            return NextResponse.json(
                { error: 'Tour title and stops are required' },
                { status: 400 }
            );
        }

        // Try different models in order of preference
        let model;
        try {
            model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });
        } catch {
            model = getGenAI().getGenerativeModel({ model: 'gemini-pro' });
        }

        // Generate scripts for each stop
        const scripts = await Promise.all(
            stops.map(async (stop, index) => {
                const prompt = language === 'ar'
                    ? `أنت مرشد سياحي محترف في الرياض، المملكة العربية السعودية.

اكتب نصاً صوتياً احترافياً (80-120 كلمة) عن المحطة التالية في جولة "${tourTitleAr}":

المحطة: ${stop.titleAr}
${stop.description ? `الوصف: ${stop.description}` : ''}

المتطلبات:
- ابدأ بترحيب قصير إذا كانت المحطة الأولى
- اذكر معلومات تاريخية وثقافية مثيرة للاهتمام
- استخدم أسلوباً دافئاً وودوداً مناسباً للسماع
- اختم بجملة تشويقية للمحطة التالية إذا لم تكن المحطة الأخيرة
- إذا كانت المحطة الأخيرة، اختم بشكر المستمع

اكتب النص بالعربية الفصحى السهلة.`
                    : `You are a professional tour guide in Riyadh, Saudi Arabia.

Write a professional audio script (80-120 words) for the following stop in the "${tourTitle}" tour:

Stop: ${stop.title}
${stop.description ? `Description: ${stop.description}` : ''}

Requirements:
- Start with a brief welcome if it's the first stop
- Include interesting historical and cultural information
- Use a warm, friendly tone suitable for listening
- End with a teaser for the next stop if not the last
- If it's the last stop, thank the listener

Write in clear, engaging English.`;

                try {
                    const result = await model.generateContent(prompt);
                    const text = result.response.text();

                    return {
                        stopId: `${index + 1}`,
                        stopTitle: language === 'ar' ? stop.titleAr : stop.title,
                        script: text.trim(),
                        language,
                    };
                } catch (error) {
                    console.error(`Error generating script for stop ${index + 1}:`, error);
                    return {
                        stopId: `${index + 1}`,
                        stopTitle: language === 'ar' ? stop.titleAr : stop.title,
                        script: language === 'ar'
                            ? `مرحباً بكم في ${stop.titleAr}. هذا المكان يمثل جزءاً مهماً من تراث الرياض العريق.`
                            : `Welcome to ${stop.title}. This location represents an important part of Riyadh's rich heritage.`,
                        language,
                        error: true,
                    };
                }
            })
        );

        return NextResponse.json({
            success: true,
            tourTitle: language === 'ar' ? tourTitleAr : tourTitle,
            language,
            scripts,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Generate tour scripts error:', error);
        return NextResponse.json(
            { error: 'Failed to generate tour scripts' },
            { status: 500 }
        );
    }
}

// GET: Generate script for a single stop/place
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const placeName = searchParams.get('place');
    const placeNameAr = searchParams.get('placeAr');
    const language = searchParams.get('lang') || 'ar';
    const context = searchParams.get('context') || '';

    if (!placeName && !placeNameAr) {
        return NextResponse.json(
            { error: 'Place name is required' },
            { status: 400 }
        );
    }

    try {
        const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

        const name = language === 'ar' ? (placeNameAr || placeName) : placeName;

        const prompt = language === 'ar'
            ? `أنت مرشد سياحي محترف. اكتب نصاً صوتياً قصيراً وجذاباً (60-100 كلمة) عن "${name}" في الرياض.
${context ? `السياق: ${context}` : ''}

اذكر:
- تاريخ المكان وأهميته
- ما يميزه عن غيره
- نصيحة للزائرين

اكتب بأسلوب دافئ ومشوق للسماع.`
            : `You are a professional tour guide. Write a short, engaging audio script (60-100 words) about "${name}" in Riyadh.
${context ? `Context: ${context}` : ''}

Include:
- The history and significance of the place
- What makes it unique
- Tips for visitors

Write in a warm, engaging style suitable for listening.`;

        const result = await model.generateContent(prompt);
        const script = result.response.text();

        return NextResponse.json({
            success: true,
            place: name,
            language,
            script: script.trim(),
            // Generate TTS URL for convenience
            ttsUrl: `/api/tts?text=${encodeURIComponent(script.trim().substring(0, 500))}&lang=${language}`,
        });
    } catch (error) {
        console.error('Generate place script error:', error);

        // Fallback script
        const fallbackScript = language === 'ar'
            ? `مرحباً بكم في ${placeNameAr || placeName}. هذا المكان الرائع يمثل جزءاً من تراث مدينة الرياض العريق. نتمنى لكم زيارة ممتعة.`
            : `Welcome to ${placeName}. This wonderful place represents part of Riyadh's rich heritage. We hope you enjoy your visit.`;

        return NextResponse.json({
            success: true,
            place: language === 'ar' ? (placeNameAr || placeName) : placeName,
            language,
            script: fallbackScript,
            ttsUrl: `/api/tts?text=${encodeURIComponent(fallbackScript)}&lang=${language}`,
            fallback: true,
        });
    }
}
