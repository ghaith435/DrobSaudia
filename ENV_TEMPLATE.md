# Environment Variables Template for Riyadh Guide

Copy this file to `.env` and fill in the values.

## Database Configuration
```env
# PostgreSQL connection string (Prisma 7 format)
DATABASE_URL="postgresql://username:password@localhost:5432/riyadh_guide?sslmode=require"
```

## Authentication (NextAuth.js v5)
```env
# Generate with: npx auth secret
AUTH_SECRET="your-32-character-or-longer-secret-key"

# Google OAuth (https://console.cloud.google.com/)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Optional: Trusted host for production
AUTH_TRUST_HOST=true
```

## AI Services
```env
# Google Gemini API (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key"

# Ollama Local AI with GLM-4.7-Flash
# Model: unsloth/GLM-4.7-Flash-GGUF (30B-A3B MoE)
# https://huggingface.co/unsloth/GLM-4.7-Flash-GGUF
#
# Setup:
#   1. Install Ollama: curl -fsSL https://ollama.com/install.sh | sh
#   2. Run setup script: ./scripts/setup-glm.sh
#   OR manually: ollama pull hf.co/unsloth/GLM-4.7-Flash-GGUF:Q4_K_M
#
# Available quantizations:
#   - Q2_K:   ~2.5GB (Fastest, lower quality)
#   - Q4_K_M: ~4.5GB (Recommended)
#   - Q5_K_M: ~5.5GB (Higher quality)
#   - Q8_0:   ~8GB   (Highest quality)
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="glm-4.7-flash"

# Piper TTS for Voice Assistant (https://github.com/rhasspy/piper)
# Optional: Local TTS server for offline voice generation
PIPER_TTS_URL="http://localhost:5000"
```

## Google Maps
```env
# Google Maps JavaScript API (https://console.cloud.google.com/)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

## Application URLs
```env
# Base URL for the application
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"

# API URL (same as base URL for Next.js)
NEXT_PUBLIC_API_URL="https://your-domain.vercel.app/api"
```

## Vercel-specific (set in Vercel Dashboard)
```env
# These are automatically set by Vercel
VERCEL_URL="automatically-set"
VERCEL_ENV="production"
```

## Optional: Image Storage
```env
# Cloudinary (https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Or AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="your-bucket-name"
AWS_REGION="us-east-1"
```

## Optional: Push Notifications
```env
# Firebase Cloud Messaging
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="your-private-key"
```

---

## Vercel Deployment Steps

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Add environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add AUTH_SECRET
   vercel env add GEMINI_API_KEY
   # ... add all required variables
   ```

5. Deploy:
   ```bash
   vercel --prod
   ```

## Database Setup (Vercel Postgres)

1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the connection string to `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma db push
   ```
