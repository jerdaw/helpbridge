import { PilotScorecard } from "@/types/pilot-metrics"
import { AttemptOutcome } from "@/types/pilot-contact-attempt"
import { ReferralState } from "@/types/pilot-referral"

const FAILURE_OUTCOMES: ReadonlySet<AttemptOutcome> = new Set<AttemptOutcome>([
  "disconnected_number",
  "no_response",
  "intake_unavailable",
  "invalid_routing",
  "other_failure",
])

const TERMINAL_REFERRAL_STATES: ReadonlySet<ReferralState> = new Set<ReferralState>([
  "connected",
  "failed",
  "client_withdrew",
  "no_response_timeout",
])

export interface PilotScorecardInputs {
  totalContactAttempts: number
  failedContactAttempts: number
  p50SecondsToConnection: number | null
  p75SecondsToConnection: number | null
  p90SecondsToConnection: number | null
  totalReferrals: number
  terminalReferrals: number
  servicesInPilotScope: number
  servicesMeetingSla: number
  totalEntitiesForRepeatFailure: number
  entitiesWith2PlusFailures: number
  dataDecaySampleSize: number
  dataDecayFatalCount: number
  preferenceFitTaskCount: number
  preferenceFitKccTaskCount: number
}

export interface Gate1ThresholdEvaluation {
  failedContactRateReductionPass: boolean
  timeToConnectionReductionPass: boolean
  freshnessSlaPass: boolean
  referralCapturePass: boolean
  fatalErrorRatePass: boolean
  passedAll: boolean
}

function computeRate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null
  return numerator / denominator
}

export function computeFailedContactRate(outcomes: AttemptOutcome[]): number | null {
  if (outcomes.length === 0) return null
  const failed = outcomes.filter((outcome) => FAILURE_OUTCOMES.has(outcome)).length
  return failed / outcomes.length
}

export function computeReferralCompletionCaptureRate(states: ReferralState[]): number | null {
  if (states.length === 0) return null
  const terminal = states.filter((state) => TERMINAL_REFERRAL_STATES.has(state)).length
  return terminal / states.length
}

export function buildPilotScorecard(
  pilotCycleId: string,
  inputs: PilotScorecardInputs,
  generatedAt?: string
): PilotScorecard {
  return {
    pilot_cycle_id: pilotCycleId,
    generated_at: generatedAt ?? new Date().toISOString(),
    m1_failed_contact_rate: computeRate(inputs.failedContactAttempts, inputs.totalContactAttempts),
    m2_p50_seconds_to_connection: inputs.p50SecondsToConnection,
    m2_p75_seconds_to_connection: inputs.p75SecondsToConnection,
    m2_p90_seconds_to_connection: inputs.p90SecondsToConnection,
    m3_referral_completion_capture_rate: computeRate(inputs.terminalReferrals, inputs.totalReferrals),
    m4_freshness_sla_compliance: computeRate(inputs.servicesMeetingSla, inputs.servicesInPilotScope),
    m5_repeat_failure_rate: computeRate(inputs.entitiesWith2PlusFailures, inputs.totalEntitiesForRepeatFailure),
    m6_data_decay_fatal_error_rate: computeRate(inputs.dataDecayFatalCount, inputs.dataDecaySampleSize),
    m7_preference_fit_indicator: computeRate(inputs.preferenceFitKccTaskCount, inputs.preferenceFitTaskCount),
  }
}

export function evaluateGate1Thresholds(
  scorecard: PilotScorecard,
  baselineFailedContactRate: number | null,
  baselineP50SecondsToConnection: number | null
): Gate1ThresholdEvaluation {
  const failedContactRateReduction =
    baselineFailedContactRate !== null && baselineFailedContactRate > 0 && scorecard.m1_failed_contact_rate !== null
      ? (baselineFailedContactRate - scorecard.m1_failed_contact_rate) / baselineFailedContactRate
      : null

  const connectionTimeReduction =
    baselineP50SecondsToConnection !== null &&
    baselineP50SecondsToConnection > 0 &&
    scorecard.m2_p50_seconds_to_connection !== null
      ? (baselineP50SecondsToConnection - scorecard.m2_p50_seconds_to_connection) / baselineP50SecondsToConnection
      : null

  const failedContactRateReductionPass = failedContactRateReduction !== null && failedContactRateReduction >= 0.3
  const timeToConnectionReductionPass = connectionTimeReduction !== null && connectionTimeReduction >= 0.25
  const freshnessSlaPass =
    scorecard.m4_freshness_sla_compliance !== null && scorecard.m4_freshness_sla_compliance >= 0.7
  const referralCapturePass =
    scorecard.m3_referral_completion_capture_rate !== null && scorecard.m3_referral_completion_capture_rate >= 0.5
  const fatalErrorRatePass =
    scorecard.m6_data_decay_fatal_error_rate !== null && scorecard.m6_data_decay_fatal_error_rate <= 0.1

  return {
    failedContactRateReductionPass,
    timeToConnectionReductionPass,
    freshnessSlaPass,
    referralCapturePass,
    fatalErrorRatePass,
    passedAll:
      failedContactRateReductionPass &&
      timeToConnectionReductionPass &&
      freshnessSlaPass &&
      referralCapturePass &&
      fatalErrorRatePass,
  }
}
