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

/** Footer on every page. */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/40 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-600">
          Education only. Not medical advice. Not a diagnosis tool. Not a dosing tool.
        </p>
        <p className="mt-1">
          Do not change medication without the prescriber. For urgent risk, seek urgent medical help.
        </p>
        <p className="mt-2 text-slate-400">A registered provider evidence project.</p>
      </div>
    </footer>
  )
}
