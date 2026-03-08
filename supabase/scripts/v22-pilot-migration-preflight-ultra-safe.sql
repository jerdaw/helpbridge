-- v22 Pilot Migration Preflight ULTRA SAFE (READ-ONLY)
-- Intentionally minimal and conservative to avoid edge-case catalog/view errors.
-- Contains SELECT-only statements.

-- 00. Context
SELECT
  '00_context' AS section,
  NOW() AS executed_at,
  current_database() AS db_name,
  current_user AS db_user,
  current_setting('server_version') AS server_version;

-- 01. Object existence (core + pilot)
WITH expected(name, kind) AS (
  VALUES
    ('organizations', 'table'),
    ('services', 'table'),
    ('organization_members', 'table'),
    ('feedback', 'table'),
    ('service_update_requests', 'table'),
    ('plain_language_summaries', 'table'),
    ('analytics_events', 'table'),
    ('search_analytics', 'table'),
    ('notifications', 'table'),
    ('organization_settings', 'table'),
    ('organization_invitations', 'table'),
    ('reindex_progress', 'table'),
    ('admin_actions', 'table'),
    ('app_admins', 'table'),
    ('audit_logs', 'table'),
    ('notification_audit', 'table'),
    ('partner_terms_acceptance', 'table'),
    ('service_submissions', 'table'),
    ('push_subscriptions', 'table'),
    ('services_public', 'view'),
    ('feedback_aggregations', 'view'),
    ('unmet_needs_summary', 'view'),
    ('partner_service_analytics', 'view'),
    ('active_reindex_operations', 'view'),
    ('mat_feedback_aggregations', 'materialized_view'),
    ('mat_unmet_needs_summary', 'materialized_view'),
    ('pilot_contact_attempt_events', 'table'),
    ('pilot_referral_events', 'table'),
    ('pilot_metric_snapshots', 'table'),
    ('pilot_integration_feasibility_decisions', 'table')
)
SELECT
  '01_expected_objects' AS section,
  e.name,
  e.kind,
  to_regclass('public.' || e.name) IS NOT NULL AS exists_in_public
FROM expected e
ORDER BY e.kind, e.name;

-- 02. Table row estimates and size
SELECT
  '02_table_stats' AS section,
  c.relname AS table_name,
  COALESCE(s.n_live_tup::BIGINT, NULL) AS est_live_rows,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relname;

-- 03. Services columns (actual)
SELECT
  '03_services_columns' AS section,
  a.attnum AS ordinal_position,
  a.attname AS column_name,
  format_type(a.atttypid, a.atttypmod) AS data_type,
  NOT a.attnotnull AS is_nullable
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'services'
  AND c.relkind = 'r'
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;

-- 04. RLS enabled state
SELECT
  '04_rls_status' AS section,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relname;

-- 05. Policies (raw, no expression expansion)
SELECT
  '05_policies_raw' AS section,
  n.nspname AS schemaname,
  c.relname AS tablename,
  p.polname AS policyname,
  p.polcmd AS cmd_code,
  p.polroles::TEXT AS role_oids,
  p.polqual IS NOT NULL AS has_using_clause,
  p.polwithcheck IS NOT NULL AS has_with_check_clause
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
ORDER BY c.relname, p.polname;

-- 06. Security-definer functions of interest
SELECT
  '06_functions' AS section,
  p.proname,
  pg_get_function_identity_arguments(p.oid) AS identity_args,
  p.prosecdef AS security_definer,
  p.proconfig AS runtime_config
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'is_admin',
    'get_user_organization_id',
    'user_can_manage_service',
    'generate_invitation_token',
    'accept_organization_invitation',
    'soft_delete_service',
    'log_admin_action',
    'update_reindex_progress',
    'bulk_update_service_status',
    'transfer_ownership'
  )
ORDER BY p.proname;

-- 07. Legacy user_metadata usage detection
SELECT
  '07_function_user_metadata_usage' AS section,
  p.proname,
  pg_get_function_identity_arguments(p.oid) AS identity_args
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND pg_get_functiondef(p.oid) ILIKE '%user_metadata%'
ORDER BY p.proname;

-- 08. Basic integrity checks
SELECT
  '08_feedback_orphan_service_refs' AS section,
  COUNT(*)::BIGINT AS orphan_count
FROM feedback f
LEFT JOIN services s ON s.id = f.service_id
WHERE f.service_id IS NOT NULL
  AND s.id IS NULL;

SELECT
  '08_service_update_requests_orphan_service_refs' AS section,
  COUNT(*)::BIGINT AS orphan_count
FROM service_update_requests r
LEFT JOIN services s ON s.id = r.service_id
WHERE s.id IS NULL;

SELECT
  '08_services_null_org_id' AS section,
  COUNT(*)::BIGINT AS services_without_org
FROM services
WHERE org_id IS NULL;

SELECT
  '08_app_admins_without_auth_user' AS section,
  COUNT(*)::BIGINT AS dangling_admin_rows
FROM app_admins a
LEFT JOIN auth.users u ON u.id = a.user_id
WHERE u.id IS NULL;

-- 09. Pilot table readiness
WITH expected(name) AS (
  VALUES
    ('pilot_contact_attempt_events'),
    ('pilot_referral_events'),
    ('pilot_metric_snapshots'),
    ('pilot_integration_feasibility_decisions')
)
SELECT
  '09_pilot_tables' AS section,
  e.name AS table_name,
  to_regclass('public.' || e.name) IS NOT NULL AS exists_in_public
FROM expected e
ORDER BY e.name;
