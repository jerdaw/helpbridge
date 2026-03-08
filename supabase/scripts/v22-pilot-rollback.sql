-- =====================================================================================
-- v22 Pilot Rollback Helper (MANUAL)
-- =====================================================================================
-- Use only if you must roll back v22 pilot schema introduction.
-- This script is intentionally scoped to pilot-only objects.
-- =====================================================================================

BEGIN;

DROP TABLE IF EXISTS pilot_integration_feasibility_decisions;
DROP TABLE IF EXISTS pilot_metric_snapshots;
DROP TABLE IF EXISTS pilot_referral_events;
DROP TABLE IF EXISTS pilot_contact_attempt_events;

COMMIT;
