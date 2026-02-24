import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, authLimiter, apiSuccess, apiError } from '@/lib/security';
import { contactSchema, validateInput } from '@/lib/validations';

async function handler(req: NextRequest) {
    const body = await req.json();
    const validation = validateInput(contactSchema, body);

    if (!validation.success) {
        return apiError(validation.error, 400);
    }

    // In production, send email or save to database
    console.log('Contact form submission:', validation.data);

    return apiSuccess({ received: true }, 'تم استلام رسالتك بنجاح! سنتواصل معك قريباً.');
}

export const POST = withRateLimit(withErrorHandler(handler), authLimiter);
