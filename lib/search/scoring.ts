import { ScoringWeights } from './types';
import { Service } from '@/types/service';
import { normalize } from './utils';

export const WEIGHTS: ScoringWeights = {
    vector: 100, // Semantic match is the gold standard
    syntheticQuery: 50,
    name: 30,
    identityTag: 20,
    description: 10,
};

/**
 * Calculates a match score for a single service against a normalized query tokens.
 */
export const scoreServiceKeyword = (service: Service, tokens: string[]): { score: number, reasons: string[] } => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Check Synthetic Queries (High Impact) - Currently English Only
    if (service.synthetic_queries) {
        for (const query of service.synthetic_queries) {
            const queryText = normalize(query);
            let queryMatches = 0;

            for (const token of tokens) {
                if (queryText.includes(token)) {
                    queryMatches++;
                }
            }

            if (queryMatches > 0) {
                const points = WEIGHTS.syntheticQuery * queryMatches;
                score += points;
                matchReasons.push(`Matched intent: "${query}" (+${points})`);
                break;
            }
        }
    }

    // 2. Check Name (Medium Impact) - English & French
    const nameText = normalize(service.name);
    const nameFrText = service.name_fr ? normalize(service.name_fr) : '';

    for (const token of tokens) {
        if (nameText.includes(token)) {
            score += WEIGHTS.name;
            matchReasons.push(`Matched name: "${service.name}" (+${WEIGHTS.name})`);
        } else if (nameFrText && nameFrText.includes(token)) {
            score += WEIGHTS.name;
            matchReasons.push(`Matched name (FR): "${service.name_fr}" (+${WEIGHTS.name})`);
        }
    }

    // 3. Check Identity Tags (Boost)
    if (service.identity_tags) {
        for (const identity of service.identity_tags) {
            const tagText = normalize(identity.tag);
            for (const token of tokens) {
                if (tagText.includes(token)) {
                    score += WEIGHTS.identityTag;
                    matchReasons.push(`Matched tag: "${identity.tag}" (+${WEIGHTS.identityTag})`);
                }
            }
        }
    }

    // 4. Check Description (Low Impact / Catch-all) - English & French
    const descText = normalize(service.description);
    const descFrText = service.description_fr ? normalize(service.description_fr) : '';
    let descScore = 0;

    for (const token of tokens) {
        if (descText.includes(token)) {
            descScore += WEIGHTS.description;
        } else if (descFrText && descFrText.includes(token)) {
            descScore += WEIGHTS.description;
        }
    }

    if (descScore > 0) {
        score += descScore;
        matchReasons.push(`Matched description (+${descScore})`);
    }

    return { score, reasons: matchReasons };
};
