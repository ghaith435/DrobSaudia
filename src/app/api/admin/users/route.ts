export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - List all users with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const role = searchParams.get('role');
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        const where: any = {};

        if (role) {
            where.role = role;
        }

        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        } else if (status === 'verified') {
            where.isVerified = true;
        } else if (status === 'unverified') {
            where.isVerified = false;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { nameAr: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    email: true,
                    phone: true,
                    image: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, nameAr, email, password, role, phone } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                nameAr,
                email,
                phone,
                password: hashedPassword,
                role: role || 'USER',
                isVerified: true // Admin-created users are verified by default
            },
            select: {
                id: true,
                name: true,
                nameAr: true,
                email: true,
                role: true,
                isActive: true,
                isVerified: true,
                createdAt: true
            }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'USER_CREATED_BY_ADMIN',
                entityType: 'user',
                entityId: user.id
            }
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

// PATCH - Update user
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updates,
            select: {
                id: true,
                name: true,
                nameAr: true,
                email: true,
                role: true,
                isActive: true,
                isVerified: true,
                updatedAt: true
            }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'USER_UPDATED_BY_ADMIN',
                entityType: 'user',
                entityId: user.id,
                metadata: JSON.stringify({ updatedFields: Object.keys(updates) })
            }
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'USER_DELETED_BY_ADMIN',
                entityType: 'user',
                entityId: id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
