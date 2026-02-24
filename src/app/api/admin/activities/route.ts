import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all activity logs with pagination
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const action = searchParams.get('action');
        const entityType = searchParams.get('entityType');
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {};

        if (action) {
            where.action = action;
        }

        if (entityType) {
            where.entityType = entityType;
        }

        if (userId) {
            where.userId = userId;
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }

        const [activities, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.activityLog.count({ where })
        ]);

        // Get user info for activities with userId
        const userIds = [...new Set(activities.filter(a => a.userId).map(a => a.userId!))];
        const users = userIds.length > 0 ? await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, nameAr: true, email: true }
        }) : [];

        const usersMap = new Map(users.map(u => [u.id, u]));

        const activitiesWithUsers = activities.map(a => ({
            ...a,
            user: a.userId ? usersMap.get(a.userId) || null : null
        }));

        return NextResponse.json({
            activities: activitiesWithUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

// GET activity statistics
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type } = body; // 'stats' | 'recent'

        if (type === 'stats') {
            const [
                totalActivities,
                todayActivities,
                weekActivities,
                activityByAction
            ] = await Promise.all([
                prisma.activityLog.count(),
                prisma.activityLog.count({
                    where: {
                        createdAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }),
                prisma.activityLog.count({
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                    }
                }),
                prisma.activityLog.groupBy({
                    by: ['action'],
                    _count: { action: true },
                    orderBy: { _count: { action: 'desc' } },
                    take: 10
                })
            ]);

            return NextResponse.json({
                stats: {
                    total: totalActivities,
                    today: todayActivities,
                    thisWeek: weekActivities,
                    byAction: activityByAction.map(a => ({
                        action: a.action,
                        count: a._count.action
                    }))
                }
            });
        }

        // Default: return recent activities
        const recentActivities = await prisma.activityLog.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ activities: recentActivities });
    } catch (error) {
        console.error('Error fetching activity stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activity stats' },
            { status: 500 }
        );
    }
}
