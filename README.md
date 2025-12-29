# Kingston Care Connect 🇨🇦

> **The "Semantic Bridge" for Student Social Services.**
> A verified, governance-first search engine for food, crisis, and housing support in Kingston, ON.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status: Pilot](https://img.shields.io/badge/Status-Pilot-orange.svg)

## 🎯 The Mission: "The Kingston 150"

Scraping 60,000 messy records helps no one. **Kingston Care Connect** takes a different approach: **Manual Curation over Automatic Extraction.**

We maintain a strict, hand-verified dataset of the **Top 150 High-Impact Services** for Queen's University students, ensuring that every result is:
1.  **Verified** (No broken links or dead numbers).
2.  **Accessible** (Clear eligibility criteria).
3.  **Identity-Aware** (Evidence-backed safety tags).

---

## 🛡️ Governance & Verification Levels

We utilize a rigorous verification schema to ensure data integrity.

| Level | Status | Definition | Action |
| :--- | :--- | :--- | :--- |
| **L0** | Unverified | Raw data from web/referral. | ❌ Not Displayed |
| **L1** | **Verified** | Existence confirmed (Phone/URL active). | ✅ **Displayed** |
| **L2** | Vetted | Eligibility criteria cross-referenced with official docs. | ✅ **Verified Badge** |
| **L3** | Partner | Direct confirmation from the service provider. | 🌟 **Partner Badge** |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- `npm` or `pnpm`

### Installation

```bash
git clone https://github.com/jerdaw/kingston-care-connect.git
cd kingston-care-connect
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to browse the app.

### Running the CLI Search Tool

Test the search algorithm directly from your terminal:

```bash
npm run search "I need food tonight"
```

### Running Tests

```bash
npm run test
```

---

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS v4
- **Search Engine**: In-memory, weighted scoring algorithm (`lib/search.ts`) - Privacy first.
- **Data Source**: `data/services.json` (Curated JSON-based DB).
- **Icons**: Lucide React.
- **Animations**: Framer Motion.

## 🔒 Privacy Policy

**We do not log user searches.**
All search processing happens transiently. Your queries for "crisis support" or "shelter" stay on the machine and are never recorded in a database.

---
*Built with ❤️ for Kingston Students.*
