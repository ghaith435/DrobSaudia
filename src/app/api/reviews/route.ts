export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

async function getCurrentUserId(request: NextRequest): Promise<string | null> {
    const userId = request.headers.get('x-user-id');
    return userId;
}

// GET /api/reviews?placeId=xxx - Get reviews for a place
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const placeId = searchParams.get('placeId');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!placeId) {
            return NextResponse.json(
                { success: false, error: 'Place ID is required' },
                { status: 400 }
            );
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    placeId,
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.review.count({
                where: {
                    placeId,
                    isApproved: true,
                },
            }),
        ]);

        // Calculate rating distribution
        const ratingDistribution = await prisma.review.groupBy({
            by: ['rating'],
            where: {
                placeId,
                isApproved: true,
            },
            _count: true,
        });

        return NextResponse.json({
            success: true,
            data: {
                reviews,
                ratingDistribution: ratingDistribution.map((r) => ({
                    rating: r.rating,
                    count: r._count,
                })),
            },
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + reviews.length < total,
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
    try {
        const userId = await getCurrentUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { placeId, rating, title, content, images } = await request.json();

        if (!placeId || !rating || !content) {
            return NextResponse.json(
                { success: false, error: 'Place ID, rating, and content are required' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Check if user already reviewed this place
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_placeId: {
                    userId,
                    placeId,
                },
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this place' },
                { status: 400 }
            );
        }

        // Create review and update place rating
        const [review] = await prisma.$transaction([
            prisma.review.create({
                data: {
                    userId,
                    placeId,
                    rating,
                    title,
                    content,
                    images: images || [],
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            }),
            // Update place rating
            prisma.$executeRaw`
                UPDATE places
                SET rating = (
                    SELECT AVG(rating)::DECIMAL(2,1)
                    FROM reviews
                    WHERE place_id = ${placeId} AND is_approved = true
                ),
                review_count = (
                    SELECT COUNT(*)
                    FROM reviews
                    WHERE place_id = ${placeId} AND is_approved = true
                )
                WHERE id = ${placeId}
            `,
        ]);

        return NextResponse.json({
            success: true,
            data: review,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
