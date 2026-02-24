export const dynamic = 'force-dynamic';

// Experience Marketplace API - Experiences CRUD
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List experiences with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const pricingTier = searchParams.get('pricingTier');
        const guideId = searchParams.get('guideId');
        const status = searchParams.get('status') || 'APPROVED';
        const featured = searchParams.get('featured');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const languages = searchParams.get('languages')?.split(',');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const order = searchParams.get('order') || 'desc';

        // Build where clause
        const where: Record<string, unknown> = {
            isActive: true,
            status: status
        };

        if (category) where.category = category;
        if (pricingTier) where.pricingTier = pricingTier;
        if (guideId) where.guideId = guideId;
        if (featured === 'true') where.isFeatured = true;

        if (minPrice || maxPrice) {
            where.basePrice = {};
            if (minPrice) (where.basePrice as Record<string, number>).gte = parseInt(minPrice);
            if (maxPrice) (where.basePrice as Record<string, number>).lte = parseInt(maxPrice);
        }

        if (languages?.length) {
            where.languages = { hasSome: languages };
        }

        // Fetch experiences
        const [experiences, total] = await Promise.all([
            prisma.experience.findMany({
                where,
                include: {
                    guide: {
                        select: {
                            id: true,
                            displayName: true,
                            displayNameAr: true,
                            avatar: true,
                            rating: true,
                            certificationStatus: true
                        }
                    },
                    space: {
                        select: {
                            id: true,
                            name: true,
                            nameAr: true,
                            address: true
                        }
                    }
                },
                orderBy: { [sortBy]: order },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.experience.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: experiences,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Experiences GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
}

// POST - Create new experience
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            guideId,
            spaceId,
            title,
            titleAr,
            subtitle,
            subtitleAr,
            description,
            descriptionAr,
            coverImage,
            gallery,
            videoUrl,
            category,
            subcategory,
            tags,
            dynamicDuration,
            minDuration,
            maxDuration,
            minGuests,
            maxGuests,
            pricingTier,
            basePrice,
            pricePerPerson,
            childPrice,
            groupDiscount,
            requirements,
            includedItems,
            excludedItems,
            languages,
            meetingPoint,
            meetingPointAr,
            latitude,
            longitude
        } = body;

        // Validate required fields
        if (!guideId || !title || !description || !basePrice) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: guideId, title, description, basePrice' },
                { status: 400 }
            );
        }

        // Verify guide exists
        const guide = await prisma.guideProfile.findUnique({
            where: { id: guideId }
        });

        if (!guide) {
            return NextResponse.json(
                { success: false, error: 'Guide profile not found' },
                { status: 404 }
            );
        }

        // Create experience
        const experience = await prisma.experience.create({
            data: {
                guideId,
                spaceId,
                title,
                titleAr,
                subtitle,
                subtitleAr,
                description,
                descriptionAr,
                coverImage,
                gallery: gallery || [],
                videoUrl,
                category: category || 'CULTURAL',
                subcategory,
                tags: tags || [],
                dynamicDuration: dynamicDuration || false,
                minDuration: minDuration || 60,
                maxDuration: maxDuration || 180,
                minGuests: minGuests || 1,
                maxGuests: maxGuests || 10,
                pricingTier: pricingTier || 'STANDARD',
                basePrice: parseInt(basePrice),
                pricePerPerson,
                childPrice,
                groupDiscount,
                requirements: requirements || [],
                includedItems: includedItems || [],
                excludedItems: excludedItems || [],
                languages: languages || ['ar', 'en'],
                meetingPoint,
                meetingPointAr,
                latitude,
                longitude,
                status: 'DRAFT'
            },
            include: {
                guide: {
                    select: {
                        id: true,
                        displayName: true,
                        avatar: true
                    }
                }
            }
        });

        // Update guide stats
        await prisma.guideProfile.update({
            where: { id: guideId },
            data: { totalExperiences: { increment: 1 } }
        });

        return NextResponse.json({
            success: true,
            data: experience,
            message: 'Experience created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Experience POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create experience' },
            { status: 500 }
        );
    }
}
