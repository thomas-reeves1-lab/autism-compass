-- AutismCompass store backend schema (DORMANT until STORE_LIVE).
-- Row Level Security ON everywhere. Only the service role (used by edge functions)
-- may write. Nothing here stores clinical/tracker data — that stays in the browser.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null check (type in ('digital','physical')),
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'AUD',
  evidence_level text,
  tga_disclaimer text not null,           -- required on every product
  description_plain_english text,
  image_url text,
  stripe_price_id text,
  active boolean not null default false,   -- dormant by default
  -- physical-only fields (stubbed until PHYSICAL_STORE_LIVE)
  stock integer,
  weight_grams integer,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_session_id text unique,
  status text not null default 'pending',
  total_cents integer not null,
  items jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  tier text not null check (tier in ('free','premium','practitioner')),
  stripe_sub_id text unique,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  magnet text,
  consent_marketing boolean not null default false,  -- no pre-ticked boxes
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table orders enable row level security;
alter table subscriptions enable row level security;
alter table leads enable row level security;

-- Public may read only ACTIVE products. No public writes anywhere.
create policy "public reads active products"
  on products for select using (active = true);

-- Orders, subscriptions, leads: no public access. Service role bypasses RLS,
-- so edge functions (service role) handle all writes. No client-side inserts.
