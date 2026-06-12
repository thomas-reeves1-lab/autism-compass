import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Lock, ChevronDown, ShieldCheck } from '../../components/icons'
import { treatments } from '../../data/evidence'
import type { Treatment, MetricKey } from '../../lib/types'
import { metricLabels } from '../../lib/labels'
import { useAppStore } from '../../store/useAppStore'
import { useProjection } from '../../lib/useProjection'
import { GlassCard, SectionTitle, EvidenceBadge, SafetyScoreChip } from '../../components/ui'
import { SponsorSlot } from '../../components/SponsorSlot'
import { safetyScore } from '../../lib/safety'

const SUPPLEMENT_CATEGORIES = new Set([
  'Supplement', 'Vitamin', 'Amino acid', 'Fatty acid', 'Mineral', 'Fibre', 'Plant extract', 'Sleep support', 'Gut support',
])

/** Sort weight: medicines first (grouped under risperidone), then adjuncts, then supplements. */
function groupWeight(cat: string): number {
  if (cat === 'Medication') return 0
  if (cat === 'Prescription adjunct') return 1
  if (cat === 'Not recommended') return 8
  if (cat === 'No intervention model') return 9
  return 4
}

/** Adjuncts shown as cards (everything except risperidone + NAC which have sliders, and watchful). */
const ADJUNCTS = treatments
  .filter((t) => !['risperidone', 'nac', 'watchful'].includes(t.id))
  .slice()
  .sort((a, b) => groupWeight(a.category) - groupWeight(b.category))

