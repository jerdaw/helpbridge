# 12. Secure Views for Materialized Data

Date: 2026-01-26

## Status

Accepted

## Context

We use Materialized Views (MVs) in Postgres to aggregate data for complex queries like `feedback_aggregations` and `unmet_needs_summary`. MVs are performant but present a security challenge:

1. **No Row Level Security (RLS)**: MVs do not support RLS policies directly.
2. **API Exposure**: Exposing MVs directly to the Supabase Data API allows `anon` and `authenticated` roles to query them if permissions are granted.
3. **Security Warnings**: The Supabase Database Linter correctly flags exposed MVs and `SECURITY DEFINER` views as high-severity risks.

We needed a way to expose this aggregated data to the frontend API securely while satisfying security auditors and linting tools.

## Decision

We have adopted a **"Secure View Wrapper"** pattern for all Materialized Views exposed to the API.

1. **Backing Materialized View (`mat_*`)**:
   - The actual data storage remains in a Materialized View for performance.
   - These are renamed with a `mat_` prefix (e.g., `mat_feedback_aggregations`).
   - **Permissions**: All permissions are explicitly **REVOKED** from `anon` and `authenticated` roles. These views are effectively private to the database owner.

2. **Public API View**:
   - A standard Postgres View is created with the original name (e.g., `feedback_aggregations`).
   - This View selects all data from the backing `mat_*` MV.
   - **Security Invoker**: The View is configured with `security_invoker = true`. This is critical. It ensures the View executes with the permissions of the _caller_ (the user), not the _creator_ (the admin).
   - **Permissions**: `SELECT` permission is granted to `anon` and `authenticated` roles as needed.

## Consequences

### Positive

- Security Compliance: Satisfies `materialized_view_in_api` and `security_definer_view` lint warnings.
- Access Control: We can now control access at the View level. If RLS is needed in the future, we can add `WHERE` clauses to the View that filter based on `auth.uid()`, effectively polyfilling RLS for the MV data.
- API Stability: The frontend continues to query `feedback_aggregations` transparently; the implementation detail of the `mat_` backing view is hidden.

### Negative

- Complexity: Requires two database objects for every aggregated resource (MV + View).
- Maintenance: Schema changes must be applied to both the MV and the View.

## Automated Verification

We verify this pattern via:

- Supabase Linter: Checks for `security_definer_view` and `materialized_view_in_api`.
- Schema validation: Ensuring `security_invoker` property is set.
