import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صالح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
        .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
    phone: z.string().optional(),
});

// ============================================
// REVIEW SCHEMAS
// ============================================

export const reviewSchema = z.object({
    placeId: z.string().cuid(),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(200).optional(),
    content: z.string().min(10, 'المراجعة يجب أن تكون 10 أحرف على الأقل').max(2000),
    images: z.array(z.string().url()).max(5).optional(),
});

// ============================================
// PLACE SCHEMAS
// ============================================

export const placeSchema = z.object({
    name: z.string().min(2).max(200),
    nameAr: z.string().max(200).optional(),
    description: z.string().min(20).max(5000),
    descriptionAr: z.string().max(5000).optional(),
    image: z.string().url(),
    gallery: z.array(z.string().url()).max(20).optional(),
    categoryId: z.string().cuid(),
    address: z.string().min(5).max(500),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    openingHours: z.string().optional(),
    features: z.array(z.string()).optional(),
    price: z.enum(['FREE', 'BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']).optional(),
});

// ============================================
// SEARCH SCHEMAS
// ============================================

export const searchSchema = z.object({
    q: z.string().min(1).max(200),
    category: z.string().optional(),
    city: z.string().optional(),
    price: z.enum(['FREE', 'BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']).optional(),
    rating: z.number().min(1).max(5).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    radius: z.number().min(0.1).max(100).optional(), // km
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['relevance', 'rating', 'distance', 'newest']).default('relevance'),
});

// ============================================
// BOOKING SCHEMAS
// ============================================

export const bookingSchema = z.object({
    experienceId: z.string().cuid(),
    slotId: z.string().cuid().optional(),
    date: z.string().datetime(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    guestCount: z.number().int().min(1).max(50),
    guestDetails: z.array(z.object({
        name: z.string(),
        age: z.number().int().optional(),
        specialNeeds: z.string().optional(),
    })).optional(),
    specialRequests: z.string().max(1000).optional(),
    paymentMethod: z.enum(['card', 'apple_pay', 'stc_pay']).optional(),
});

// ============================================
// TRIP SCHEMAS
// ============================================

export const tripSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isPublic: z.boolean().default(false),
    places: z.array(z.object({
        placeId: z.string().cuid(),
        order: z.number().int().min(0),
        notes: z.string().max(500).optional(),
        visitDate: z.string().datetime().optional(),
    })).optional(),
});

// ============================================
// NOTIFICATION SCHEMAS
// ============================================

export const notificationSchema = z.object({
    title: z.string().min(1).max(200),
    titleAr: z.string().max(200).optional(),
    body: z.string().min(1).max(1000),
    bodyAr: z.string().max(1000).optional(),
    type: z.enum(['INFO', 'PROMOTION', 'ANNOUNCEMENT', 'REQUEST_UPDATE', 'REWARD', 'SYSTEM']).default('INFO'),
    actionUrl: z.string().url().optional(),
    userId: z.string().cuid(),
});

// ============================================
// AI CHAT SCHEMA
// ============================================

export const aiChatSchema = z.object({
    message: z.string().min(1).max(5000),
    sessionId: z.string().optional(),
    type: z.enum(['TOUR_GUIDE', 'TRIP_PLANNER', 'AR_GUIDE', 'VR_HISTORY', 'RAG_QUERY']).default('TOUR_GUIDE'),
    context: z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeId: z.string().optional(),
        language: z.enum(['ar', 'en']).default('ar'),
    }).optional(),
});

// ============================================
// PAGINATION SCHEMA
// ============================================

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// CONTACT / FEEDBACK SCHEMA
// ============================================

export const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().min(5).max(200),
    message: z.string().min(20).max(5000),
    type: z.enum(['general', 'support', 'feedback', 'partnership', 'bug']).default('general'),
});

// ============================================
// HELPER: Validate and parse
// ============================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: errors };
}

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type AIChatInput = z.infer<typeof aiChatSchema>;
