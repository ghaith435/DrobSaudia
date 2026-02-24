/**
 * AI Integration for Smart Tourism Platform
 * Uses Ollama (local) as primary with support for external APIs
 */

import { ollamaChat, checkOllamaStatus } from '@/lib/ollama';

/**
 * System prompt for the spatial AI tourism guide
 */
const SPATIAL_AI_PROMPT_AR = `
أنت مرشد سياحي خبير في المملكة العربية السعودية، متخصص في الدرعية التاريخية ومعالم الرياض.

عند إعطائك إحداثيات GPS أو اسم موقع، قدم المعلومات التالية بأسلوب مشوق وتفاعلي:

1. **نبذة تاريخية**: معلومات موجزة عن تاريخ الموقع وأهميته
2. **الأهمية الثقافية**: ماذا يمثل هذا الموقع للمملكة والعالم
3. **نصائح الزيارة**: أفضل أوقات الزيارة، ما يجب إحضاره، المدة المقترحة
4. **المعالم القريبة**: مواقع أخرى قريبة يمكن زيارتها
5. **حقائق مثيرة**: معلومات فريدة لا يعرفها الكثيرون

الأسلوب: ودي، متحمس، ثقافي، يحترم التراث السعودي
اللغة: العربية الفصحى مع لمسة محلية سعودية
`;

const SPATIAL_AI_PROMPT_EN = `
You are an expert tourism guide specializing in Saudi Arabia, particularly the historic Diriyah and Riyadh landmarks.

When given GPS coordinates or a location name, provide the following information in an engaging and interactive style:

1. **Historical Overview**: Brief information about the site's history and significance
2. **Cultural Importance**: What this site represents for the Kingdom and the world
3. **Visit Tips**: Best times to visit, what to bring, suggested duration
4. **Nearby Attractions**: Other sites nearby worth visiting
5. **Fascinating Facts**: Unique information that most people don't know

Style: Friendly, enthusiastic, cultural, respecting Saudi heritage
Language: Clear and engaging English
`;

/**
 * Get location information using AI
 */
export async function getLocationInfo(
    coords: { lat: number; lng: number },
    locale: 'ar' | 'en' = 'ar'
): Promise<string> {
    try {
        const systemPrompt = locale === 'ar' ? SPATIAL_AI_PROMPT_AR : SPATIAL_AI_PROMPT_EN;
        const userMessage = locale === 'ar'
            ? `الإحداثيات الحالية: ${coords.lat}, ${coords.lng}\nأخبرني عن هذا الموقع والمعالم القريبة.`
            : `Current coordinates: ${coords.lat}, ${coords.lng}\nTell me about this location and nearby attractions.`;

        const response = await ollamaChat({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
        });

        return response.message?.content || '';
    } catch (error) {
        console.error('Error getting location info:', error);
        throw error;
    }
}

/**
 * Generate audio guide script for a location
 */
export async function generateAudioGuideScript(
    locationName: string,
    locale: 'ar' | 'en' = 'ar'
): Promise<string> {
    try {
        const systemPrompt = locale === 'ar'
            ? `أنت كاتب نصوص محترف للأدلة الصوتية السياحية. اكتب نصًا مشوقًا ومناسبًا للاستماع (2-3 دقائق) عن المعلم السياحي المعطى. استخدم لغة عربية فصيحة مع نبرة ودية ومتحمسة.`
            : `You are a professional audio guide script writer. Write an engaging script suitable for listening (2-3 minutes) about the given tourist attraction. Use clear language with a friendly and enthusiastic tone.`;

        const userMessage = locale === 'ar'
            ? `اكتب نص دليل صوتي عن: ${locationName}`
            : `Write an audio guide script about: ${locationName}`;

        const response = await ollamaChat({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.8,
        });

        return response.message?.content || '';
    } catch (error) {
        console.error('Error generating audio guide script:', error);
        throw error;
    }
}

/**
 * Plan a trip based on user preferences
 */
