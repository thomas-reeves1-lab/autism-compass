# WIRING — autism-compass

Last verified: 2026-07-18 (against `master` @ `8c71e55`)

## What this is

A public, education-only web app. It shows what published studies reported about ASD
behaviour supports and supplement pathways, tracks changes over time, and builds a
doctor-visit pack. Static Vite + React 19 + TypeScript front end. No backend is wired
to it today, and no personal data leaves the browser.

## Entry points

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 5173 (also `.claude/launch.json`) |
| `npm run build` | `tsc -b && vite build` into `dist/` (root base `/`) |
| `GH_PAGES=1 npm run build` | Same, but base `/autism-compass/` for GitHub Pages |
| `npm run test` | Vitest, jsdom. 2 files, 16 tests |
| `npm run lint` | ESLint. Currently fails, see Gotcha 1 |
| `npm run preview` | Serves the built `dist/` locally |

App boots at `src/main.tsx` (StrictMode, ErrorBoundary, MotionConfig) into `src/App.tsx`.
`App.tsx` is the whole router: tabs are `useState`, and every non-dashboard tab is a
`lazy()` chunk. `react-router-dom` is a dependency but is imported nowhere.

## Data flow

All arrows are LOCAL. Nothing in the default build calls a service that stores data.

```
src/data/{evidence,studies,therapies,sensory}.ts   (hand-edited evidence tables)
        -> src/lib/calculator.ts  calculateProjectedMetrics()  (saturating dose curve,
           effects applied in "remaining room" space, uncertainty bands)
        -> src/features/calculator/*  (KPI grid, rings, charts, evidence table)

user input -> src/store/useAppStore.ts (zustand + persist)
        -> localStorage key "autismcompass-v2"
        -> src/lib/exports.ts downloadTrackerCsv() -> browser download (Blob, no upload)

consent choice -> localStorage key "autismcompass-consent-v1" (src/lib/consent.ts)
```

Two outbound arrows exist and both are inert by default:

- LIVE, always: Google Fonts stylesheet and preconnect, hardcoded in `index.html`.
- LIVE, only if configured: `src/features/growth/LeadCapture.tsx:25` POSTs an email to
  `import.meta.env.VITE_LEAD_ENDPOINT`. That variable is unset in this repo, so the
  `fetch` is skipped and the form just shows its done state.

## Credentials

**This repo holds no credentials, and there is no `.env` or `.env.example` in it.**

| Name | Read by | Set where | Notes |
|---|---|---|---|
| `VITE_LEAD_ENDPOINT` | `src/features/growth/LeadCapture.tsx:25` | build-time env on the host | Unset. Optional |
| `SUPABASE_URL` | `supabase/functions/capture-lead/index.ts:8`, `stripe-webhook/index.ts:15` | Supabase project secrets | Functions are undeployed |
| `SUPABASE_SERVICE_ROLE_KEY` | `capture-lead/index.ts:9`, `stripe-webhook/index.ts:16` | Supabase project secrets | Server-side only, never in the client bundle |
| `STRIPE_SECRET_KEY` | `create-checkout/index.ts:10`, `stripe-webhook/index.ts:9` | Supabase project secrets | Undeployed |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook/index.ts:13` | Supabase project secrets | Undeployed |
| `SITE_URL` | `create-checkout/index.ts:14` | Supabase project secrets | Defaults to `http://localhost:5173` |

Anything prefixed `VITE_` is baked into the public bundle. Never put a secret behind
that prefix. See Gotcha 5 for the `.gitignore` hole.

## External services

| Service | Used for | State |
|---|---|---|
| GitHub Pages | Hosting the built site | Live. `gh-pages` branch serves built assets |
| Google Fonts | Roboto / Roboto Flex, `index.html` | Live on every page load |
| Plausible | `track()` in `src/lib/consent.ts` | Inert. Calls `window.plausible` only if it exists, and no analytics script is loaded in `index.html`. Also gated on consent being `granted` |
| Supabase Edge Functions | `capture-lead`, `create-checkout`, `stripe-webhook` | Code only. No `supabase/config.toml`, no project is linked in-repo, and no client imports them from `src/` |
| Stripe | Checkout and webhooks, via those functions | Dormant |
| Vercel | `vercel.json` (framework vite, output `dist`, SPA rewrites) | Config present. Whether a Vercel project is actually connected: **unknown** from the repo |

