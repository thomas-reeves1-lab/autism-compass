import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Phone, ShieldAlert, ChevronDown } from './icons'

/** Modern, slim clinical strip — on every page. Not a chunky box. */
export function TopWarningBanner() {
  return (
    <div className="relative border-b border-brand-deep/10 bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs text-slate-600">
        <ShieldAlert size={15} className="shrink-0 text-brand-navy" />
        <p className="leading-tight">
          <span className="font-bold uppercase tracking-wide text-brand-deep">Education only</span>
          <span className="mx-1.5 text-slate-300">·</span>
          Not medical advice, not a dosing tool. Always speak to the treating doctor before changing
          anything.
        </p>
      </div>
      {/* clinical accent hairline */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, #0e5196, #2c7be5 45%, #7bc043)' }}
      />
    </div>
  )
}

const DANGER_SIGNS =
  'Serious aggression, self-injury, seizure, breathing trouble, overdose concern, allergic reaction, sudden severe behaviour change, collapse, high fever with stiff muscles, or chest pain.'

/** Stripe-style slim emergency banner with an expandable detail row. */
export function EmergencyWarning() {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-danger/30" style={{ background: 'linear-gradient(90deg, rgba(210,59,59,0.10), rgba(210,59,59,0.04))' }}>
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-danger/12 text-danger">
          <AlertTriangle size={16} />
        </span>
        <p className="min-w-0 flex-1 text-sm text-danger">
          <span className="font-extrabold">Immediate danger?</span>{' '}
          <span className="text-danger/85">Seizure, breathing trouble, collapse or severe change — get urgent help now.</span>
        </p>
        <button
          onClick={() => setOpen((o) => !o)}
          className="hidden items-center gap-1 text-xs font-bold text-danger/80 hover:text-danger sm:inline-flex"
        >
          Signs <ChevronDown size={13} className={open ? 'rotate-180 transition' : 'transition'} />
        </button>
        <a
          href="tel:000"
          className="btn-danger shrink-0 px-3 py-1.5 text-xs"
          aria-label="Call 000 emergency services"
        >
          <Phone size={14} /> Call 000
        </a>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-danger/15 px-3 py-2 text-xs text-danger/80"
          >
            {DANGER_SIGNS} In Australia, call <span className="font-bold">000</span> or go to hospital.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TRUST_PILLS = [
  { label: 'Registered NDIS provider' },
  { label: 'Reviewed by a Registered Nurse' },
  { label: 'Education only' },
  { label: 'No cure claims' },
]

/** Footer on every page — dark glass to match the aurora. */
export function SiteFooter({
  onOpen,
}: {
  onOpen?: (doc: 'guide' | 'privacy' | 'terms' | 'refunds' | 'affiliate') => void
}) {
  const links: { key: 'guide' | 'privacy' | 'terms' | 'refunds' | 'affiliate'; label: string }[] = [
    { key: 'guide', label: 'Free guide' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'terms', label: 'Terms' },
    { key: 'refunds', label: 'Refunds' },
    { key: 'affiliate', label: 'Affiliate disclosure' },
  ]
  return (
    <footer
      className="mt-12 border-t border-white/10"
      style={{
        background: 'linear-gradient(180deg, rgba(5,12,26,0.0) 0%, rgba(5,12,26,0.88) 18%, #050c1a 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Gradient accent hairline at top */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #0e5196 20%, #2c7be5 50%, #7bc043 80%, transparent)' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Trust pills row */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {TRUST_PILLS.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/70"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-leaf" />
              {p.label}
            </span>
          ))}
        </div>

        {/* Links row */}
        {onOpen && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => onOpen(l.key)}
                className="text-xs font-semibold text-white/50 transition hover:text-white/90"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-[11px] font-bold text-white/40">
          Education only. Not medical advice. Not a diagnosis tool. Not a dosing tool.
        </p>
        <p className="mt-1 text-center text-[11px] text-white/30">
          Do not change medication without the prescriber. For urgent risk, seek urgent medical help.
        </p>
        <p className="mt-3 text-center text-[10px] text-white/20">
          A registered NDIS provider evidence project. Tasmania, Australia.
        </p>
      </div>
    </footer>
  )
}
