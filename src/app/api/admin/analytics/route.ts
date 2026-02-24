export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Get overview statistics
        const [
            totalUsers,
            activeUsers,
            totalPlaces,
            totalRequests,
            pendingRequests,
            totalViews,
            recentRequests,
            recentUsers,
            requestsByType,
            requestsByStatus,
            topPlaces,
            topSearches
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.place.count(),
            prisma.userRequest.count(),
            prisma.userRequest.count({ where: { status: 'PENDING' } }),
            prisma.pageView.count(),
            prisma.userRequest.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
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
            }),
            prisma.userRequest.groupBy({
                by: ['type'],
                _count: { type: true }
            }),
            prisma.userRequest.groupBy({
                by: ['status'],
                _count: { status: true }
            }),
            prisma.place.findMany({
                take: 10,
                orderBy: { viewCount: 'desc' },
                select: {
                    id: true,
                    name: true,
                    nameAr: true,
                    viewCount: true,
                    rating: true
                }
            }),
            prisma.searchLog.groupBy({
                by: ['query'],
                _count: { query: true },
                orderBy: { _count: { query: 'desc' } },
                take: 10
            })
        ]);

        return NextResponse.json({
            overview: {
                totalUsers,
                activeUsers,
                totalPlaces,
                totalRequests,
                pendingRequests,
                totalViews
            },
            recentRequests,
            recentUsers,
            requestsByType: requestsByType.map(r => ({
                type: r.type,
                count: r._count.type
            })),
            requestsByStatus: requestsByStatus.map(r => ({
                status: r.status,
                count: r._count.status
            })),
            topPlaces,
            topSearches: topSearches.map(s => ({
                query: s.query,
                count: s._count.query
            }))
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
