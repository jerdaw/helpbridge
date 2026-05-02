---
status: archived
last_updated: 2026-05-01
owner: jer
tags: [v20.0, ui, navigation, documentation, archive]
---

# v20.0 Public and Operational Surface Polish

## Summary

This maintenance wave polished the remaining high-value public, trust, help,
legal, and authenticated operational surfaces while Gate 0 remained blocked. The
work kept CareConnect's privacy, governance, routing, auth, API, schema, and
service-data contracts intact.

## Completed Scope

- Polished `/about/partners` as the reference-sources and source-review
  explanation page.
- Rebuilt `/submit-service` into a concise public suggestion intake and restored
  `POST /api/v1/submissions` with validation, rate limiting, pending storage,
  and privacy-safe error handling.
- Polished `/settings` with a clearer local-device preference layout.
- Cleaned stale route references: footer category links now use the supported
  homepage query pattern, partner-login onboarding points to `/about/partners`,
  and admin SLO runbook links open the GitHub docs source externally.
- Polished `/login`, `/offline`, and `/service/[id]` while preserving magic-link
  auth, offline behavior, service facts, and opt-in third-party map loading.
- Polished `/privacy`, `/terms`, `/content-policy`, `/partner-terms`,
  `/accessibility`, `/faq`, `/user-guide`, and `/impact` with the shared static
  page shell, stable last-reviewed copy, and current 196-service language.
- Polished `/dashboard/**` and `/admin/**` with the operational shell,
  localized partner navigation, consistent card surfaces, and focused component
  coverage.

## Public Interfaces

- No new public routes were added.
- No database schema, service-data, search, auth, sitemap, or robots behavior
  changed.
- `POST /api/v1/submissions` was restored for the existing public suggestion
  queue with pending-review semantics only; submissions do not publish or update
  service listings automatically.

## Verification

The implementation added and updated focused Vitest coverage for the changed
surfaces, including submit-service, route-reference cleanup, login/offline,
service detail, static legal/help/impact pages, settings, and authenticated
dashboard/admin components.

Local validation during the wave used targeted Vitest runs plus:

- `npm run lint`
- `npm run type-check`
- `npm run i18n-audit`
- `npm run format:check`
- `npm run check:refs`
- `git diff --check`

Local Playwright suites were intentionally not run so browser E2E remains in the
CI/manual-dispatch lane while GitHub Actions is in free-tier budget mode.

## Remaining Follow-Up

Authenticated desktop/mobile visual QA for `/dashboard/**` and `/admin/**`
remains blocked until a valid local Supabase environment and signed-in
partner/admin session are available. That follow-up remains tracked in the
active roadmap; it is not an implementation gap in this archive.
