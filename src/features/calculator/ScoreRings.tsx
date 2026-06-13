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
    <div className="sticky top-[50px] z-30 -mx-1">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="flex items-center gap-1 overflow-x-auto rounded-2xl px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(232,244,251,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px -12px rgba(6,32,63,0.35), inset 0 1px 0 rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px) saturate(1.6)',
        }}
      >
        {/* Live indicator column */}
        <div className="shrink-0 pr-2">
          <div className="flex items-center gap-1">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-brand-leaf"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/60">Live</span>
          </div>
          <span className="block text-[9px] font-black uppercase tracking-widest text-brand-leaf">scores</span>
        </div>
        <div
          className="mx-1 h-10 w-px shrink-0"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(14,81,150,0.15), transparent)' }}
        />

        {rings.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.08 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 18 }}
            className="flex shrink-0 flex-col items-center px-2"
          >
            <RingGauge value={r.value} max={10} size={56} stroke={6} colour={r.colour} />
            <span className="mt-0.5 text-[10px] font-extrabold" style={{ color: r.colour }}>
              {r.label}
            </span>
          </motion.div>
        ))}

        {/* Legend hint — desktop only, now glass-tinted */}
        <div
          className="ml-auto hidden shrink-0 rounded-xl px-3 py-1.5 text-[10px] leading-relaxed text-slate-500 sm:block"
          style={{ background: 'rgba(14,81,150,0.05)', border: '1px solid rgba(14,81,150,0.09)' }}
        >
          <span className="font-bold text-brand-navy">Higher</span> = calmer
          <br />
          <span className="font-bold text-orange-600">Side-effect</span> lower = better
        </div>
      </motion.div>
    </div>
  )
}
