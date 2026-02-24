import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, nameAr, email, phone, password } = body;

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

        // Create user with new fields
        const user = await prisma.user.create({
            data: {
                name,
                nameAr: nameAr || null,
                email,
                phone: phone || null,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                nameAr: true,
                email: true,
                phone: true,
                createdAt: true,
            },
        });

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
                totalXp: 100,
                level: 1,
                points: 100, // Welcome bonus
                visitCount: 0,
                tourCount: 0,
                reviewCount: 0,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                entityType: 'user',
                entityId: user.id,
            },
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
}
