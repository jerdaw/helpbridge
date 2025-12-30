import { VerificationLevel } from '@/types/service';
import { SearchResult, SearchOptions } from './types';
import { loadServices } from './data';
import { tokenize } from './utils';
import { scoreServiceKeyword, WEIGHTS } from './scoring';
import { fetchQueryEmbedding, cosineSimilarity } from './vector';
import { resortByDistance, calculateDistanceKm } from './geo';

/**
 * Main Hybrid Search Function (Optimized for Cost)
 * Strategy: "Lazy Semantic"
 * 1. Fast Keyword Search first (Free).
 * 2. If good matches found (> threshold), return immediately. Saves API cost.
 * 3. Only fetch Vector (Paid) if keywords fail to find relevant results.
 */
export const searchServices = async (query: string, options: SearchOptions = {}): Promise<SearchResult[]> => {
    const services = await loadServices();
    const tokens = tokenize(query);

    // Category Filter (Hard filter)
    const filteredServices = options.category
        ? services.filter(s => s.intent_category === options.category)
        : services;

    // Special Case: Empty Query but Category/Location selected
    if (query.trim().length === 0) {
        if (options.category || options.location) {
            // Return everything matching filter
            let results = filteredServices.map(service => ({
                service,
                score: 1,
                matchReasons: ['Filter Match']
            }));

            // Sort by Distance if available
            if (options.location) {
                results = results.map(r => {
                    if (r.service.coordinates) {
                        const dist = calculateDistanceKm(
                            options.location!.lat, options.location!.lng,
                            r.service.coordinates.lat, r.service.coordinates.lng
                        );
                        return { ...r, distance: dist };
                    }
                    return { ...r, distance: Infinity };
                }).sort((a, b) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const distA = (a as any).distance ?? Infinity;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const distB = (b as any).distance ?? Infinity;
                    return distA - distB;
                });
            }
            return results;
        }
        return [];
    }

    if (tokens.length === 0) return [];

    // 1. First Pass: Keyword Only (Zero Cost)
    const results: SearchResult[] = [];

    for (const service of filteredServices) {
        if (service.verification_level === VerificationLevel.L0) continue;

        const keywordResult = scoreServiceKeyword(service, tokens);
        if (keywordResult.score > 0) {
            results.push({ service, score: keywordResult.score, matchReasons: keywordResult.reasons });
        }
    }

    // Sort by Keyword Score
    results.sort((a, b) => b.score - a.score);

    let queryVector: number[] | null = options.vectorOverride || null;

    // 2. Cost Optimization Check (Only if no override provided)
    if (!options.vectorOverride) {
        // 30 points = Name Match. 50 points = Intent Match.
        const KEYWORD_CONFIDENCE_THRESHOLD = 40;
        const bestScore = results.length > 0 ? results[0]!.score : 0;

        if (bestScore >= KEYWORD_CONFIDENCE_THRESHOLD) {
            // High confidence! Skip expensive vector search.
            // Apply Geo Sort if needed
            if (options.location) {
                return resortByDistance(results, options.location);
            }
            return results;
        }

        // 3. Low Confidence? Pay for Vector Search (Semantic Fallback)
        queryVector = await fetchQueryEmbedding(query);
    }

    if (!queryVector) {
        return options.location ? resortByDistance(results, options.location) : results; // Fallback
    }

    // We need to re-score or add semantic matches that weren't found by keywords
    const resultsMap = new Map<string, SearchResult>();
    results.forEach(r => resultsMap.set(r.service.id, r));

    for (const service of filteredServices) {
        if (service.verification_level === VerificationLevel.L0) continue;

        // Use embedding from DB (on service object) OR fallback to local JSON
        // Note: data.ts doesn't export fallbackEmbeddings yet, let's fix that or import directly
        const serviceVector = service.embedding; // data.ts already overlays these
        if (!serviceVector) continue;

        const similarity = cosineSimilarity(queryVector, serviceVector);

        // Semantic Threshold
        if (similarity > 0.01) {
            const vectorPoints = similarity * WEIGHTS.vector;

            if (vectorPoints > 0) {
                const existing = resultsMap.get(service.id);

                if (existing) {
                    // Boost existing result
                    existing.score += vectorPoints;
                    if (vectorPoints > 30) {
                        existing.matchReasons.push(`Semantic Boost (${Math.round(similarity * 100)}%)`);
                    }
                } else {
                    // New Semantic-only result
                    if (vectorPoints > 25) {
                        resultsMap.set(service.id, {
                            service,
                            score: vectorPoints,
                            matchReasons: [`Semantic Rescue (${Math.round(similarity * 100)}%)`]
                        });
                    }
                }
            }
        }
    }

    // Convert back to array
    let finalResults = Array.from(resultsMap.values());

    // Sort
    if (options.location) {
        finalResults = resortByDistance(finalResults, options.location);
    } else {
        finalResults.sort((a, b) => b.score - a.score);
    }

    return finalResults;
};
