# Autism Compass — Daily Visual Improvement Plan (2026-06-13)

## Goal
Polish the UI across every page so it earns trust and delights families on first visit. No live flags. No claims. No selling. Visual only.

## Tracks (sequential, each one builds and tests before committing)

### Track A — Footer dark glass + hero credibility strip
- Scope: SafetyShell.tsx (footer), App.tsx (hero section)
- Change: dark navy-glass footer (matches aurora), hero trust pills
- Test: build green, no claim grep hits

### Track B — Nav glow + score rings glass backdrop
- Scope: App.tsx (nav), ScoreRings.tsx
- Change: active nav tab gets subtle leaf-green glow ring; score rings sticky strip gets glass backdrop
- Test: build green

### Track C — KPI + delta animations + tab skeleton
- Scope: KpiGrid.tsx, App.tsx (TabFallback)
- Change: delta chip pulse on change, skeleton pulse loader
- Test: build green + 16 tests

### Track D — Evidence table + study library visual depth
- Scope: EvidenceTable.tsx, StudyLibrary.tsx
- Change: gradient borders on high-evidence rows, colour-coded evidence bands, better search input style
- Test: build green

### Track E — Mobile UX: nav scroll + compact hero
- Scope: App.tsx, index.css
- Change: nav gets scroll-snap, hero title better sizes on sm/xs, thumb-size tap targets
- Test: build green

### Track F — Micro-interactions: hover, focus, press
- Scope: index.css, accent-card, btn classes
- Change: consistent hover glow on all cards, tactile btn-primary press, smooth focus ring
- Test: build green + 16 tests + claim grep clean

## Hard rules (same as overnight-build)
- No *_LIVE flag touched
- No "treats autism" claims
- Build + 16 tests green before each commit
- Claim grep clean at end
