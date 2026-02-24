// Vector Matching Engine for Experience Marketplace
// Uses cosine similarity for matching user preferences with guide profiles

import { generateEmbedding as ollamaGenerateEmbedding } from '../ollama';

export interface VectorEmbedding {
    vector: number[];
    dimensions: number;
}

export interface MatchResult {
    id: string;
    score: number;
    metadata?: Record<string, unknown>;
}

// Generate embeddings using Ollama
export async function generateEmbedding(text: string): Promise<VectorEmbedding> {
    try {
        const embedding = await ollamaGenerateEmbedding(text);

        return {
            vector: embedding,
            dimensions: embedding.length
        };
    } catch (error) {
        console.error('Embedding generation error:', error);
        // Fallback: generate a simple hash-based pseudo-embedding
        return generateFallbackEmbedding(text);
    }
}

// Cosine similarity calculation
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
}

// Euclidean distance (alternative metric)
export function euclideanDistance(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same dimensions');
    }

    let sum = 0;
    for (let i = 0; i < vecA.length; i++) {
        sum += Math.pow(vecA[i] - vecB[i], 2);
    }

    return Math.sqrt(sum);
}

// Find top K matches using cosine similarity
export function findTopMatches(
    queryVector: number[],
    candidates: { id: string; vector: number[]; metadata?: Record<string, unknown> }[],
    topK: number = 10.
): MatchResult[] {
    const results: MatchResult[] = candidates.map(candidate => ({
        id: candidate.id,
        score: cosineSimilarity(queryVector, candidate.vector),
        metadata: candidate.metadata
    }));

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
}

// Match user preferences to guide profiles
export async function matchGuidesToPreferences(
    userPreferences: {
        interests: string[];
        languages: string[];
        budget: string;
        groupType: string;
        specificNeeds?: string;
    },
    guideProfiles: {
        id: string;
        bioVector: string | null;
        specialties: string[];
        languages: string[];
        hourlyRate: number | null;
        certificationStatus: string;
    }[]
): Promise<MatchResult[]> {
    // Build user preference text for embedding
    const userText = `
    Looking for a guide with expertise in: ${userPreferences.interests.join(', ')}.
    Preferred languages: ${userPreferences.languages.join(', ')}.
    Budget level: ${userPreferences.budget}.
    Group type: ${userPreferences.groupType}.
    ${userPreferences.specificNeeds ? `Special requirements: ${userPreferences.specificNeeds}` : ''}
  `.trim();

    // Generate user embedding
    const userEmbedding = await generateEmbedding(userText);

    // Parse guide embeddings and score
    const candidatesWithVectors = guideProfiles
        .filter(g => g.bioVector)
        .map(guide => {
            try {
                const vector = JSON.parse(guide.bioVector!) as number[];
                return {
                    id: guide.id,
                    vector,
                    metadata: {
                        specialties: guide.specialties,
                        languages: guide.languages,
                        hourlyRate: guide.hourlyRate,
                        certificationStatus: guide.certificationStatus
                    }
                };
            } catch {
                return null;
            }
        })
        .filter((g): g is NonNullable<typeof g> => g !== null);

    // Find matches
    let matches = findTopMatches(userEmbedding.vector, candidatesWithVectors);

    // Apply boosting factors
    matches = matches.map(match => {
        let boostedScore = match.score;

        // Boost for matching languages
        const guideLanguages = (match.metadata?.languages as string[]) || [];
        const languageOverlap = userPreferences.languages.filter(l => guideLanguages.includes(l)).length;
        boostedScore += languageOverlap * 0.05;

        // Boost for certification
        if (match.metadata?.certificationStatus === 'CERTIFIED') {
            boostedScore += 0.1;
        }

        // Budget alignment (penalize if too expensive)
        const hourlyRate = match.metadata?.hourlyRate as number | undefined;
        if (hourlyRate) {
            const budgetThresholds: Record<string, number> = {
                economy: 100,
                standard: 250,
                premium: 500,
                luxury: 1000
            };
            const maxRate = budgetThresholds[userPreferences.budget] || 250;
            if (hourlyRate > maxRate) {
                boostedScore -= 0.15;
            }
        }

        return { ...match, score: Math.min(1, Math.max(0, boostedScore)) };
    });

    // Re-sort after boosting
    matches.sort((a, b) => b.score - a.score);

    return matches;
}

// Match user intent to experiences
export async function matchExperiencesToIntent(
    userIntent: string,
    experiences: {
        id: string;
        title: string;
        description: string;
        category: string;
        tags: string[];
        pricingTier: string;
        rating: number;
    }[],
    topK: number = 10
): Promise<MatchResult[]> {
    // Generate embedding for user intent
    const intentEmbedding = await generateEmbedding(userIntent);

    // Generate embeddings for experiences (or use cached)
    const experiencesWithVectors = await Promise.all(
        experiences.map(async (exp) => {
            const expText = `${exp.title}. ${exp.description}. Category: ${exp.category}. Tags: ${exp.tags.join(', ')}`;
            const embedding = await generateEmbedding(expText);
            return {
                id: exp.id,
                vector: embedding.vector,
                metadata: {
                    title: exp.title,
                    category: exp.category,
                    pricingTier: exp.pricingTier,
                    rating: exp.rating
                }
            };
        })
    );

    // Find matches
    let matches = findTopMatches(intentEmbedding.vector, experiencesWithVectors, topK);

    // Apply rating boost
    matches = matches.map(match => {
        const rating = (match.metadata?.rating as number) || 0;
        const ratingBoost = (rating / 5) * 0.1;
        return { ...match, score: Math.min(1, match.score + ratingBoost) };
    });

    matches.sort((a, b) => b.score - a.score);

    return matches;
}

// Generate guide bio embedding and store
export async function generateGuideEmbedding(
    bio: string,
    specialties: string[],
    languages: string[]
): Promise<string> {
    const fullText = `${bio}. Specialties: ${specialties.join(', ')}. Languages: ${languages.join(', ')}`;
    const embedding = await generateEmbedding(fullText);
    return JSON.stringify(embedding.vector);
}

// Fallback embedding generation (deterministic hash-based)
function generateFallbackEmbedding(text: string): VectorEmbedding {
    const DIMENSIONS = 384; // Standard small embedding size
    const vector = new Array(DIMENSIONS).fill(0);

    // Simple hash-based pseudo-embedding
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        for (let j = 0; j < word.length; j++) {
            const idx = (word.charCodeAt(j) * (i + 1) * (j + 1)) % DIMENSIONS;
            vector[idx] += 1 / (i + 1);
        }
    }

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (magnitude > 0) {
        for (let i = 0; i < vector.length; i++) {
            vector[i] /= magnitude;
        }
    }

    return { vector, dimensions: DIMENSIONS };
}
