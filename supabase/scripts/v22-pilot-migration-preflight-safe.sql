-- v22 Pilot Migration Preflight SAFE (READ-ONLY)
-- Purpose: conservative catalog/integrity checks before any migration.
-- Guarantee: SELECT-only; no DDL/DML.

-- 00. Context
SELECT
  '00_context' AS section,
  NOW() AS executed_at,
  current_database() AS db_name,
  current_user AS db_user,
  current_setting('server_version') AS server_version;

-- 01. Expected object existence
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

-- 02. Relation sizes and estimated rows
SELECT
  '02_relation_sizes' AS section,
  c.relname AS relation_name,
  CASE c.relkind
    WHEN 'r' THEN 'table'
    WHEN 'v' THEN 'view'
    WHEN 'm' THEN 'materialized_view'
    ELSE c.relkind::text
  END AS relation_kind,
  COALESCE(s.n_live_tup::BIGINT, NULL) AS est_live_rows,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'v', 'm')
ORDER BY pg_total_relation_size(c.oid) DESC, c.relname;

-- 03. Column inventory (catalog-based, avoids information_schema views)
SELECT
  '03_columns' AS section,
  c.relname AS table_name,
  a.attnum AS ordinal_position,
  a.attname AS column_name,
  format_type(a.atttypid, a.atttypmod) AS data_type,
  NOT a.attnotnull AS is_nullable,
  pg_get_expr(d.adbin, d.adrelid) AS column_default
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND c.relname IN (
    'organizations',
    'services',
    'organization_members',
    'feedback',
    'service_update_requests',
    'plain_language_summaries',
    'analytics_events',
    'search_analytics',
    'notifications',
    'organization_settings',
    'organization_invitations',
    'reindex_progress',
    'admin_actions',
    'app_admins',
    'audit_logs',
    'notification_audit',
    'partner_terms_acceptance',
    'service_submissions',
    'push_subscriptions'
  )
ORDER BY c.relname, a.attnum;

-- 04. Services column presence check
WITH required(column_name) AS (
  VALUES
    ('id'),('name'),('description'),('name_fr'),('description_fr'),
    ('address'),('address_fr'),('phone'),('url'),('email'),
    ('hours'),('hours_text'),('hours_text_fr'),
    ('fees'),('fees_fr'),('eligibility'),('eligibility_fr'),
    ('application_process'),('application_process_fr'),
    ('languages'),('bus_routes'),('accessibility'),
    ('category'),('tags'),('org_id'),('embedding'),('published'),
    ('scope'),('virtual_delivery'),('primary_phone_label'),('service_area'),
    ('authority_tier'),('resource_indicators'),('synthetic_queries'),('synthetic_queries_fr'),
    ('coordinates'),('deleted_at'),('deleted_by'),
    ('admin_notes'),('last_admin_review'),('reviewed_by'),
    ('updated_at'),('created_at'),('last_verified'),('verification_status')
),
actual AS (
  SELECT a.attname AS column_name
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = 'services'
    AND c.relkind = 'r'
    AND a.attnum > 0
    AND NOT a.attisdropped
)
SELECT
  '04_services_column_presence' AS section,
  r.column_name,
  (a.column_name IS NOT NULL) AS exists_in_services
FROM required r
LEFT JOIN actual a ON a.column_name = r.column_name
ORDER BY r.column_name;

-- 05. RLS status
SELECT
  '05_rls_status' AS section,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relname;

-- 06. RLS policies (direct from pg_policy)
SELECT
  '06_policies' AS section,
  n.nspname AS schemaname,
  c.relname AS tablename,
  p.polname AS policyname,
  CASE p.polcmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
    ELSE p.polcmd::TEXT
  END AS cmd,
  p.polroles::TEXT AS role_oids,
  pg_get_expr(p.polqual, p.polrelid) AS qual,
  pg_get_expr(p.polwithcheck, p.polrelid) AS with_check
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
ORDER BY c.relname, p.polname;

-- 07. Raw ACL inventory for key relations (avoids information_schema grant views)
SELECT
  '07_acl_raw' AS section,
  c.relname AS relation_name,
  CASE c.relkind
    WHEN 'r' THEN 'table'
    WHEN 'v' THEN 'view'
    WHEN 'm' THEN 'materialized_view'
    ELSE c.relkind::TEXT
  END AS relation_kind,
  c.relacl::TEXT AS relacl
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'services',
    'services_public',
    'feedback',
    'feedback_aggregations',
    'unmet_needs_summary',
    'mat_feedback_aggregations',
    'mat_unmet_needs_summary',
    'organization_members',
    'app_admins',
    'reindex_progress',
    'admin_actions',
    'notification_audit'
  )
