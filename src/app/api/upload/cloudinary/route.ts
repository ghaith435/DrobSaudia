import { NextRequest } from 'next/server';
import { withErrorHandler, withRateLimit, apiLimiter, apiSuccess, apiError } from '@/lib/security';
import { uploadImage, deleteImage, FOLDERS } from '@/lib/cloudinary';

async function handlePost(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || FOLDERS.PLACES;
    const tags = formData.get('tags') as string;

    if (!file) {
        return apiError('No file provided', 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
        return apiError('نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP, AVIF', 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return apiError('حجم الملف يتجاوز الحد الأقصى (10 ميغابايت)', 400);
    }

    // Convert to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await uploadImage(base64, {
        folder,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
    });

    return apiSuccess({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
    }, 'تم رفع الصورة بنجاح');
}

async function handleDelete(req: NextRequest) {
    const body = await req.json();
    const { publicId } = body;

    if (!publicId) {
        return apiError('Public ID is required', 400);
    }

    await deleteImage(publicId);
    return apiSuccess({ deleted: true }, 'تم حذف الصورة بنجاح');
}

export const POST = withRateLimit(withErrorHandler(handlePost), apiLimiter);
export const DELETE = withRateLimit(withErrorHandler(handleDelete), apiLimiter);
