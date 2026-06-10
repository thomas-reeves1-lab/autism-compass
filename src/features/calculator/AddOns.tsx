import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Lock, ChevronDown, ShieldCheck } from 'lucide-react'
import { treatments } from '../../data/evidence'
import type { Treatment } from '../../lib/types'
import { metricLabels } from '../../lib/labels'
import { useAppStore } from '../../store/useAppStore'
import { GlassCard, SectionTitle, EvidenceBadge, Pill } from '../../components/ui'

/** Adjuncts shown as cards (everything except risperidone + NAC which have sliders). */
const ADJUNCTS = treatments.filter((t) => !['risperidone', 'nac'].includes(t.id))

export function AddOns() {
  return (
    <GlassCard>
      <SectionTitle
        icon={<Leaf size={20} />}
        title="Add-on options to learn about"
        subtitle="Switch options on to see what the evidence model estimates. Supplements need a safety check first. Doctor-only items are locked."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ADJUNCTS.map((t) => (
          <AddOnCard key={t.id} t={t} />
        ))}
      </div>
    </GlassCard>
  )
}

function AddOnCard({ t }: { t: Treatment }) {
  const selected = useAppStore((s) => s.selectedAdjuncts.includes(t.id))
  const toggle = useAppStore((s) => s.toggleAdjunct)
  const [open, setOpen] = useState(false)
  const [showSafety, setShowSafety] = useState(false)

  const handleToggle = () => {
    if (selected) return toggle(t.id)
    if (t.doctorOnly) return // locked
    setShowSafety(true) // require the safety check before switching on
  }

  return (
    <div className={`rounded-xl border p-4 transition ${selected ? 'border-brand-leaf bg-safe-soft/40' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
          <p className="text-xs text-slate-500">{t.type}</p>
        </div>
        <EvidenceBadge level={t.evidenceLevel} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {t.targetMetrics.slice(0, 3).map((m) => (
          <span key={m} className="pill bg-slate-50 text-slate-500">
            {metricLabels[m]}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {t.doctorOnly ? (
          <Pill tone="doctor">
            <Lock size={12} /> Doctor-only discussion item
          </Pill>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden border-t border-slate-100 pt-3 text-xs text-slate-600"
          >
            <p className="mb-2">{t.plainEnglishSummary}</p>
            <p className="mb-2 italic text-slate-500">{t.confidenceNote}</p>
            {t.sideEffects.length > 0 && (
              <p className="mb-1">
                <span className="font-bold">Side effects: </span>
                {t.sideEffects.join(', ')}
              </p>
            )}
            <p className="mb-1">
              <span className="font-bold">Studied dose: </span>
              {t.studiedDoseRange}
            </p>
            {t.doctorQuestions.length > 0 && (
              <p>
                <span className="font-bold">Ask the doctor: </span>
                {t.doctorQuestions[0]}
              </p>
            )}
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
    </div>
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
