import { motion } from 'framer-motion'
import { useProjection } from '../../lib/useProjection'
import { RingGauge } from '../../components/ui'
import type { MetricKey } from '../../lib/types'

const mean = (p: ReturnType<typeof useProjection>, keys: MetricKey[]) =>
  +(keys.reduce((a, k) => a + p[k].projected, 0) / keys.length).toFixed(1)

/** Animated dial strip — the headline scores, casino-dashboard style but calm. */
export function ScoreRings() {
  const p = useProjection()

  const calm = +(10 - mean(p, ['irritability', 'aggressionRisk', 'selfInjuryRisk', 'looping'])).toFixed(1)
  const sleep = +(10 - mean(p, ['sleepOnsetDelay', 'nightWaking'])).toFixed(1)
  const sideEffect = p.sideEffectPressure.projected
  const settle = +(10 - mean(p, ['hyperactivity', 'stereotypy'])).toFixed(1)

  const rings = [
    { value: calm, label: 'Calm score', sub: 'higher is better', colour: '#2e9e5b' },
    { value: settle, label: 'Settled', sub: 'higher is better', colour: '#2c7be5' },
    { value: sleep, label: 'Sleep', sub: 'higher is better', colour: '#0e5196' },
    { value: sideEffect, label: 'Side-effect', sub: 'lower is better', colour: '#e8730c' },
  ]

  return (
    <div className="glass shine grid grid-cols-2 gap-2 p-5 md:grid-cols-4">
      {rings.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex flex-col items-center"
        >
          <RingGauge value={r.value} max={10} colour={r.colour} label={r.label} sublabel={r.sub} />
        </motion.div>
      ))}
    </div>
  )
}
