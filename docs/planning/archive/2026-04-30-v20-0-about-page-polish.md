---
status: archived
last_updated: 2026-04-30
owner: jer
tags: [planning, v20.0, maintenance, about, accessibility]
---

# v20.0 About Page Polish

## Summary

This archive records the completed 2026-04-30 About page maintenance pass while
v22.0 Gate 0 remains blocked on external evidence.

The work rebuilt `/about` as a calmer trust and context page instead of a
collection of homepage-like sections. It restored the page-level background
wash, removed repeated homepage stats/content, unified the page on a shared
content rail, tightened section rhythm, and kept the call-to-action styling
consistent with the existing button system. No curated service records,
verification levels, search behavior, database schema, or runtime contracts
changed.

## Completed Outcomes

1. Reworked the About page layout around a coherent hero, integrated trust
   overview, boundaries card, governance/land context cards, and final CTA.
2. Removed the duplicated homepage-style stats rail and reduced repeated
   governance/source messaging.
3. Replaced stacked, disconnected trust/boundary sections with the integrated
   `AboutTrustOverview` surface.
4. Restored a smooth page-level background wash instead of abrupt per-section
   bands or visible dividers.
5. Aligned the hero, source review, context cards, and final CTA to a shared
   centered content rail so the page no longer changes grids mid-scroll.
6. Tightened the hero-to-source-review spacing while keeping the change easy to
   reverse if the visual rhythm needs another pass.
7. Updated the primary About CTAs to use the existing button sizing/elevation
   with solid `#6366f1` fill and white text/icons.
8. Kept supporting CTAs as standard outline buttons so the primary action has
   clear hierarchy without adding new decorative surfaces.
9. Preserved existing `/about`, `/about/partners`, `/privacy`, and
   `/accessibility` navigation behavior.
10. Kept all public claims grounded in the existing privacy-first, verified
    directory posture.

## Verification Snapshot

Validated on 2026-04-30:

1. `npm test -- tests/components/about/AboutSurfaces.test.tsx tests/components/home/HomeSurfaces.test.tsx`
2. `npm run lint`
3. `npm run type-check`
4. `npm run i18n-audit`
5. `npm run format:check`
6. `git diff --check`
7. Commit hook checks: ESLint, Prettier, related Vitest, type-check, i18n
   audit, and format check

Local Playwright test suites were not run, per the free-tier CI testing
posture. The UI spacing and CTA treatments were inspected through the running
local app with desktop and mobile viewport screenshots.

## Remaining Follow-Through

No new roadmap follow-up remains for this About page polish pass. Existing
v22.0 Gate 0 blockers are unchanged:

1. `UA-1 / G0-3`: attach candidate partner legal/API terms and complete
   clause-level C1 review.
2. `UA-3 / G0-8`: attach named pilot partner list, outreach owner assignment,
   and dated outreach execution evidence.

## Canonical References

1. [Roadmap](../roadmap.md)
2. [Planning index](../README.md)
3. [Component usage guide](../../development/components.md)
4. [Testing guidelines](../../development/testing-guidelines.md)
