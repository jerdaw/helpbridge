---
status: draft
last_updated: 2026-03-08
owner: jer
tags: [implementation, v22.0, phase-0, sql, metrics]
---

# v22.0 Phase 0 Baseline Query Spec

This document defines reproducible baseline query patterns for Phase 0 metrics.

Companion documents:

1. [v22.0 Phase 0 Baseline Metric Definitions](v22-0-phase-0-baseline-metric-definitions.md)
2. [v22.0 Phase 0 Implementation Plan](v22-0-phase-0-implementation-plan.md)

## Parameters

All queries must parameterize:

1. `:baseline_start` (date/timestamp)
2. `:baseline_end` (date/timestamp)
3. `:pilot_cycle_id` (string, optional for pre-pilot compatibility)

## Query Versioning

Use this metadata header in every saved query:

```sql
-- query_id: v22_phase0_m1_failed_contact_rate
-- query_version: 1
-- owner: jer
-- last_updated: 2026-03-08
```

## M1 Failed Contact Rate

```sql
WITH attempts AS (
  SELECT attempt_outcome
  FROM pilot_contact_attempt_events
  WHERE attempted_at >= :baseline_start
    AND attempted_at < :baseline_end
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
```

## M2 Time to Successful Connection (median/p75/p90)

```sql
WITH successful_connections AS (
  SELECT
    initial_event_at,
    successful_connection_at,
    EXTRACT(EPOCH FROM (successful_connection_at - initial_event_at)) AS seconds_to_connection
  FROM pilot_connection_events
  WHERE successful_connection_at >= :baseline_start
    AND successful_connection_at < :baseline_end
    AND initial_event_at IS NOT NULL
)
SELECT
  percentile_cont(0.50) WITHIN GROUP (ORDER BY seconds_to_connection) AS p50_seconds,
  percentile_cont(0.75) WITHIN GROUP (ORDER BY seconds_to_connection) AS p75_seconds,
  percentile_cont(0.90) WITHIN GROUP (ORDER BY seconds_to_connection) AS p90_seconds
FROM successful_connections;
```

## M3 Referral Completion Capture Rate

```sql
WITH referrals AS (
  SELECT referral_state
  FROM pilot_referral_events
  WHERE created_at >= :baseline_start
    AND created_at < :baseline_end
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
```

## M4 Freshness SLA Compliance

```sql
WITH pilot_services AS (
  SELECT service_id, sla_tier
  FROM pilot_service_scope
),
latest_status AS (
  SELECT
    e.service_id,
    MAX(e.status_updated_at) AS last_status_updated_at
  FROM service_operational_status_events e
  GROUP BY e.service_id
),
compliance AS (
  SELECT
    s.service_id,
    s.sla_tier,
    l.last_status_updated_at,
    CASE
      WHEN s.sla_tier = 'crisis' AND l.last_status_updated_at >= (NOW() - INTERVAL '24 hours') THEN TRUE
      WHEN s.sla_tier = 'high_demand_non_crisis' AND l.last_status_updated_at >= (NOW() - INTERVAL '48 hours') THEN TRUE
      WHEN s.sla_tier = 'standard' AND l.last_status_updated_at >= (NOW() - INTERVAL '7 days') THEN TRUE
      ELSE FALSE
    END AS meets_sla
  FROM pilot_services s
  LEFT JOIN latest_status l ON l.service_id = s.service_id
)
SELECT
  COUNT(*) FILTER (WHERE meets_sla) AS services_meeting_status_sla,
  COUNT(*) AS pilot_services_total,
  CASE
    WHEN COUNT(*) = 0 THEN NULL
    ELSE COUNT(*) FILTER (WHERE meets_sla)::numeric / COUNT(*)
  END AS freshness_compliance
FROM compliance;
```

## M5 Repeat Failure Rate

```sql
WITH failure_events AS (
  SELECT referral_entity_id
  FROM pilot_contact_attempt_events
  WHERE attempted_at >= :baseline_start
    AND attempted_at < :baseline_end
    AND attempt_outcome IN (
      'disconnected_number',
      'no_response',
      'intake_unavailable',
      'invalid_routing',
      'other_failure'
    )
),
entity_failures AS (
  SELECT referral_entity_id, COUNT(*) AS failure_count
  FROM failure_events
  GROUP BY referral_entity_id
)
SELECT
  COUNT(*) FILTER (WHERE failure_count >= 2) AS entities_with_2plus_failures,
  COUNT(*) AS total_entities,
  CASE
    WHEN COUNT(*) = 0 THEN NULL
    ELSE COUNT(*) FILTER (WHERE failure_count >= 2)::numeric / COUNT(*)
  END AS repeat_failure_rate
FROM entity_failures;
```

## M6 Data-Decay Fatal Error Rate

```sql
WITH sampled AS (
  SELECT severity
  FROM pilot_data_decay_audits
  WHERE audited_at >= :baseline_start
    AND audited_at < :baseline_end
),
counts AS (
  SELECT
    COUNT(*) AS records_sampled,
    COUNT(*) FILTER (WHERE severity = 'fatal') AS records_with_access_blocking_errors
  FROM sampled
)
SELECT
  records_with_access_blocking_errors,
  records_sampled,
  CASE
    WHEN records_sampled = 0 THEN NULL
    ELSE records_with_access_blocking_errors::numeric / records_sampled
  END AS fatal_error_rate
FROM counts;
```

## M7 Preference-Fit Indicator

```sql
WITH cohort_tasks AS (
  SELECT completion_channel
  FROM pilot_preference_fit_events
  WHERE completed_at >= :baseline_start
    AND completed_at < :baseline_end
),
counts AS (
  SELECT
    COUNT(*) AS cohort_total_tasks,
    COUNT(*) FILTER (WHERE completion_channel = 'kcc') AS cohort_tasks_preferably_completed_via_kcc
  FROM cohort_tasks
)
SELECT
  cohort_tasks_preferably_completed_via_kcc,
  cohort_total_tasks,
  CASE
    WHEN cohort_total_tasks = 0 THEN NULL
    ELSE cohort_tasks_preferably_completed_via_kcc::numeric / cohort_total_tasks
  END AS preference_fit
FROM counts;
```

## Baseline Query QA Checklist

- [ ] All seven query headers include `query_id` and `query_version`
- [ ] All queries execute with parameterized date inputs
- [ ] Null/zero denominator behavior is explicitly handled
- [ ] Baseline outputs saved with execution timestamp and owner
- [ ] Metric outputs copied into baseline report artifact
