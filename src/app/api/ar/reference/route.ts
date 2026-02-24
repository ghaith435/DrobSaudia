import { NextRequest, NextResponse } from 'next/server';

const AR_SERVICE_URL = process.env.AR_SERVICE_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { place_id, image } = body;

        if (!place_id || !image) {
            return NextResponse.json({
                success: false,
                error: 'بيانات ناقصة - يرجى تقديم معرف المكان والصورة'
            }, { status: 400 });
        }

        // إرسال للخدمة
        try {
            const response = await fetch(`${AR_SERVICE_URL}/add-reference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    place_id,
                    image
                }),
                signal: AbortSignal.timeout(30000) // 30 seconds for upload
            });

            const result = await response.json();
            return NextResponse.json(result);

        } catch (serviceError) {
            return NextResponse.json({
                success: false,
                error: 'خدمة التعرف غير متاحة'
            }, { status: 503 });
        }

    } catch (error) {
        console.error('خطأ في إضافة المرجع:', error);
        return NextResponse.json({
            success: false,
            error: 'فشل في معالجة الطلب'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const response = await fetch(`${AR_SERVICE_URL}/places`, {
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            const result = await response.json();
            return NextResponse.json(result);
        }
    } catch {
        // Fallback
    }

    // قائمة الأماكن المحلية
    const places = [
        { id: "1", name: "At-Turaif, Diriyah", name_ar: "حي الطريف، الدرعية", category: "History", has_reference_images: false, reference_count: 0 },
        { id: "2", name: "Kingdom Centre Tower", name_ar: "برج المملكة", category: "Modern", has_reference_images: false, reference_count: 0 },
        { id: "3", name: "Boulevard World", name_ar: "بوليفارد وورلد", category: "Entertainment", has_reference_images: false, reference_count: 0 },
        { id: "4", name: "Riyadh Park Mall", name_ar: "رياض بارك مول", category: "Shopping", has_reference_images: false, reference_count: 0 },
        { id: "5", name: "Najd Village Restaurant", name_ar: "مطعم قرية نجد", category: "Dining", has_reference_images: false, reference_count: 0 },
        { id: "6", name: "Edge of the World", name_ar: "حافة العالم", category: "Nature", has_reference_images: false, reference_count: 0 },
        { id: "7", name: "The National Museum", name_ar: "المتحف الوطني", category: "History", has_reference_images: false, reference_count: 0 },
        { id: "8", name: "Panorama Mall", name_ar: "بانوراما مول", category: "Shopping", has_reference_images: false, reference_count: 0 },
        { id: "9", name: "Via Riyadh", name_ar: "فيا الرياض", category: "Entertainment", has_reference_images: false, reference_count: 0 },
        { id: "10", name: "Wadi Hanifa", name_ar: "وادي حنيفة", category: "Nature", has_reference_images: false, reference_count: 0 }
    ];

    return NextResponse.json({
        success: true,
        places,
        fallback: true
    });
}
