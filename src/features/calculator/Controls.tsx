import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Pill as PillIcon, ChevronDown } from '../../components/icons'
import { useAppStore } from '../../store/useAppStore'
import { metricLabels } from '../../lib/labels'
import { faceFor } from '../../lib/faceScale'
import type { MetricKey } from '../../lib/types'
import { GlassCard, Pill, SafetyScoreChip } from '../../components/ui'
import { safetyScore } from '../../lib/safety'
import { treatmentById } from '../../data/evidence'

const NAC_TSP: Record<number, string> = {
  600: '¼ tsp', 900: '⅜ tsp', 1200: '½ tsp', 1800: '¾ tsp', 2400: '1 tsp', 2700: '1⅛ tsp',
}
function nearestTsp(mg: number): string {
  if (mg <= 0) return '—'
  const keys = Object.keys(NAC_TSP).map(Number)
  return NAC_TSP[keys.reduce((a, b) => (Math.abs(b - mg) < Math.abs(a - mg) ? b : a))]
}

/** Compact, full-width dose controls: Risperidone and NAC side by side. */
export function DoseSliders() {
  const { risperidoneDose, nacDose, setRisperidone, setNac } = useAppStore()
  return (
    <GlassCard className="!p-4">
      <div className="mb-3 flex items-center gap-2">
        <PillIcon size={18} className="text-brand-navy" />
        <h2 className="text-base font-black text-brand-deep">Medication &amp; supplement sliders</h2>
        <span className="ml-auto text-[11px] text-slate-400">Education only · not a recommendation</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Risperidone */}
        <motion.div
          className="relative overflow-hidden rounded-xl p-3.5 pl-5"
          whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(194,65,12,0.3)' }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            background: 'linear-gradient(135deg, rgba(194,65,12,0.07), rgba(194,65,12,0.03))',
            border: '1px solid rgba(194,65,12,0.2)',
            boxShadow: '0 2px 8px -4px rgba(194,65,12,0.2)',
          }}
        >
          <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: '#C2410C' }} />
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-brand-deep">Risperidone</span>
            <div className="flex items-center gap-1.5">
              <SafetyScoreChip score={safetyScore(treatmentById('risperidone')!)} />
              <Pill tone="doctor"><Lock size={11} /> Doctor</Pill>
            </div>
          </div>
          <input
            type="range" min={0.5} max={3} step={0.25} value={risperidoneDose}
            onChange={(e) => setRisperidone(+e.target.value)}
            className="w-full accent-doctor"
            aria-label="Risperidone total daily dose"
          />
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[10px] text-slate-400">0.5</span>
            <span className="text-lg font-black text-doctor">{risperidoneDose}<span className="text-xs font-bold"> mg/day</span></span>
            <span className="text-[10px] text-slate-400">3</span>
          </div>
          <p className="mt-1 text-[10px] leading-tight text-doctor/80">Prescription antipsychotic. Only the prescriber can change it.</p>
        </motion.div>

        {/* NAC */}
        <motion.div
          className="relative overflow-hidden rounded-xl p-3.5 pl-5"
          whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(21,128,61,0.26)' }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            background: 'linear-gradient(135deg, rgba(21,128,61,0.07), rgba(21,128,61,0.03))',
            border: '1px solid rgba(21,128,61,0.18)',
            boxShadow: '0 2px 8px -4px rgba(21,128,61,0.15)',
          }}
        >
          <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: '#15803D' }} />
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-brand-deep">NAC</span>
            <div className="flex items-center gap-1.5">
              <SafetyScoreChip score={safetyScore(treatmentById('nac')!)} />
              <Pill tone="safe">Supplement</Pill>
            </div>
          </div>
          <input
            type="range" min={0} max={2700} step={300} value={nacDose}
            onChange={(e) => setNac(+e.target.value)}
            className="w-full accent-safe"
            aria-label="NAC total daily dose"
          />
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[10px] text-slate-400">0</span>
            <span className="text-lg font-black text-safe">
              {nacDose}<span className="text-xs font-bold"> mg/day</span>
              {nacDose > 0 && <span className="ml-1 text-[10px] font-bold text-slate-400">~{nearestTsp(nacDose)}</span>}
            </span>
            <span className="text-[10px] text-slate-400">2700</span>
          </div>
          <p className="mt-1 text-[10px] leading-tight text-slate-400">Teaspoons are not accurate. Use the label and ask a pharmacist.</p>
        </motion.div>
      </div>
    </GlassCard>
  )
}

