export const dynamic = 'force-dynamic';

// AI TripBuilder API - Generate personalized itineraries
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateItinerary, refineItinerary, TripBuilderPreferences } from '@/lib/ai/trip-builder';
import { matchExperiencesToIntent } from '@/lib/ai/vector-matching';

// POST - Generate new itinerary
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            userId,
            preferences,
            sessionId
        } = body as {
            userId?: string;
            preferences: TripBuilderPreferences;
            sessionId?: string;
        };

        if (!preferences) {
            return NextResponse.json(
                { success: false, error: 'Preferences required' },
                { status: 400 }
            );
        }

        // Fetch available experiences for AI context
        const experiences = await prisma.experience.findMany({
            where: {
                isActive: true,
                status: 'APPROVED'
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                tags: true,
                basePrice: true,
                minDuration: true,
                pricingTier: true,
                rating: true
            },
            take: 50
        });

        // Convert to format expected by TripBuilder
        const experiencesForAI = experiences.map(exp => ({
            id: exp.id,
            title: exp.title,
            category: exp.category,
            price: exp.basePrice,
            duration: exp.minDuration
        }));

        // Generate itinerary using AI
        const itinerary = await generateItinerary(preferences, experiencesForAI);

        // Match experiences to user intent if provided
        let matchedExperiences: { id: string; score: number }[] = [];
        if (preferences.intent && experiences.length > 0) {
            const matches = await matchExperiencesToIntent(
                preferences.intent,
                experiences.map(exp => ({
                    id: exp.id,
                    title: exp.title,
                    description: exp.description,
                    category: exp.category,
                    tags: exp.tags,
                    pricingTier: exp.pricingTier,
                    rating: exp.rating
                })),
                5
            );
            matchedExperiences = matches.map(m => ({ id: m.id, score: m.score }));

            // Add matched experiences to itinerary
            itinerary.recommendedExperiences = matchedExperiences.map(m => m.id);
        }

        // Create or update session
        const session = sessionId
            ? await prisma.tripBuilderSession.upsert({
                where: { sessionId },
                update: {
                    preferences: JSON.stringify(preferences),
                    itinerary: JSON.stringify(itinerary),
                    experiences: itinerary.recommendedExperiences,
                    status: 'READY'
                },
                create: {
                    sessionId,
                    userId,
                    intent: preferences.intent,
                    preferences: JSON.stringify(preferences),
                    itinerary: JSON.stringify(itinerary),
                    experiences: itinerary.recommendedExperiences,
                    status: 'READY'
                }
            })
            : await prisma.tripBuilderSession.create({
                data: {
                    sessionId: `tb-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                    userId,
                    intent: preferences.intent,
                    preferences: JSON.stringify(preferences),
                    itinerary: JSON.stringify(itinerary),
                    experiences: itinerary.recommendedExperiences,
                    status: 'READY'
                }
            });

        return NextResponse.json({
            success: true,
            data: {
                sessionId: session.sessionId,
                itinerary,
                matchedExperiences: matchedExperiences.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('TripBuilder POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate itinerary' },
            { status: 500 }
        );
    }
}

// PATCH - Refine existing itinerary
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, feedback } = body;

        if (!sessionId || !feedback) {
            return NextResponse.json(
                { success: false, error: 'Session ID and feedback required' },
                { status: 400 }
            );
        }

        // Fetch existing session
        const session = await prisma.tripBuilderSession.findUnique({
            where: { sessionId }
        });

        if (!session || !session.itinerary) {
            return NextResponse.json(
                { success: false, error: 'Session not found or no itinerary exists' },
                { status: 404 }
            );
        }

        const currentItinerary = JSON.parse(session.itinerary);

        // Refine itinerary based on feedback
        const refinedItinerary = await refineItinerary(currentItinerary, feedback);

        // Update session
        await prisma.tripBuilderSession.update({
            where: { sessionId },
            data: {
                itinerary: JSON.stringify(refinedItinerary),
                experiences: refinedItinerary.recommendedExperiences || []
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                sessionId,
                itinerary: refinedItinerary
            }
        });
    } catch (error) {
        console.error('TripBuilder PATCH error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to refine itinerary' },
            { status: 500 }
        );
    }
}

// GET - Fetch session
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        const userId = searchParams.get('userId');

        if (sessionId) {
            const session = await prisma.tripBuilderSession.findUnique({
                where: { sessionId }
            });

            if (!session) {
                return NextResponse.json(
                    { success: false, error: 'Session not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: {
                    ...session,
                    preferences: session.preferences ? JSON.parse(session.preferences) : null,
                    itinerary: session.itinerary ? JSON.parse(session.itinerary) : null
                }
            });
        }

        if (userId) {
            const sessions = await prisma.tripBuilderSession.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 10
            });

            return NextResponse.json({
                success: true,
                data: sessions.map(s => ({
                    ...s,
                    preferences: s.preferences ? JSON.parse(s.preferences) : null,
                    itinerary: s.itinerary ? JSON.parse(s.itinerary) : null
                }))
            });
        }

        return NextResponse.json(
            { success: false, error: 'Session ID or User ID required' },
            { status: 400 }
        );
    } catch (error) {
        console.error('TripBuilder GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}
