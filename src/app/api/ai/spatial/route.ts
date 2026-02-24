export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ollamaChat } from '@/lib/ollama';
import { getNearestAttractions, diriyahAttractions } from '@/data/diriyah';

const SPATIAL_AI_PROMPT_AR = `
أنت مرشد سياحي خبير في المملكة العربية السعودية، متخصص في الدرعية التاريخية ومعالم الرياض.
عند إعطائك سؤال أو موقع، قدم إجابة مختصرة ومفيدة (2-3 فقرات كحد أقصى).
كن ودوداً ومتحمساً. استخدم العربية الفصحى.
`;

const SPATIAL_AI_PROMPT_EN = `
You are an expert tourism guide specializing in Saudi Arabia, particularly historic Diriyah and Riyadh landmarks.
When given a question or location, provide a concise and helpful response (2-3 paragraphs maximum).
Be friendly and enthusiastic. Use clear English.
`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, locale = 'ar', coordinates } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Build context with nearby attractions if coordinates provided
        let context = '';
        if (coordinates) {
            const nearby = getNearestAttractions(coordinates, 3);
            context = locale === 'ar'
                ? `المعالم القريبة: ${nearby.map(a => a.nameAr).join(', ')}\n\n`
                : `Nearby attractions: ${nearby.map(a => a.name).join(', ')}\n\n`;
        }

        // Add information about all Diriyah attractions
        const attractionsInfo = diriyahAttractions
            .map(a => locale === 'ar'
                ? `${a.nameAr}: ${a.descriptionAr}`
                : `${a.name}: ${a.description}`)
            .join('\n');

        const systemPrompt = locale === 'ar' ? SPATIAL_AI_PROMPT_AR : SPATIAL_AI_PROMPT_EN;
        const fullSystemPrompt = `${systemPrompt}\n\nمعلومات المعالم المتاحة:\n${attractionsInfo}`;

        const response = await ollamaChat({
            messages: [
                { role: 'system', content: fullSystemPrompt },
                { role: 'user', content: `${context}${query}` }
            ],
            temperature: 0.7,
        });

        const aiResponse = response.message?.content || '';

        return NextResponse.json({
            response: aiResponse,
        });
    } catch (error) {
        console.error('Error in spatial AI:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
