// Image Upload Service
// Supports both Cloudinary and local storage fallback

interface UploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

interface UploadOptions {
    folder?: string;
    transformation?: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'fit' | 'scale' | 'thumb';
        quality?: number;
    };
}

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: 'riyadh_guide', // Create this in Cloudinary dashboard
};

// Generate Cloudinary signature for secure uploads
function generateSignature(timestamp: number, folder: string): string {
    const crypto = require('crypto');
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    return crypto.createHash('sha256').update(toSign).digest('hex');
}

// Upload image to Cloudinary
export async function uploadToCloudinary(
    file: File | Blob,
    options: UploadOptions = {}
): Promise<UploadResult> {
    const { folder = 'riyadh-guide', transformation } = options;

    if (!CLOUDINARY_CONFIG.cloudName) {
        return { success: false, error: 'Cloudinary not configured' };
    }

    try {
        const timestamp = Math.round(Date.now() / 1000);
        const formData = new FormData();

        formData.append('file', file);
        formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('folder', folder);
        formData.append('signature', generateSignature(timestamp, folder));

        if (transformation) {
            const trans = [];
            if (transformation.width) trans.push(`w_${transformation.width}`);
            if (transformation.height) trans.push(`h_${transformation.height}`);
            if (transformation.crop) trans.push(`c_${transformation.crop}`);
            if (transformation.quality) trans.push(`q_${transformation.quality}`);
            if (trans.length > 0) {
                formData.append('transformation', trans.join(','));
            }
        }

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            return {
                success: true,
                url: data.secure_url,
                publicId: data.public_id,
            };
        } else {
            return {
                success: false,
                error: data.error?.message || 'Upload failed',
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
    if (!CLOUDINARY_CONFIG.cloudName) return false;

    try {
        const timestamp = Math.round(Date.now() / 1000);
        const crypto = require('crypto');
        const toSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
        const signature = crypto.createHash('sha256').update(toSign).digest('hex');

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        return data.result === 'ok';
    } catch {
        return false;
    }
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(
    publicId: string,
    options: { width?: number; height?: number; quality?: number } = {}
): string {
    if (!CLOUDINARY_CONFIG.cloudName) return '';

    const { width = 800, height, quality = 'auto' } = options;

    let transformations = `f_auto,q_${quality},w_${width}`;
    if (height) transformations += `,h_${height}`;
    transformations += ',c_fill';

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
}

// Placeholder image generator
export function getPlaceholderUrl(width: number = 400, height: number = 300, text?: string): string {
    const encodedText = encodeURIComponent(text || 'Riyadh Guide');
    return `https://via.placeholder.com/${width}x${height}/0a0a0f/d9b063?text=${encodedText}`;
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF are allowed' };
    }

    return { valid: true };
}
