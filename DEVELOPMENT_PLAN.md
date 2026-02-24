# 📋 خطة التطوير الشاملة - منصة سياحة السعودية الذكية
## Smart Saudi Tourism Platform - Development Plan

---

## 🎯 نظرة عامة | Overview

منصة سياحية ذكية للمملكة العربية السعودية مع تركيز خاص على **الدرعية التاريخية**، تستخدم نظام مساعد صوتي تفاعلي وخرائط متقدمة مع تقنيات AI حديثة.

---

## ✅ المهام المكتملة | Completed Tasks

### المرحلة 1: البنية الأساسية ✅
- [x] إعداد مشروع Next.js 16.1 مع TypeScript
- [x] تكوين Prisma مع PostgreSQL
- [x] إعداد نظام المصادقة (NextAuth.js)
- [x] إنشاء نظام الأدوار والصلاحيات
- [x] إنشاء واجهة ثنائية اللغة (العربية/الإنجليزية)
- [x] دعم RTL للعربية
- [x] صفحة رئيسية محسّنة مع تصميم احترافي
- [x] نظام التسجيل مع الحقول الجديدة
- [x] صفحة الطلبات والمقترحات
- [x] مكونات الحماية (ProtectedRoute)

---

## 🗺️ المرحلة 2: الخرائط والمسارات

### 2.1 Google Maps Integration
```typescript
// src/lib/maps/google-maps.ts
interface MapConfig {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  language: 'ar' | 'en';
}

// الإحداثيات الأساسية للدرعية
const DIRIYAH_COORDS = {
  center: { lat: 24.7347, lng: 46.5769 },
  attractions: [
    { name: 'حي الطريف', lat: 24.7344, lng: 46.5777 },
    { name: 'البجيري', lat: 24.7356, lng: 46.5752 },
    { name: 'متحف الدرعية', lat: 24.7339, lng: 46.5762 },
    { name: 'سوق الدرعية', lat: 24.7351, lng: 46.5745 },
  ]
};
```

### 2.2 نظام التوجيه الذكي
```typescript
// أنواع المستخدمين
type UserType = 'driver' | 'pedestrian' | 'wheelchair';

interface RouteOptions {
  userType: UserType;
  avoidStairs: boolean;
  preferShaded: boolean;
  includeRestStops: boolean;
}
```

### 2.3 ملفات الخرائط المطلوبة
```
src/
├── lib/
│   └── maps/
│       ├── google-maps.ts      # تكامل Google Maps
│       ├── routing.ts          # محرك التوجيه
│       └── accessibility.ts    # مسارات ذوي الاحتياجات
├── components/
│   └── maps/
│       ├── MapView.tsx         # عرض الخريطة
│       ├── RouteSelector.tsx   # اختيار المسار
│       └── LocationMarker.tsx  # علامات المواقع
└── hooks/
    ├── useGeolocation.ts       # تتبع الموقع
    └── useRoute.ts             # حساب المسار
```

---

## 🎧 المرحلة 3: المعالجة الصوتية

### 3.1 Speech-to-Text (Whisper API)
```typescript
// src/lib/speech/whisper.ts
interface WhisperConfig {
  apiKey: string;
  model: 'whisper-1';
  language: 'ar' | 'en';
}

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'ar');
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  });
  
  return (await response.json()).text;
}
```

### 3.2 Text-to-Speech (ElevenLabs)
```typescript
// src/lib/speech/elevenlabs.ts
interface TTSConfig {
  voiceId: string;        // صوت عربي طبيعي
  modelId: 'eleven_multilingual_v2';
  stability: 0.5;
  similarityBoost: 0.75;
}

async function generateSpeech(text: string, locale: 'ar' | 'en'): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    }),
  });
  
  return response.arrayBuffer();
}
```

### 3.3 ملفات المعالجة الصوتية
```
src/
├── lib/
│   └── speech/
│       ├── whisper.ts          # تحويل الصوت لنص
│       ├── elevenlabs.ts       # تحويل النص لصوت
│       └── voice-commands.ts   # أوامر صوتية
├── components/
│   └── audio/
│       ├── VoiceAssistant.tsx  # المساعد الصوتي
│       ├── AudioPlayer.tsx     # مشغل الصوت
│       └── VoiceRecorder.tsx   # تسجيل الصوت
└── hooks/
    ├── useSpeechRecognition.ts
    └── useAudioPlayer.ts
```

---

## 🤖 المرحلة 4: الذكاء الاصطناعي المكاني

