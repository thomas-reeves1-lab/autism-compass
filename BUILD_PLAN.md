# Overnight Build Plan — Autism Compass (safe tracks only)

## Goal
Advance the approved money plan overnight using ONLY work that cannot cross a compliance line, so it is safe to run unsupervised.

## Hard safety rule (non-negotiable, unsupervised run)
Do NOT, under any circumstances tonight:
- flip any `*_LIVE` feature flag (STORE, GROWTH, SPONSORS, AFFILIATE, PREMIUM stay false)
- write or imply any "treats/cures/fixes autism" claim
- present legal drafts as final or remove the "lawyer to review" notices
- send any email or connect any live payment/affiliate account
- deploy anything that sells or collects money

Every track below is dormant, education-only, or content-draft. All reversible.

## Tracks (file-isolated, independent)
- **Track A — SEO foundation.** `public/robots.txt`, `public/sitemap.xml`, richer FAQ/MedicalWebPage JSON-LD in `index.html`. Smoke: files exist, valid, list real routes; no banned claim in output.
- **Track B — Email nurture drafts.** `src/content/nurture.ts` — welcome + 5 nurture emails as DRAFT data (not wired to send). Education + give-value-first, TGA-safe. Smoke: array length, every email has subject+body, grep clean of claims.
- **Track C — "What it is / what it isn't" trust section.** A safe credibility block on the dashboard (the user asked for this earlier). Smoke: renders, build green.
- **Track D — webapp-testing + a11y quick pass.** Run build/tests, fix only small safe issues. Smoke: build + 16 tests green, zero console errors.

## Out of scope tonight
Anything that sells, any live flag, any real legal/medical sign-off content, payments, email sending, ads.

## Risks / most-likely conflict
Track A and Track C both touch presentation near the hero; A edits `index.html` head only, C edits `App.tsx` body — no shared lines. Watch `index.html` if both grow.

## Loop
`/loop 10m`: one safe track per wake, update MORNING_BRIEFING.md each time. When safe tracks are exhausted, STOP looping (do not invent risky work).
