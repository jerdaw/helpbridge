import { describe, it, expect } from "vitest"
import { getSuggestion, DICTIONARY } from "@/lib/search/fuzzy"

describe("Fuzzy - Spell Correction", () => {
  describe("getSuggestion", () => {
    it("should correct common typos - housing", () => {
      const suggestion = getSuggestion("houssing")
      expect(suggestion).toBe("housing")
    })

    it("should correct common typos - shelter", () => {
      const suggestion = getSuggestion("sheleter")
      expect(suggestion).toBe("shelter")
    })

    it("should correct common typos - emergency", () => {
      const suggestion = getSuggestion("emergancy")
      expect(suggestion).toBe("emergency")
    })

    it("should correct common typos - addiction", () => {
      const suggestion = getSuggestion("addction")
      expect(suggestion).toBe("addiction")
    })

    it("should correct common typos - suicide", () => {
      const suggestion = getSuggestion("suicde")
      expect(suggestion).toBe("suicide")
    })

    it("should correct common typos - prescription", () => {
      // "prescripton" is 1 edit away (missing 'i')
      const suggestion = getSuggestion("prescripton")
      expect(suggestion).toBe("prescription")
    })

    it("should return null for correctly spelled words", () => {
      const suggestion = getSuggestion("food")
      expect(suggestion).toBeNull()
    })

    it("should return null for exact dictionary match - housing", () => {
      const suggestion = getSuggestion("housing")
      expect(suggestion).toBeNull()
    })

    it("should return null for exact dictionary match - kingscourt", () => {
      const suggestion = getSuggestion("kingscourt")
      expect(suggestion).toBeNull()
    })

    it("should return null for null input", () => {
      const suggestion = getSuggestion(null as unknown as string)
      expect(suggestion).toBeNull()
    })

    it("should return null for empty string", () => {
      const suggestion = getSuggestion("")
      expect(suggestion).toBeNull()
    })

    it("should return null for very short queries (<3 chars)", () => {
      const suggestion = getSuggestion("ab")
      expect(suggestion).toBeNull()
    })

    it("should return null for numeric words", () => {
      const suggestion = getSuggestion("123")
      expect(suggestion).toBeNull()
    })

    it("should return null for words too far from dictionary (edit distance >2)", () => {
      const suggestion = getSuggestion("xyzzy")
      expect(suggestion).toBeNull()
    })

    it("should handle multi-word queries - first word corrected", () => {
      const suggestion = getSuggestion("houssing help")
      expect(suggestion).toBe("housing help")
    })

    it("should handle multi-word queries - second word corrected", () => {
      const suggestion = getSuggestion("food sheleter")
      expect(suggestion).toBe("food shelter")
    })

    it("should handle multi-word queries - both correct", () => {
      const suggestion = getSuggestion("help me")
      // Either null (all correct) or unchanged
      expect(suggestion === null || suggestion === "help me").toBe(true)
    })

    it("should be case insensitive for typos", () => {
      const suggestion = getSuggestion("HOUSSING")
      expect(suggestion).toBe("housing")
    })

    it("should be case insensitive for correct words", () => {
      const suggestion = getSuggestion("Housing")
      expect(suggestion).toBeNull()
    })

    it("should preserve numeric words in multi-word queries", () => {
      const suggestion = getSuggestion("houssing 123")
      expect(suggestion).toBe("housing 123")
    })

    it("should correct multiple typos in query", () => {
      const suggestion = getSuggestion("houssing sheleter")
      expect(suggestion).toBe("housing shelter")
    })
  })

  describe("DICTIONARY", () => {
    it("should contain common service-related terms", () => {
      expect(DICTIONARY).toContain("food")
      expect(DICTIONARY).toContain("housing")
      expect(DICTIONARY).toContain("shelter")
      expect(DICTIONARY).toContain("emergency")
      expect(DICTIONARY).toContain("health")
    })

    it("should contain crisis-related terms", () => {
      expect(DICTIONARY).toContain("suicide")
      expect(DICTIONARY).toContain("crisis")
      expect(DICTIONARY).toContain("addiction")
    })

    it("should contain location-specific terms", () => {
      expect(DICTIONARY).toContain("kingscourt")
      expect(DICTIONARY).toContain("downtown")
      expect(DICTIONARY).toContain("cataraqui")
    })
  })
})
