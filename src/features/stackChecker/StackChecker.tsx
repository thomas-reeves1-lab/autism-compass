import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, AlertTriangle, CheckCircle2, Lock } from '../../components/icons'
import { treatments } from '../../data/evidence'
import { checkStack, type TrafficLight } from '../../lib/safety'
import { GlassCard, SectionTitle, AnimatedNumber } from '../../components/ui'

const LIGHT_META: Record<TrafficLight, { label: string; text: string; bg: string; hex: string; grad: string }> = {
  green:  { label: 'Clear to discuss',                       text: 'text-safe',    bg: 'bg-safe-soft',    hex: '#15803D', grad: 'linear-gradient(110deg,#15803D,#1FA055)' },
  yellow: { label: 'Caution — bring to pharmacist',          text: 'text-caution', bg: 'bg-caution-soft', hex: '#B45309', grad: 'linear-gradient(110deg,#B45309,#D08214)' },
  orange: { label: 'Doctor / pharmacist review recommended', text: 'text-doctor',  bg: 'bg-doctor-soft',  hex: '#C2410C', grad: 'linear-gradient(110deg,#C2410C,#E0631F)' },
  red:    { label: 'Do not self-start — medical advice needed', text: 'text-danger', bg: 'bg-danger-soft', hex: '#B91C1C', grad: 'linear-gradient(110deg,#B91C1C,#DC2F2F)' },
}

const PHARMACIST_QUESTIONS = [
  'Can these be taken together safely?',
  'Could any of these change risperidone levels?',
  'Could this combination make sleepiness worse?',
  'Could this affect bleeding risk or seizures?',
  'Should any doses be separated by time or food?',
  'What signs should we call you about straight away?',
]

const doctorItems = treatments.filter((t) => t.id !== 'watchful' && t.doctorOnly)
const supplementItems = treatments.filter((t) => t.id !== 'watchful' && !t.doctorOnly)

export function StackChecker() {
  const [selected, setSelected] = useState<string[]>(['risperidone'])
  const result = checkStack(selected)
  const meta = LIGHT_META[result.light]
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const ChipGroup = ({ label, accent, items }: { label: string; accent: string; items: typeof treatments }) => (
    <div className="mb-3">
      <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: accent }}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t) => {
          const on = selected.includes(t.id)
          return (
            <motion.button
              key={t.id}
              onClick={() => toggle(t.id)}
              whileTap={{ scale: 0.94 }}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition"
              style={on ? {
                background: accent,
                color: '#fff',
                boxShadow: `0 2px 8px -3px ${accent}88`,
              } : {
                background: 'rgba(255,255,255,0.85)',
                color: '#475569',
                boxShadow: 'inset 0 0 0 1px rgba(14,81,150,0.15)',
              }}
            >
              {t.doctorOnly && (
                <Lock size={11} style={{ color: on ? 'rgba(255,255,255,0.75)' : '#C2410C' }} />
              )}
              {t.name}
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  return (
    <GlassCard>
      <SectionTitle
        icon={<Plane size={20} />}
        title="Safe Stack Checker"
        subtitle="A calm pre-flight check of everything together. Tick what is being taken or considered. This is a conversation helper, not medical advice."
      />

      <div
        className="mb-4 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5fb)', border: '1px solid rgba(14,81,150,0.09)' }}
      >
        <div className="mb-2 flex items-center gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Pre-flight — select what is being taken</p>
          {selected.length > 0 && (
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white"
              style={{ background: 'linear-gradient(110deg,#0e5196,#2c7be5)' }}
            >
              {selected.length} selected
            </span>
          )}
        </div>

        <ChipGroup label="Doctor-prescribed items" accent="#C2410C" items={doctorItems} />
        <ChipGroup label="Supplements and other" accent="#0E5196" items={supplementItems} />
      </div>

      {/* Animated traffic-light result */}
      <motion.div
        key={result.light}
        initial={{ scale: 0.97, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-2xl p-4 text-white"
        style={{ background: meta.grad, boxShadow: `0 8px 24px -10px ${meta.hex}88` }}
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

      {/* Flags */}
      <div className="mt-3 space-y-2">
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
                transition={{ delay: Math.min(i, 12) * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
                className="relative overflow-hidden rounded-xl p-3 pl-5"
                style={{
                  background: `linear-gradient(135deg, white, color-mix(in srgb, ${m.hex} 5%, white))`,
                  border: `1px solid ${m.hex}22`,
                  boxShadow: `0 2px 8px -4px ${m.hex}44`,
                }}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl"
                  style={{ background: m.hex }}
                />
                <p className={`text-sm font-bold ${m.text}`}>{f.title}</p>
                <p className="text-xs text-slate-600">{f.detail}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {result.flags.length === 0 && selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-safe"
            style={{ background: 'rgba(21,128,61,0.07)', border: '1px solid rgba(21,128,61,0.18)' }}
          >
            <CheckCircle2 size={16} className="shrink-0 text-safe" />
            No interaction flags detected for this combination. Always confirm with a pharmacist.
          </motion.div>
        )}
      </div>

      {result.doctorOnlyItems.length > 0 && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs text-doctor"
          style={{ background: 'rgba(194,65,12,0.07)', border: '1px solid rgba(194,65,12,0.2)' }}
        >
          <Lock size={14} className="mt-0.5 shrink-0 text-doctor" />
          <p><span className="font-extrabold">Doctor-only items selected:</span>{' '}{result.doctorOnlyItems.join(', ')}. Do not use this website to self-start them.</p>
        </div>
      )}

      {/* Pharmacist questions — numbered cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="mt-4 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #f0f7ff, #e8f4fd)', border: '1px solid rgba(44,123,229,0.12)' }}
      >
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-brand-navy">Questions to ask the pharmacist</p>
        <ol className="space-y-2">
          {PHARMACIST_QUESTIONS.map((q, i) => (
            <motion.li
              key={q}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 12) * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
              className="flex items-start gap-2.5"
            >
              <span
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                style={{ background: 'linear-gradient(135deg, #0e5196, #2c7be5)' }}
              >
                {i + 1}
              </span>
              <span className="text-xs text-slate-600">{q}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </GlassCard>
  )
}
