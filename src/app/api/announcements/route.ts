export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch active announcements
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const includeRead = searchParams.get('includeRead') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        const now = new Date();

        const announcements = await prisma.announcement.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                OR: [
                    { endDate: null },
                    { endDate: { gte: now } },
                ],
            },
            include: {
                readBy: userId ? {
                    where: { userId },
                } : false,
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
        });

        // Map to include isRead flag
        const result = announcements.map(ann => ({
            ...ann,
            isRead: userId && ann.readBy ? ann.readBy.length > 0 : false,
            readBy: undefined, // Remove the array from response
        }));

        // Filter out read if requested
        const filtered = includeRead ? result : result.filter(a => !a.isRead);

        return NextResponse.json(filtered);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch announcements' },
            { status: 500 }
        );
    }
}

// POST - Create announcement (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            titleAr,
            content,
            contentAr,
            image,
            type,
            priority,
            targetAudience,
            startDate,
            endDate,
            createdBy,
        } = body;

        if (!title || !titleAr || !content || !contentAr || !createdBy) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                titleAr,
                content,
                contentAr,
                image,
                type: type || 'GENERAL',
                priority: priority || 0,
                targetAudience: targetAudience ? JSON.stringify(targetAudience) : null,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                createdBy,
            },
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { error: 'Failed to create announcement' },
            { status: 500 }
        );
    }
}

// Mark announcement as read
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { announcementId, userId } = body;

        if (!announcementId || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await prisma.announcementRead.upsert({
            where: {
                announcementId_userId: {
                    announcementId,
                    userId,
                },
            },
            create: {
                announcementId,
                userId,
            },
            update: {},
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking announcement as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark announcement as read' },
            { status: 500 }
        );
    }
}
