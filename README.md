# Life.OS — Narrative Reality Console

> *A high-tech operating system designed for the retrieval and manipulation of human destinies.*

![Life.OS](https://img.shields.io/badge/version-1.0.0--alpha-blue) ![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![Vercel](https://img.shields.io/badge/deploy-Vercel-black)

**Life.OS** is an interactive narrative experience wrapped in a cinematic, ultra-dark operating system interface. It presents three life paths — Medical Surgeon, Corporate Executive, and Spiritual Hermit — as "destiny narratives" that users explore, make choices within, and archive. Every decision shifts your Reality Sync percentage, spends Curious Credits, and writes to your personal Destiny Data Bank.

---

## Concept

You are an **Operator** seated at the Life.OS console — a fictional operating system that can access, explore, and (with sufficient clearance) **override** human destinies. The interface treats light as data, uses glassmorphism surfaces to create physical depth, and renders an 18px dot-grid texture across the void to suggest latent intelligence beneath the surface.

Three narrative paths await:

| Path | Designation | Vibe |
|------|------------|------|
| `NARRATIVE_082_MED` | **The Surgeon** | 3 AM trauma bay, flickering fluorescents, life-or-death choices |
| `NARRATIVE_115_CORP` | **The Executive** | 99th-floor corner office, quarterly anomalies, whistleblower tension |
| `NARRATIVE_401_FREE` | **The Hermit** | Dali, Yunnan — mountains, stillness, the terrifying beauty of silence |

Each path contains **branching narrative nodes** with full prose, binary choices, credit costs, and consequence chains. Completed paths are archived in the **Destiny Data Bank** with timeline scrubbing. Unexplored branches appear as **corrupted/redacted strata** — glitched data cards that hint at paths not taken.

---

## Design System

Life.OS follows **AI-Native Minimalism** with **Restrained Mystery** — an aesthetic of quiet awe, cinematic weight, and focused precision.

- **Ultra-Dark palette** — `#131317` background, `#FFFFFF` primary signal, `#7BD0FF` cyan accent for technical data, `#8B5CF6` violet accent for narrative elements
- **Glassmorphism** — surfaces use `rgba(255,255,255,0.03)` with `backdrop-filter: blur(20px)` and `0.5px` semi-transparent borders
- **18px environmental grid** — radial-gradient dot pattern at 3-5% opacity for digital texture
- **Liquid motion** — `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions, glitch text animations, scanline effects
- **Geist + JetBrains Mono** fonts loaded via `next/font`
- **Breathing light waves** — slow-pulsing cyan/violet blobs in the periphery suggesting ambient intelligence

Full design token manifest in [`DESIGN.md`](./DESIGN.md).

---

## Architecture

```
                   ┌──────────────────────────────┐
                   │       Vercel (Serverless)     │
                   │                              │
  Browser ────────►│  Next.js 14 (App Router)     │
                   │  ├─ 10 pages (React)          │
                   │  ├─ 9 API routes              │
                   │  ├─ 15 shared UI components   │
                   │  └─ JWT auth (jose)           │
                   │                              │
                   │  Vercel KV (session state)    │
                   │  └─ fallback: globalThis Map  │
                   └──────────────────────────────┘
```

### API Endpoints

All under `/api/v1/`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/initialize` | Biometric auth → JWT + user profile |
| `GET` | `/narratives` | List all narrative paths with user progress |
| `GET` | `/narratives/:id` | Narrative detail with current scene node |
| `POST` | `/narratives/:id/choice` | Submit a decision → branch to next node |
| `GET` | `/user/credits` | Curious Credits balance + transactions |
| `GET` | `/user/profile` | Reality sync %, path synchronicity, metrics |
| `POST` | `/payments/unlock-fragment` | Spend credits to unlock paywalled content |
| `GET` | `/archive/timeline` | Timeline entries with corrupted strata overlay |
| `POST` | `/terminal` | Command-line interface (STATUS, SYNC, SCAN, etc.) |

Full API contract in [`life.os_technical_integration_manifest.md`](./life.os_technical_integration_manifest.md).

### Pages

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | Landing | Redirects to initialize |
| `/initialize` | System Gateway | Boot sequence + IDENTIFY_USER |
| `/transition` | Glitch Reveal | Fragmentation → reassembly animation |
| `/hub` | Narrative Hub | Three 3:4 narrative cards |
| `/narratives/:id` | Narrative Scene | Prose + binary choices + branching |
| `/profile` | Reality Sync Dashboard | Credits, sync ring, path synchronicity, terminal logs |
| `/archive` | Destiny Data Bank | Timeline scrubber + corrupted strata cards |
| `/decrypt` | Decryption Gateway | 6×6 puzzle grid + credit paywall |
| `/override` | System Override | ROOT-level node recalibration |
| `/breach` | Fragment Reassembly | Post-decryption completion |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| Auth | JWT via `jose` (Edge-compatible) |
| State | React Context + useReducer |
| Data | Vercel KV (production) / globalThis Map (local dev) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/lifeos.git
cd lifeos

# Install
npm install

# Set up env
cp .env.example .env.local
# Edit .env.local — add any JWT_SECRET

# Run
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `JWT_SECRET` | Yes (prod) | dev fallback | JWT signing secret |
| `KV_URL` | No | — | Vercel KV connection |
| `KV_REST_API_URL` | No | — | Vercel KV REST endpoint |
| `KV_REST_API_TOKEN` | No | — | Vercel KV auth token |
| `NEXT_PUBLIC_API_BASE` | No | `/api/v1` | API base URL |

Without KV credentials, the app uses an in-memory store (suitable for local dev, resets on restart).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── (gateway)/              # Public auth flow
│   │   ├── initialize/         # Boot sequence
│   │   └── transition/         # Glitch reveal
│   ├── (console)/              # Authenticated app
│   │   ├── hub/                # Narrative selector
│   │   ├── narratives/[id]/    # Narrative scene viewer
│   │   ├── profile/            # Reality sync dashboard
│   │   ├── archive/            # Destiny data bank
│   │   ├── decrypt/            # Paywall gateway
│   │   ├── override/           # System override
│   │   └── breach/             # Fragment reassembly
│   └── api/v1/                 # REST API
│       ├── auth/initialize/
│       ├── narratives/
│       ├── user/
│       ├── payments/
│       ├── archive/timeline/
│       └── terminal/
├── components/ui/              # 15 shared components
├── lib/                        # Auth, store, state, utils
├── models/                     # TypeScript interfaces
├── data/                       # Seed content (narratives, archive, credits, terminal)
└── middleware.ts               # JWT verification
```

---

## Narrative Content

All narrative content lives in `src/data/seed-narratives.ts` as typed TypeScript objects. Each narrative path is a tree of nodes connected by choices:

```
NARRATIVE_082_MED (The Surgeon)
├── NODE_001: "The Sound of Silence"
│   ├── Assess Patient Vitals → NODE_002
│   └── Call for Backup → NODE_003
├── NODE_002: "Chemical Surge"
│   ├── Defibrillate Now → NODE_004 [PAYWALL: 2 CC]
│   └── Wait for Stabilization → NODE_005
├── NODE_003: "The Fork in the Road"
├── NODE_004: "The Machine's Breath" [PAYWALL]
├── NODE_005: "Resuscitation Phase"
├── NODE_006: "System Resolution"
└── NODE_007: "The Choice"
```

Choices carry consequences: reality sync deltas, fragment gains/losses, credit deductions, and outcome flags that unlock new paths.

---

## Credits

- **Design System** — AI-Native Minimalism + Glassmorphism + Corporate Modernism
- **Typography** — Geist by Vercel, rendered via Inter + JetBrains Mono
- **Original frontend screens** — 36 static HTML prototypes served as visual reference
- **Narrative content** — Original fiction written for the Life.OS universe

---

*Life.OS v1.0.0-alpha — "Every choice rewrites the destiny."*
