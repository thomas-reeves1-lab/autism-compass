import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Phone, ShieldAlert, ChevronDown, ShieldCheck, Stethoscope, BookOpen, CheckCircle2 } from './icons'

/** Modern, slim clinical strip — on every page. Not a chunky box. */
export function TopWarningBanner() {
  return (
    <motion.div
      id="site-top-banner"
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      className="relative border-b border-brand-deep/10 bg-white/75 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs text-slate-600">
        <ShieldAlert size={15} className="shrink-0 text-brand-navy" />
        <p className="leading-tight">
          <span className="font-bold uppercase tracking-wide text-brand-deep">Education only</span>
          <span className="mx-1.5 text-slate-300">·</span>
          {/* Full text on sm+, short on mobile to keep banner single-line */}
          <span className="hidden sm:inline">Not medical advice, not a dosing tool. Always speak to the treating doctor before changing anything.</span>
          <span className="sm:hidden">Not medical advice.</span>
        </p>
      </div>
      {/* clinical accent hairline */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, #0e5196, #2c7be5 45%, #7bc043)' }}
      />
    </motion.div>
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
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="hidden items-center gap-1 text-xs font-bold text-danger/80 hover:text-danger sm:inline-flex"
        >
          Signs{' '}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="inline-block"
          >
            <ChevronDown size={13} />
          </motion.span>
        </motion.button>
        <motion.a
          href="tel:000"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="btn-danger shrink-0 px-3 py-1.5 text-xs"
          aria-label="Call 000 emergency services"
        >
          <Phone size={14} /> Call 000
        </motion.a>
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
  { label: 'Registered NDIS provider',       Icon: ShieldCheck,  iconColour: '#7bc8ff' },
  { label: 'Reviewed by a Registered Nurse', Icon: Stethoscope,  iconColour: '#86efac' },
  { label: 'Education only',                 Icon: BookOpen,     iconColour: '#c4b5fd' },
  { label: 'No cure claims',                 Icon: CheckCircle2, iconColour: '#fde68a' },
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
          {TRUST_PILLS.map((p, i) => (
            <motion.span
              key={p.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              className="inline-flex cursor-default items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white/75"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.13)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p.Icon size={12} style={{ color: p.iconColour, flexShrink: 0 }} />
              {p.label}
            </motion.span>
          ))}
        </div>

        {/* Links row */}
        {onOpen && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <motion.button
                key={l.key}
                onClick={() => onOpen(l.key)}
                whileHover={{ y: -1, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="text-xs font-semibold text-white/50 transition hover:text-white/90"
              >
                {l.label}
              </motion.button>
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
