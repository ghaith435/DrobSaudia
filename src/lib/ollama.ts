// Ollama AI Integration - GLM-4.7-Flash Model
// Local AI for Tourism Guide Features
// Model: unsloth/GLM-4.7-Flash-GGUF (30B-A3B MoE)
// https://huggingface.co/unsloth/GLM-4.7-Flash-GGUF

export interface OllamaMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OllamaResponse {
    model: string;
    created_at: string;
    message: {
        role: string;
        content: string;
    };
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
}

export interface OllamaChatOptions {
    model?: string;
    messages: OllamaMessage[];
    stream?: boolean;
    temperature?: number;
    top_p?: number;
    context?: number[];
    format?: 'json';
}

// Ollama API base URL - can be customized via environment variable
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
// LFM2.5-Thinking: Lightweight local AI model for tourism guide
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'lfm2.5-thinking';

// Supported languages for the tour guide
export const TOUR_GUIDE_LANGUAGES = {
    ar: { name: 'العربية', voice: 'ar' },
    en: { name: 'English', voice: 'en' },
    fr: { name: 'Français', voice: 'fr' },
    es: { name: 'Español', voice: 'es' },
    de: { name: 'Deutsch', voice: 'de' },
    zh: { name: '中文', voice: 'zh' },
    ja: { name: '日本語', voice: 'ja' },
    ko: { name: '한국어', voice: 'ko' },
} as const;

export type TourGuideLanguage = keyof typeof TOUR_GUIDE_LANGUAGES;

/**
 * Send a chat request to Ollama
 */
export async function ollamaChat(options: OllamaChatOptions): Promise<OllamaResponse> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: options.model || DEFAULT_MODEL,
            messages: options.messages,
            stream: false,
            options: {
                temperature: options.temperature ?? 0.7,
                top_p: options.top_p ?? 0.9,
            },
            format: options.format,
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Stream chat response from Ollama
 */
export async function* ollamaChatStream(options: OllamaChatOptions): AsyncGenerator<string> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: options.model || DEFAULT_MODEL,
            messages: options.messages,
            stream: true,
            options: {
                temperature: options.temperature ?? 0.7,
                top_p: options.top_p ?? 0.9,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
            try {
                const data = JSON.parse(line);
                if (data.message?.content) {
                    yield data.message.content;
                }
            } catch {
                // Skip invalid JSON lines
            }
        }
    }
}

/**
 * Check if Ollama is running and the model is available
 */
