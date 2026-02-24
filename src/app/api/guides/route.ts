// Experience Marketplace API - Guides CRUD
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateGuideEmbedding, matchGuidesToPreferences } from '@/lib/ai/vector-matching';

// GET - List guides with filtering and AI matching
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const specialties = searchParams.get('specialties')?.split(',');
        const languages = searchParams.get('languages')?.split(',');
        const certified = searchParams.get('certified');
        const featured = searchParams.get('featured');
        const verified = searchParams.get('verified');
        const minRating = searchParams.get('minRating');
        const maxRate = searchParams.get('maxRate');
        const serviceArea = searchParams.get('serviceArea');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const sortBy = searchParams.get('sortBy') || 'rating';
        const order = searchParams.get('order') || 'desc';

        // AI Matching mode
        const matchIntent = searchParams.get('matchIntent');

        // Build where clause
        const where: Record<string, unknown> = {
            isActive: true
        };

        if (specialties?.length) {
            where.specialties = { hasSome: specialties };
        }
        if (languages?.length) {
            where.languages = { hasSome: languages };
        }
        if (certified === 'true') {
            where.certificationStatus = 'CERTIFIED';
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }
        if (verified === 'true') {
            where.isVerified = true;
        }
        if (minRating) {
            where.rating = { gte: parseFloat(minRating) };
        }
        if (maxRate) {
            where.hourlyRate = { lte: parseInt(maxRate) };
        }
        if (serviceArea) {
            where.serviceAreas = { has: serviceArea };
        }

        // Standard query
        const [guides, total] = await Promise.all([
            prisma.guideProfile.findMany({
                where,
                include: {
                    experiences: {
                        where: { status: 'APPROVED', isActive: true },
                        take: 3,
                        select: {
                            id: true,
                            title: true,
                            titleAr: true,
                            coverImage: true,
                            rating: true,
                            basePrice: true
                        }
                    },
                    _count: {
                        select: {
                            experiences: true,
                            bookings: true,
                            guideReviews: true
                        }
                    }
                },
                orderBy: { [sortBy]: order },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.guideProfile.count({ where })
        ]);

        // If AI matching requested, re-rank results
        if (matchIntent && guides.length > 0) {
            const preferences = {
                interests: specialties || [],
                languages: languages || ['ar', 'en'],
                budget: searchParams.get('budget') || 'standard',
                groupType: searchParams.get('groupType') || 'solo',
                specificNeeds: matchIntent
            };

            const matchResults = await matchGuidesToPreferences(
                preferences,
                guides.map(g => ({
                    id: g.id,
                    bioVector: g.bioVector,
                    specialties: g.specialties,
                    languages: g.languages,
                    hourlyRate: g.hourlyRate,
                    certificationStatus: g.certificationStatus
                }))
            );

            // Reorder guides by match score
            const rankedGuides = matchResults
                .map(match => ({
                    ...guides.find(g => g.id === match.id),
                    matchScore: match.score
                }))
                .filter(g => g.id);

            return NextResponse.json({
                success: true,
                data: rankedGuides,
                aiMatched: true,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        }

        return NextResponse.json({
            success: true,
            data: guides,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Guides GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch guides' },
            { status: 500 }
        );
    }
}

// POST - Create or update guide profile
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            userId,
            displayName,
            displayNameAr,
            bio,
            bioAr,
            avatar,
            coverImage,
            languages,
            specialties,
            certifications,
            yearsExperience,
            hourlyRate,
            minimumDuration,
            maximumGuests,
            serviceAreas,
            canTravel,
            travelRadius
        } = body;

        // Validate required fields
        if (!userId || !displayName || !bio) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: userId, displayName, bio' },
                { status: 400 }
            );
        }

        // Generate bio embedding for AI matching
        let bioVector: string | null = null;
        try {
            bioVector = await generateGuideEmbedding(
                bio,
                specialties || [],
                languages || ['ar']
            );
        } catch (err) {
            console.error('Failed to generate embedding:', err);
        }

        // Check if profile exists
        const existingProfile = await prisma.guideProfile.findUnique({
            where: { userId }
        });

        let guide;
        if (existingProfile) {
            // Update existing
            guide = await prisma.guideProfile.update({
                where: { userId },
                data: {
                    displayName,
                    displayNameAr,
                    bio,
                    bioAr,
                    bioVector,
                    avatar,
                    coverImage,
                    languages: languages || existingProfile.languages,
                    specialties: specialties || existingProfile.specialties,
                    certifications: certifications || existingProfile.certifications,
                    yearsExperience: yearsExperience ?? existingProfile.yearsExperience,
                    hourlyRate,
                    minimumDuration: minimumDuration ?? existingProfile.minimumDuration,
                    maximumGuests: maximumGuests ?? existingProfile.maximumGuests,
                    serviceAreas: serviceAreas || existingProfile.serviceAreas,
                    canTravel: canTravel ?? existingProfile.canTravel,
                    travelRadius: travelRadius ?? existingProfile.travelRadius
                }
            });
        } else {
            // Create new
            guide = await prisma.guideProfile.create({
                data: {
                    userId,
                    displayName,
                    displayNameAr,
                    bio,
                    bioAr,
                    bioVector,
                    avatar,
                    coverImage,
                    languages: languages || ['ar'],
                    specialties: specialties || [],
                    certifications: certifications || [],
                    yearsExperience: yearsExperience || 0,
                    hourlyRate,
                    minimumDuration: minimumDuration || 60,
                    maximumGuests: maximumGuests || 10,
                    serviceAreas: serviceAreas || [],
                    canTravel: canTravel ?? true,
                    travelRadius: travelRadius || 50
                }
            });

            // Update user role to PARTNER
            await prisma.user.update({
                where: { id: userId },
                data: { role: 'PARTNER' }
            });
        }

        return NextResponse.json({
            success: true,
            data: guide,
            message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully'
        }, { status: existingProfile ? 200 : 201 });
    } catch (error) {
        console.error('Guide POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create/update guide profile' },
            { status: 500 }
        );
    }
}