export function AddOns() {
  const selectedAdjuncts = useAppStore((s) => s.selectedAdjuncts)
  const lastAdded = useAppStore((s) => s.lastAdded)
  const projection = useProjection()
  // Selected options float to the top, then medicines-first by group weight.
  const ordered = [...ADJUNCTS].sort((a, b) => {
    const sa = selectedAdjuncts.includes(a.id) ? 0 : 1
    const sb = selectedAdjuncts.includes(b.id) ? 0 : 1
    if (sa !== sb) return sa - sb
    return groupWeight(a.category) - groupWeight(b.category)
  })

  // What did the most recently added option actually move?
  const lastEffects = (
    lastAdded
      ? (Object.keys(projection) as MetricKey[]).flatMap((m) => {
          const c = projection[m].contributions.find((x) => x.treatmentId === lastAdded)
          return c ? [{ metric: m, delta: c.delta, name: c.treatmentName }] : []
        })
      : []
  )
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 5)

  return (
    <GlassCard>
      <SectionTitle
        icon={<Leaf size={20} />}
        title="Add-on options to learn about"
        subtitle="Switch options on — they jump to the top. Supplements need a safety check first. Doctor-only items open an education gate."
      />

      <AnimatePresence mode="wait">
        {lastAdded && lastEffects.length > 0 && (
          <motion.div
            key={lastAdded}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex flex-wrap items-center gap-2 rounded-xl p-3 text-white shadow-card"
            style={{ background: 'linear-gradient(110deg, #0E5196, #1740A8)' }}
          >
            <span className="rounded-md bg-brand-leaf/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-deep">
              Just added
            </span>
            <span className="font-extrabold">{lastEffects[0].name}</span>
            <span className="text-xs text-white/60">moved</span>
            {lastEffects.map((e) => (
              <span
                key={e.metric}
                className="pill-solid"
                style={{ background: e.delta < 0 ? '#15803D' : '#C2410C' }}
              >
                {e.delta < 0 ? '▼' : '▲'} {metricLabels[e.metric]} {Math.abs(e.delta)}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ordered.map((t) => (
          <AddOnCard key={t.id} t={t} />
        ))}
      </motion.div>
    </GlassCard>
  )
}

function AddOnCard({ t }: { t: Treatment }) {
  const selected = useAppStore((s) => s.selectedAdjuncts.includes(t.id))
  const toggle = useAppStore((s) => s.toggleAdjunct)
  const [open, setOpen] = useState(false)
  const [showSafety, setShowSafety] = useState(false)
  const [showDoctor, setShowDoctor] = useState(false)

  const handleToggle = () => {
    if (selected) return toggle(t.id)
    if (t.doctorOnly) return setShowDoctor(true) // doctor-only education gate
    setShowSafety(true) // supplement safety check before switching on
  }

  const accentHex = t.doctorOnly ? '#C2410C' : SUPPLEMENT_CATEGORIES.has(t.category) ? '#15803D' : '#0E5196'

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="relative overflow-hidden rounded-xl p-4 pl-5"
      style={{
        background: selected
          ? `linear-gradient(135deg, color-mix(in srgb, ${accentHex} 8%, white), color-mix(in srgb, ${accentHex} 4%, white))`
          : 'linear-gradient(135deg, #ffffff, #f8fafc)',
        border: selected ? `1.5px solid ${accentHex}40` : '1px solid rgba(14,81,150,0.1)',
        boxShadow: selected ? `0 4px 16px -6px ${accentHex}55` : '0 2px 8px -4px rgba(6,32,63,0.08)',
      }}
    >
      <span
        className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl transition-all"
        style={{ background: selected ? accentHex : `${accentHex}44` }}
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
          <p className="text-xs text-slate-500">{t.type}</p>
        </div>
        <EvidenceBadge level={t.evidenceLevel} />
      </div>

      <div className="mt-2">
        <SafetyScoreChip score={safetyScore(t)} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {t.targetMetrics.slice(0, 3).map((m) => (
          <span
            key={m}
            className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: `${accentHex}12`, color: accentHex }}
          >
            {metricLabels[m]}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {t.doctorOnly ? (
          selected ? (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-doctor">
              <input type="checkbox" checked onChange={() => toggle(t.id)} className="h-4 w-4 accent-doctor" />
              On (doctor-only)
            </label>
          ) : (
            <button onClick={() => setShowDoctor(true)} className="flex items-center gap-1.5 text-sm font-bold text-doctor">
              <Lock size={13} /> Add (doctor only)
            </button>
          )
        ) : (
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={selected} onChange={handleToggle} className="h-4 w-4 accent-brand-navy" />
            {selected ? 'On' : 'Add to model'}
          </label>
        )}
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-xs font-bold text-brand-navy">
          Learn more <ChevronDown size={14} className={open ? 'rotate-180 transition' : 'transition'} />
        </button>
      </div>

      {SUPPLEMENT_CATEGORIES.has(t.category) && (
        <SponsorSlot
          kind="supplement"
          sponsor={undefined}
          disclaimer="Not a medicine. Not approved to treat autism. Ask your doctor or pharmacist."
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div
              className="space-y-2 rounded-xl p-3 text-xs text-slate-600"
              style={{ background: `${accentHex}06`, border: `1px solid ${accentHex}14` }}
            >
              <p>{t.plainEnglishSummary}</p>
              <p className="italic text-slate-400">{t.confidenceNote}</p>
              {t.sideEffects.length > 0 && (
                <p><span className="font-bold text-slate-700">Side effects: </span>{t.sideEffects.join(', ')}</p>
              )}
              <p><span className="font-bold text-slate-700">Studied dose: </span>{t.studiedDoseRange}</p>
              {t.doctorQuestions.length > 0 && (
                <p style={{ color: accentHex }}><span className="font-bold">Ask: </span>{t.doctorQuestions[0]}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSafety && (
          <SupplementSafetyModal
            t={t}
            onClose={() => setShowSafety(false)}
            onConfirm={() => {
              toggle(t.id)
              setShowSafety(false)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDoctor && (
          <DoctorGateModal
            t={t}
            onClose={() => setShowDoctor(false)}
            onConfirm={() => {
              toggle(t.id)
              setShowDoctor(false)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DoctorGateModal({ t, onClose, onConfirm }: { t: Treatment; onClose: () => void; onConfirm: () => void }) {
  const checks = [
    'I understand this is a prescription / doctor-only medicine',
    'I will NOT start, stop, or change this without the prescriber',
    'I understand this website is education only, not medical advice',
    'I am adding this only to learn what the evidence model shows',
    'I understand it can interact with other medicines and needs monitoring',
  ]
  const [ticked, setTicked] = useState<boolean[]>(checks.map(() => false))
  const all = ticked.every(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="card max-w-md border-t-4 border-doctor p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-2 text-doctor">
          <Lock />
          <h3 className="text-lg font-extrabold">Doctor-only education gate</h3>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          <span className="font-bold">{t.name}</span> is a prescription / doctor-only medicine. You can
          add it to the education model to learn what studies found — but only the prescriber can ever
          decide to use it. Please confirm:
        </p>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <label key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={ticked[i]}
                onChange={() => setTicked((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                className="mt-0.5 h-4 w-4 accent-doctor"
              />
              {c}
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!all}
            className="btn text-sm bg-doctor text-white hover:opacity-90 disabled:opacity-50"
          >
            Add to model (education only)
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SupplementSafetyModal({ t, onClose, onConfirm }: { t: Treatment; onClose: () => void; onConfirm: () => void }) {
  const checks = [
    'I understand this is not medical advice',
    'I will ask the treating doctor or pharmacist before using this',
    'I understand supplements can interact with medication',
    'I understand "natural" does not mean safe',
    'I understand dose and product quality matter',
  ]
  const [ticked, setTicked] = useState<boolean[]>(checks.map(() => false))
  const all = ticked.every(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="card max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-2 text-brand-deep">
          <ShieldCheck className="text-safe" />
          <h3 className="text-lg font-extrabold">Supplement safety check</h3>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Before switching on <span className="font-bold">{t.name}</span> in the education model, please confirm:
        </p>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <label key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={ticked[i]}
                onChange={() => setTicked((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                className="mt-0.5 h-4 w-4 accent-brand-navy"
              />
              {c}
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={!all} className="btn-primary text-sm">
            Add to model
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
