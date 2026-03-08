import { z } from "zod"
import { INTEGRATION_DECISIONS, INTEGRATION_VIOLATION_CODES } from "@/types/integration-feasibility"
import { findDisallowedPrivacyKeyPaths } from "@/lib/schemas/privacy-guards"

const IntegrationDecisionEnum = z.enum(INTEGRATION_DECISIONS)
const IntegrationViolationCodeEnum = z.enum(INTEGRATION_VIOLATION_CODES)

export const IntegrationFeasibilityDecisionSchema = z
  .object({
    decision: IntegrationDecisionEnum,
    decision_date: z.string().date(),
    redline_checklist_version: z.string().min(1).max(50),
    violations: z.array(IntegrationViolationCodeEnum),
    compensating_controls: z.array(z.string().min(1).max(500)),
    owners: z.array(z.string().min(1).max(120)).min(1),
  })
  .strict()
  .superRefine((value, context) => {
    const disallowedPaths = findDisallowedPrivacyKeyPaths(value)
    for (const path of disallowedPaths) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Disallowed privacy field detected: ${path}`,
      })
    }

    if (value.decision === "go" && value.violations.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["violations"],
        message: "violations must be empty for decision=go",
      })
    }

    if (value.decision === "conditional" && value.compensating_controls.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compensating_controls"],
        message: "compensating_controls is required for decision=conditional",
      })
    }
  })
