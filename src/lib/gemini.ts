import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
// Initialize Gemini AI lazily
const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// Supported languages for audio guidance
export const SUPPORTED_LANGUAGES = {
    en: { name: "English", nativeName: "English", code: "en-US" },
    ar: { name: "Arabic", nativeName: "العربية", code: "ar-SA" },
    fr: { name: "French", nativeName: "Français", code: "fr-FR" },
    es: { name: "Spanish", nativeName: "Español", code: "es-ES" },
    de: { name: "German", nativeName: "Deutsch", code: "de-DE" },
    zh: { name: "Chinese", nativeName: "中文", code: "zh-CN" },
    ja: { name: "Japanese", nativeName: "日本語", code: "ja-JP" },
    ko: { name: "Korean", nativeName: "한국어", code: "ko-KR" },
    ru: { name: "Russian", nativeName: "Русский", code: "ru-RU" },
    hi: { name: "Hindi", nativeName: "हिन्दी", code: "hi-IN" },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

interface PlaceInfo {
    name: string;
    nameAr?: string;
    description: string;
    category: string;
    rating: number;
    reviewCount: number;
    features: string[];
    address: string;
    openingHours?: string;
    userReviews?: Array<{
        rating: number;
        content: string;
        userName: string;
    }>;
}

// Generate audio guide script using Gemini AI
export async function generateAudioGuide(
    place: PlaceInfo,
    language: LanguageCode = "en",
    includeReviews: boolean = true
): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

    const languageInfo = SUPPORTED_LANGUAGES[language];

    // Build reviews summary for AI
    let reviewsSummary = "";
    if (includeReviews && place.userReviews && place.userReviews.length > 0) {
        const avgRating = place.userReviews.reduce((acc, r) => acc + r.rating, 0) / place.userReviews.length;
        const highlights = place.userReviews.slice(0, 3).map(r => r.content).join(" ");
        reviewsSummary = `
        User Reviews Summary:
        - Average user rating: ${avgRating.toFixed(1)} out of 5
        - Total reviews: ${place.reviewCount}
        - Recent visitor highlights: ${highlights}
        `;
    }

    const prompt = `You are a professional tour guide for Riyadh, Saudi Arabia. Generate an engaging, informative audio guide script for the following tourist attraction.

The script should be:
1. Written in ${languageInfo.name} language (${languageInfo.nativeName})
2. 2-3 minutes when read aloud (approximately 300-400 words)
3. Engaging and conversational, as if speaking directly to the tourist
4. Include interesting historical facts, cultural context, and practical tips
5. Mention what makes this place special and must-see highlights
6. Include insights from user reviews to give authentic visitor perspective

Place Information:
- Name: ${place.name}${place.nameAr ? ` (${place.nameAr})` : ""}
- Category: ${place.category}
- Description: ${place.description}
- Overall Rating: ${place.rating}/5 from ${place.reviewCount} reviews
- Features: ${place.features.join(", ")}
- Location: ${place.address}
${place.openingHours ? `- Opening Hours: ${place.openingHours}` : ""}

${reviewsSummary}

Generate the audio guide script in ${languageInfo.name}. Start with a warm welcome and end with encouragement to explore and enjoy.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating audio guide:", error);
        throw new Error("Failed to generate audio guide");
    }
}

// Generate personalized trip suggestions based on preferences
export async function generateTripSuggestions(
    userPreferences: {
        interests: string[];
        duration: string;
        budget: string;
        language: LanguageCode;
    },
    availablePlaces: PlaceInfo[]
): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });
    const languageInfo = SUPPORTED_LANGUAGES[userPreferences.language];

    const placesInfo = availablePlaces.map(p =>
        `- ${p.name}: ${p.category}, Rating: ${p.rating}, Features: ${p.features.join(", ")}`
    ).join("\n");

    const prompt = `You are a travel advisor for Riyadh, Saudi Arabia. Create a personalized trip itinerary based on the following:

User Preferences:
- Interests: ${userPreferences.interests.join(", ")}
- Trip Duration: ${userPreferences.duration}
- Budget: ${userPreferences.budget}

Available Places:
${placesInfo}

Generate a detailed trip plan in ${languageInfo.name} language that:
1. Matches the user's interests and budget
2. Provides realistic time allocations
3. Includes practical tips for each location
4. Suggests the best order to visit places
5. Mentions approximate costs where relevant

Format the response as a clear, day-by-day itinerary.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating trip suggestions:", error);
        throw new Error("Failed to generate trip suggestions");
    }
}

