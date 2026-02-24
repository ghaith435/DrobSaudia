// TripBuilder AI Agent - Generates personalized itineraries based on user intent
import { ollamaChat } from '../ollama';

export interface TripBuilderPreferences {
    intent?: string;
    duration?: string;
    interests?: string[];
    budget?: 'economy' | 'standard' | 'premium' | 'luxury';
    groupType?: 'solo' | 'couple' | 'family' | 'friends' | 'group';
    groupSize?: number;
    pace?: 'relaxed' | 'moderate' | 'active';
    accessibility?: string[];
    languages?: string[];
    startDate?: string;
    specificRequests?: string;
}

export interface ItineraryItem {
    id: string;
    type: 'experience' | 'place' | 'meal' | 'transport';
    title: string;
    titleAr?: string;
    description: string;
    startTime: string;
    endTime: string;
    duration: number; // minutes
    location?: {
        name: string;
        latitude: number;
        longitude: number;
    };
    price?: number;
    experienceId?: string;
    guideId?: string;
    notes?: string;
}

export interface DayPlan {
    day: number;
    date?: string;
    theme?: string;
    themeAr?: string;
    items: ItineraryItem[];
    totalDuration: number;
    totalCost: number;
}

export interface GeneratedItinerary {
    id: string;
    title: string;
    titleAr?: string;
    summary: string;
    summaryAr?: string;
    days: DayPlan[];
    totalCost: number;
    highlights: string[];
    tips: string[];
    recommendedExperiences: string[];
}

const SYSTEM_PROMPT = `You are TripBuilder, an AI travel planning agent specializing in Riyadh, Saudi Arabia experiences.

Your role is to create personalized, detailed itineraries that match the user's intent and preferences.

When generating itineraries:
1. Consider the user's budget tier (economy, standard, premium, luxury)
2. Match experiences to their interests and group type
3. Plan realistic timing with appropriate breaks
4. Include a mix of activities, meals, and experiences
5. Suggest local hidden gems alongside popular attractions
6. Account for Saudi cultural norms and prayer times
7. Include practical tips for each day

Always respond with valid JSON matching the requested format.`;

export async function generateItinerary(
    preferences: TripBuilderPreferences,
    availableExperiences?: { id: string; title: string; category: string; price: number; duration: number }[]
): Promise<GeneratedItinerary> {
    const userMessage = buildUserMessage(preferences, availableExperiences);

    try {
        const response = await ollamaChat({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            format: 'json',
            temperature: 0.7
        });

        const itinerary = JSON.parse(response.message.content);
        return validateAndEnrichItinerary(itinerary, preferences);
    } catch (error) {
        console.error('TripBuilder generation error:', error);
        return generateFallbackItinerary(preferences);
    }
}

function buildUserMessage(
    preferences: TripBuilderPreferences,
    experiences?: { id: string; title: string; category: string; price: number; duration: number }[]
): string {
    let message = `Create a personalized Riyadh itinerary with these preferences:

Intent: ${preferences.intent || 'General tourism exploration'}
Duration: ${preferences.duration || '1 day'}
Budget: ${preferences.budget || 'standard'}
Group: ${preferences.groupType || 'solo'} (${preferences.groupSize || 1} people)
Pace: ${preferences.pace || 'moderate'}
Interests: ${preferences.interests?.join(', ') || 'Various'}
Languages: ${preferences.languages?.join(', ') || 'Arabic, English'}
`;

    if (preferences.accessibility?.length) {
        message += `Accessibility needs: ${preferences.accessibility.join(', ')}\n`;
    }

    if (preferences.specificRequests) {
        message += `Special requests: ${preferences.specificRequests}\n`;
    }

    if (experiences?.length) {
        message += `\nAvailable experiences to consider:\n`;
        experiences.forEach(exp => {
            message += `- ${exp.title} (${exp.category}, ${exp.duration} min, ${exp.price} SAR)\n`;
        });
    }

    message += `
Respond with JSON containing:
{
  "id": "unique-id",
  "title": "Itinerary title",
  "titleAr": "Arabic title",
  "summary": "Brief summary",
  "summaryAr": "Arabic summary",
  "days": [
    {
      "day": 1,
      "theme": "Day theme",
      "themeAr": "Arabic theme",
      "items": [
        {
          "id": "item-id",
          "type": "experience|place|meal|transport",
          "title": "Activity title",
          "titleAr": "Arabic title",
          "description": "Brief description",
          "startTime": "09:00",
          "endTime": "11:00",
          "duration": 120,
          "location": { "name": "Location name", "latitude": 24.7, "longitude": 46.7 },
          "price": 150,
          "notes": "Any tips"
        }
      ],
      "totalDuration": 480,
      "totalCost": 500
    }
  ],
  "totalCost": 500,
  "highlights": ["Highlight 1", "Highlight 2"],
  "tips": ["Practical tip 1", "Practical tip 2"],
  "recommendedExperiences": ["experience-id-1", "experience-id-2"]
}`;

    return message;
}

