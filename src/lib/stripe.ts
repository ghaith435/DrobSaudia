import Stripe from 'stripe';

// Lazy initialization of Stripe to prevent build-time errors
let stripeInstance: Stripe | null = null;

const getStripe = () => {
    if (!stripeInstance) {
        // Use dummy key for build time if env var is missing
        const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy1234567890abcdefghijklmnop';

        if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
            console.warn('⚠️ STRIPE_SECRET_KEY is not set. Payment features will not work.');
        }

        stripeInstance = new Stripe(apiKey, {
            apiVersion: '2025-12-18.acacia' as any,
            typescript: true,
        });
    }
    return stripeInstance;
};

// Price IDs for different products
export const STRIPE_PRICES = {
    TOUR_BASIC: process.env.STRIPE_PRICE_TOUR_BASIC || '',
    TOUR_PREMIUM: process.env.STRIPE_PRICE_TOUR_PREMIUM || '',
    EXPERIENCE: process.env.STRIPE_PRICE_EXPERIENCE || '',
};

// Create a checkout session
export async function createCheckoutSession({
    priceId,
    quantity = 1,
    customerId,
    successUrl,
    cancelUrl,
    metadata,
}: {
    priceId: string;
    quantity?: number;
    customerId?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}) {
    const session = await getStripe().checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity,
            },
        ],
        ...(customerId ? { customer: customerId } : {}),
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            ...metadata,
            platform: 'riyadh-guide',
        },
        locale: 'auto',
    });

    return session;
}

// Create a payment intent for custom amounts
export async function createPaymentIntent({
    amount,
    currency = 'sar',
    description,
    customerId,
    metadata,
}: {
    amount: number;
    currency?: string;
    description: string;
    customerId?: string;
    metadata?: Record<string, string>;
}) {
    const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to halalas
        currency,
        description,
        ...(customerId ? { customer: customerId } : {}),
        metadata: {
            ...metadata,
            platform: 'riyadh-guide',
        },
    });

    return paymentIntent;
}

// Create or get a Stripe customer
export async function getOrCreateCustomer({
    email,
    name,
    userId,
}: {
    email: string;
    name: string;
    userId: string;
}) {
    // Search for existing customer
    const existingCustomers = await getStripe().customers.list({
        email,
        limit: 1,
    });

    if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await getStripe().customers.create({
        email,
        name,
        metadata: {
            userId,
            platform: 'riyadh-guide',
        },
    });

    return customer;
}

// Verify webhook signature
export function constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
) {
    return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
}