export async function planTrip(params: {
    startLocation: string;
    interests: string[];
    duration: number; // in days
    budget: 'low' | 'medium' | 'high' | 'luxury';
    travelersCount: number;
    includeChildren: boolean;
    accessibility: boolean;
    locale: 'ar' | 'en';
}): Promise<string> {
    try {
        const { locale, ...tripParams } = params;

        const systemPrompt = locale === 'ar'
            ? `أنت مخطط رحلات خبير في المملكة العربية السعودية. قدم خطة رحلة مفصلة ومنظمة بشكل جميل تتضمن:
- جدول يومي مفصل
- المعالم والأماكن المقترحة
- تقديرات التكلفة
- نصائح عملية
- بدائل للطقس السيء
استخدم تنسيق Markdown للوضوح.`
            : `You are an expert trip planner for Saudi Arabia. Provide a detailed and beautifully organized trip plan including:
- Detailed daily itinerary
- Suggested attractions and places
- Cost estimates
- Practical tips
- Bad weather alternatives
Use Markdown formatting for clarity.`;

        const userMessage = locale === 'ar'
            ? `خطط رحلة بالمواصفات التالية:
- نقطة البداية: ${tripParams.startLocation}
- الاهتمامات: ${tripParams.interests.join(', ')}
- المدة: ${tripParams.duration} أيام
- الميزانية: ${tripParams.budget}
- عدد المسافرين: ${tripParams.travelersCount}
- يشمل أطفال: ${tripParams.includeChildren ? 'نعم' : 'لا'}
- احتياجات خاصة: ${tripParams.accessibility ? 'نعم' : 'لا'}`
            : `Plan a trip with the following specifications:
- Starting point: ${tripParams.startLocation}
- Interests: ${tripParams.interests.join(', ')}
- Duration: ${tripParams.duration} days
- Budget: ${tripParams.budget}
- Number of travelers: ${tripParams.travelersCount}
- Includes children: ${tripParams.includeChildren ? 'Yes' : 'No'}
- Accessibility needs: ${tripParams.accessibility ? 'Yes' : 'No'}`;

        const response = await ollamaChat({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
        });

        return response.message?.content || '';
    } catch (error) {
        console.error('Error planning trip:', error);
        throw error;
    }
}

/**
 * Process voice command and return appropriate response
 */
export async function processVoiceCommand(
    command: string,
    context: {
        currentLocation?: { lat: number; lng: number };
        locale: 'ar' | 'en';
    }
): Promise<{
    action: 'navigate' | 'info' | 'search' | 'help' | 'unknown';
    response: string;
    data?: Record<string, unknown>;
}> {
    try {
        const systemPrompt = context.locale === 'ar'
            ? `أنت مساعد صوتي ذكي لتطبيق سياحي. حلل الأمر الصوتي وحدد:
1. نوع الإجراء: navigate (التنقل), info (معلومات), search (بحث), help (مساعدة)
2. الرد المناسب
أجب بتنسيق JSON: {"action": "...", "response": "...", "data": {...}}`
            : `You are a smart voice assistant for a tourism app. Analyze the voice command and determine:
1. Action type: navigate, info, search, help
2. Appropriate response
Reply in JSON format: {"action": "...", "response": "...", "data": {...}}`;

        const response = await ollamaChat({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: command }
            ],
            temperature: 0.5,
        });

        try {
            const result = JSON.parse(response.message?.content || '{}');
            return {
                action: result.action || 'unknown',
                response: result.response || '',
                data: result.data,
            };
        } catch {
            return {
                action: 'unknown',
                response: response.message?.content || '',
            };
        }
    } catch (error) {
        console.error('Error processing voice command:', error);
        throw error;
    }
}

/**
 * Check if AI service is available
 */
export async function checkAIStatus(): Promise<{
    available: boolean;
    provider: 'ollama' | 'none';
}> {
    const status = await checkOllamaStatus();

    return {
        available: status.available,
        provider: status.available ? 'ollama' : 'none'
    };
}
