import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Fetch all audio tours (with optional filters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const city = searchParams.get('city');
        const active = searchParams.get('active');
        const includeStops = searchParams.get('includeStops') === 'true';

        const where: Record<string, unknown> = {};

        if (category && category !== 'all') {
            where.category = category.toUpperCase();
        }

        if (featured === 'true') {
            where.isFeatured = true;
        }

        if (city) {
            where.city = city;
        }

        if (active !== 'false') {
            where.isActive = true;
        }

        const audioTours = await prisma.audioTour.findMany({
            where,
            include: includeStops ? { stops: { orderBy: { order: 'asc' } } } : undefined,
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ success: true, data: audioTours });
    } catch (error) {
        console.error('Error fetching audio tours:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch audio tours' },
            { status: 500 }
        );
    }
}

// POST - Create a new audio tour (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            title,
            titleAr,
            description,
            descriptionAr,
            image,
            gallery,
            duration,
            distance,
            difficulty,
            category,
            isFree,
            price,
            audioUrl,
            audioUrlAr,
            latitude,
            longitude,
            city,
            isFeatured,
            stops
        } = body;

        // Validate required fields
        if (!title || !titleAr || !description || !descriptionAr || !duration) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const audioTour = await prisma.audioTour.create({
            data: {
                title,
                titleAr,
                description,
                descriptionAr,
                image,
                gallery: gallery || [],
                duration,
                distance,
                difficulty: difficulty || 'EASY',
                category: category || 'HISTORICAL',
                isFree: isFree !== false,
                price,
                audioUrl,
                audioUrlAr,
                latitude,
                longitude,
                city: city || 'riyadh',
                isFeatured: isFeatured || false,
                createdBy: session.user.id,
                stops: stops ? {
                    create: stops.map((stop: {
                        name: string;
                        nameAr: string;
                        description: string;
                        descriptionAr: string;
                        latitude: number;
                        longitude: number;
                        image?: string;
                        audioUrl?: string;
                        audioUrlAr?: string;
                        duration?: number;
                    }, index: number) => ({
                        order: index,
                        name: stop.name,
                        nameAr: stop.nameAr,
                        description: stop.description,
                        descriptionAr: stop.descriptionAr,
                        latitude: stop.latitude,
                        longitude: stop.longitude,
                        image: stop.image,
                        audioUrl: stop.audioUrl,
                        audioUrlAr: stop.audioUrlAr,
                        duration: stop.duration || 5
                    }))
                } : undefined
            },
            include: { stops: { orderBy: { order: 'asc' } } }
        });

        return NextResponse.json({ success: true, data: audioTour }, { status: 201 });
    } catch (error) {
        console.error('Error creating audio tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create audio tour' },
            { status: 500 }
        );
    }
}

// PUT - Update an audio tour (Admin only)
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, stops, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Tour ID is required' },
                { status: 400 }
            );
        }

        // Update the tour
        const audioTour = await prisma.audioTour.update({
            where: { id },
            data: updateData,
            include: { stops: { orderBy: { order: 'asc' } } }
        });

        // If stops are provided, update them
        if (stops) {
            // Delete existing stops
            await prisma.audioTourStop.deleteMany({
                where: { tourId: id }
            });

            // Create new stops
            await prisma.audioTourStop.createMany({
                data: stops.map((stop: {
                    name: string;
                    nameAr: string;
                    description: string;
                    descriptionAr: string;
                    latitude: number;
                    longitude: number;
                    image?: string;
                    audioUrl?: string;
                    audioUrlAr?: string;
                    duration?: number;
                }, index: number) => ({
                    tourId: id,
                    order: index,
                    name: stop.name,
                    nameAr: stop.nameAr,
                    description: stop.description,
                    descriptionAr: stop.descriptionAr,
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                    image: stop.image,
                    audioUrl: stop.audioUrl,
                    audioUrlAr: stop.audioUrlAr,
                    duration: stop.duration || 5
                }))
            });

            // Fetch updated tour with stops
            const updatedTour = await prisma.audioTour.findUnique({
                where: { id },
                include: { stops: { orderBy: { order: 'asc' } } }
            });

            return NextResponse.json({ success: true, data: updatedTour });
        }

        return NextResponse.json({ success: true, data: audioTour });
    } catch (error) {
        console.error('Error updating audio tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update audio tour' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an audio tour (Admin only)
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Tour ID is required' },
                { status: 400 }
            );
        }

        await prisma.audioTour.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Audio tour deleted successfully' });
    } catch (error) {
        console.error('Error deleting audio tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete audio tour' },
            { status: 500 }
        );
    }
}