/** Compact, full-width, collapsible starting point. Collapsed shows colour-coded chips. */
export function BaselineEditor() {
  const { baselineMetrics, enabledMetrics, setMetric, toggleMetric, resetBaseline } = useAppStore()
  const keys = Object.keys(metricLabels) as MetricKey[]
  const [open, setOpen] = useState(false)

  return (
    <GlassCard className="!p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-black text-brand-deep">Your starting point</h2>
        <span className="text-[11px] text-slate-400">Example profile · 0 calm → 10 severe</span>
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="btn-ghost ml-auto px-3 py-1.5 text-xs"
        >
          {open ? 'Done' : 'Edit'}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="inline-block"
          >
            <ChevronDown size={13} />
          </motion.span>
        </motion.button>
      </div>

      {/* Collapsed: dense colour-coded chips (read-only) */}
      {!open && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {keys.filter((k) => enabledMetrics[k]).map((k) => {
            const f = faceFor(baselineMetrics[k])
            return (
              <span key={k} className={`pill ${f.bg} ${f.colour}`}>
                {metricLabels[k]} <b className="ml-0.5">{baselineMetrics[k]}</b>
              </span>
            )
          })}
        </div>
      )}

      {/* Expanded: dense slider grid */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {keys.map((k) => (
                <div key={k} className={`flex items-center gap-2 ${enabledMetrics[k] ? '' : 'opacity-50'}`}>
                  <input
                    type="checkbox" checked={enabledMetrics[k]} onChange={() => toggleMetric(k)}
                    className="h-3.5 w-3.5 shrink-0 accent-brand-navy" aria-label={`Toggle ${metricLabels[k]}`}
                  />
                  <label className="w-32 shrink-0 truncate text-xs font-bold text-slate-600">{metricLabels[k]}</label>
                  <input
                    type="range" min={0} max={10} step={1} value={baselineMetrics[k]} disabled={!enabledMetrics[k]}
                    onChange={(e) => setMetric(k, +e.target.value)}
                    className="w-full accent-brand-navy" aria-label={metricLabels[k]}
                  />
                  <span className="w-5 text-right text-sm font-black text-brand-navy">{baselineMetrics[k]}</span>
                </div>
              ))}
            </div>
            <motion.button
              onClick={resetBaseline}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="btn-ghost mt-3 px-3 py-1.5 text-xs"
            >
              Reset to example defaults
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

export function EvidenceModeToggle() {
  const { evidenceMode, setEvidenceMode } = useAppStore()
  const modes: { id: typeof evidenceMode; label: string; help: string }[] = [
    { id: 'direct', label: 'Study only', help: 'Only direct study findings' },
    { id: 'practical', label: 'Practical estimate', help: 'Direct + estimated from studies' },
    { id: 'explore', label: 'Explore', help: 'Includes theoretical items' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-bold text-slate-500">Evidence mode:</span>
      <div
        className="inline-flex rounded-xl p-0.5"
        style={{
          background: 'rgba(14,81,150,0.06)',
          border: '1px solid rgba(14,81,150,0.12)',
        }}
      >
        {modes.map((m) => {
          const active = evidenceMode === m.id
          return (
            <motion.button
              key={m.id}
              onClick={() => setEvidenceMode(m.id)}
              title={m.help}
              whileHover={!active ? { scale: 1.04 } : {}}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="relative rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
              style={
                active
                  ? {
                      background: 'linear-gradient(135deg, #0E5196, #1d4ed8)',
                      color: '#fff',
                      boxShadow: '0 2px 8px -3px rgba(14,81,150,0.6)',
                    }
                  : { color: '#64748b' }
              }
            >
              {m.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
