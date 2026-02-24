import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Points packages available for purchase
const POINTS_PACKAGES = [
    { id: 'starter', name: 'Starter', nameAr: 'مبتدئ', points: 100, price: 10, bonus: 0 },
    { id: 'explorer', name: 'Explorer', nameAr: 'مستكشف', points: 300, price: 25, bonus: 50 },
    { id: 'adventurer', name: 'Adventurer', nameAr: 'مغامر', points: 500, price: 40, bonus: 100 },
    { id: 'legend', name: 'Legend', nameAr: 'أسطوري', points: 1000, price: 75, bonus: 250 },
];

// GET - Get available packages
export async function GET() {
    return NextResponse.json({
        packages: POINTS_PACKAGES,
    });
}

// POST - Purchase a package (simulate payment)
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
        const { packageId, paymentMethod } = body;

        if (!packageId) {
            return NextResponse.json(
                { error: 'Package ID is required' },
                { status: 400 }
            );
        }

        // Find the package
        const selectedPackage = POINTS_PACKAGES.find(pkg => pkg.id === packageId);

        if (!selectedPackage) {
            return NextResponse.json(
                { error: 'Invalid package' },
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

        // In production, this would integrate with a payment gateway
        // For now, we simulate a successful payment

        const totalPoints = selectedPackage.points + selectedPackage.bonus;

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

        // Add points to user
        const updatedXP = await prisma.userXP.update({
            where: { userId: user.id },
            data: {
                points: userXP.points + totalPoints,
            },
        });

        // Log the purchase
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'POINTS_PURCHASED',
                entityType: 'points',
                entityId: selectedPackage.id,
                metadata: JSON.stringify({
                    packageId: selectedPackage.id,
                    packageName: selectedPackage.name,
                    basePoints: selectedPackage.points,
                    bonusPoints: selectedPackage.bonus,
                    totalPoints,
                    price: selectedPackage.price,
                    paymentMethod: paymentMethod || 'card',
                    previousBalance: userXP.points,
                    newBalance: updatedXP.points,
                }),
            },
        });

        // Send notification
        await prisma.userNotification.create({
            data: {
                userId: user.id,
                title: 'Points Added Successfully',
                titleAr: 'تمت إضافة النقاط بنجاح',
                body: `${totalPoints} points have been added to your account.`,
                bodyAr: `تم إضافة ${totalPoints} نقطة إلى حسابك.`,
                type: 'REWARD',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Points purchased successfully',
            package: {
                id: selectedPackage.id,
                name: selectedPackage.name,
                nameAr: selectedPackage.nameAr,
                points: selectedPackage.points,
                bonus: selectedPackage.bonus,
                totalPoints,
            },
            newBalance: updatedXP.points,
        });
    } catch (error) {
        console.error('Error purchasing points:', error);
        return NextResponse.json(
            { error: 'Failed to purchase points' },
            { status: 500 }
        );
    }
}
