import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FileText, Printer, ShieldCheck } from '../../components/icons'
import { useAppStore } from '../../store/useAppStore'
import { useProjection } from '../../lib/useProjection'
import { treatmentById } from '../../data/evidence'
import { metricLabels } from '../../lib/labels'
import type { MetricKey } from '../../lib/types'
import { GlassCard, SectionTitle } from '../../components/ui'

const EV_ACCENT: Record<string, string> = {
  strong: '#15803D', moderate: '#16a34a', emerging: '#2563eb',
  mixed: '#d97706', weak: '#ca8a04', theoretical: '#64748b',
  negative: '#dc2626', doctorOnly: '#7c3aed',
}

function severityStyle(v: number): { bg: string; bar: string } {
  if (v <= 3) return { bg: 'rgba(21,128,61,0.06)', bar: '#15803D' }
  if (v <= 6) return { bg: 'rgba(180,83,9,0.06)', bar: '#B45309' }
  return { bg: 'rgba(185,28,28,0.07)', bar: '#B91C1C' }
}

const DOCTOR_QUESTIONS = [
  'Is the current risperidone dose still the best risk-benefit fit?',
  'Are weight, appetite, sleep, prolactin, movement side effects, and metabolic markers being monitored?',
  'Is NAC (or any supplement we are considering) appropriate with this medication profile?',
  'Are there seizure, asthma, liver, kidney, bleeding, or medication-interaction concerns?',
  'Which behaviour target are we actually trying to improve?',
  'How will we measure success after 8 to 12 weeks?',
]

