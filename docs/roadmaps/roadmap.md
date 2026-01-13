# Kingston Care Connect: Roadmap

> **Current Version**: v14.0
> **Last Updated**: 2026-01-13
> **Status**: Production-Ready / Maintenance Mode

---

## ️ Current State

Completed **Roadmap V14**: Delivered Privacy-Preserving Impact metrics, Plain-Language summaries, Printable cards, and full Localization coverage.

By **Roadmap V12**: Established fundamental **legal protections**, **regulatory compliance (PIPEDA, AODA)**, and **liability mitigation**.

Completed **Roadmap V10**: Strengthened data governance with **schema validation (Zod)**, **staleness enforcement**, and **ranking improvements**.

For details on completed features, see the [Archived Roadmaps](archive/).

---

## v12.0: Legal & Compliance Infrastructure (Completed)

> **Status**: Implemented
> **Definition**: [2026-01-02-v12-0-legal-compliance.md](archive/2026-01-02-v12-0-legal-compliance.md)

---

## v10.0: Data Architecture & Governance (Completed)

> **Status**: Implemented
> **Definition**: [archive/2026-01-02-v10-0-data-architecture.md](archive/2026-01-02-v10-0-data-architecture.md)

---

## v11.0: Scope Expansion - Ontario-Wide Services (Completed)

> **Status**: ✅ Implemented (2026-01-08)
> **Focus**: Ontario-wide services for Kingston residents
> **Definition**: [archive/2026-01-08-v11-0-scope-expansion.md](archive/2026-01-08-v11-0-scope-expansion.md)

### Key Accomplishments

- [x] Added `scope` enum (`kingston`, `ontario`, `canada`) to data model
- [x] Ingested 47 Ontario-wide services (Crisis, Health, Legal)
- [x] Scope filter UI with fallback handling
- [x] 196 total services with 100% embedding coverage

### Future Phases (Deferred to v15+)

- Canada-wide services expansion
- Major Ontario cities (Toronto, Ottawa, etc.)

---

## v13.0: Secure Data Architecture (Completed)

> **Status**: ✅ Implemented (2026-01-07)
> **Focus**: Privacy & Scalability
> **Definition**: [archive/2026-01-07-v13-0-librarian-model.md](archive/2026-01-07-v13-0-librarian-model.md)

### 1. Privacy-First Data Fetching ("Librarian Model")

- [x] **Goal**: Stop sending the full database (JSON) to the client.
- [x] **Method**: Migrate public search to use Supabase API (server-side).
- **Benefit**: Internal notes, draft services, and verification metadata remain strictly on the server.

### 2. On-Demand Scalability

- [x] **Goal**: Support 1000+ services without increasing initial page load size.
- [x] **Method**: Paginated fetching and server-side filtering.

- [x] **Method**: Paginated fetching and server-side filtering.

---

## v13.1: AI Compliance Audit Remediation (Completed)

> **Status**: ✅ Implemented (2026-01-12)
> **Focus**: Legal Risk Mitigation & Safety
> **Definition**: [archive/2026-01-12-v13-1-ai-compliance-remediation.md](archive/2026-01-12-v13-1-ai-compliance-remediation.md)

### 1. Liability Mitigation

- [x] **Safety Preamble**: Binding system protocol to prevent "professional advice" liability (Moffatt).
- [x] **Crisis Circuit Breaker**: Client-side hard block for self-harm inputs.
- [x] **ToS Upgrades**: "Crisis Waiver" and "Third-Party Liability" clauses.

### 2. AODA & Safety UX

- [x] **Accessibility**: `aria-live` regions for screen readers.
- [x] **Friction**: Persistent disclaimers and outcome feedback loops.

---

## v14.0: Measurable Impact, Equity & Trust (Completed)

> **Status**: ✅ Implemented (2026-01-13)
> **Focus**: Verifiable community impact without tracking
> **Definition**: [archive/2026-01-13-v14-0-impact-equity-trust.md](archive/2026-01-13-v14-0-impact-equity-trust.md)

### 1. Privacy-Preserving Outcomes + QI Loop

