import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('⚠️ Cloudinary credentials not set. Image features will use fallback.');
}

// Upload folders
export const FOLDERS = {
    PLACES: 'riyadh-guide/places',
    TOURS: 'riyadh-guide/tours',
    REVIEWS: 'riyadh-guide/reviews',
    USERS: 'riyadh-guide/users',
    EVENTS: 'riyadh-guide/events',
    AR: 'riyadh-guide/ar',
} as const;

// Upload image from base64 or URL
export async function uploadImage(
    source: string,
    options: {
        folder?: string;
        publicId?: string;
        transformation?: Record<string, unknown>[];
        tags?: string[];
    } = {}
): Promise<UploadApiResponse> {
    const result = await cloudinary.uploader.upload(source, {
        folder: options.folder || FOLDERS.PLACES,
        public_id: options.publicId,
        transformation: options.transformation || [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        ],
        tags: options.tags,
        resource_type: 'auto',
    });

    return result;
}

// Upload multiple images
export async function uploadMultipleImages(
    sources: string[],
    folder: string = FOLDERS.PLACES
): Promise<UploadApiResponse[]> {
    const uploads = sources.map((source) =>
        uploadImage(source, { folder })
    );
    return Promise.all(uploads);
}

// Delete image
export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

// Generate optimized URL
export function getOptimizedUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string | number;
        format?: string;
    } = {}
): string {
    return cloudinary.url(publicId, {
        width: options.width || 800,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto',
        fetch_format: options.format || 'auto',
        secure: true,
    });
}

// Generate thumbnail
export function getThumbnailUrl(publicId: string, size = 200): string {
    return getOptimizedUrl(publicId, {
        width: size,
        height: size,
        crop: 'fill',
    });
}

// Generate blur placeholder for lazy loading
export function getBlurPlaceholder(publicId: string): string {
    return cloudinary.url(publicId, {
        width: 10,
        quality: 10,
        effect: 'blur:1000',
        fetch_format: 'auto',
        secure: true,
    });
}

// Generate responsive image srcset
export function getResponsiveSrcSet(publicId: string): string {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
        .map((w) => `${getOptimizedUrl(publicId, { width: w })} ${w}w`)
        .join(', ');
}

export { cloudinary };
