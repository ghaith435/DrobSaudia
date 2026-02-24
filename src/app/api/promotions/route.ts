import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch active promotions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type');

        const now = new Date();

        const where: Record<string, unknown> = {
            isActive: true,
            startDate: { lte: now },
            OR: [
                { endDate: null },
                { endDate: { gte: now } },
            ],
        };

        if (type) where.type = type;

        const promotions = await prisma.promotion.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return NextResponse.json(promotions);
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch promotions' },
            { status: 500 }
        );
    }
}

// POST - Create promotion (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            titleAr,
            description,
            descriptionAr,
            image,
            code,
            discount,
            type,
            targetUrl,
            startDate,
            endDate,
            maxUses,
            createdBy,
        } = body;

        if (!title || !titleAr || !description || !descriptionAr || !createdBy) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const promotion = await prisma.promotion.create({
            data: {
                title,
                titleAr,
                description,
                descriptionAr,
                image,
                code,
                discount,
                type: type || 'OFFER',
                targetUrl,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                maxUses,
                createdBy,
            },
        });

        return NextResponse.json(promotion, { status: 201 });
    } catch (error) {
        console.error('Error creating promotion:', error);
        return NextResponse.json(
            { error: 'Failed to create promotion' },
            { status: 500 }
        );
    }
}

// PATCH - Update promotion or increment usage
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, action, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Promotion ID is required' },
                { status: 400 }
            );
        }

        if (action === 'use_code') {
            // Increment usage count
            const promotion = await prisma.promotion.update({
                where: { id },
                data: {
                    usedCount: { increment: 1 },
                },
            });
            return NextResponse.json(promotion);
        }

        // Regular update
        const promotion = await prisma.promotion.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error('Error updating promotion:', error);
        return NextResponse.json(
            { error: 'Failed to update promotion' },
            { status: 500 }
        );
    }
}
