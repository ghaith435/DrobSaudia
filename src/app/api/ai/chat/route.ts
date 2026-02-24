export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { chatWithGuide, LanguageCode, ChatMessage } from '@/lib/gemini';

interface ChatContext {
    currentLocation?: { latitude: number; longitude: number };
    currentPlace?: string;
    visitedPlaces?: string[];
    userPreferences?: {
        interests?: string[];
        language?: LanguageCode;
    };
    conversationHistory?: Array<{
        role: 'user' | 'guide';
        content: string;
        timestamp?: Date;
    }>;
}

// Fallback responses when Gemini is not available
function getFallbackResponse(userInput: string, isArabic: boolean): string {
    const lowerInput = userInput.toLowerCase();

    if (isArabic) {
        if (lowerInput.includes('مطاعم') || lowerInput.includes('أكل') || lowerInput.includes('عشاء')) {
            return 'تتميز الرياض بمشهد طهي رائع! أنصحك بزيارة "تراس البجيري" في الدرعية لتجربة فاخرة مع إطلالة تاريخية، أو زيارة "ميازو" للأكل الياباني المعاصر. هل تفضل نوعاً معيناً من الطعام؟';
        } else if (lowerInput.includes('تاريخ') || lowerInput.includes('درعية') || lowerInput.includes('تراث')) {
            return 'تعتبر الدرعية التاريخية جوهرة المملكة. يمكنك زيارة حي الطريف (موقع تراث عالمي)، وقصر سلوى، ومسجد الإمام محمد بن سعود. هل تود أن أقترح لك خطة لزيارة الدرعية؟';
        } else if (lowerInput.includes('بوليفارد') || lowerInput.includes('ترفيه') || lowerInput.includes('سينما')) {
            return 'بوليفارد رياض سيتي هو وجهة الترفيه الأولى! يضم النافورة الراقصة، ومناطق ترفيهية متنوعة مثل سكوير وسابورت. أنصحك بزيارتها في المساء للاستمتاع بالأجواء.';
        } else if (lowerInput.includes('خطة') || lowerInput.includes('جدول')) {
            return 'بالتأكيد! يمكنني مساعدتك في تخطيط يومك. هل تفضل الأماكن التاريخية أم الحديثة والترفيهية؟';
        } else if (lowerInput.includes('حال') || lowerInput.includes('مرحبا') || lowerInput.includes('أهلا')) {
            return 'أهلاً وسهلاً بك! أنا مرشدك السياحي الذكي للرياض. يسعدني مساعدتك في استكشاف أجمل المعالم السياحية والتاريخية والترفيهية. ماذا تود أن تعرف عن الرياض اليوم؟';
        }
        return 'أهلاً بك في الرياض! أنا هنا لمساعدتك. يمكنك سؤالي عن المطاعم، الأماكن السياحية، الفعاليات، أو التاريخ. ماذا تود أن تعرف؟';
    } else {
        if (lowerInput.includes('restaurant') || lowerInput.includes('food') || lowerInput.includes('eat')) {
            return 'Riyadh has an amazing culinary scene! I recommend visiting "Bujairi Terrace" in Diriyah for a luxury experience with historic views, or "Myazu" for contemporary Japanese cuisine. Do you prefer a specific type of food?';
        } else if (lowerInput.includes('history') || lowerInput.includes('diriyah') || lowerInput.includes('heritage')) {
            return 'Historical Diriyah is the jewel of the Kingdom. You can visit At-Turaif (UNESCO World Heritage site), Salwa Palace, and Imam Mohammad bin Saud Mosque. Would you like a tour plan for Diriyah?';
        } else if (lowerInput.includes('boulevard') || lowerInput.includes('entertainment') || lowerInput.includes('cinema')) {
            return 'Boulevard Riyadh City is the premier entertainment destination! It features the dancing fountain and various zones like Square and Sport. I recommend visiting in the evening to enjoy the atmosphere.';
        } else if (lowerInput.includes('plan') || lowerInput.includes('schedule')) {
            return 'Certainly! I can help you plan your day. Do you prefer historical sites or modern entertainment?';
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('how are')) {
            return 'Hello! I am your AI tour guide for Riyadh. I am happy to help you discover the most beautiful landmarks, historical sites, and entertainment venues. What would you like to know about Riyadh today?';
        }
        return 'Welcome to Riyadh! I am here to help. You can ask me about restaurants, tourist spots, events, or history. What would you like to know?';
    }
}

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json() as {
            message: string;
            context?: ChatContext;
        };

        const language = (context?.userPreferences?.language || 'ar') as LanguageCode;
        const isArabic = language === 'ar';

        let response: string;
        let aiSource: 'gemini' | 'fallback' = 'fallback';

        // Check if Gemini API key is configured
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;

        if (hasGeminiKey) {
            try {
                // Convert conversation history to ChatMessage format
                const conversationHistory: ChatMessage[] = context?.conversationHistory?.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })) || [];

                // Use Gemini for smart response
                response = await chatWithGuide(
                    message,
                    conversationHistory,
                    language,
                    {
                        currentPlace: context?.currentPlace,
                        visitedPlaces: context?.visitedPlaces,
                        interests: context?.userPreferences?.interests
                    }
                );
                aiSource = 'gemini';
            } catch (geminiError) {
                console.error('Gemini chat error:', geminiError);
                // Fallback to static responses if Gemini fails
                response = getFallbackResponse(message, isArabic);
            }
        } else {
            // No API key - use fallback responses
            console.log('No GEMINI_API_KEY configured, using fallback responses');
            response = getFallbackResponse(message, isArabic);
        }

        return NextResponse.json({
            success: true,
            response,
            aiSource,
            geminiConfigured: hasGeminiKey
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
            response: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
        }, { status: 500 });
    }
}
