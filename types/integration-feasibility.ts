export const INTEGRATION_DECISIONS = ["go", "conditional", "blocked"] as const
export type IntegrationDecision = (typeof INTEGRATION_DECISIONS)[number]

export const INTEGRATION_VIOLATION_CODES = [
  "raw_query_text_required",
  "forced_user_identifying_telemetry",
  "reidentification_capability_required",
  "retention_policy_conflict",
  "auditability_gap",
] as const
export type IntegrationViolationCode = (typeof INTEGRATION_VIOLATION_CODES)[number]

export interface IntegrationFeasibilityDecision {
  decision: IntegrationDecision
  decision_date: string
  redline_checklist_version: string
  violations: IntegrationViolationCode[]
  compensating_controls: string[]
  owners: string[]
}
