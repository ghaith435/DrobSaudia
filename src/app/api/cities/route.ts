import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch cities
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') !== 'false';

        const where = activeOnly ? { isActive: true } : {};

        const cities = await prisma.city.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        );
    }
}

// POST - Create city (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            nameAr,
            slug,
            description,
            descriptionAr,
            image,
            latitude,
            longitude,
            order,
        } = body;

        if (!name || !nameAr || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const city = await prisma.city.create({
            data: {
                name,
                nameAr,
                slug,
                description,
                descriptionAr,
                image,
                latitude,
                longitude,
                order: order || 0,
            },
        });

        return NextResponse.json(city, { status: 201 });
    } catch (error) {
        console.error('Error creating city:', error);
        return NextResponse.json(
            { error: 'Failed to create city' },
            { status: 500 }
        );
    }
}

// PATCH - Update city
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'City ID is required' },
                { status: 400 }
            );
        }

        const city = await prisma.city.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(city);
    } catch (error) {
        console.error('Error updating city:', error);
        return NextResponse.json(
            { error: 'Failed to update city' },
            { status: 500 }
        );
    }
}

// DELETE - Delete city
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'City ID is required' },
                { status: 400 }
            );
        }

        await prisma.city.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting city:', error);
        return NextResponse.json(
            { error: 'Failed to delete city' },
            { status: 500 }
        );
    }
}
