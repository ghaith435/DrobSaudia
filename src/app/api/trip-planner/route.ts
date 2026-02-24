export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// Simulate ChatGPT/Gemini API response for trip planning
export async function POST(request: NextRequest) {
    try {
        const preferences = await request.json();

        const {
            duration,
            interests,
            budget,
            pace,
            travelWith,
            startDate,
        } = preferences;

        // In production, this would call OpenAI/Gemini API
        // For now, generate a smart itinerary based on preferences

        const itinerary = generateSmartItinerary(preferences);

        return NextResponse.json({
            success: true,
            itinerary,
            preferences: {
                duration,
                interests,
                budget,
                pace,
                travelWith,
                startDate,
            }
        });
    } catch (error) {
        console.error('Trip planner error:', error);
        return NextResponse.json(
            { error: 'Failed to generate trip plan' },
            { status: 500 }
        );
    }
}

interface TripPreferences {
    duration: number;
    interests: string[];
    budget: 'budget' | 'moderate' | 'luxury';
    pace: 'relaxed' | 'moderate' | 'active';
    travelWith: 'solo' | 'couple' | 'family' | 'friends';
    startDate?: string;
}

interface Activity {
    time: string;
    place: string;
    description: string;
    duration: string;
    category: string;
    tips?: string;
}

interface DayPlan {
    day: number;
    title: string;
    activities: Activity[];
}

