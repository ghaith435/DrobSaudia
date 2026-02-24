import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess } from '@/lib/security';

// Sentiment analysis for reviews using simple keyword-based approach
// In production, replace with Gemini API call

const POSITIVE_AR = ['ممتاز', 'رائع', 'جميل', 'مذهل', 'أحببت', 'أنصح', 'مبدع', 'فخم', 'نظيف', 'مريح', 'مميز', 'خرافي', 'واو', 'استمتعت', 'يستحق', 'محترف', 'لذيذ', 'مضيف'];
const NEGATIVE_AR = ['سيء', 'مخيب', 'سيئ', 'قذر', 'غالي', 'مزدحم', 'بطيء', 'مقرف', 'مهمل', 'سيئة', 'خطير', 'لا أنصح', 'ضعيف', 'كارثي'];
const POSITIVE_EN = ['excellent', 'amazing', 'beautiful', 'great', 'love', 'recommend', 'clean', 'friendly', 'fantastic', 'wonderful', 'perfect', 'impressive'];
const NEGATIVE_EN = ['bad', 'terrible', 'dirty', 'expensive', 'crowded', 'slow', 'rude', 'disappointing', 'worst', 'avoid', 'boring', 'horrible'];

function analyzeSentiment(text: string): { score: number; label: 'positive' | 'neutral' | 'negative'; keywords: string[] } {
    const lowerText = text.toLowerCase();
    const foundPositive: string[] = [];
    const foundNegative: string[] = [];

    [...POSITIVE_AR, ...POSITIVE_EN].forEach(word => {
        if (lowerText.includes(word.toLowerCase())) foundPositive.push(word);
    });

    [...NEGATIVE_AR, ...NEGATIVE_EN].forEach(word => {
        if (lowerText.includes(word.toLowerCase())) foundNegative.push(word);
    });

    const score = (foundPositive.length - foundNegative.length) / Math.max(foundPositive.length + foundNegative.length, 1);

    return {
        score: Math.round((score + 1) * 50), // 0-100
        label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
        keywords: [...foundPositive, ...foundNegative],
    };
}

async function handler(req: NextRequest) {
    const url = new URL(req.url);
    const placeId = url.searchParams.get('placeId');

    // Sample reviews for analysis
    const sampleReviews = [
        { id: '1', content: 'مكان ممتاز ورائع، أنصح بزيارته. النظافة والخدمة مميزة', rating: 5, createdAt: '2026-01-15' },
        { id: '2', content: 'تجربة جميلة، الأجواء فخمة والطعام لذيذ', rating: 4, createdAt: '2026-01-10' },
        { id: '3', content: 'المكان مزدحم جداً والأسعار غالية', rating: 2, createdAt: '2026-01-08' },
        { id: '4', content: 'Beautiful place, definitely recommend visiting!', rating: 5, createdAt: '2026-01-05' },
        { id: '5', content: 'استمتعت كثيراً بالجولة، يستحق الزيارة بلا شك', rating: 5, createdAt: '2026-01-03' },
        { id: '6', content: 'خدمة سيئة والموظفين غير محترفين', rating: 1, createdAt: '2025-12-28' },
        { id: '7', content: 'مكان مريح وهادئ، مناسب للعائلات', rating: 4, createdAt: '2025-12-25' },
        { id: '8', content: 'Average experience, nothing special', rating: 3, createdAt: '2025-12-20' },
    ];

    const analyzed = sampleReviews.map(review => ({
        ...review,
        sentiment: analyzeSentiment(review.content),
    }));

    const sentimentSummary = {
        positive: analyzed.filter(r => r.sentiment.label === 'positive').length,
        neutral: analyzed.filter(r => r.sentiment.label === 'neutral').length,
        negative: analyzed.filter(r => r.sentiment.label === 'negative').length,
        averageScore: Math.round(analyzed.reduce((acc, r) => acc + r.sentiment.score, 0) / analyzed.length),
        topPositiveKeywords: [...new Set(analyzed.flatMap(r => r.sentiment.label === 'positive' ? r.sentiment.keywords : []))].slice(0, 5),
        topNegativeKeywords: [...new Set(analyzed.flatMap(r => r.sentiment.label === 'negative' ? r.sentiment.keywords : []))].slice(0, 5),
        ratingDistribution: {
            5: analyzed.filter(r => r.rating === 5).length,
            4: analyzed.filter(r => r.rating === 4).length,
            3: analyzed.filter(r => r.rating === 3).length,
            2: analyzed.filter(r => r.rating === 2).length,
            1: analyzed.filter(r => r.rating === 1).length,
        },
        trend: 'improving' as const,
    };

    return apiSuccess({
        placeId,
        reviews: analyzed,
        summary: sentimentSummary,
        totalReviews: analyzed.length,
        averageRating: Math.round(analyzed.reduce((acc, r) => acc + r.rating, 0) / analyzed.length * 10) / 10,
    });
}

export const GET = withRateLimit(withErrorHandler(handler), apiLimiter);
