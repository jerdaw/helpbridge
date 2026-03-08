import { describe, it, expect } from "vitest"
import {
  PilotContactAttemptCreateSchema,
  PilotReferralCreateSchema,
  PilotReferralUpdateSchema,
} from "@/lib/schemas/pilot-events"

describe("pilot-events schema", () => {
  it("accepts a valid contact attempt payload", () => {
    const result = PilotContactAttemptCreateSchema.safeParse({
      pilot_cycle_id: "v22-cycle-1",
      service_id: "kingston-food-bank",
      recorded_by_org_id: "3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e",
      attempt_channel: "phone",
      attempt_outcome: "connected",
      attempted_at: "2026-03-08T15:00:00.000Z",
    })

    expect(result.success).toBe(true)
  })

  it("rejects contact payload with disallowed privacy field", () => {
    const result = PilotContactAttemptCreateSchema.safeParse({
      pilot_cycle_id: "v22-cycle-1",
      service_id: "kingston-food-bank",
      recorded_by_org_id: "3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e",
      attempt_channel: "phone",
      attempt_outcome: "connected",
      attempted_at: "2026-03-08T15:00:00.000Z",
      query_text: "i need food",
    })

    expect(result.success).toBe(false)
  })

  it("accepts a valid referral create payload", () => {
    const result = PilotReferralCreateSchema.safeParse({
      pilot_cycle_id: "v22-cycle-1",
      source_org_id: "3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e",
      target_service_id: "kingston-housing-help",
      referral_state: "initiated",
      created_at: "2026-03-08T15:00:00.000Z",
      updated_at: "2026-03-08T15:00:00.000Z",
    })

    expect(result.success).toBe(true)
  })

  it("rejects terminal referral state update without terminal_at", () => {
    const result = PilotReferralUpdateSchema.safeParse({
      source_org_id: "3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e",
      referral_state: "failed",
      updated_at: "2026-03-08T15:00:00.000Z",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "terminal_at")).toBe(true)
    }
  })

  it("rejects initiated referral update with failure_reason_code", () => {
    const result = PilotReferralUpdateSchema.safeParse({
      source_org_id: "3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e",
      referral_state: "initiated",
      updated_at: "2026-03-08T15:00:00.000Z",
      failure_reason_code: "no_response",
    })

    expect(result.success).toBe(false)
  })
})