function validateAndEnrichItinerary(
    itinerary: GeneratedItinerary,
    preferences: TripBuilderPreferences
): GeneratedItinerary {
    // Ensure all required fields exist
    return {
        id: itinerary.id || `tb-${Date.now()}`,
        title: itinerary.title || 'Your Riyadh Adventure',
        titleAr: itinerary.titleAr || 'مغامرتك في الرياض',
        summary: itinerary.summary || 'A personalized journey through Riyadh',
        summaryAr: itinerary.summaryAr || 'رحلة مخصصة عبر الرياض',
        days: itinerary.days || [],
        totalCost: itinerary.totalCost || 0,
        highlights: itinerary.highlights || [],
        tips: itinerary.tips || [],
        recommendedExperiences: itinerary.recommendedExperiences || []
    };
}

function generateFallbackItinerary(preferences: TripBuilderPreferences): GeneratedItinerary {
    // Fallback itinerary when AI fails
    const defaultItems: ItineraryItem[] = [
        {
            id: 'fb-1',
            type: 'place',
            title: 'Kingdom Tower',
            titleAr: 'برج المملكة',
            description: 'Start your day at Riyadh\'s iconic landmark with panoramic views',
            startTime: '09:00',
            endTime: '11:00',
            duration: 120,
            location: { name: 'Kingdom Tower', latitude: 24.7113, longitude: 46.6743 },
            price: 75
        },
        {
            id: 'fb-2',
            type: 'meal',
            title: 'Lunch at Bujairi Terrace',
            titleAr: 'غداء في تراس البجيري',
            description: 'Enjoy traditional Saudi cuisine with views of Diriyah',
            startTime: '12:30',
            endTime: '14:00',
            duration: 90,
            location: { name: 'Bujairi Terrace', latitude: 24.7342, longitude: 46.5731 },
            price: preferences.budget === 'luxury' ? 300 : 150
        },
        {
            id: 'fb-3',
            type: 'experience',
            title: 'At-Turaif Historical Tour',
            titleAr: 'جولة تاريخية في الطريف',
            description: 'Explore the UNESCO World Heritage site',
            startTime: '15:00',
            endTime: '17:30',
            duration: 150,
            location: { name: 'At-Turaif', latitude: 24.7336, longitude: 46.5729 },
            price: 95
        }
    ];

    return {
        id: `fallback-${Date.now()}`,
        title: 'Classic Riyadh Experience',
        titleAr: 'تجربة الرياض الكلاسيكية',
        summary: 'A curated journey through Riyadh\'s most iconic attractions',
        summaryAr: 'رحلة منسقة عبر أبرز معالم الرياض',
        days: [{
            day: 1,
            theme: 'Icons of Riyadh',
            themeAr: 'معالم الرياض',
            items: defaultItems,
            totalDuration: 360,
            totalCost: defaultItems.reduce((sum, item) => sum + (item.price || 0), 0)
        }],
        totalCost: defaultItems.reduce((sum, item) => sum + (item.price || 0), 0),
        highlights: [
            'Panoramic city views from Kingdom Tower',
            'UNESCO World Heritage site exploration',
            'Authentic Saudi culinary experience'
        ],
        tips: [
            'Dress modestly, especially when visiting historical sites',
            'Prayer times may affect opening hours - plan accordingly',
            'Carry water, especially in summer months'
        ],
        recommendedExperiences: []
    };
}

export async function refineItinerary(
    currentItinerary: GeneratedItinerary,
    feedback: string
): Promise<GeneratedItinerary> {
    const userMessage = `Current itinerary:
${JSON.stringify(currentItinerary, null, 2)}

User feedback: ${feedback}

Please modify the itinerary based on the feedback and return the updated JSON in the same format.`;

    try {
        const response = await ollamaChat({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            format: 'json',
            temperature: 0.7
        });

        return JSON.parse(response.message.content);
    } catch (error) {
        console.error('TripBuilder refinement error:', error);
        return currentItinerary;
    }
}
