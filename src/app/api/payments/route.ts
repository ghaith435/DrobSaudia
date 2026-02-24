export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createPaymentIntent, getOrCreateCustomer } from '@/lib/stripe';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess, apiError } from '@/lib/security';

async function handlePost(req: NextRequest) {
    const body = await req.json();
    const { action } = body;

    if (action === 'create-checkout') {
        // Create a Stripe Checkout session
        const { priceId, quantity, email, name, userId, successUrl, cancelUrl, metadata } = body;

        if (!priceId || !successUrl || !cancelUrl) {
            return apiError('Missing required fields: priceId, successUrl, cancelUrl', 400);
        }

        let customerId: string | undefined;
        if (email && name && userId) {
            const customer = await getOrCreateCustomer({ email, name, userId });
            customerId = customer.id;
        }

        const session = await createCheckoutSession({
            priceId,
            quantity: quantity || 1,
            customerId,
            successUrl,
            cancelUrl,
            metadata,
        });

        return apiSuccess({
            sessionId: session.id,
            url: session.url,
        });
    }

    if (action === 'create-payment-intent') {
        // Create a PaymentIntent for custom amounts
        const { amount, description, email, name, userId, metadata } = body;

        if (!amount || !description) {
            return apiError('Missing required fields: amount, description', 400);
        }

        let customerId: string | undefined;
        if (email && name && userId) {
            const customer = await getOrCreateCustomer({ email, name, userId });
            customerId = customer.id;
        }

        const paymentIntent = await createPaymentIntent({
            amount,
            description,
            customerId,
            metadata,
        });

        return apiSuccess({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }

    return apiError('Invalid action. Use create-checkout or create-payment-intent', 400);
}

export const POST = withRateLimit(withErrorHandler(handlePost), apiLimiter);
