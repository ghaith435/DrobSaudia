import { NextRequest, NextResponse } from 'next/server';

const AR_SERVICE_URL = process.env.AR_SERVICE_URL || 'http://localhost:5001';

// بيانات الأماكن المحلية كـ fallback
const PLACES_DATA: Record<string, {
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    category: string;
    location: { lat: number; lng: number };
}> = {
    "1": {
        name: "At-Turaif, Diriyah",
        nameAr: "حي الطريف، الدرعية",
        description: "The birthplace of the first Saudi state, a UNESCO World Heritage site.",
        descriptionAr: "مهد الدولة السعودية الأولى، موقع تراث عالمي لليونسكو.",
        category: "History",
        location: { lat: 24.7333, lng: 46.5750 }
    },
    "2": {
        name: "Kingdom Centre Tower",
        nameAr: "برج المملكة",
        description: "An iconic 99-story skyscraper featuring the Sky Bridge.",
        descriptionAr: "ناطحة سحاب أيقونية من 99 طابقًا تتميز بجسر السماء.",
        category: "Modern",
        location: { lat: 24.7114, lng: 46.6744 }
    },
    "3": {
        name: "Boulevard World",
        nameAr: "بوليفارد وورلد",
        description: "A massive entertainment zone bringing cultures from around the world.",
        descriptionAr: "منطقة ترفيهية ضخمة تجلب ثقافات من جميع أنحاء العالم.",
        category: "Entertainment",
        location: { lat: 24.7890, lng: 46.6110 }
    },
    "4": {
        name: "Riyadh Park Mall",
        nameAr: "رياض بارك مول",
        description: "One of Riyadh's most popular shopping destinations.",
        descriptionAr: "أحد أشهر وجهات التسوق في الرياض.",
        category: "Shopping",
        location: { lat: 24.7550, lng: 46.6300 }
    },
    "5": {
        name: "Najd Village Restaurant",
        nameAr: "مطعم قرية نجد",
        description: "Experience authentic traditional Saudi Najdi cuisine.",
        descriptionAr: "تجربة المطبخ النجدي السعودي التقليدي الأصيل.",
        category: "Dining",
        location: { lat: 24.6800, lng: 46.7000 }
    },
    "6": {
        name: "Edge of the World",
        nameAr: "حافة العالم",
        description: "A breathtaking natural wonder on the edge of the Tuwaiq Escarpment.",
        descriptionAr: "أعجوبة طبيعية خلابة على حافة جرف طويق.",
        category: "Nature",
        location: { lat: 24.8361, lng: 46.2158 }
    },
    "7": {
        name: "The National Museum",
        nameAr: "المتحف الوطني",
        description: "Saudi Arabia's premier museum showcasing the Kingdom's rich history.",
        descriptionAr: "متحف المملكة العربية السعودية الأول الذي يعرض تاريخ المملكة الغني.",
        category: "History",
        location: { lat: 24.6476, lng: 46.7102 }
    },
    "8": {
        name: "Panorama Mall",
        nameAr: "بانوراما مول",
        description: "A premium shopping destination featuring luxury brands.",
        descriptionAr: "وجهة تسوق فاخرة تضم علامات تجارية فخمة.",
        category: "Shopping",
        location: { lat: 24.7685, lng: 46.6890 }
    },
    "9": {
        name: "Via Riyadh",
        nameAr: "فيا الرياض",
        description: "An upscale outdoor entertainment destination.",
        descriptionAr: "وجهة ترفيهية راقية في الهواء الطلق.",
        category: "Entertainment",
        location: { lat: 24.7234, lng: 46.6678 }
    },
    "10": {
        name: "Wadi Hanifa",
        nameAr: "وادي حنيفة",
        description: "A rehabilitated natural valley with scenic walking and cycling paths.",
        descriptionAr: "وادي طبيعي مُعاد تأهيله يوفر مسارات للمشي وركوب الدراجات.",
        category: "Nature",
        location: { lat: 24.5500, lng: 46.6200 }
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, min_confidence = 0.3 } = body;

        if (!image) {
            return NextResponse.json({
                success: false,
                error: 'لم يتم تقديم صورة'
            }, { status: 400 });
        }

        // محاولة الاتصال بخدمة OpenCV
        try {
            const response = await fetch(`${AR_SERVICE_URL}/recognize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image,
                    min_confidence
                }),
                signal: AbortSignal.timeout(10000) // timeout 10 seconds
            });

            if (response.ok) {
                const result = await response.json();
                return NextResponse.json(result);
            }
        } catch (serviceError) {
            console.log('خدمة OpenCV غير متاحة، استخدام التعرف التجريبي');
        }

        // Fallback: تعرف تجريبي بناءً على تحليل بسيط
        const demoRecognition = await performDemoRecognition(image);

        return NextResponse.json(demoRecognition);

    } catch (error) {
        console.error('خطأ في التعرف:', error);
        return NextResponse.json({
            success: false,
            error: 'فشل في معالجة الطلب'
        }, { status: 500 });
    }
}

// دالة التعرف التجريبي (للعرض التوضيحي)
async function performDemoRecognition(imageData: string) {
    // في الإنتاج، سيتم استبدال هذا بالاتصال الفعلي بخدمة OpenCV
    // هذا للعرض التوضيحي فقط

    // استخراج بعض المعلومات من الصورة (محاكاة)
    const imageSize = imageData.length;

    // اختيار مكان عشوائي للتوضيح (في الإنتاج سيكون هذا نتيجة OpenCV)
    const placeIds = Object.keys(PLACES_DATA);

    // إذا كانت الصورة صغيرة جداً، لا يمكن التعرف
    if (imageSize < 1000) {
        return {
            success: true,
            recognized: false,
            message: 'الصورة صغيرة جداً للتعرف'
        };
    }

    // محاكاة التعرف (في 70% من الحالات)
    const shouldRecognize = Math.random() > 0.3;

    if (shouldRecognize) {
        const randomPlaceId = placeIds[Math.floor(Math.random() * placeIds.length)];
        const place = PLACES_DATA[randomPlaceId];
        const confidence = 60 + Math.floor(Math.random() * 35); // 60-95%

        return {
            success: true,
            recognized: true,
            place: {
                id: randomPlaceId,
                name: place.name,
                nameAr: place.nameAr,
                confidence: confidence,
                matchedFeatures: Math.floor(confidence / 2),
                description: place.description,
                descriptionAr: place.descriptionAr,
                category: place.category,
                location: place.location
            },
            demo: true // علامة أن هذا تعرف تجريبي
        };
    }

    return {
        success: true,
        recognized: false,
        message: 'لم يتم التعرف على المكان - جرب توجيه الكاميرا نحو معلم واضح'
    };
}

export async function GET() {
    // فحص حالة الخدمة
    try {
        const response = await fetch(`${AR_SERVICE_URL}/health`, {
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            return NextResponse.json({
                status: 'online',
                service: 'OpenCV Recognition Service',
                fallback: false
            });
        }
    } catch {
        // الخدمة غير متاحة
    }

    return NextResponse.json({
        status: 'offline',
        service: 'Demo Recognition (Fallback)',
        fallback: true,
        message: 'خدمة OpenCV غير متاحة، يتم استخدام التعرف التجريبي'
    });
}
