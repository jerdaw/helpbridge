import { z } from "zod"
import { ATTEMPT_CHANNELS, ATTEMPT_OUTCOMES, OUTCOME_NOTES_CODES } from "@/types/pilot-contact-attempt"
import { REFERRAL_FAILURE_REASON_CODES, REFERRAL_STATES } from "@/types/pilot-referral"
import { findDisallowedPrivacyKeyPaths } from "@/lib/schemas/privacy-guards"

const AttemptChannelEnum = z.enum(ATTEMPT_CHANNELS)
const AttemptOutcomeEnum = z.enum(ATTEMPT_OUTCOMES)
const OutcomeNotesCodeEnum = z.enum(OUTCOME_NOTES_CODES)

const ReferralStateEnum = z.enum(REFERRAL_STATES)
const ReferralFailureReasonCodeEnum = z.enum(REFERRAL_FAILURE_REASON_CODES)

function addPrivacyFieldIssues(value: unknown, context: z.RefinementCtx) {
  const disallowedPaths = findDisallowedPrivacyKeyPaths(value)
  for (const path of disallowedPaths) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Disallowed privacy field detected: ${path}`,
    })
  }
}

export const PilotContactAttemptCreateSchema = z
  .object({
    pilot_cycle_id: z.string().min(1).max(100),
    service_id: z.string().min(1).max(100),
    recorded_by_org_id: z.string().uuid(),
    attempt_channel: AttemptChannelEnum,
    attempt_outcome: AttemptOutcomeEnum,
    attempted_at: z.string().datetime(),
    resolved_at: z.string().datetime().optional(),
    outcome_notes_code: OutcomeNotesCodeEnum.optional(),
  })
  .strict()
  .superRefine(addPrivacyFieldIssues)

export const PilotReferralCreateSchema = z
  .object({
    pilot_cycle_id: z.string().min(1).max(100),
    source_org_id: z.string().uuid(),
    target_service_id: z.string().min(1).max(100),
    referral_state: ReferralStateEnum.default("initiated"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    terminal_at: z.string().datetime().optional(),
    failure_reason_code: ReferralFailureReasonCodeEnum.optional(),
  })
  .strict()
  .superRefine(addPrivacyFieldIssues)

const TERMINAL_REFERRAL_STATES: ReadonlySet<string> = new Set([
  "connected",
  "failed",
  "client_withdrew",
  "no_response_timeout",
])

export const PilotReferralUpdateSchema = z
  .object({
    source_org_id: z.string().uuid(),
    referral_state: ReferralStateEnum,
    updated_at: z.string().datetime(),
    terminal_at: z.string().datetime().optional(),
    failure_reason_code: ReferralFailureReasonCodeEnum.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    addPrivacyFieldIssues(value, context)

    if (TERMINAL_REFERRAL_STATES.has(value.referral_state) && !value.terminal_at) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["terminal_at"],
        message: "terminal_at is required when setting a terminal referral_state",
      })
    }

    if (value.referral_state === "initiated" && value.failure_reason_code) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["failure_reason_code"],
        message: "failure_reason_code is not valid for initiated state",
      })
    }
  })
