export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    try {
        const event = constructWebhookEvent(body, signature, webhookSecret);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('✅ Payment completed:', session.id);

                // TODO: Update booking status in database
                // TODO: Send confirmation email
                // TODO: Award XP points

                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.log('❌ Payment failed:', paymentIntent.id);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                console.log('📋 Subscription event:', event.type);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err);
        return NextResponse.json(
            { error: 'Webhook verification failed' },
            { status: 400 }
        );
    }
}
