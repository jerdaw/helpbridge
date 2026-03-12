import { type SearchResult } from "./types"
import { type SearchMode } from "./search-mode"

type SearchScope = "all" | "kingston" | "provincial"

interface VectorUpgradeOptions {
  query: string
  category?: string
  userLocation?: { lat: number; lng: number }
  openNow?: boolean
  isReady: boolean
  mode: SearchMode
  scope: SearchScope
  generateEmbedding: (text: string) => Promise<number[] | null>
  search: (
    query: string,
    options: {
      category?: string
      location?: { lat: number; lng: number }
      vectorOverride?: number[] | null
      openNow?: boolean
    }
  ) => Promise<SearchResult[]>
}

export function filterSearchResultsByScope(results: SearchResult[], scope: SearchScope): SearchResult[] {
  if (scope === "all") return results

  if (scope === "kingston") {
    return results.filter((result) => result.service.scope === "kingston" || !result.service.scope)
  }

  return results.filter((result) => result.service.scope === "ontario" || result.service.scope === "canada")
}

export async function enhanceSearchResults({
  query,
  category,
  userLocation,
  openNow,
  isReady,
  mode,
  scope,
  generateEmbedding,
  search,
}: VectorUpgradeOptions): Promise<SearchResult[] | null> {
  if (mode !== "local" || !isReady || query.trim().length === 0) {
    return null
  }

  const embedding = await generateEmbedding(query)
  if (!embedding) {
    return null
  }

  const enhancedResults = await search(query, {
    category,
    location: userLocation,
    vectorOverride: embedding,
    openNow,
  })

  return filterSearchResultsByScope(enhancedResults, scope)
}
