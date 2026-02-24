import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

describe('Validation Schemas', () => {
    let validations: any;

    beforeAll(async () => {
        validations = await import('@/lib/validations');
    });

    describe('contactSchema', () => {
        it('should accept valid contact data', () => {
            const valid = {
                name: 'أحمد',
                email: 'ahmed@example.com',
                subject: 'استفسار عن جولة',
                message: 'أريد معرفة المزيد عن الجولات المتاحة في الدرعية',
                type: 'general',
            };
            const result = validations.contactSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalid = {
                name: 'أحمد',
                email: 'not-an-email',
                subject: 'test',
                message: 'هذه رسالة اختبار طويلة كفاية',
            };
            const result = validations.contactSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });

        it('should reject short message', () => {
            const invalid = {
                name: 'أحمد',
                email: 'ahmed@test.com',
                subject: 'test subject',
                message: 'قصير',
            };
            const result = validations.contactSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });
    });

    describe('reviewSchema', () => {
        it('should accept valid review', () => {
            const valid = {
                placeId: 'ck8s9q9q0000001l8f9y5z1x2', // valid 25-char CUID
                rating: 5,
                content: 'مكان رائع وممتاز، أنصح بزيارته!',
            };
            const result = validations.reviewSchema.safeParse(valid);
            if (!result.success) {
                console.error('Review Schema Validation Error:', JSON.stringify(result.error, null, 2));
            }
            expect(result.success).toBe(true);
        });

        it('should reject rating > 5', () => {
            const invalid = {
                placeId: 'clxxxxxxxxxxxxxxxx',
                rating: 6,
                content: 'this is a test review content',
            };
            const result = validations.reviewSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });

        it('should reject rating < 1', () => {
            const invalid = {
                placeId: 'clxxxxxxxxxxxxxxxx',
                rating: 0,
                content: 'this is a test review content',
            };
            const result = validations.reviewSchema.safeParse(invalid);
            expect(result.success).toBe(false);
        });
    });

    describe('validateInput helper', () => {
        it('should return success for valid data', () => {
            const schema = z.object({ name: z.string().min(2) });
            const result = validations.validateInput(schema, { name: 'أحمد' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe('أحمد');
            }
        });

        it('should return error for invalid data', () => {
            const schema = z.object({ name: z.string().min(2) });
            const result = validations.validateInput(schema, { name: 'أ' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBeTruthy();
            }
        });
    });
});
