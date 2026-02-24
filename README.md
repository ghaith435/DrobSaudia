# 🏙️ Riyadh Tourism Platform

A premium, full-stack tourism platform for Riyadh, Saudi Arabia. Built with Next.js 16, React Native/Expo, and a comprehensive set of AI-powered features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

### 🌐 Web Application
- **Premium Dark Theme** with Glassmorphism design
- **Google Maps Integration** with custom markers
- **AI Audio Guides** - 15+ languages with natural TTS
- **AI Trip Planner** - Personalized itineraries
- **AI Review Analysis** - Sentiment and insights
- **Pre-defined Tours** - 4 themed guided tours
- **Rewards & Gamification** - XP, badges, leaderboard
- **Partner Wallet** - Points to discounts conversion
- **Crowd Level Estimation** - Real-time predictions
- **Time Machine AR** - Historical before/after views
- **Events & Seasons** - Riyadh Season integration
- **Admin Dashboard** - Full management system

### 📱 Mobile Application
- **React Native + Expo** setup
- **Bottom Tab Navigation** - 5 main screens
- **Place Details** with Similar Places
- **Interactive Comparison** - Compare attractions
- **Favorites Management**
- **User Profile** with stats and settings

### 🛠️ Backend
- **PostgreSQL** with Prisma ORM 7
- **NextAuth.js v5** authentication
- **RESTful API** routes
- **Gemini AI** integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Maps API key
- Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd riyadh-guide-web

# Install dependencies
npm install

# Set up environment variables
cp ENV_TEMPLATE.md .env.local
# Edit .env.local with your credentials

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/riyadh_guide"

# Authentication
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-oauth-id"
AUTH_GOOGLE_SECRET="your-google-oauth-secret"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
```

## 📁 Project Structure

```
riyadh-guide-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── audio-guide/ # AI audio generation
│   │   │   ├── places/      # Places CRUD
│   │   │   ├── reviews/     # Reviews & analysis
│   │   │   └── trip-planner/# AI itinerary generation
│   │   ├── admin/           # Admin dashboard
│   │   ├── auth/            # Authentication pages
│   │   ├── events/          # Events listing
│   │   ├── place/[id]/      # Place details
│   │   ├── places/          # Places listing
│   │   ├── planner/         # AI trip planner
│   │   ├── rewards/         # Gamification hub
│   │   └── tours/           # Guided tours
│   ├── components/          # React components
│   │   ├── AudioGuide.tsx   # TTS audio player
│   │   ├── CrowdIndicator.tsx
│   │   ├── InfoCard.tsx     # Rich place details
│   │   ├── MapView.tsx      # Google Maps
│   │   ├── ReviewsSection.tsx
│   │   └── TimeMachine.tsx  # Historical AR
│   ├── data/                # Static data
│   │   ├── badges.ts        # Gamification badges
│   │   ├── events.ts        # Events data
│   │   ├── places.ts        # Places data
│   │   └── tours.ts         # Tours data
│   ├── hooks/               # Custom React hooks
│   │   ├── useGeolocation.ts
│   │   └── useTextToSpeech.ts
│   └── lib/                 # Utilities
│       ├── gemini.ts        # AI integration
│       └── prisma.ts        # Database client
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## 🗺️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/places` | GET, POST | List/Create places |
| `/api/places/[id]` | GET, PUT, DELETE | Place CRUD |
| `/api/places/google` | GET | Google Places proxy |
| `/api/categories` | GET, POST | Categories |
| `/api/favorites` | GET, POST, DELETE | User favorites |
| `/api/reviews` | GET, POST | Reviews |
| `/api/reviews/analysis` | GET | AI review analysis |
| `/api/audio-guide` | GET | AI audio guide script |
| `/api/trip-planner` | POST | AI trip suggestions |

## 🎨 Design System

### Colors
- **Background**: `#0a0a0f` (Deep black)
- **Surface**: `#0f172a` (Dark slate)
- **Accent Gold**: `#d9b063` (Riyadh gold)
- **Text Primary**: `#f8fafc` (Off-white)
- **Text Secondary**: `#94a3b8` (Muted gray)

### Typography
- **English**: Outfit (300-800)
- **Arabic**: Tajawal (400-700)

### Components
- Glassmorphism cards with blur effects
- Gold accent highlights
- Smooth spring animations
- RTL support for Arabic

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Docker

```dockerfile
# Build
docker build -t riyadh-guide .

# Run
docker run -p 3000:3000 riyadh-guide
```

## 📱 Mobile App Setup

```bash
cd riyadh-guide-mobile

# Install dependencies
npm install

# Start Expo
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## 🏆 Gamification System

### XP Levels
1. **Newcomer** (0-99 XP)
2. **Explorer** (100-299 XP)
3. **Adventurer** (300-599 XP)
4. **Discoverer** (600-999 XP)
5. **Expert** (1000-1999 XP)
6. **Master** (2000-4999 XP)
7. **Ambassador** (5000+ XP)

### Badge Categories
- 🏛️ History & Heritage
- 🌿 Nature & Gardens
- 🛍️ Shopping
- 🎭 Entertainment
- 🍽️ Dining
- ⭐ Special Achievements

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Team

Built with ❤️ for Riyadh tourism.

---

**Last Updated**: January 2026
