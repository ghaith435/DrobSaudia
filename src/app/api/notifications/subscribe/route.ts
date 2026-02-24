import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Store subscriptions in database (you should add a PushSubscription model)
// For now, we'll use a simple in-memory store for demo
const subscriptions = new Map<string, object>();

// POST /api/notifications/subscribe - Subscribe to push notifications
export async function POST(request: NextRequest) {
    try {
        const subscription = await request.json();

        if (!subscription?.endpoint) {
            return NextResponse.json(
                { success: false, error: "Invalid subscription" },
                { status: 400 }
            );
        }

        // In production, save to database
        // await prisma.pushSubscription.create({ data: { ... } });
        subscriptions.set(subscription.endpoint, subscription);

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed to notifications",
        });
    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to subscribe" },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications/subscribe - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
    try {
        const { endpoint } = await request.json();

        if (!endpoint) {
            return NextResponse.json(
                { success: false, error: "Endpoint required" },
                { status: 400 }
            );
        }

        // In production, delete from database
        subscriptions.delete(endpoint);

        return NextResponse.json({
            success: true,
            message: "Successfully unsubscribed",
        });
    } catch (error) {
        console.error("Unsubscribe error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to unsubscribe" },
            { status: 500 }
        );
    }
}

// GET /api/notifications/subscribe - Check subscription status
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
        return NextResponse.json({
            success: true,
            data: {
                configured: !!process.env.VAPID_PUBLIC_KEY,
                vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null,
            },
        });
    }

    const isSubscribed = subscriptions.has(endpoint);

    return NextResponse.json({
        success: true,
        data: {
            subscribed: isSubscribed,
        },
    });
}
