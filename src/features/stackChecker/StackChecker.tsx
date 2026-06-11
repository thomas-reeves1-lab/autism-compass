import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, AlertTriangle, CheckCircle2, Lock } from '../../components/icons'
import { treatments } from '../../data/evidence'
import { checkStack, type TrafficLight } from '../../lib/safety'
import { GlassCard, SectionTitle, AnimatedNumber } from '../../components/ui'

const LIGHT_META: Record<TrafficLight, { label: string; text: string; bg: string; hex: string; grad: string }> = {
  green: { label: 'Clear to discuss', text: 'text-safe', bg: 'bg-safe-soft', hex: '#15803D', grad: 'linear-gradient(110deg,#15803D,#1FA055)' },
  yellow: { label: 'Caution — bring to pharmacist', text: 'text-caution', bg: 'bg-caution-soft', hex: '#B45309', grad: 'linear-gradient(110deg,#B45309,#D08214)' },
  orange: { label: 'Doctor / pharmacist review recommended', text: 'text-doctor', bg: 'bg-doctor-soft', hex: '#C2410C', grad: 'linear-gradient(110deg,#C2410C,#E0631F)' },
  red: { label: 'Do not self-start — medical advice needed', text: 'text-danger', bg: 'bg-danger-soft', hex: '#B91C1C', grad: 'linear-gradient(110deg,#B91C1C,#DC2F2F)' },
}

export function StackChecker() {
  const [selected, setSelected] = useState<string[]>(['risperidone'])
  const result = checkStack(selected)
  const meta = LIGHT_META[result.light]
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <GlassCard>
      <SectionTitle
        icon={<Plane size={20} />}
        title="Safe Stack Checker"
        subtitle="A calm pre-flight check of everything together. Tick what is being taken or considered. This is a conversation helper, not medical advice."
      />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Pre-flight check — select items</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {treatments
          .filter((t) => t.id !== 'watchful')
          .map((t) => {
            const on = selected.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggle(t.id)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  on ? 'bg-brand-navy text-white shadow-card' : 'bg-white text-slate-600 ring-1 ring-inset ring-brand-deep/15 hover:ring-brand-navy/40'
                }`}
              >
                {t.doctorOnly && <Lock size={11} className={on ? 'text-brand-leaf' : 'text-doctor'} />} {t.name}
              </button>
            )
          })}
      </div>

      {/* Animated traffic-light result */}
      <motion.div
        key={result.light}
        initial={{ scale: 0.97, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-2xl p-4 text-white shadow-glass"
        style={{ background: meta.grad }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(60% 120% at 100% 0%, rgba(255,255,255,0.5), transparent)' }} />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-base font-black">
            {result.light === 'green' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            {meta.label}
          </div>
          <div className="text-right">
            <div className="text-3xl font-black leading-none">
              <AnimatedNumber value={result.score} />
            </div>
            <div className="text-[10px] uppercase tracking-wide text-white/70">stack score /100</div>
          </div>
        </div>
      </motion.div>

      {/* Flags as accent cards */}
      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {result.flags.map((f, i) => {
            const m = LIGHT_META[f.level]
            return (
              <motion.div
                key={f.title}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className="accent-card p-3 pl-4"
                style={{ ['--accent' as string]: m.hex }}
              >
                <p className={`text-sm font-bold ${m.text}`}>{f.title}</p>
                <p className="text-xs text-slate-600">{f.detail}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {result.doctorOnlyItems.length > 0 && (
        <p className="mt-3 rounded-lg bg-doctor-soft px-3 py-2 text-xs text-doctor">
          Doctor-only items selected: {result.doctorOnlyItems.join(', ')}. Do not use this website to
          self-start them.
        </p>
      )}

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-brand-deep/8">
        <p className="font-bold text-slate-700">Questions to ask the pharmacist:</p>
        <ul className="ml-4 list-disc">
          <li>Can these be taken together?</li>
          <li>Could this change risperidone levels?</li>
          <li>Could this make sleepiness worse?</li>
          <li>Could this affect bleeding risk or seizures?</li>
          <li>Should any doses be separated from fibre?</li>
          <li>What should we stop and call you about?</li>
        </ul>
      </div>
    </GlassCard>
  )
}