export function DoctorPack() {
  const { selectedAdjuncts, risperidoneDose, nacDose, baselineMetrics } = useAppStore()
  const projection = useProjection()
  const considering = [
    ...(nacDose > 0 ? ['nac'] : []),
    ...selectedAdjuncts,
  ]
    .map((id) => treatmentById(id))
    .filter(Boolean)

  return (
    <GlassCard>
      <SectionTitle
        icon={<FileText size={20} />}
        title="Doctor Visit Pack"
        subtitle="A clean one-page summary to take to the appointment. Print it or save as PDF from the print dialog."
      />
      <motion.button
        onClick={() => window.print()}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="btn-primary mb-4 text-sm"
      >
        <Printer size={16} /> Print / save as PDF
      </motion.button>

      <div id="doctor-pack" className="overflow-hidden rounded-2xl bg-white text-sm text-slate-700" style={{ boxShadow: '0 0 0 1px rgba(14,81,150,0.1), 0 8px 32px -12px rgba(6,32,63,0.25)' }}>
        {/* Header strip */}
        <div
          className="flex items-center gap-3 p-5 text-white"
          style={{ background: 'linear-gradient(110deg, #071a36 0%, #0e5196 55%, #1740A8 100%)' }}
        >
          <img src={`${import.meta.env.BASE_URL}brand/autism-compass-mark.svg`} alt="" className="h-10 w-10 rounded-xl bg-white/95 p-0.5 shadow-lg" />
          <div>
            <h3 className="text-base font-black leading-tight">Autism Compass</h3>
            <p className="text-sm font-bold text-white/80">Doctor Visit Pack</p>
            <p className="text-[11px] text-white/50">Education only · Not medical advice · {new Date().toLocaleDateString('en-AU')}</p>
          </div>
          <div
            className="ml-auto hidden rounded-lg px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/60 sm:block"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Education<br />Only
          </div>
        </div>

        <div className="space-y-0 divide-y divide-slate-100">
          {/* Medication */}
          <PackSection accent="#0E5196" title="Current medication reference">
            <p className="text-slate-600">
              <span className="font-bold text-brand-deep">Risperidone</span> {risperidoneDose > 0 ? `${risperidoneDose} mg/day` : 'not currently selected'}{' '}
              <span className="text-slate-400">(reference only, not a recommendation)</span>
            </p>
          </PackSection>

          {/* Baselines */}
          <PackSection accent="#1D4ED8" title="Baseline behaviours (0 calm, 10 severe)">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {(Object.keys(baselineMetrics) as MetricKey[])
                .filter((k) => baselineMetrics[k] >= 4)
                .map((k, i) => {
                  const s = severityStyle(baselineMetrics[k])
                  return (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 10) * 0.05, type: 'spring', stiffness: 280, damping: 24 }}
                      className="relative flex items-center justify-between overflow-hidden rounded-lg py-1.5 pl-5 pr-3"
                      style={{ background: s.bg }}
                    >
                      <span className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-lg" style={{ background: s.bar }} />
                      <span className="text-xs text-slate-600">{metricLabels[k]}</span>
                      <span className="font-extrabold" style={{ color: s.bar }}>{baselineMetrics[k]}</span>
                    </motion.div>
                  )
                })}
            </div>
            {(Object.keys(baselineMetrics) as MetricKey[]).filter((k) => baselineMetrics[k] >= 4).length === 0 && (
              <p className="text-xs text-slate-400">No behaviours flagged above 4 yet. Use the Baseline editor on the Calculator tab.</p>
            )}
          </PackSection>

          {/* Options to discuss */}
          {considering.length > 0 && (
            <PackSection accent="#7c3aed" title="Options we want to discuss">
              <div className="space-y-2">
                {considering.map((t, i) => {
                  const acc = EV_ACCENT[t!.evidenceLevel] ?? '#64748b'
                  return (
                    <motion.div
                      key={t!.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ delay: Math.min(i, 12) * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
                      className="relative overflow-hidden rounded-xl p-3 pl-5"
                      style={{
                        background: `linear-gradient(135deg, white, color-mix(in srgb, ${acc} 4%, white))`,
                        border: `1px solid ${acc}22`,
                      }}
                    >
                      <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: acc }} />
                      <p className="font-extrabold text-brand-deep">{t!.name}</p>
                      <p className="text-xs" style={{ color: acc }}>
                        {t!.evidenceLevel} evidence{t!.doctorOnly ? ' · doctor-only' : ''} · {t!.confidenceNote}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </PackSection>
          )}

          {/* Model estimates */}
          <PackSection accent="#15803D" title="Model estimates (not a promise)">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {(Object.keys(projection) as MetricKey[])
                .filter((k) => Math.abs(projection[k].projected - projection[k].baseline) >= 0.5)
                .map((k, i) => {
                  const delta = +(projection[k].projected - projection[k].baseline).toFixed(1)
                  const down = delta < 0
                  const bar = down ? '#15803D' : '#C2410C'
                  const bg = down ? 'rgba(21,128,61,0.06)' : 'rgba(194,65,12,0.06)'
                  return (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 10) * 0.05, type: 'spring', stiffness: 280, damping: 24 }}
                      className="relative flex items-center justify-between overflow-hidden rounded-lg py-1.5 pl-5 pr-3"
                      style={{ background: bg }}
                    >
                      <span className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-lg" style={{ background: bar }} />
                      <span className="text-xs text-slate-600">{metricLabels[k]}</span>
                      <span className="text-xs font-extrabold" style={{ color: bar }}>
                        {projection[k].baseline} {down ? '▼' : '▲'} {projection[k].projected}
                      </span>
                    </motion.div>
                  )
                })}
            </div>
          </PackSection>

          {/* Questions */}
          <PackSection accent="#B45309" title="Questions for the doctor">
            <ol className="space-y-2">
              {DOCTOR_QUESTIONS.map((q, i) => (
                <motion.li
                  key={q}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i, 12) * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
                  className="flex items-start gap-2.5"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                    style={{ background: '#B45309' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-slate-600">{q}</span>
                </motion.li>
              ))}
            </ol>
          </PackSection>
        </div>

        <div
          className="flex items-center gap-2 px-5 py-3 text-[10px] text-slate-400"
          style={{ borderTop: '1px solid #f1f5f9' }}
        >
          <ShieldCheck size={12} className="shrink-0 text-safe" />
          Autism Compass · Education only · Not medical advice · Do not change medication without the prescriber.
        </div>
      </div>
    </GlassCard>
  )
}

function PackSection({ accent, title, children }: { accent: string; title: string; children: ReactNode }) {
  return (
    <motion.div
      className="relative px-5 py-4 pl-8"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-16px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      <div className="absolute bottom-0 left-5 top-0 w-[3px] rounded-full" style={{ background: accent }} />
      <h4 className="mb-2.5 text-xs font-extrabold uppercase tracking-wider" style={{ color: accent }}>
        {title}
      </h4>
      {children}
    </motion.div>
  )
}
