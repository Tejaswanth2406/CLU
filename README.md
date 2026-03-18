# CLU — Legal Document Analyzer

> **Read the fine print — before you click "I Agree."**

CLU is an AI-powered web app that analyzes Terms of Service, Privacy Policies, EULAs, and License Agreements. It surfaces the clauses that matter — risks, constraints, and gotchas — in plain English. No legalese. No surprises.

Works with **Anthropic Claude** or **OpenAI GPT** — bring your own key.

---

## Why CLU?

Most people click "I Agree" without reading a word. Legal documents are intentionally dense. CLU changes that — paste any agreement and get a real-time, structured breakdown of what you're agreeing to, what's unusual, and what you should be concerned about.

---

## Features

| | |
|---|---|
| **Risk Score (0–100)** | Instant danger rating for any legal document |
| **Severity-tagged findings** | Danger · Warning · Info · Safe — scannable at a glance |
| **Plain English summaries** | Every clause rewritten in clear, direct language |
| **Document type detection** | Auto-detects ToS, Privacy Policy, EULA, License |
| **Streaming responses** | Real-time output as analysis runs — no waiting |
| **Smart caching** | Redis-backed cache for instant repeat lookups |
| **Multi-provider AI** | Swap between Claude and GPT via a single env variable |
| **File upload** | Drop `.txt` or `.md` files directly — no copy-paste |
| **Analysis history** | Local and private, persisted to your browser |
| **Export** | Download findings as a formatted text report |
| **Dark mode** | System-aware with manual override |
| **Keyboard shortcut** | `⌘ + Enter` to analyze |

---

## Demo

```
Document: Acme Corp Terms of Service
Type:     Terms of Service
Score:    74 / 100
──────────────────────────────────────────────────────
[DANGER]  Broad data selling rights to third parties
          The company may sell or transfer your personal data, usage history,
          and behavioral profiles to third parties without additional consent.

[DANGER]  Unilateral terms modification without notice
          Terms can be changed at any time. Continued use constitutes
          acceptance — even if you were never notified of the change.

[WARNING] Mandatory arbitration clause
          Disputes must be resolved through binding arbitration. You waive
          your right to a jury trial and class action lawsuits.

[INFO]    Content you post is licensed to the platform
          You retain ownership, but grant a worldwide, royalty-free license
          to use, display, and distribute your content.

[SAFE]    30-day cancellation — no penalty
          Cancel anytime. Access continues until the end of your billing
          period with no cancellation fee.
```

---

## Architecture

CLU uses a monorepo with a decoupled frontend and backend. Your API key never touches the client.

```
apps/
├── web/          React frontend (Vite)
└── api/          Express backend
```

```
Browser → Express API → Redis cache → AI Provider (Claude or GPT)
                    ↑
              (cache miss only)
```

On a cache hit the response is instant. On a cache miss, the result streams live to the browser and is stored in Redis for subsequent requests.

---

## AI Provider Setup

CLU supports both Anthropic and OpenAI. Set `AI_PROVIDER` in your backend `.env` to switch between them.

### Using Anthropic Claude (default)

