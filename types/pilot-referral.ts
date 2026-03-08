export const REFERRAL_STATES = ["initiated", "connected", "failed", "client_withdrew", "no_response_timeout"] as const
export type ReferralState = (typeof REFERRAL_STATES)[number]

export const REFERRAL_FAILURE_REASON_CODES = [
  "disconnected_number",
  "no_response",
  "intake_closed",
  "ineligible",
  "capacity_full",
  "unknown_failure",
] as const
export type ReferralFailureReasonCode = (typeof REFERRAL_FAILURE_REASON_CODES)[number]

export interface PilotReferralEvent {
  id: string
  pilot_cycle_id: string
  source_org_id: string
  target_service_id: string
  referral_state: ReferralState
  created_at: string
  updated_at: string
  terminal_at?: string | null
  failure_reason_code?: ReferralFailureReasonCode | null
}
