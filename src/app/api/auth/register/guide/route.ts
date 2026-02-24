export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface TourInput {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    duration: number;
    durationUnit: 'hours' | 'days';
    languages: string[];
    images: string[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            nameAr,
            email,
            phone,
            password,
            bio,
            bioAr,
            yearsExperience,
            languages,
            tours,
        } = body;

        // Validation
        if (!name || !email || !email.includes('@') || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        if (!tours || !Array.isArray(tours) || tours.length === 0) {
            return NextResponse.json(
                { error: 'At least one tour experience is required' },
                { status: 400 }
            );
        }

        if (tours.length > 3) {
            return NextResponse.json(
                { error: 'Maximum 3 tour experiences allowed' },
                { status: 400 }
            );
        }

        // Validate each tour
        for (const tour of tours as TourInput[]) {
            if (!tour.title || !tour.description || !tour.duration || !tour.languages?.length) {
                return NextResponse.json(
                    { error: 'Each tour must have title, description, duration, and at least one language' },
                    { status: 400 }
                );
            }
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with PARTNER role (guide)
        const user = await prisma.user.create({
            data: {
                name,
                nameAr: nameAr || null,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: 'PARTNER',
            },
            select: {
                id: true,
                name: true,
                nameAr: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        // Create GuideProfile
        const guideProfile = await prisma.guideProfile.create({
            data: {
                userId: user.id,
                displayName: name,
                displayNameAr: nameAr || null,
                bio: bio || '',
                bioAr: bioAr || null,
                languages: languages || ['ar'],
                yearsExperience: yearsExperience || 0,
                certificationStatus: 'PENDING',
            },
        });

        // Create Experience entries for each tour
        const createdTours = [];
        for (const tour of tours as TourInput[]) {
            // Convert duration to minutes
            const durationInMinutes = tour.durationUnit === 'days'
                ? tour.duration * 24 * 60
                : tour.duration * 60;

            // Filter out base64 images (in production, these would be uploaded to Cloudinary)
            const tourImages = (tour.images || []).filter(
                (img: string) => img.startsWith('data:image')
            );

            const experience = await prisma.experience.create({
                data: {
                    guideId: guideProfile.id,
                    title: tour.title,
                    titleAr: tour.titleAr || tour.title,
                    description: tour.description,
                    descriptionAr: tour.descriptionAr || tour.description,
                    gallery: tourImages.slice(0, 5), // max 5 images
                    category: 'CULTURAL',
                    minDuration: durationInMinutes,
                    maxDuration: durationInMinutes,
                    languages: tour.languages,
                    basePrice: 0,
                    status: 'PENDING_REVIEW',
                },
            });

            createdTours.push({
                id: experience.id,
                title: experience.title,
                duration: durationInMinutes,
                languages: experience.languages,
            });
        }

        // Create default user preferences
        await prisma.userPreference.create({
            data: {
                userId: user.id,
                language: 'ar',
                theme: 'dark',
                pushEnabled: true,
                emailEnabled: true,
            },
        });

        // Create UserXP record with welcome bonus points
        await prisma.userXP.create({
            data: {
                userId: user.id,
                totalXp: 150,
                level: 1,
                points: 150, // Higher welcome bonus for guides
                visitCount: 0,
                tourCount: 0,
                reviewCount: 0,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'GUIDE_REGISTERED',
                entityType: 'guide',
                entityId: guideProfile.id,
                metadata: JSON.stringify({
                    toursCount: createdTours.length,
                    languages: languages,
                }),
            },
        });

        return NextResponse.json(
            {
                message: 'Guide registered successfully',
                user: {
                    ...user,
                    guideProfile: {
                        id: guideProfile.id,
                        displayName: guideProfile.displayName,
                    },
                },
                tours: createdTours,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering guide:', error);
        return NextResponse.json(
            { error: 'Failed to register guide' },
            { status: 500 }
        );
    }
}
