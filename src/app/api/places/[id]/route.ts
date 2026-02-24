export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/places/[id] - Get a single place by ID or slug
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const place = await prisma.place.findFirst({
            where: {
                OR: [
                    { id },
                    { slug: id },
                ],
                isActive: true,
            },
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
                reviews: {
                    where: { isApproved: true },
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
                    take: 10,
                },
            },
        });

        if (!place) {
            return NextResponse.json(
                { success: false, error: 'Place not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.place.update({
            where: { id: place.id },
            data: { viewCount: { increment: 1 } },
        });

        // Get similar places
        const similarPlaces = await prisma.place.findMany({
            where: {
                categoryId: place.categoryId,
                id: { not: place.id },
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                nameAr: true,
                slug: true,
                image: true,
                rating: true,
                price: true,
            },
            take: 4,
            orderBy: { rating: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: {
                ...place,
                similarPlaces,
            },
        });
    } catch (error) {
        console.error('Error fetching place:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch place' },
            { status: 500 }
        );
    }
}

// PUT /api/places/[id] - Update a place (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const place = await prisma.place.update({
            where: { id },
            data: body,
            include: {
                category: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: place,
        });
    } catch (error) {
        console.error('Error updating place:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update place' },
            { status: 500 }
        );
    }
}

// DELETE /api/places/[id] - Soft delete a place (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.place.update({
            where: { id },
            data: { isActive: false },
        });

        return NextResponse.json({
            success: true,
            message: 'Place deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting place:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete place' },
            { status: 500 }
        );
    }
}