ORDER BY c.relname;

-- 08. View definitions
SELECT
  '08_views' AS section,
  n.nspname AS schemaname,
  c.relname AS viewname,
  pg_get_viewdef(c.oid, true) AS definition
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'v'
  AND c.relname IN (
    'services_public',
    'feedback_aggregations',
    'unmet_needs_summary',
    'partner_service_analytics',
    'active_reindex_operations'
  )
ORDER BY c.relname;

SELECT
  '08_matviews' AS section,
  n.nspname AS schemaname,
  c.relname AS matviewname,
  pg_get_viewdef(c.oid, true) AS definition
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'm'
  AND c.relname IN ('mat_feedback_aggregations', 'mat_unmet_needs_summary')
ORDER BY c.relname;

-- 09. Function inventory
SELECT
  '09_functions' AS section,
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

-- 10. Legacy admin-model usage detection
SELECT
  '10_function_user_metadata_usage' AS section,
  p.proname,
  pg_get_function_identity_arguments(p.oid) AS identity_args
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND pg_get_functiondef(p.oid) ILIKE '%user_metadata%'
ORDER BY p.proname;

SELECT
  '10_policy_user_metadata_usage' AS section,
  c.relname AS tablename,
  p.polname AS policyname,
  CASE p.polcmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
    ELSE p.polcmd::TEXT
  END AS cmd,
  pg_get_expr(p.polqual, p.polrelid) AS qual,
  pg_get_expr(p.polwithcheck, p.polrelid) AS with_check
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND (
    COALESCE(pg_get_expr(p.polqual, p.polrelid), '') ILIKE '%user_metadata%'
    OR COALESCE(pg_get_expr(p.polwithcheck, p.polrelid), '') ILIKE '%user_metadata%'
  )
ORDER BY c.relname, p.polname;

-- 11. Core referential/data checks
SELECT
  '11_feedback_orphan_service_refs' AS section,
  COUNT(*)::BIGINT AS orphan_count
FROM feedback f
LEFT JOIN services s ON s.id = f.service_id
WHERE f.service_id IS NOT NULL
  AND s.id IS NULL;

SELECT
  '11_service_update_requests_orphan_service_refs' AS section,
  COUNT(*)::BIGINT AS orphan_count
FROM service_update_requests r
LEFT JOIN services s ON s.id = r.service_id
WHERE s.id IS NULL;

SELECT
  '11_feedback_type_distribution' AS section,
  feedback_type,
  COUNT(*)::BIGINT AS row_count
FROM feedback
GROUP BY feedback_type
ORDER BY row_count DESC;

SELECT
  '11_feedback_status_distribution' AS section,
  status,
  COUNT(*)::BIGINT AS row_count
FROM feedback
GROUP BY status
ORDER BY row_count DESC;

SELECT
  '11_service_update_requests_status_distribution' AS section,
  status,
  COUNT(*)::BIGINT AS row_count
FROM service_update_requests
GROUP BY status
ORDER BY row_count DESC;

SELECT
  '11_service_update_requests_payload_columns' AS section,
  a.attname AS column_name,
  format_type(a.atttypid, a.atttypmod) AS data_type
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'service_update_requests'
  AND c.relkind = 'r'
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND a.attname IN ('field_updates', 'updates')
ORDER BY a.attname;

WITH owner_counts AS (
  SELECT organization_id, COUNT(*) FILTER (WHERE role = 'owner') AS owner_count
  FROM organization_members
  GROUP BY organization_id
)
SELECT
  '11_org_owner_count_anomalies' AS section,
  COUNT(*)::BIGINT AS orgs_with_owner_count_not_equal_1
FROM owner_counts
WHERE owner_count <> 1;

SELECT
  '11_services_null_org_id' AS section,
  COUNT(*)::BIGINT AS services_without_org
FROM services
WHERE org_id IS NULL;

SELECT
  '11_app_admins_without_auth_user' AS section,
  COUNT(*)::BIGINT AS dangling_admin_rows
FROM app_admins a
LEFT JOIN auth.users u ON u.id = a.user_id
WHERE u.id IS NULL;

-- 12. Pilot readiness snapshot
WITH expected(name) AS (
  VALUES
    ('pilot_contact_attempt_events'),
    ('pilot_referral_events'),
    ('pilot_metric_snapshots'),
    ('pilot_integration_feasibility_decisions')
)
SELECT
  '12_pilot_tables' AS section,
  e.name AS table_name,
  to_regclass('public.' || e.name) IS NOT NULL AS exists_in_public
FROM expected e
ORDER BY e.name;