- [x] **Goal**: Measure usefulness and continuously improve data quality without logging queries or tracking users.
- [x] **User feedback**: "Was this helpful?", "Report an issue", and "Couldn't find a service" prompts (opt-in, no account required).
- [x] **Data minimization**: Store only aggregated counts + user-submitted feedback content (no cookies, no persistent identifiers).
- [x] **Operations**: Triage queue + resolution workflow (status, owner, timestamps) with staleness links back to the verification backlog.
- [x] **Public reporting**: Quarterly "Impact & Data Quality" summary (e.g., reports resolved, median time-to-fix, % services verified in last 90 days).

### 2. Equity-First Access Pack (TMU/Toronto-Ready)

- [x] **Full UI localization**: Close remaining `next-intl` gaps for `en`, `fr` and added `npm run i18n-audit` to CI.
- [x] **Plain-language mode**: Added simplified summaries and "how to use this service" steps for the highest-impact services, backed by a lightweight review workflow.
- [x] **Low-bandwidth outputs**: Printable/text-only "resource cards" for service pages (phone/address/hours/eligibility), optimized for shelters and drop-in centres.
- [x] **Accessibility upgrades**: Keyboard-first flows, reduced-motion support, and AODA-focused UX checks for critical pages (Search, Service Details).

### 3. Visible Verification + Provenance (Trust Layer)

- [x] **Service-level trust panel**: Display `verified_at` and "last reviewed" status directly on Service Details.
- [x] **Partner update requests**: Structured change requests with audit trail (who/what/when) and human approval before publish.
- [x] **Crisis-safe routing**: Consistent emergency escalation UI (e.g., 911/988) and clear scope disclaimers for crisis-related intents.
- [x] **Narrative alignment**: McMaster = evaluation/QI; Queen's = Kingston governance & partners; Western = operational reliability at scale.

---

## v15.0: Mobile Apps (iOS/Android)

> **Status**: Planned
> **Focus**: Availability & Offline Access

### 1. App Store Availability

- [ ] **Goal**: Publish Kingston Care Connect on Apple App Store and Google Play Store.
- [ ] **Technical Approach**: Use cross-platform technology (e.g., Capacitor) to wrap the existing web app, minimizing development overhead while ensuring native reach.

### 2. Offline Capabilities

- [ ] **Goal**: Enable core directory access (search & view details) without an active internet connection.
- [ ] **Method**: Service Worker caching strategy for critical JSON data and assets.

### 3. Native Integration

- [ ] **Goal**: Leverage native device features where impactful.
- [ ] **Features**: Push notifications for critical service updates (e.g., shelter capacity changes), home screen widgets.

---

## Roadmap Overview

The following items represent the strategic phases of the roadmap:

| Version   | Focus                        | Status    | Key Benefit                        |
| :-------- | :--------------------------- | :-------- | :--------------------------------- |
| **v10.0** | Data Architecture/Governance | Completed | Data quality + search relevance    |
| **v10.1** | UI Polish & Data Expansion   | Completed | 159 services + Map + Multi-lingual |
| **v12.0** | Legal & Compliance           | Completed | Liability protection + compliance  |
| **v13.0** | Secure Data Architecture     | Completed | Privacy + Infinite Scale           |
| **v13.1** | AI Compliance Remediation    | Completed | Moffatt/AODA Legal Safety          |
| **v11.0** | Scope Expansion              | Completed | Ontario-wide services (47)         |
| **v14.0** | Impact, Equity & Trust       | Completed | Verifiable outcomes + access       |
| **v15.0** | Mobile Apps                  | Planned   | Offline access + App Store         |

---

## Removed Items (Feasibility/Scope)

The following items were evaluated and removed during previous roadmap cycles:

| Item                                   | Reason                          |
| :------------------------------------- | :------------------------------ |
| Partner Onboarding (email auto-verify) | Security risk                   |
| Conversational Intake AI               | Complexity, browser support     |
| Navigator Sharing                      | Scope creep                     |
| Trip Planner                           | Paid API, scope creep           |
| User-tracking Impact Analytics         | Scope, privacy risk             |
| Full Health Literacy Rewrite           | Effort without review process   |
| Text-to-Speech                         | Nice-to-have, not core          |
| Research Publication                   | Personal activity, not software |
