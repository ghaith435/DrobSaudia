import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categories - Get all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: {
                        places: {
                            where: { isActive: true },
                        },
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        const formattedCategories = categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            nameAr: cat.nameAr,
            slug: cat.slug,
            icon: cat.icon,
            description: cat.description,
            image: cat.image,
            placeCount: cat._count.places,
        }));

        return NextResponse.json({
            success: true,
            data: formattedCategories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST /api/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, nameAr, icon, description, image, order } = body;

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const category = await prisma.category.create({
            data: {
                name,
                nameAr,
                slug,
                icon,
                description,
                image,
                order: order || 0,
            },
        });

        return NextResponse.json({
            success: true,
            data: category,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
