import { describe, it, expect } from "vitest"
import { findDisallowedPrivacyKeyPaths } from "@/lib/schemas/privacy-guards"

describe("privacy-guards", () => {
  it("finds disallowed keys at top level", () => {
    const result = findDisallowedPrivacyKeyPaths({
      query_text: "need shelter",
      pilot_cycle_id: "v22-cycle-1",
    })

    expect(result).toContain("query_text")
  })

  it("finds disallowed keys in nested objects and arrays", () => {
    const result = findDisallowedPrivacyKeyPaths({
      context: {
        details: {
          notes: "private text",
        },
      },
      events: [{ message: "do not store this" }],
    })

    expect(result).toContain("context.details.notes")
    expect(result).toContain("events.0.message")
  })

  it("returns an empty array when no disallowed keys exist", () => {
    const result = findDisallowedPrivacyKeyPaths({
      pilot_cycle_id: "v22-cycle-1",
      referral_state: "initiated",
    })

    expect(result).toEqual([])
  })
})
