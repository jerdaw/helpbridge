import { describe, it, expect } from "vitest"
import { IntegrationFeasibilityDecisionSchema } from "@/lib/schemas/integration-feasibility"

describe("integration-feasibility schema", () => {
  it("accepts a valid go decision with no violations", () => {
    const result = IntegrationFeasibilityDecisionSchema.safeParse({
      decision: "go",
      decision_date: "2026-03-08",
      redline_checklist_version: "v1",
      violations: [],
      compensating_controls: [],
      owners: ["jer"],
    })

    expect(result.success).toBe(true)
  })

  it("rejects go decision when violations are present", () => {
    const result = IntegrationFeasibilityDecisionSchema.safeParse({
      decision: "go",
      decision_date: "2026-03-08",
      redline_checklist_version: "v1",
      violations: ["raw_query_text_required"],
      compensating_controls: [],
      owners: ["jer"],
    })

    expect(result.success).toBe(false)
  })

  it("rejects conditional decision with no compensating controls", () => {
    const result = IntegrationFeasibilityDecisionSchema.safeParse({
      decision: "conditional",
      decision_date: "2026-03-08",
      redline_checklist_version: "v1",
      violations: ["retention_policy_conflict"],
      compensating_controls: [],
      owners: ["jer"],
    })

    expect(result.success).toBe(false)
  })

  it("accepts blocked decision with violations", () => {
    const result = IntegrationFeasibilityDecisionSchema.safeParse({
      decision: "blocked",
      decision_date: "2026-03-08",
      redline_checklist_version: "v1",
      violations: ["forced_user_identifying_telemetry"],
      compensating_controls: [],
      owners: ["jer"],
    })

    expect(result.success).toBe(true)
  })
})