Get your key at [console.anthropic.com](https://console.anthropic.com).

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

### Using OpenAI GPT

Get your key at [platform.openai.com](https://platform.openai.com/api-keys).

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

Only the variables for the active provider are required. The other set is ignored.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite 5 |
| Styling | Tailwind CSS v3, Framer Motion |
| State | Zustand |
| Backend | Express, Zod |
| Caching | Redis (Upstash / Railway / Redis Cloud) |
| AI | Anthropic Claude API · OpenAI API (streaming) |
| Testing | Vitest, Playwright, Supertest |
| CI/CD | GitHub Actions |
| Deployment | Vercel (web) · Railway or Render (api) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An API key from [Anthropic](https://console.anthropic.com) or [OpenAI](https://platform.openai.com/api-keys)
- A Redis instance — [Upstash](https://upstash.com) has a free tier and works out of the box

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tejaswanth2406/clu.git
cd clu

# 2. Install all dependencies
npm install
```

### Configure the backend

```bash
cd apps/api
cp .env.example .env
```

Then edit `apps/api/.env` — pick one provider:

```env
# ── AI Provider ──────────────────────────────────────
# Set to "anthropic" or "openai"
AI_PROVIDER=anthropic

# Anthropic (used when AI_PROVIDER=anthropic)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# OpenAI (used when AI_PROVIDER=openai)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# ── Redis ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Server ────────────────────────────────────────────
PORT=3001
```

### Configure the frontend

```bash
cd apps/web
cp .env.example .env.local
```

```env
# apps/web/.env.local
VITE_API_URL=http://localhost:3001
```

### Run

```bash
# From the repo root — starts both frontend and backend
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)
API: [http://localhost:3001](http://localhost:3001)

---

## Environment Variables

### Backend (`apps/api/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `AI_PROVIDER` | No | `anthropic` | Which provider to use: `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` | If using Anthropic | — | Your Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-20250514` | Claude model to use |
| `OPENAI_API_KEY` | If using OpenAI | — | Your OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o` | GPT model to use |
| `REDIS_URL` | No | — | Redis connection URL. Caching is disabled if unset |
| `PORT` | No | `3001` | Port for the API server |

### Frontend (`apps/web/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:3001` | Backend API base URL |
| `VITE_MAX_DOCUMENT_CHARS` | No | `8000` | Max input characters |
| `VITE_ENABLE_FILE_UPLOAD` | No | `true` | Enable file upload UI |
| `VITE_ENABLE_HISTORY` | No | `true` | Enable analysis history |
| `VITE_ENABLE_EXPORT` | No | `true` | Enable export button |

---

## Project Structure

```
clu/
├── apps/
│   ├── web/                           # React frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── analyzer/
│   │       │   │   ├── DocumentInput.tsx      # Text input + file drop zone
│   │       │   │   ├── AnalysisResults.tsx    # Results view with findings
│   │       │   │   ├── FindingCard.tsx        # Expandable individual finding
│   │       │   │   ├── LoadingState.tsx       # Animated loading indicator
│   │       │   │   └── ErrorState.tsx         # Error display with retry
│   │       │   ├── layout/
│   │       │   │   ├── Header.tsx             # App header with theme toggle
│   │       │   │   └── HistoryPanel.tsx       # Slide-in history sidebar
│   │       │   └── ui/
│   │       │       ├── Button.tsx             # Polymorphic button
│   │       │       ├── Badge.tsx              # Severity badge
│   │       │       ├── RiskMeter.tsx          # Animated risk score bar
│   │       │       └── StatCard.tsx           # Metric summary card
│   │       ├── hooks/
│   │       │   ├── useAnalysis.ts             # Wraps store + streaming logic
│   │       │   ├── useTheme.ts                # Dark/light mode persistence
│   │       │   ├── useFileReader.ts           # File reading with validation
│   │       │   └── useKeyboard.ts             # Keyboard shortcut registration
│   │       ├── services/
│   │       │   ├── analysisService.ts         # Streaming fetch to backend
│   │       │   └── historyService.ts          # localStorage persistence
│   │       ├── store/
│   │       │   └── appStore.ts                # Zustand global state
│   │       └── types/
│   │           └── index.ts
│   │
│   └── api/                           # Express backend
│       └── src/
│           ├── routes/
│           │   └── analyze.ts         # POST /api/analyze + /stream
│           ├── providers/
│           │   ├── anthropic.ts       # Claude streaming adapter
│           │   └── openai.ts          # GPT streaming adapter
│           ├── middleware/
│           │   ├── rateLimit.ts       # 100 req / 15 min
│           │   └── logger.ts          # Request logging
│           ├── lib/
│           │   ├── redis.ts           # Redis client + cache helpers
│           │   └── timeout.ts         # Promise timeout wrapper
│           └── index.ts               # Server entry point
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint + test + build on every PR
│       └── deploy.yml                 # Deploy on push to main
└── package.json                       # Workspace root
```

---

## API Reference

### `POST /api/analyze`

Analyzes a document. Returns a cached result instantly if available, otherwise calls the configured AI provider and caches the response.

**Request**
```json
{ "input": "paste your legal document here..." }
```

**Response**
```json
{
  "riskScore": 74,
  "documentType": "Terms of Service",
  "provider": "anthropic",
  "findings": [
    {
      "severity": "danger",
      "title": "Broad data selling rights to third parties",
      "summary": "...",
      "clause": "§ 8.4 — ..."
    }
  ],
  "cached": false
}
```

---

### `POST /api/analyze/stream`

Same as above, but streams the response as Server-Sent Events. The final result is written to Redis after streaming completes.

**Response** — `text/event-stream`, JSON deltas until `[DONE]`.

---

## Scripts

```bash
# Root — runs both apps concurrently
npm run dev            # Start frontend + backend
npm run build          # Build both apps
npm run test           # Run all tests

# Frontend (apps/web)
npm run dev            # Vite dev server on :3000
npm run build          # Production build
npm run test:e2e       # Playwright end-to-end tests

# Backend (apps/api)
npm run dev            # ts-node-dev with hot reload on :3001
npm run build          # TypeScript compile
npm run test           # Vitest + Supertest integration tests
```

---

## Deployment

### Frontend — Vercel

1. Connect `apps/web` to [Vercel](https://vercel.com)
2. Set `VITE_API_URL` to your deployed backend URL
3. Vercel auto-detects Vite — no extra configuration needed

### Backend — Railway or Render

1. Connect `apps/api` to [Railway](https://railway.app) or [Render](https://render.com)
2. Set environment variables (`AI_PROVIDER`, your chosen API key, `REDIS_URL`)
3. Start command: `npm run build && node dist/index.js`

### Redis — Upstash (recommended)

[Upstash](https://upstash.com) offers a free serverless Redis tier. Create a database, copy the connection URL, and set it as `REDIS_URL`. Results are cached for 1 hour by default.

---

## Privacy

CLU does **not** store, log, or transmit your documents anywhere except:

- The **AI provider's API** (Anthropic or OpenAI), for the analysis call
- Your **Redis instance**, where results are cached by a SHA-256 hash of the input — not the raw text

All browser history is saved locally in `localStorage` and never leaves your device.

See [Anthropic's privacy policy](https://www.anthropic.com/privacy) or [OpenAI's privacy policy](https://openai.com/privacy) depending on which provider you use.

---

## Contributing

Contributions are welcome.

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feat/my-feature

# 3. Commit with conventional commits
git commit -m "feat: add PDF support"

# 4. Push and open a Pull Request
git push origin feat/my-feature
```

See [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) for the PR checklist.

---

## License

MIT © CLU Contributors
