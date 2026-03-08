const DISALLOWED_PRIVACY_KEYS = new Set(["query", "query_text", "message", "user_text", "notes"])

function walk(value: unknown, path: string[] = [], found: string[] = []): string[] {
  if (!value || typeof value !== "object") {
    return found
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...path, String(index)], found))
    return found
  }

  const record = value as Record<string, unknown>
  for (const [key, nestedValue] of Object.entries(record)) {
    const nextPath = [...path, key]
    if (DISALLOWED_PRIVACY_KEYS.has(key.toLowerCase())) {
      found.push(nextPath.join("."))
    }
    walk(nestedValue, nextPath, found)
  }

  return found
}

export function findDisallowedPrivacyKeyPaths(payload: unknown): string[] {
  return walk(payload)
}
