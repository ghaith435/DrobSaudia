import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, validateImageFile } from "@/lib/image-upload";

// POST /api/upload - Upload an image
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folder = formData.get('folder') as string || 'general';

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, {
            folder: `riyadh-guide/${folder}`,
            transformation: {
                width: 1200,
                quality: 85,
                crop: 'fill',
            },
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                data: {
                    url: result.url,
                    publicId: result.publicId,
                },
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to upload image" },
            { status: 500 }
        );
    }
}

// GET /api/upload - Get upload configuration
export async function GET() {
    const hasCloudinary = !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY
    );

    return NextResponse.json({
        success: true,
        data: {
            configured: hasCloudinary,
            maxSize: "10MB",
            allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        },
    });
}
