/**
 * Cosine similarity between two vectors.
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i]! * vecB[i]!;
        normA += vecA[i]! * vecA[i]!;
        normB += vecB[i]! * vecB[i]!;
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Fetches query embedding from the API.
 */
export const fetchQueryEmbedding = async (query: string): Promise<number[] | null> => {
    try {
        const res = await fetch('/api/search/embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!res.ok) return null;

        const data = await res.json() as { embedding: number[] };
        return data.embedding;
    } catch (e) {
        console.warn("Vector embedding fetch failed", e);
        return null; // Fallback to keyword only
    }
};
