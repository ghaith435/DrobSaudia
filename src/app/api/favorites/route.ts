export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This would typically check authentication
// For now, we'll use a simple user ID from headers
async function getCurrentUserId(request: NextRequest): Promise<string | null> {
    // In production, this would verify JWT token or session
    const userId = request.headers.get('x-user-id');
    return userId;
}

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
    try {
        const userId = await getCurrentUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                place: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                nameAr: true,
                                slug: true,
                                icon: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: favorites.map((f) => ({
                id: f.id,
                createdAt: f.createdAt,
                place: f.place,
            })),
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch favorites' },
            { status: 500 }
        );
    }
}

// POST /api/favorites - Add a place to favorites
export async function POST(request: NextRequest) {
    try {
        const userId = await getCurrentUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { placeId } = await request.json();

        if (!placeId) {
            return NextResponse.json(
                { success: false, error: 'Place ID is required' },
                { status: 400 }
            );
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_placeId: {
                    userId,
                    placeId,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Already in favorites' },
                { status: 400 }
            );
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                placeId,
            },
            include: {
                place: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: favorite,
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add favorite' },
            { status: 500 }
        );
    }
}

// DELETE /api/favorites - Remove a place from favorites
export async function DELETE(request: NextRequest) {
    try {
        const userId = await getCurrentUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { placeId } = await request.json();

        if (!placeId) {
            return NextResponse.json(
                { success: false, error: 'Place ID is required' },
                { status: 400 }
            );
        }

        await prisma.favorite.delete({
            where: {
                userId_placeId: {
                    userId,
                    placeId,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Removed from favorites',
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to remove favorite' },
            { status: 500 }
        );
    }
}
