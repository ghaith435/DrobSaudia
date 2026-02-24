import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch user notifications
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const where: Record<string, unknown> = { userId };
        if (unreadOnly) where.isRead = false;

        const [notifications, unreadCount] = await Promise.all([
            prisma.userNotification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
            }),
            prisma.userNotification.count({
                where: { userId, isRead: false },
            }),
        ]);

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// POST - Create notification (for admin/system use)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, title, titleAr, body: notifBody, bodyAr, type, actionUrl } = body;

        if (!userId || !title || !notifBody) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const notification = await prisma.userNotification.create({
            data: {
                userId,
                title,
                titleAr,
                body: notifBody,
                bodyAr,
                type: type || 'INFO',
                actionUrl,
            },
        });

        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        );
    }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { notificationId, userId, markAll } = body;

        if (markAll && userId) {
            // Mark all notifications as read for user
            await prisma.userNotification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true, readAt: new Date() },
            });
            return NextResponse.json({ success: true });
        }

        if (!notificationId) {
            return NextResponse.json(
                { error: 'Notification ID is required' },
                { status: 400 }
            );
        }

        await prisma.userNotification.update({
            where: { id: notificationId },
            data: { isRead: true, readAt: new Date() },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}