function generateSmartItinerary(preferences: TripPreferences): DayPlan[] {
    const { duration, interests, budget, pace, travelWith } = preferences;

    // Activity database organized by category
    const activityDatabase: Record<string, Activity[]> = {
        history: [
            { time: '09:00', place: 'حي الطريف - الدرعية', description: 'استكشف موقع التراث العالمي لليونسكو ومهد الدولة السعودية', duration: '3 ساعات', category: 'تاريخي', tips: 'أفضل وقت للتصوير في الصباح الباكر' },
            { time: '10:00', place: 'المتحف الوطني', description: 'تعرف على تاريخ المملكة عبر 8 قاعات متميزة', duration: '2.5 ساعة', category: 'تاريخي', tips: 'استأجر دليل صوتي للتجربة الكاملة' },
            { time: '11:00', place: 'قصر المصمك', description: 'القلعة التاريخية التي شهدت توحيد المملكة', duration: '1.5 ساعة', category: 'تاريخي' },
            { time: '09:30', place: 'قصر المربع', description: 'مقر الملك عبدالعزيز التاريخي', duration: '2 ساعة', category: 'تاريخي' },
        ],
        nature: [
            { time: '06:00', place: 'حافة العالم', description: 'مشاهدة شروق الشمس من حافة جبل طويق', duration: '4 ساعات', category: 'طبيعة', tips: 'انطلق مبكراً لتجنب الحرارة' },
            { time: '16:00', place: 'وادي حنيفة', description: 'استمتع بمسار المشي الطبيعي ومناظر الغروب', duration: '3 ساعات', category: 'طبيعة' },
            { time: '17:00', place: 'حديقة الملك عبدالله', description: 'تنزه في أجمل حدائق الرياض مع عروض النوافير', duration: '2 ساعة', category: 'طبيعة' },
            { time: '18:00', place: 'منتزه السلام', description: 'حديقة عائلية مع ألعاب أطفال ومساحات خضراء', duration: '2 ساعة', category: 'طبيعة' },
        ],
        shopping: [
            { time: '14:00', place: 'الرياض بارك', description: 'أكبر مراكز التسوق مع 400+ متجر', duration: '3 ساعات', category: 'تسوق' },
            { time: '15:00', place: 'بانوراما مول', description: 'تجربة تسوق فاخرة مع مدينة ثلج داخلية', duration: '2.5 ساعة', category: 'تسوق' },
            { time: '10:00', place: 'سوق الزل', description: 'السوق التقليدي للهدايا والحرف اليدوية', duration: '2 ساعة', category: 'تسوق', tips: 'تفاوض على الأسعار' },
            { time: '16:00', place: 'غرناطة مول', description: 'مول عائلي مع ترفيه متنوع', duration: '3 ساعات', category: 'تسوق' },
        ],
        food: [
            { time: '13:00', place: 'قرية نجد', description: 'تذوق الكبسة الأصيلة في أجواء تراثية', duration: '2 ساعة', category: 'طعام' },
            { time: '20:00', place: 'مطل البجيري', description: 'عشاء فاخر مع إطلالة على حي الطريف', duration: '2.5 ساعة', category: 'طعام' },
            { time: '19:00', place: 'شارع التحلية', description: 'تجربة مقاهي ومطاعم متنوعة', duration: '2 ساعة', category: 'طعام' },
            { time: '12:00', place: 'المذاق السعودي', description: 'بوفيه سعودي تقليدي', duration: '1.5 ساعة', category: 'طعام' },
        ],
        entertainment: [
            { time: '18:00', place: 'بوليفارد وورلد', description: 'مناطق ترفيهية عالمية وعروض حية', duration: '4 ساعات', category: 'ترفيه' },
            { time: '19:00', place: 'فيا الرياض', description: 'أجواء مسائية راقية مع موسيقى حية', duration: '3 ساعات', category: 'ترفيه' },
            { time: '20:00', place: 'جوي بوليفارد', description: 'ملاهي ومطاعم للعائلات', duration: '3 ساعات', category: 'ترفيه' },
            { time: '21:00', place: 'وينتر وندرلاند', description: 'أجواء شتوية أوروبية', duration: '3 ساعات', category: 'ترفيه' },
        ],
        architecture: [
            { time: '10:00', place: 'برج المملكة', description: 'صعود للجسر السماوي مع إطلالة 360°', duration: '1.5 ساعة', category: 'عمارة' },
            { time: '11:00', place: 'مركز الملك عبدالله المالي', description: 'جولة في تحفة العمارة الحديثة', duration: '2 ساعة', category: 'عمارة' },
            { time: '14:00', place: 'برج الفيصلية', description: 'أيقونة العمارة السعودية الحديثة', duration: '1.5 ساعة', category: 'عمارة' },
        ],
        relaxation: [
            { time: '10:00', place: 'سبا الرياض', description: 'جلسة استرخاء وعناية', duration: '2 ساعة', category: 'استجمام' },
            { time: '16:00', place: 'منتجع موفنبيك', description: 'مسبح وجاكوزي وسبا', duration: '3 ساعات', category: 'استجمام' },
        ],
        art: [
            { time: '11:00', place: 'مؤسسة الملك فيصل', description: 'معارض فنية وثقافية', duration: '2 ساعة', category: 'فن' },
            { time: '15:00', place: 'آرت هاوس', description: 'معرض للفن السعودي المعاصر', duration: '1.5 ساعة', category: 'فن' },
        ],
    };

    // Adjust activities based on budget
    const budgetFilter = (activity: Activity): boolean => {
        if (budget === 'luxury') return true;
        if (budget === 'budget') {
            const expensivePlaces = ['مطل البجيري', 'سبا الرياض', 'منتجع موفنبيك', 'بانوراما مول'];
            return !expensivePlaces.includes(activity.place);
        }
        return true;
    };

    // Adjust activities based on travel group
    const groupFilter = (activity: Activity): boolean => {
        if (travelWith === 'family') {
            const familyFriendly = ['حديقة الملك عبدالله', 'وادي حنيفة', 'بوليفارد وورلد', 'المتحف الوطني', 'جوي بوليفارد'];
            return familyFriendly.includes(activity.place) || activity.category !== 'استجمام';
        }
        if (travelWith === 'couple') {
            const romantic = ['مطل البجيري', 'فيا الرياض', 'حافة العالم', 'شارع التحلية'];
            // Prioritize but don't exclude
        }
        return true;
    };

    // Number of activities per day based on pace
    const activitiesPerDay = pace === 'relaxed' ? 2 : pace === 'moderate' ? 3 : 4;

    const days: DayPlan[] = [];
    const usedActivities = new Set<string>();

    // Build itinerary day by day
    for (let d = 1; d <= duration; d++) {
        const dayActivities: Activity[] = [];

        // Get activities for this day based on interests
        const availableInterests = interests.length > 0 ? interests : Object.keys(activityDatabase);

        for (const interest of availableInterests) {
            const categoryActivities = activityDatabase[interest] || [];
            const filtered = categoryActivities
                .filter(a => !usedActivities.has(a.place))
                .filter(budgetFilter)
                .filter(groupFilter);

            if (filtered.length > 0 && dayActivities.length < activitiesPerDay) {
                const activity = filtered[Math.floor(Math.random() * filtered.length)];
                usedActivities.add(activity.place);
                dayActivities.push(activity);
            }
        }

        // Fill remaining slots with diverse activities
        while (dayActivities.length < activitiesPerDay) {
            const allCategories = Object.keys(activityDatabase);
            const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
            const categoryActivities = activityDatabase[randomCategory]
                .filter(a => !usedActivities.has(a.place))
                .filter(budgetFilter);

            if (categoryActivities.length > 0) {
                const activity = categoryActivities[0];
                usedActivities.add(activity.place);
                dayActivities.push(activity);
            } else {
                break;
            }
        }

        // Sort by time
        dayActivities.sort((a, b) => a.time.localeCompare(b.time));

        // Assign proper times
        const times = pace === 'relaxed'
            ? ['10:00', '16:00']
            : pace === 'moderate'
                ? ['09:00', '13:00', '18:00']
                : ['08:00', '11:00', '15:00', '19:00'];

        dayActivities.forEach((activity, idx) => {
            if (times[idx]) {
                activity.time = times[idx];
            }
        });

        // Create day title
        const mainCategory = dayActivities[0]?.category || 'استكشاف';
        const titles: Record<number, string> = {
            1: 'بداية المغامرة',
            [duration]: 'اليوم الأخير',
        };

        days.push({
            day: d,
            title: titles[d] || `يوم ${mainCategory}`,
            activities: dayActivities,
        });
    }

    return days;
}
