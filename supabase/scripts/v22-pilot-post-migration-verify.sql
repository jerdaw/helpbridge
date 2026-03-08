-- v22 Pilot Post-Migration Verification (READ-ONLY)
-- Purpose: confirm pilot schema, policies, and function hardening after migration.
-- Guarantee: SELECT-only.

-- 00. Context
SELECT
  NOW() AS executed_at,
  current_database() AS db_name,
  current_user AS db_user,
  current_setting('server_version') AS server_version;

-- 01. Pilot table existence
SELECT
  to_regclass('public.pilot_contact_attempt_events') IS NOT NULL AS contact_table,
  to_regclass('public.pilot_referral_events') IS NOT NULL AS referral_table,
  to_regclass('public.pilot_metric_snapshots') IS NOT NULL AS metric_table,
  to_regclass('public.pilot_integration_feasibility_decisions') IS NOT NULL AS feasibility_table;

-- 02. Pilot RLS enabled
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'pilot_contact_attempt_events',
    'pilot_referral_events',
    'pilot_metric_snapshots',
    'pilot_integration_feasibility_decisions'
  )
ORDER BY c.relname;

-- 03. Pilot policy coverage by table/cmd (expect one row per cmd per table)
SELECT
  tablename,
  cmd,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'pilot_contact_attempt_events',
    'pilot_referral_events',
    'pilot_metric_snapshots',
    'pilot_integration_feasibility_decisions'
  )
GROUP BY tablename, cmd
ORDER BY tablename, cmd;

-- 04. Legacy user_metadata function references (expect 0)
SELECT COUNT(*) AS user_metadata_function_count
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND pg_get_functiondef(p.oid) ILIKE '%user_metadata%';

-- 05. bulk_update_service_status hardening status
SELECT
  p.proname,
  pg_get_function_identity_arguments(p.oid) AS identity_args,
  pg_get_functiondef(p.oid) ILIKE '%is_admin()%' AS uses_is_admin,
  pg_get_functiondef(p.oid) ILIKE '%user_metadata%' AS uses_user_metadata
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND p.proname = 'bulk_update_service_status'
ORDER BY p.proname;

-- 06. Pilot table row counts (baseline visibility only)
SELECT 'pilot_contact_attempt_events' AS table_name, COUNT(*)::BIGINT AS row_count FROM pilot_contact_attempt_events
UNION ALL
SELECT 'pilot_referral_events' AS table_name, COUNT(*)::BIGINT AS row_count FROM pilot_referral_events
UNION ALL
SELECT 'pilot_metric_snapshots' AS table_name, COUNT(*)::BIGINT AS row_count FROM pilot_metric_snapshots
UNION ALL
SELECT 'pilot_integration_feasibility_decisions' AS table_name, COUNT(*)::BIGINT AS row_count FROM pilot_integration_feasibility_decisions
ORDER BY table_name;
