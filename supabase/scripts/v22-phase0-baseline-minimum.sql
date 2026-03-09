-- v22 Phase 0 Baseline Minimum Metrics (M1 + M3)
-- Purpose: SQL Editor execution helper for Gate 0 minimum mode.
-- Safety: SELECT-only.

-- Locked baseline window
WITH params AS (
  SELECT
    TIMESTAMPTZ '2026-02-10T00:00:00Z' AS baseline_start,
    TIMESTAMPTZ '2026-03-09T00:00:00Z' AS baseline_end
)
SELECT baseline_start, baseline_end FROM params;

-- query_id: v22_phase0_preflight_schema_dependencies
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'pilot_contact_attempt_events',
    'pilot_referral_events',
    'pilot_metric_snapshots',
    'pilot_connection_events',
    'pilot_service_scope',
    'service_operational_status_events',
    'pilot_data_decay_audits',
    'pilot_preference_fit_events'
  )
ORDER BY table_name;

-- query_id: v22_phase0_m1_failed_contact_rate
WITH params AS (
  SELECT
    TIMESTAMPTZ '2026-02-10T00:00:00Z' AS baseline_start,
    TIMESTAMPTZ '2026-03-09T00:00:00Z' AS baseline_end
),
attempts AS (
  SELECT e.attempt_outcome
  FROM pilot_contact_attempt_events e
  CROSS JOIN params p
  WHERE e.attempted_at >= p.baseline_start
    AND e.attempted_at < p.baseline_end
),
counts AS (
  SELECT
    COUNT(*) AS total_contact_attempts,
    COUNT(*) FILTER (
      WHERE attempt_outcome IN (
        'disconnected_number',
        'no_response',
        'intake_unavailable',
        'invalid_routing',
        'other_failure'
      )
    ) AS failed_contact_events
  FROM attempts
)
SELECT
  failed_contact_events,
  total_contact_attempts,
  CASE
    WHEN total_contact_attempts = 0 THEN NULL
    ELSE failed_contact_events::numeric / total_contact_attempts
  END AS failed_contact_rate
FROM counts;

-- query_id: v22_phase0_m3_referral_completion_capture_rate
WITH params AS (
  SELECT
    TIMESTAMPTZ '2026-02-10T00:00:00Z' AS baseline_start,
    TIMESTAMPTZ '2026-03-09T00:00:00Z' AS baseline_end
),
referrals AS (
  SELECT e.referral_state
  FROM pilot_referral_events e
  CROSS JOIN params p
  WHERE e.created_at >= p.baseline_start
    AND e.created_at < p.baseline_end
),
counts AS (
  SELECT
    COUNT(*) AS total_referrals,
    COUNT(*) FILTER (
      WHERE referral_state IN ('connected', 'failed', 'client_withdrew', 'no_response_timeout')
    ) AS referrals_with_terminal_state
  FROM referrals
)
SELECT
  referrals_with_terminal_state,
  total_referrals,
  CASE
    WHEN total_referrals = 0 THEN NULL
    ELSE referrals_with_terminal_state::numeric / total_referrals
  END AS completion_capture_rate
FROM counts;
