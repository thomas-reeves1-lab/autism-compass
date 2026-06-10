# AutismCompass

An animated, family-friendly **evidence calculator** for ASD level 3 style behaviours. It shows what published studies found about common behaviour and supplement pathways, tracks changes over time, and helps families prepare for the doctor.

> **This is not medical advice.** It does not tell you what to take or what dose to use. It is only a visual summary of published study findings. Always speak to the treating doctor before changing anything.

Case name `moroC` is used throughout. Names have been changed for privacy.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run test     # vitest (calculator + ethics rail)
```

Node 20+ recommended.

## What is built (and what is live)

| Area | State |
|---|---|
| Evidence calculator, KPI faces, charts | **Live, free** |
| Safe Stack Checker, Loop Map, What Changed | **Live, free** |
| Medication Safety tab, Doctor Visit Pack | **Live, free** |
| Family tracker + CSV export | **Live, free** (local storage only) |
| PDF / premium exports | Built, gated by `PREMIUM_LIVE` |
| Store (digital + physical), Stripe, Supabase | Built, **dormant** `STORE_LIVE` |
| Growth engine (offers, funnels, upsells, plans) | Built, **dormant** `GROWTH_LIVE`, honest defaults |

Core safety tools are **always free** and can never be paywalled. This is enforced by a test (`src/features/growth/ethics.test.ts`).

## Feature flags — how to go live

Edit `src/config/featureFlags.ts`:

```ts
export const featureFlags = {
  STORE_LIVE: false,          // turn the store on
  PHYSICAL_STORE_LIVE: false, // expose physical supplement catalogue
  PREMIUM_LIVE: false,        // require payment for premium exports
  GROWTH_LIVE: false,         // show the growth / offers engine
}
```

In dev, dormant modules render in a clearly marked **preview** so you can build and review them. In production they stay hidden until their flag is `true`.

## The growth ethics rail

`src/features/growth/ethics.ts` gates every persuasion mechanism. Dark patterns (fake scarcity, fake countdowns, fear selling, exit-intent) ship **OFF**. Honest persuasion (real guarantees, value stacks, honest urgency) ships **ON**. Clinical-safety content is listed in `NEVER_GATED` and can never be locked behind a paywall.

## Editing the evidence

Everything is data-driven and editable:

- **`src/data/evidence.ts`** — the 25 treatments. Each effect carries a `maxEffect`, an honesty `label`, an `uncertainty` band, and a plain-English `reason`. Change a number here and the whole tool updates.
- **`src/data/studies.ts`** — the study library (plain-English takeaways).
- **`src/data/evidence.ts` → `baselineDefaults`** — the default `moroC` baseline scores.

### Add a treatment

Append a `Treatment` object to `treatments` in `evidence.ts` (copy an existing one). Add any new study to `studies.ts`. It appears automatically in the add-on cards, evidence table, and stack checker.

### How the model works

`src/lib/calculator.ts` → `calculateProjectedMetrics`:

- Dose response is a **saturating curve**, not a straight line.
- Effects apply in "remaining room" space so a metric never goes below 0 or above 10.
- Each metric shows an **uncertainty band** and the honesty labels of its contributors.
- **Evidence modes**: *Study only* (direct findings), *Practical estimate* (direct + estimated), *Explore* (includes theoretical).
- Skin-picking benefit comes only from NAC's body-focused-repetitive-behaviour evidence. Ginkgo never improves a metric. Watchful Waiting changes nothing.

## Store backend (Supabase + Stripe)

Schema in `supabase/migrations/0001_init.sql` (products, orders, subscriptions, leads — RLS on, service-role writes only). Edge functions in `supabase/functions/`:

- `create-checkout` — Stripe Checkout session (one-off + subscription, order bumps, one-click upsell)
- `stripe-webhook` — signature-verified, idempotent fulfilment + subscription state
- `capture-lead` — email capture with explicit consent (no pre-ticked boxes)

To go live: create a Supabase project, run the migration, deploy the functions, set secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL`), then flip `STORE_LIVE`.

## Deploy

Vercel (or any static host): `npm run build`, deploy `dist/`. Supabase hosts the backend. Set env vars for the Stripe publishable key and Supabase URL.

## Brand

Logo at `public/brand/iel-logo.png`. Colours in `tailwind.config.js`: navy `#0E5196`, deep `#003D7A`, leaf `#7BC043`, sky `#E8F4FB`. Replace the logo file to rebrand.

## Privacy

The family tracker stores data in the browser (`localStorage`) only. Nothing is sent to any server unless you export it. No personal data goes to external APIs.

---

A registered provider evidence project. Education only. Not medical advice. Not a diagnosis tool. Not a dosing tool.
