import { motion } from 'framer-motion'
import { useProjection } from '../../lib/useProjection'
import { RingGauge } from '../../components/ui'
import type { MetricKey } from '../../lib/types'

const mean = (p: ReturnType<typeof useProjection>, keys: MetricKey[]) =>
  +(keys.reduce((a, k) => a + p[k].projected, 0) / keys.length).toFixed(1)

/** Compact sticky score bar — the headline dials follow you down the page. */
export function ScoreRings() {
  const p = useProjection()

  const calm = +(10 - mean(p, ['irritability', 'aggressionRisk', 'selfInjuryRisk', 'looping'])).toFixed(1)
  const sleep = +(10 - mean(p, ['sleepOnsetDelay', 'nightWaking'])).toFixed(1)
  const sideEffect = p.sideEffectPressure.projected
  const settle = +(10 - mean(p, ['hyperactivity', 'stereotypy'])).toFixed(1)

  const rings = [
    { value: calm, label: 'Calm', colour: '#15803D' },
    { value: settle, label: 'Settled', colour: '#1D4ED8' },
    { value: sleep, label: 'Sleep', colour: '#0E5196' },
    { value: sideEffect, label: 'Side-effect', colour: '#C2410C' },
  ]

  return (
    <div className="sticky top-[54px] z-30">
      <div className="glass flex items-center gap-1 overflow-x-auto !rounded-xl !p-2.5 shadow-glass">
        <span className="shrink-0 px-1.5 text-[10px] font-black uppercase leading-tight tracking-wider text-brand-navy/70">
          Live
          <br />
          scores
        </span>
        <div className="h-9 w-px shrink-0 bg-brand-deep/10" />
        {rings.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="flex shrink-0 flex-col items-center px-1.5"
          >
            <RingGauge value={r.value} max={10} size={58} stroke={7} colour={r.colour} />
            <span className="mt-0.5 text-[10px] font-bold text-slate-500">{r.label}</span>
          </motion.div>
        ))}
        <span className="ml-auto hidden shrink-0 px-2 text-[10px] text-slate-400 sm:block">
          higher = calmer · side-effect lower = better
        </span>
      </div>
    </div>
  )
}