// Analyze reviews to extract key insights
export async function analyzeReviews(
    reviews: Array<{ rating: number; content: string }>,
    language: LanguageCode = "en"
): Promise<{
    summary: string;
    positives: string[];
    negatives: string[];
    tips: string[];
}> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });
    const languageInfo = SUPPORTED_LANGUAGES[language];

    const reviewsText = reviews.map((r, i) =>
        `Review ${i + 1} (${r.rating}/5): ${r.content}`
    ).join("\n");

    const prompt = `Analyze the following tourist reviews and extract key insights in ${languageInfo.name} language.

Reviews:
${reviewsText}

Provide a JSON response with:
1. "summary": A 2-3 sentence overall summary
2. "positives": Array of 3-5 most mentioned positive aspects
3. "negatives": Array of any common complaints or issues
4. "tips": Array of 3-5 practical tips from visitors

Return ONLY valid JSON, no markdown.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json\n?|\n?```/g, "");
        return JSON.parse(text);
    } catch (error) {
        console.error("Error analyzing reviews:", error);
        return {
            summary: "Unable to analyze reviews at this time.",
            positives: [],
            negatives: [],
            tips: [],
        };
    }
}

// Smart chat with tour guide using Gemini AI
export interface ChatMessage {
    role: 'user' | 'guide';
    content: string;
}

export async function chatWithGuide(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    language: LanguageCode = "ar",
    context?: {
        currentPlace?: string;
        visitedPlaces?: string[];
        interests?: string[];
    }
): Promise<string> {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
    const languageInfo = SUPPORTED_LANGUAGES[language];

    // Build conversation context
    const historyText = conversationHistory.slice(-6).map(msg =>
        `${msg.role === 'user' ? 'السائح' : 'المرشد'}: ${msg.content}`
    ).join("\n");

    const contextInfo = context ? `
معلومات إضافية:
${context.currentPlace ? `- المكان الحالي: ${context.currentPlace}` : ''}
${context.visitedPlaces?.length ? `- الأماكن التي زارها: ${context.visitedPlaces.join(', ')}` : ''}
${context.interests?.length ? `- اهتماماته: ${context.interests.join(', ')}` : ''}
` : '';

    const systemPrompt = language === 'ar' ? `أنت مرشد سياحي ذكي وودود لمدينة الرياض، المملكة العربية السعودية. اسمك "دليل الرياض".

مهمتك:
- الإجابة على أسئلة السياح بشكل طبيعي ومفيد
- تقديم معلومات عن الأماكن السياحية والتاريخية والترفيهية في الرياض
- اقتراح الأماكن والمطاعم والأنشطة المناسبة
- تقديم نصائح عملية للزوار
- الرد بأسلوب ودود ومحترف

أماكن مهمة في الرياض تعرفها جيداً:
- الدرعية التاريخية (حي الطريف، تراس البجيري)
- بوليفارد رياض سيتي
- برج المملكة
- المتحف الوطني
- حديقة الملك عبدالله
- وادي حنيفة
- سوق الزل

${contextInfo}

${historyText ? `المحادثة السابقة:\n${historyText}\n` : ''}

أجب على رسالة السائح التالية بشكل طبيعي ومختصر (2-4 جمل). لا تستخدم عناوين أو نقاط. اجعل الرد محادثة طبيعية.`
        : `You are a smart and friendly tour guide for Riyadh, Saudi Arabia. Your name is "Riyadh Guide".

Your mission:
- Answer tourist questions naturally and helpfully
- Provide information about tourist, historical, and entertainment places in Riyadh
- Suggest suitable places, restaurants, and activities
- Provide practical tips for visitors
- Respond in a friendly and professional manner

${contextInfo}

${historyText ? `Previous conversation:\n${historyText}\n` : ''}

Reply to the following tourist message naturally and briefly (2-4 sentences). Don't use headers or bullet points. Make it a natural conversation.`;

    const prompt = `${systemPrompt}

رسالة السائح: ${userMessage}

ردك:`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error in chat with guide:", error);
        // Return a helpful fallback message
        if (language === 'ar') {
            return "عذراً، واجهت مشكلة تقنية. يمكنك سؤالي عن المطاعم، الأماكن السياحية، أو التاريخ. كيف يمكنني مساعدتك؟";
        }
        return "Sorry, I encountered a technical issue. You can ask me about restaurants, tourist spots, or history. How can I help you?";
    }
}

