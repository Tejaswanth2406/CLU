# CLU — Legal Document Analyzer

> **Read the fine print — before you click "I Agree."**

CLU is an AI-powered web application that analyzes Terms of Service, Privacy Policies, License Agreements, and EULAs. It surfaces the most important clauses, constraints, and risks that most people skip — powered by Claude (Anthropic).

---

## Features

- **Risk Score (0–100)** — Instant danger rating for any legal document
- **Severity-tagged findings** — Danger, Warning, Info, and user-friendly clauses
- **Plain English summaries** — No legalese
- **Document type detection** — Auto-detects ToS, Privacy Policy, EULA, License
- **File upload** — Drop `.txt` or `.md` files directly
- **Analysis history** — Local, private, persisted to your browser
- **Export** — Download findings as a text report
- **Dark mode** — System-aware with manual override
- **Keyboard shortcuts** — `⌘ + Enter` to analyze

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Animation | Framer Motion |
| AI | Anthropic Claude API |
| Testing | Vitest + Playwright |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tejaswanth2406/clu.git
cd clu

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your VITE_ANTHROPIC_API_KEY

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` 
| `VITE_ANTHROPIC_MODEL` | No | Model to use (default: `claude-sonnet-4-20250514`) |
| `VITE_MAX_TOKENS` | No | Max tokens per analysis (default: `2000`) |
| `VITE_MAX_DOCUMENT_CHARS` | No | Max input chars (default: `8000`) |
| `VITE_ENABLE_FILE_UPLOAD` | No | Enable file upload UI (default: `true`) |
| `VITE_ENABLE_HISTORY` | No | Enable analysis history (default: `true`) |
| `VITE_ENABLE_EXPORT` | No | Enable export button (default: `true`) |


---

## Project Structure

```
clu/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Lint + test + build on every PR
│   │   └── deploy.yml       # Deploy to GitHub Pages / Vercel / Netlify on main
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── analyzer/
│   │   │   ├── DocumentInput.tsx     # Text input + file drop zone
│   │   │   ├── AnalysisResults.tsx   # Results view with all findings
│   │   │   ├── FindingCard.tsx       # Expandable individual finding
│   │   │   ├── LoadingState.tsx      # Animated loading indicator
│   │   │   └── ErrorState.tsx        # Error display with retry
│   │   ├── layout/
│   │   │   ├── Header.tsx            # App header with theme toggle
│   │   │   └── HistoryPanel.tsx      # Slide-in history sidebar
│   │   └── ui/
│   │       ├── Button.tsx            # Polymorphic button component
│   │       ├── Badge.tsx             # Severity badge
│   │       ├── RiskMeter.tsx         # Animated risk score bar
│   │       └── StatCard.tsx          # Metric summary card
│   ├── hooks/
│   │   ├── useAnalysis.ts            # Convenience hook wrapping store
│   │   ├── useTheme.ts               # Dark/light mode with persistence
│   │   ├── useFileReader.ts          # File reading with validation
│   │   └── useKeyboard.ts            # Keyboard shortcut registration
│   ├── lib/
│   │   ├── constants.ts              # All app constants and feature flags
│   │   ├── utils.ts                  # Pure utility functions
│   │   └── nanoid.ts                 # Minimal ID generator
│   ├── services/
│   │   ├── analysisService.ts        # Anthropic API integration
│   │   └── historyService.ts         # localStorage persistence
│   ├── store/
│   │   └── appStore.ts               # Zustand global state
│   ├── styles/
│   │   └── globals.css               # Tailwind base + custom utilities
│   ├── tests/
│   │   └── setup.ts                  # Vitest setup / mocks
│   ├── types/
│   │   └── index.ts                  # All TypeScript types
│   ├── App.tsx                       # Root component + view router
│   └── main.tsx                      # React entry point
├── tests/
│   ├── unit/
│   │   ├── utils.test.ts
│   │   └── historyService.test.ts
│   ├── integration/
│   │   └── analysisService.test.ts
│   └── e2e/
│       └── app.spec.ts
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── playwright.config.ts
├── postcss.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Scripts

```bash
npm run dev          # Start dev server on :3000
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format all files
npm run typecheck    # TypeScript type check only
npm run test         # Run unit + integration tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests with coverage report
npm run test:e2e     # Playwright end-to-end tests
```

---

## Deployment

### GitHub Pages (default — included in CI)
Pushes to `main` auto-deploy via `deploy.yml`. Set `VITE_ANTHROPIC_API_KEY` in your repo's **Settings → Secrets → Actions**.

### Vercel
1. Connect your repo to Vercel
2. Set `VITE_ANTHROPIC_API_KEY` in Vercel environment variables
3. Vercel auto-detects Vite — no extra config needed

### Netlify
1. Connect your repo to Netlify
2. Build command: `npm run build`, publish directory: `dist`
3. Add `VITE_ANTHROPIC_API_KEY` in Site settings → Environment variables

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with conventional commits: `git commit -m "feat: add PDF support"`
4. Push and open a Pull Request

See [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) for the PR checklist.

---

## Privacy

CLU does **not** store, log, or transmit your documents anywhere except directly to the Anthropic API for analysis. All history is stored locally in your browser's `localStorage` and never leaves your device.

---

## License

MIT © CLU Contributors
