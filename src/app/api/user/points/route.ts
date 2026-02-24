export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Get user points and stats
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get or create UserXP record
        let userXP = await prisma.userXP.findUnique({
            where: { userId: user.id },
        });

        if (!userXP) {
            userXP = await prisma.userXP.create({
                data: {
                    userId: user.id,
                    totalXp: 0,
                    level: 1,
                    points: 0,
                    visitCount: 0,
                    tourCount: 0,
                    reviewCount: 0,
                },
            });
        }

        // Calculate level and XP needed for next level
        const xpPerLevel = 500;
        const currentLevel = Math.floor(userXP.totalXp / xpPerLevel) + 1;
        const xpForCurrentLevel = (currentLevel - 1) * xpPerLevel;
        const xpForNextLevel = currentLevel * xpPerLevel;
        const xpProgress = userXP.totalXp - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;

        return NextResponse.json({
            points: userXP.points,
            totalXp: userXP.totalXp,
            level: currentLevel,
            xpProgress,
            xpNeeded,
            xpToNextLevel: xpForNextLevel,
            visitCount: userXP.visitCount,
            tourCount: userXP.tourCount,
            reviewCount: userXP.reviewCount,
        });
    } catch (error) {
        console.error('Error fetching user points:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user points' },
            { status: 500 }
        );
    }
}

// POST - Add or deduct points
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, amount, description, descriptionAr } = body;

        if (!action || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userXP = await prisma.userXP.findUnique({
            where: { userId: user.id },
        });

        if (!userXP) {
            return NextResponse.json(
                { error: 'User XP record not found' },
                { status: 404 }
            );
        }

        let newPoints = userXP.points;
        let newTotalXp = userXP.totalXp;

        switch (action) {
            case 'EARN':
                newPoints += amount;
                newTotalXp += amount;
                break;
            case 'SPEND':
                if (userXP.points < amount) {
                    return NextResponse.json(
                        { error: 'Insufficient points' },
                        { status: 400 }
                    );
                }
                newPoints -= amount;
                break;
            case 'PURCHASE':
                newPoints += amount;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        // Update user XP
        const updatedXP = await prisma.userXP.update({
            where: { userId: user.id },
            data: {
                points: newPoints,
                totalXp: newTotalXp,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: `POINTS_${action}`,
                entityType: 'points',
                entityId: user.id,
                metadata: JSON.stringify({
                    amount,
                    previousPoints: userXP.points,
                    newPoints,
                    description: description || descriptionAr,
                }),
            },
        });

        return NextResponse.json({
            success: true,
            points: updatedXP.points,
            totalXp: updatedXP.totalXp,
        });
    } catch (error) {
        console.error('Error updating points:', error);
        return NextResponse.json(
            { error: 'Failed to update points' },
            { status: 500 }
        );
    }
}
