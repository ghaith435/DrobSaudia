export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all requests with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const search = searchParams.get('search');

        const where: any = {};

        if (type) {
            where.type = type;
        }

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [requests, total] = await Promise.all([
            prisma.userRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.userRequest.count({ where })
        ]);

        // Get user info for each request
        const userIds = [...new Set(requests.map(r => r.userId))];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, nameAr: true, email: true }
        });

        const usersMap = new Map(users.map(u => [u.id, u]));

        const requestsWithUsers = requests.map(r => ({
            ...r,
            user: usersMap.get(r.userId) || null
        }));

        return NextResponse.json({
            requests: requestsWithUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch requests' },
            { status: 500 }
        );
    }
}

// PATCH - Update request status or respond
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, response, assignedTo, priority } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Request ID is required' },
                { status: 400 }
            );
        }

        const updateData: any = {};

        if (status) {
            updateData.status = status;
            if (status === 'COMPLETED') {
                updateData.resolvedAt = new Date();
            }
        }

        if (response !== undefined) {
            updateData.response = response;
        }

        if (assignedTo !== undefined) {
            updateData.assignedTo = assignedTo;
        }

        if (priority) {
            updateData.priority = priority;
        }

        const updatedRequest = await prisma.userRequest.update({
            where: { id },
            data: updateData
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'REQUEST_UPDATED',
                entityType: 'request',
                entityId: id,
                metadata: JSON.stringify({ updatedFields: Object.keys(updateData) })
            }
        });

        return NextResponse.json({ request: updatedRequest });
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json(
            { error: 'Failed to update request' },
            { status: 500 }
        );
    }
}
