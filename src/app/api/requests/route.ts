export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Fetch user requests with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        // If user is logged in and not admin, filter by their ID
        if (session?.user) {
            const user = session.user as { id: string; role?: string };
            // Admins can see all requests
            if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
                where.userId = user.id;
            }
        } else {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (type) where.type = type;
        if (status) where.status = status;

        const [requests, total] = await Promise.all([
            prisma.userRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.userRequest.count({ where }),
        ]);

        return NextResponse.json({
            requests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch requests' },
            { status: 500 }
        );
    }
}

// POST - Create a new user request
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = session.user as { id: string };
        const body = await request.json();
        const { type, title, content, priority, metadata } = body;

        if (!type || !title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userRequest = await prisma.userRequest.create({
            data: {
                userId: user.id,
                type,
                title,
                content,
                priority: priority || 'NORMAL',
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'CREATE_REQUEST',
                entityType: 'request',
                entityId: userRequest.id,
                metadata: JSON.stringify({ type, title }),
            },
        });

        // Create a notification for admins (optional)
        try {
            await prisma.userNotification.create({
                data: {
                    userId: user.id,
                    title: 'Request Submitted',
                    titleAr: 'تم تقديم الطلب',
                    body: `Your ${type.toLowerCase()} request has been submitted.`,
                    bodyAr: `تم تقديم طلبك بنجاح.`,
                    type: 'REQUEST_UPDATE',
                    actionUrl: `/requests`,
                },
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }

        return NextResponse.json(userRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json(
            { error: 'Failed to create request' },
            { status: 500 }
        );
    }
}

// PATCH - Update request status (for admins)
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = session.user as { role?: string };

        // Only admins and moderators can update requests
        if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { id, status, response, assignedTo } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Request ID is required' },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (response) updateData.response = response;
        if (assignedTo) updateData.assignedTo = assignedTo;
        if (status === 'COMPLETED') updateData.resolvedAt = new Date();

        const userRequest = await prisma.userRequest.update({
            where: { id },
            data: updateData,
        });

        // Notify the user about the update
        try {
            await prisma.userNotification.create({
                data: {
                    userId: userRequest.userId,
                    title: 'Request Updated',
                    titleAr: 'تم تحديث الطلب',
                    body: `Your request "${userRequest.title}" has been updated to ${status}.`,
                    bodyAr: `تم تحديث طلبك "${userRequest.title}".`,
                    type: 'REQUEST_UPDATE',
                    actionUrl: `/requests`,
                },
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }

        return NextResponse.json(userRequest);
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json(
            { error: 'Failed to update request' },
            { status: 500 }
        );
    }
}
