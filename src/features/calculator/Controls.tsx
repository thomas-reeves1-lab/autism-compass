import { Lock, Pill as PillIcon } from '../../components/icons'
import { useAppStore } from '../../store/useAppStore'
import { metricLabels } from '../../lib/labels'
import type { MetricKey } from '../../lib/types'
import { GlassCard, SectionTitle, Pill, SafetyScoreChip } from '../../components/ui'
import { safetyScore } from '../../lib/safety'
import { treatmentById } from '../../data/evidence'

const NAC_TSP: Record<number, string> = {
  600: '¼ tsp',
  900: '⅜ tsp',
  1200: '½ tsp',
  1800: '¾ tsp',
  2400: '1 tsp',
  2700: '1⅛ tsp',
}

function nearestTsp(mg: number): string {
  if (mg <= 0) return '—'
  const keys = Object.keys(NAC_TSP).map(Number)
  const k = keys.reduce((a, b) => (Math.abs(b - mg) < Math.abs(a - mg) ? b : a))
  return NAC_TSP[k]
}

export function DoseSliders() {
  const { risperidoneDose, nacDose, setRisperidone, setNac } = useAppStore()

  return (
    <GlassCard>
      <SectionTitle
        icon={<PillIcon size={20} />}
        title="Medication and supplement sliders"
        subtitle="Education only. These sliders show what the evidence model would estimate. They are not a recommendation to change anything."
      />

      {/* Risperidone — doctor only */}
      <div className="rounded-xl border border-doctor/30 bg-doctor-soft/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-extrabold text-brand-deep">Risperidone total daily dose</span>
          <div className="flex items-center gap-2">
            <SafetyScoreChip score={safetyScore(treatmentById('risperidone')!)} />
            <Pill tone="doctor">
              <Lock size={12} /> Doctor only
            </Pill>
          </div>
        </div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.25}
          value={risperidoneDose}
          onChange={(e) => setRisperidone(+e.target.value)}
          className="w-full accent-brand-navy"
          aria-label="Risperidone total daily dose"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>0.5 mg/day</span>
          <span className="font-extrabold text-doctor">{risperidoneDose} mg/day</span>
          <span>3 mg/day</span>
        </div>
        <p className="mt-2 text-xs text-doctor">
          Risperidone is a prescription antipsychotic medicine. Only the prescriber can change it.
          This slider does not suggest raising or lowering the dose.
        </p>
      </div>

      {/* NAC */}
      <div className="mt-4 rounded-xl border border-safe/30 bg-safe-soft/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-extrabold text-brand-deep">N-Acetylcysteine (NAC)</span>
          <div className="flex items-center gap-2">
            <SafetyScoreChip score={safetyScore(treatmentById('nac')!)} />
            <Pill tone="safe">Supplement, not a medicine</Pill>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={2700}
          step={300}
          value={nacDose}
          onChange={(e) => setNac(+e.target.value)}
          className="w-full accent-brand-leaf"
          aria-label="NAC total daily dose"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>0 mg</span>
          <span className="font-extrabold text-safe">
            {nacDose} mg/day {nacDose > 0 && `(~${nearestTsp(nacDose)})`}
          </span>
          <span>2700 mg</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Kitchen teaspoons are not accurate medical measuring tools. Use the product label or
          scales, and confirm with a pharmacist.
        </p>
      </div>
    </GlassCard>
  )
}

export function BaselineEditor() {
  const { baselineMetrics, enabledMetrics, setMetric, toggleMetric, resetBaseline } = useAppStore()
  const keys = Object.keys(metricLabels) as MetricKey[]

  return (
    <GlassCard>
      <SectionTitle
        title="Your starting point"
        subtitle="This is an example profile. The risperidone reference (3 mg/day) is a starting point only and does not imply any recommended change. Edit every score to match your own situation. 0 = calm, 10 = severe."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {keys.map((k) => (
          <div
            key={k}
            className={`rounded-xl border p-3 ${enabledMetrics[k] ? 'border-slate-100 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">{metricLabels[k]}</label>
              <label className="flex items-center gap-1 text-xs text-slate-400">
                <input type="checkbox" checked={enabledMetrics[k]} onChange={() => toggleMetric(k)} />
                on
              </label>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={baselineMetrics[k]}
                disabled={!enabledMetrics[k]}
                onChange={(e) => setMetric(k, +e.target.value)}
                className="w-full accent-brand-navy"
                aria-label={metricLabels[k]}
              />
              <span className="w-6 text-right text-sm font-extrabold text-brand-navy">
                {baselineMetrics[k]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={resetBaseline} className="btn-ghost mt-4 text-sm">
        Reset to example defaults
      </button>
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold text-slate-500">Evidence mode:</span>
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setEvidenceMode(m.id)}
          title={m.help}
          className={`pill border transition ${
            evidenceMode === m.id
              ? 'border-brand-navy bg-brand-navy text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand-navy/40'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