### 4.1 GPT-4 Integration
```typescript
// src/lib/ai/spatial-ai.ts
interface SpatialAIConfig {
  model: 'gpt-4o' | 'claude-3.5-sonnet';
  systemPrompt: string;
}

const SPATIAL_AI_PROMPT = `
أنت مرشد سياحي خبير في المملكة العربية السعودية، متخصص في الدرعية التاريخية.
عند إعطائك إحداثيات GPS، قدم:
1. معلومات تاريخية عن الموقع
2. أهمية الموقع الثقافية
3. نصائح للزيارة
4. المعالم القريبة
اللغة: العربية الفصحى مع لمسة محلية
`;

async function getLocationInfo(
  coords: { lat: number; lng: number },
  userLanguage: 'ar' | 'en'
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SPATIAL_AI_PROMPT },
      { role: 'user', content: `الإحداثيات: ${coords.lat}, ${coords.lng}` }
    ],
  });
  
  return response.choices[0].message.content;
}
```

### 4.2 MCP Protocol Integration
```typescript
// src/lib/mcp/index.ts
interface MCPServer {
  name: string;
  endpoint: string;
  capabilities: string[];
}

const MCP_SERVERS = {
  googleMaps: {
    name: 'Google Maps MCP',
    endpoint: 'mcp://maps.google.com',
    capabilities: ['coordinates', 'routes', 'places']
  },
  accessibility: {
    name: 'Accessibility MCP',
    endpoint: 'mcp://wheelmap.org',
    capabilities: ['wheelchair_routes', 'accessible_places']
  },
  tourism: {
    name: 'Saudi Tourism MCP',
    endpoint: 'mcp://tourism.sa',
    capabilities: ['attractions', 'events', 'bookings']
  }
};
```

---

## 📁 هيكل الملفات الجديد | New File Structure

```
src/
├── app/
│   ├── page.tsx                   ✅ الصفحة الرئيسية
│   ├── auth/                      ✅ صفحات المصادقة
│   ├── requests/                  ✅ صفحة الطلبات
│   ├── places/                    ✅ الأماكن
│   ├── tours/                     ✅ الجولات
│   ├── diriyah/                   ⏳ الدرعية
│   │   ├── page.tsx              
│   │   ├── [attraction]/page.tsx
│   │   └── map/page.tsx
│   └── api/
│       ├── ai/
│       │   ├── spatial/route.ts   ⏳ AI المكاني
│       │   └── planner/route.ts   ⏳ مخطط الرحلات
│       ├── speech/
│       │   ├── transcribe/route.ts ⏳ تحويل الصوت
│       │   └── synthesize/route.ts ⏳ توليد الصوت
│       └── maps/
│           ├── routes/route.ts    ⏳ المسارات
│           └── places/route.ts    ⏳ الأماكن
├── lib/
│   ├── ai/
│   │   ├── openai.ts             ⏳ تكامل OpenAI
│   │   └── spatial-ai.ts         ⏳ AI المكاني
│   ├── speech/
│   │   ├── whisper.ts            ⏳ Whisper API
│   │   └── elevenlabs.ts         ⏳ ElevenLabs
│   ├── maps/
│   │   ├── google-maps.ts        ⏳ Google Maps
│   │   └── routing.ts            ⏳ التوجيه
│   └── mcp/
│       └── index.ts              ⏳ MCP Protocol
├── components/
│   ├── ai/
│   │   ├── VoiceAssistant.tsx    ⏳ المساعد الصوتي
│   │   └── AIGuide.tsx           ⏳ الدليل الذكي
│   └── maps/
│       ├── InteractiveMap.tsx    ⏳ الخريطة التفاعلية
│       └── RouteSelector.tsx     ⏳ اختيار المسار
└── data/
    └── diriyah.ts                ⏳ بيانات الدرعية
```

---

## 🔑 المتغيرات البيئية المطلوبة | Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI (للذكاء الاصطناعي)
OPENAI_API_KEY="sk-..."

# ElevenLabs (للصوت)
ELEVENLABS_API_KEY="..."

# Google Maps
GOOGLE_MAPS_API_KEY="..."
```

---

## 🚀 خطوات التنفيذ التالية | Next Steps

### الأولوية العالية
1. [ ] إنشاء صفحة الدرعية التفاعلية
2. [ ] تكامل Google Maps API
3. [ ] إنشاء نظام المسارات الذكية
4. [ ] تكامل OpenAI للدليل الذكي

### الأولوية المتوسطة
5. [ ] تكامل Whisper API
6. [ ] تكامل ElevenLabs TTS
7. [ ] إنشاء المساعد الصوتي

### الأولوية المنخفضة
8. [ ] دعم ذوي الاحتياجات الخاصة
9. [ ] MCP Protocol Integration
10. [ ] تحسين الأداء

---

## 📅 معلومات التحديث

- **تاريخ الإنشاء**: 2026-01-17
- **آخر تحديث**: 2026-01-17
- **الحالة**: قيد التطوير
- **المرحلة**: 2/4

---

*👤 فريق التطوير: منصة سياحة السعودية*