export async function checkOllamaStatus(): Promise<{
    available: boolean;
    model: string;
    error?: string;
}> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        if (!response.ok) {
            return { available: false, model: DEFAULT_MODEL, error: 'Ollama server not responding' };
        }

        const data = await response.json();
        const models = data.models || [];
        const hasModel = models.some((m: { name: string }) =>
            m.name.includes('lfm2.5-thinking') || m.name === DEFAULT_MODEL
        );

        return {
            available: hasModel,
            model: DEFAULT_MODEL,
            error: hasModel ? undefined : `Model ${DEFAULT_MODEL} not installed. Run: ollama pull lfm2.5-thinking`,
        };
    } catch (error) {
        return {
            available: false,
            model: DEFAULT_MODEL,
            error: `Cannot connect to Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

// ============================================
// TOURISM AI FEATURES
// ============================================

export interface TourPlanRequest {
    interests: string[];
    duration: string; // e.g., "1 day", "3 days", "1 week"
    budget: 'budget' | 'moderate' | 'luxury';
    travelStyle: 'relaxed' | 'active' | 'cultural' | 'adventure';
    groupType: 'solo' | 'couple' | 'family' | 'friends';
    language: TourGuideLanguage;
    specificPlaces?: string[];
    accessibilityNeeds?: string[];
}

export interface TourPlanDay {
    day: number;
    title: string;
    activities: {
        time: string;
        place: string;
        description: string;
        tips: string[];
        estimatedCost?: string;
    }[];
    meals: {
        type: 'breakfast' | 'lunch' | 'dinner';
        recommendation: string;
        cuisine: string;
    }[];
}

export interface TourPlan {
    title: string;
    summary: string;
    days: TourPlanDay[];
    totalEstimatedCost: string;
    generalTips: string[];
    bestTimeToVisit: string;
    weatherAdvice: string;
}

/**
 * Generate a personalized tour plan using AI
 */
export async function generateTourPlan(request: TourPlanRequest): Promise<TourPlan> {
    const systemPrompt = getSystemPromptForLanguage(request.language, 'tour_planner');

    const userPrompt = `
أنشئ خطة سياحية مفصلة للرياض بناءً على المعايير التالية:

- الاهتمامات: ${request.interests.join(', ')}
- المدة: ${request.duration}
- الميزانية: ${request.budget === 'budget' ? 'اقتصادية' : request.budget === 'moderate' ? 'متوسطة' : 'فاخرة'}
- نمط السفر: ${request.travelStyle}
- نوع المجموعة: ${request.groupType === 'solo' ? 'فردي' : request.groupType === 'couple' ? 'زوجان' : request.groupType === 'family' ? 'عائلة' : 'أصدقاء'}
${request.specificPlaces?.length ? `- أماكن محددة للزيارة: ${request.specificPlaces.join(', ')}` : ''}
${request.accessibilityNeeds?.length ? `- احتياجات خاصة: ${request.accessibilityNeeds.join(', ')}` : ''}

أعد الخطة بتنسيق JSON مع الهيكل التالي:
{
    "title": "عنوان الخطة",
    "summary": "ملخص الرحلة",
    "days": [
        {
            "day": 1,
            "title": "عنوان اليوم",
            "activities": [
                {
                    "time": "09:00",
                    "place": "اسم المكان",
                    "description": "وصف النشاط",
                    "tips": ["نصيحة 1", "نصيحة 2"],
                    "estimatedCost": "50 ريال"
                }
            ],
            "meals": [
                {
                    "type": "breakfast",
                    "recommendation": "اسم المطعم",
                    "cuisine": "نوع المطبخ"
                }
            ]
        }
    ],
    "totalEstimatedCost": "التكلفة الإجمالية",
    "generalTips": ["نصيحة عامة 1", "نصيحة عامة 2"],
    "bestTimeToVisit": "أفضل وقت للزيارة",
    "weatherAdvice": "نصائح الطقس"
}
`;

    const response = await ollamaChat({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        format: 'json'
    });

    try {
        const content = response.message.content;
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Failed to parse tour plan:', error);
        throw new Error('Failed to generate tour plan');
    }
}

/**
 * AR Scene Description - Explain what the camera is pointing at
 */
export interface ARSceneRequest {
    imageDescription?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    placeName?: string;
    language: TourGuideLanguage;
}

export interface ARSceneResponse {
    placeName: string;
    description: string;
    historicalFacts: string[];
    interestingFacts: string[];
    tips: string[];
    audioGuideText: string;
}

export async function generateARDescription(request: ARSceneRequest): Promise<ARSceneResponse> {
    const systemPrompt = getSystemPromptForLanguage(request.language, 'ar_guide');

    const userPrompt = `
قم بوصف هذا المكان السياحي للزائر:

الموقع: ${request.placeName || 'غير محدد'}
الإحداثيات: ${request.location.latitude}, ${request.location.longitude}
${request.imageDescription ? `وصف المشهد: ${request.imageDescription}` : ''}

قدم معلومات شاملة تتضمن:
1. اسم المكان والوصف العام
2. حقائق تاريخية مهمة
3. معلومات مثيرة للاهتمام
4. نصائح للزائرين
5. نص للدليل الصوتي (2-3 دقائق عند القراءة)

أعد الرد بتنسيق JSON:
{
    "placeName": "اسم المكان",
    "description": "وصف عام",
    "historicalFacts": ["حقيقة 1", "حقيقة 2"],
    "interestingFacts": ["معلومة 1", "معلومة 2"],
    "tips": ["نصيحة 1", "نصيحة 2"],
    "audioGuideText": "نص الدليل الصوتي الكامل..."
}
`;

    const response = await ollamaChat({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        format: 'json'
    });

    try {
        const content = response.message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Failed to parse AR description:', error);
        throw new Error('Failed to generate AR description');
    }
}

/**
 * Virtual Reality Historical View - Generate historical context for a place
 */
export interface VRHistoricalRequest {
    placeName: string;
    currentDescription: string;
    yearRange?: { from: number; to: number };
    language: TourGuideLanguage;
}

export interface VRHistoricalResponse {
    placeName: string;
    historicalPeriods: {
        year: number;
        era: string;
        description: string;
        visualDescription: string;
        notableEvents: string[];
    }[];
    transformationStory: string;
    preservationEfforts: string;
    culturalSignificance: string;
}

export async function generateVRHistoricalView(request: VRHistoricalRequest): Promise<VRHistoricalResponse> {
    const systemPrompt = getSystemPromptForLanguage(request.language, 'vr_historian');

    const userPrompt = `
أنشئ عرضًا تاريخيًا للواقع الافتراضي لهذا المكان:

المكان: ${request.placeName}
الوصف الحالي: ${request.currentDescription}
${request.yearRange ? `الفترة الزمنية: من ${request.yearRange.from} إلى ${request.yearRange.to}` : ''}

اشرح كيف كان المكان يبدو في فترات زمنية مختلفة، مع وصف بصري تفصيلي يمكن استخدامه لإنشاء تجربة واقع افتراضي.

أعد الرد بتنسيق JSON:
{
    "placeName": "اسم المكان",
    "historicalPeriods": [
        {
            "year": 1900,
            "era": "اسم الحقبة",
            "description": "وصف الفترة",
            "visualDescription": "وصف بصري تفصيلي للمشهد",
            "notableEvents": ["حدث 1", "حدث 2"]
        }
    ],
    "transformationStory": "قصة التحول عبر الزمن",
    "preservationEfforts": "جهود الحفاظ على التراث",
    "culturalSignificance": "الأهمية الثقافية"
}
`;

    const response = await ollamaChat({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        format: 'json'
    });

    try {
        const content = response.message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Failed to parse VR historical view:', error);
        throw new Error('Failed to generate VR historical view');
    }
}

/**
 * Virtual Tour Guide - Interactive conversational guide
 */
export interface TourGuideMessage {
    role: 'user' | 'guide';
    content: string;
    timestamp: Date;
}

export interface TourGuideContext {
    currentLocation?: { latitude: number; longitude: number };
    currentPlace?: string;
    visitedPlaces: string[];
    userPreferences: {
        interests: string[];
        language: TourGuideLanguage;
    };
    conversationHistory: TourGuideMessage[];
}

export async function chatWithTourGuide(
    userMessage: string,
    context: TourGuideContext
): Promise<string> {
    const systemPrompt = getSystemPromptForLanguage(context.userPreferences.language, 'tour_guide');

    // Build conversation history for context
    const messages: OllamaMessage[] = [
        { role: 'system', content: systemPrompt },
        {
            role: 'system',
            content: `
السياق الحالي:
- الموقع الحالي: ${context.currentPlace || 'غير محدد'}
- الأماكن التي تمت زيارتها: ${context.visitedPlaces.join(', ') || 'لا يوجد'}
- اهتمامات المستخدم: ${context.userPreferences.interests.join(', ')}
`
        }
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = context.conversationHistory.slice(-10);
    for (const msg of recentHistory) {
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        });
    }

    // Add current message
    messages.push({ role: 'user', content: userMessage });

    const response = await ollamaChat({
        messages,
        temperature: 0.8
    });

    return response.message.content;
}

// ============================================
// RAG (Retrieval Augmented Generation) System
// ============================================

export interface RAGDocument {
    id: string;
    title: string;
    content: string;
    category: string;
    metadata: Record<string, string>;
    embedding?: number[];
    createdAt: Date;
    updatedAt: Date;
}

export interface RAGQueryResult {
    answer: string;
    sources: {
        documentId: string;
        title: string;
        relevantContent: string;
        score: number;
    }[];
    confidence: number;
}

/**
 * Generate embedding for text using Ollama
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'nomic-embed-text',
            prompt: text
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama embeddings error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Query the RAG knowledge base
 */
export async function queryRAG(
    query: string,
    documents: RAGDocument[],
    topK: number = 5
): Promise<RAGQueryResult> {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarity scores
    const scoredDocs = documents
        .filter(doc => doc.embedding)
        .map(doc => ({
            document: doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding!)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    // Build context from top documents
    const context = scoredDocs
        .map(d => `المصدر: ${d.document.title}\n${d.document.content}`)
        .join('\n\n---\n\n');

    // Generate answer using context
    const response = await ollamaChat({
        messages: [
            {
                role: 'system',
                content: `أنت مساعد ذكي للمرشد السياحي. استخدم المعلومات المقدمة للإجابة على الأسئلة. إذا لم تجد المعلومات في السياق، قل ذلك بوضوح.`
            },
            {
                role: 'user',
                content: `السياق:\n${context}\n\nالسؤال: ${query}\n\nأجب بناءً على المعلومات المقدمة فقط.`
            }
        ],
        temperature: 0.3
    });

    return {
        answer: response.message.content,
        sources: scoredDocs.map(d => ({
            documentId: d.document.id,
            title: d.document.title,
            relevantContent: d.document.content.slice(0, 200) + '...',
            score: d.score
        })),
        confidence: scoredDocs.length > 0 ? scoredDocs[0].score : 0
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSystemPromptForLanguage(
    language: TourGuideLanguage,
    role: 'tour_planner' | 'ar_guide' | 'vr_historian' | 'tour_guide'
): string {
    const isArabic = language === 'ar';

    const prompts = {
        tour_planner: isArabic
            ? `أنت مخطط رحلات خبير في الرياض، المملكة العربية السعودية. لديك معرفة عميقة بجميع المعالم السياحية والمطاعم والأنشطة والفعاليات في الرياض. قدم خططًا مفصلة وعملية تناسب تفضيلات الزائر.`
            : `You are an expert trip planner for Riyadh, Saudi Arabia. You have deep knowledge of all tourist attractions, restaurants, activities, and events in Riyadh. Provide detailed and practical plans that match visitor preferences.`,

        ar_guide: isArabic
            ? `أنت دليل سياحي للواقع المعزز في الرياض. عندما يوجه الزائر الكاميرا نحو معلم ما، قدم له معلومات غنية وشيقة عن المكان، تاريخه، وأهميته الثقافية. كن ودودًا ومعلوماتيًا.`
            : `You are an AR tourism guide for Riyadh. When a visitor points their camera at a landmark, provide rich and interesting information about the place, its history, and cultural significance. Be friendly and informative.`,

        vr_historian: isArabic
            ? `أنت مؤرخ متخصص في تاريخ الرياض والمملكة العربية السعودية. مهمتك هي وصف كيف كانت الأماكن تبدو في الماضي لإنشاء تجارب واقع افتراضي. قدم أوصافًا بصرية دقيقة ومفصلة.`
            : `You are a historian specializing in the history of Riyadh and Saudi Arabia. Your mission is to describe how places looked in the past to create VR experiences. Provide accurate and detailed visual descriptions.`,

        tour_guide: isArabic
            ? `أنت مرشد سياحي افتراضي ودود وخبير في الرياض. ساعد الزوار باقتراح الأماكن، الإجابة على أسئلتهم، وتقديم معلومات مفيدة عن الأماكن السياحية والثقافة المحلية والطعام والتسوق. كن محادثًا وودودًا.`
            : `You are a friendly and expert virtual tour guide for Riyadh. Help visitors by suggesting places, answering their questions, and providing useful information about tourist sites, local culture, food, and shopping. Be conversational and friendly.`
    };

    return prompts[role];
}

export default {
    ollamaChat,
    ollamaChatStream,
    checkOllamaStatus,
    generateTourPlan,
    generateARDescription,
    generateVRHistoricalView,
    chatWithTourGuide,
    generateEmbedding,
    queryRAG,
    TOUR_GUIDE_LANGUAGES
};