Writes are turned on by `src/config/featureFlags.ts`. All six flags (`STORE_LIVE`,
`PHYSICAL_STORE_LIVE`, `PREMIUM_LIVE`, `GROWTH_LIVE`, `SPONSORS_LIVE`, `AFFILIATE_LIVE`)
are `false`. In dev, `showDormant()` renders dormant modules as marked previews.

## State and caches

| Thing | Delete effect |
|---|---|
| `localStorage["autismcompass-v2"]` | Tracker entries, change log, baseline and dose selections are lost. Not recoverable, it is the only copy. App restarts at defaults |
| `localStorage["autismcompass-consent-v1"]` | Consent banner reappears. Safe |
| `dist/` | Safe. Regenerate with `npm run build`. Gitignored |
| `node_modules/` | Safe. `npm install` |

The evidence tables in `src/data/` are source, not cache. Editing a number there changes
the whole tool, and there is no snapshot of previous values other than git history.

## Scheduled and automated

- Nothing in this repo runs on a timer. No cron, no watcher, no auto-commit.
- No workflow exists on `master`. CI lives only on branch `ci/verify-gate` (open PR #1),
  which adds `.github/workflows/ci.yml`: on push and PR to `master`, Node 20, `npm ci`,
  then `npm run test` and `npm run build`.
- `gh-pages` deploys are manual. Its history is a series of hand-made `deploy: ...`
  commits. Nothing in this repo publishes them, so the exact command used is **unknown**.

## Gotchas

1. **`npm run lint` fails right now, 3 errors.** Two `react-hooks/static-components` in
   `src/features/stackChecker/StackChecker.tsx` (a `ChipGroup` component is defined
   during render at line 34, flagged at 93 and 94) and one
   `react-refresh/only-export-components` in `src/features/legal/Legal.tsx:12`. The CI
   verify gate on PR #1 deliberately runs test and build only, and carries a comment
   saying lint is not gated until these are cleared. Do not add lint to CI before fixing
   them, and do not "fix" CI by loosening the rule.
2. **Three different host assumptions live in the repo at once.** `index.html` sets
   canonical and Open Graph URLs to `https://thomas-reeves1-lab.github.io/autism-compass/`,
   while `public/sitemap.xml` and `public/robots.txt` both point at
   `https://autismcompass.com.au/`, and `vercel.json` is configured for a root-base
   deploy. Whether the `.com.au` domain serves anything is **unknown**. Check which host
   is actually authoritative before touching SEO tags, or the canonical and the sitemap
   will keep disagreeing.
3. **Forgetting `GH_PAGES=1` silently ships a broken Pages build.** `vite.config.ts` sets
   `base` from that env var only. Build without it and every asset path resolves at the
   domain root instead of `/autism-compass/`. Vite does rewrite the absolute `/brand/...`
   paths in `index.html` when base is set, so a correct build looks fine and an incorrect
   one 404s its icons and chunks.
4. **`gh-pages` is behind `master`.** Last deploy commit is 2026-06-12, `master` head is
   2026-06-13. The published `index.html` is missing the PWA manifest link, the Apple
   web-app tags and the FAQ structured data that `master` now has. Deploying is a manual
   step someone has to remember.
5. **`.gitignore` has no `.env` entry, and this repo is public.** It only covers
   `*.local`, which catches `.env.local` but not `.env`. No `.env` file exists today.
   Create one and it is a commit away from being world-readable. Add the ignore rule
   before adding the file.
6. **The store, growth and premium modules look built but are unreachable.** All feature
   flags are `false` and the Supabase functions are not deployed or imported. Reading
   `src/features/store` or `src/features/growth` and assuming it runs in production will
   send you down a dead end.
7. **Safety content can never be paywalled, and a test enforces it.**
   `src/features/growth/ethics.ts` lists `NEVER_GATED` content, and
   `src/features/growth/ethics.test.ts` fails if clinical-safety material is gated. If
   that test goes red, the fix is the gating, never the test.
8. **Local Node is v24, CI pins Node 20.** Something that builds here can still fail the
   gate. The README asks for Node 20+.

## Verify

```bash
npm ci                    # clean install
npm run test              # expect: Test Files 2 passed, Tests 16 passed
npm run build             # expect: tsc clean, then vite writes dist/
npm run lint              # expect: exactly 3 errors (see Gotcha 1). More than 3 = new breakage
npm run dev               # expect: http://localhost:5173 serves the dashboard tab
```
