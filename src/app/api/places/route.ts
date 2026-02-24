export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/places - Get all places with optional filtering
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {
            isActive: true,
        };

        if (category) {
            where.category = {
                slug: category,
            };
        }

        if (featured === 'true') {
            where.isFeatured = true;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { nameAr: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [places, total] = await Promise.all([
            prisma.place.findMany({
                where,
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
                orderBy: [
                    { isFeatured: 'desc' },
                    { rating: 'desc' },
                ],
                take: limit,
                skip: offset,
            }),
            prisma.place.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: places,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + places.length < total,
            },
        });
    } catch (error) {
        console.error('Error fetching places:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch places' },
            { status: 500 }
        );
    }
}

// POST /api/places - Create a new place (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            name,
            nameAr,
            description,
            descriptionAr,
            image,
            gallery,
            price,
            address,
            addressAr,
            latitude,
            longitude,
            phone,
            website,
            openingHours,
            features,
            categoryId,
            isFeatured,
        } = body;

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const place = await prisma.place.create({
            data: {
                name,
                nameAr,
                slug,
                description,
                descriptionAr,
                image,
                gallery: gallery || [],
                price: price || 'FREE',
                address,
                addressAr,
                latitude,
                longitude,
                phone,
                website,
                openingHours,
                features: features || [],
                categoryId,
                isFeatured: isFeatured || false,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: place,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating place:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create place' },
            { status: 500 }
        );
    }
}
