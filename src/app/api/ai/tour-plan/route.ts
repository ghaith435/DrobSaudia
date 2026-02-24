export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { language, interests } = body;
        const isAr = language === 'ar';

        // Simulated Plan Generation
        const plan = {
            title: isAr ? 'رحلة استكشاف الرياض' : 'Riyadh Discovery Trip',
            summary: isAr
                ? `بناءً على اهتماماتك في ${interests.join(' و ')}، قمنا بإعداد هذه الخطة المتكاملة.`
                : `Based on your interests in ${interests.join(' and ')}, we created this integrated plan.`,
            totalEstimatedCost: isAr ? '500 - 800 ريال' : '500 - 800 SAR',
            days: [
                {
                    day: 1,
                    title: isAr ? 'عبق التاريخ والحداثة' : 'History meets Modernity',
                    activities: [
                        {
                            time: '09:00 AM',
                            place: isAr ? 'الدرعية التاريخية' : 'Historical Diriyah',
                            description: isAr
                                ? 'جولة صباحية في حي الطريف ومطل البجيري.'
                                : 'Morning tour in At-Turaif and Bujairi Terrace.',
                            estimatedCost: isAr ? '150 ريال' : '150 SAR'
                        },
                        {
                            time: '01:00 PM',
                            place: isAr ? 'غداء في نجد فيليدج' : 'Lunch at Najd Village',
                            description: isAr
                                ? 'تجربة الأكل السعودي التقليدي في أجواء تراثية.'
                                : 'Experience traditional Saudi food in a heritage setting.',
                            estimatedCost: isAr ? '100 ريال' : '100 SAR'
                        },
                        {
                            time: '04:00 PM',
                            place: isAr ? 'المتحف الوطني' : 'The National Museum',
                            description: isAr
                                ? 'جولة شاملة للتعرف على تاريخ المملكة والجزيرة العربية.'
                                : 'Comprehensive tour to learn about the history of the Kingdom and Arabia.',
                            estimatedCost: isAr ? '10 ريال' : '10 SAR'
                        },
                        {
                            time: '08:00 PM',
                            place: isAr ? 'بوليفارد رياض سيتي' : 'Boulevard Riyadh City',
                            description: isAr
                                ? 'مساء من الترفيه والتسوق والعشاء بجوار النافورة.'
                                : 'An evening of entertainment, shopping, and dinner by the fountain.',
                            estimatedCost: isAr ? '200 ريال' : '200 SAR'
                        }
                    ]
                }
            ],
            generalTips: isAr
                ? ['احرص على الحجز المسبق للمطاعم في البجيري.', 'استخدم تطبيقات التوصيل للتنقل بسهولة.']
                : ['Make sure to book Bujairi restaurants in advance.', 'Use ride-hailing apps for easy transport.']
        };

        // Simulate AI "thinking" time
        await new Promise(resolve => setTimeout(resolve, 2000));

        return NextResponse.json({
            success: true,
            plan
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
