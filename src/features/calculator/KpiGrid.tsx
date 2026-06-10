import { useState, type PointerEvent } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Info } from 'lucide-react'
import type { MetricKey } from '../../lib/types'
import { metricLabels, numberLabelMeta } from '../../lib/labels'
import { faceFor, alertnessFace } from '../../lib/faceScale'
import { useProjection } from '../../lib/useProjection'
import { explainMetric } from '../../lib/calculator'
import { useAppStore } from '../../store/useAppStore'
import { AnimatedNumber } from '../../components/ui'
import { FaceEmoji } from '../../components/FaceEmoji'

export function KpiGrid() {
  const enabled = useAppStore((s) => s.enabledMetrics)
  const keys = (Object.keys(metricLabels) as MetricKey[]).filter((k) => enabled[k])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {keys.map((k) => (
        <KpiCard key={k} metric={k} />
      ))}
    </div>
  )
}

function KpiCard({ metric }: { metric: MetricKey }) {
  const pm = useProjection()[metric]
  const [open, setOpen] = useState(false)
  const scale = metric === 'sedation' ? alertnessFace : faceFor
  const baseFace = scale(pm.baseline)
  const projFace = scale(pm.projected)
  const delta = +(pm.projected - pm.baseline).toFixed(1)

  // Pointer-driven 3D tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      layout
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="card lift overflow-hidden p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-extrabold text-brand-deep">{metricLabels[metric]}</h3>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-1 text-slate-400 transition hover:bg-brand-sky hover:text-brand-navy"
          aria-label="Why did this number move?"
        >
          <Info size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-center">
          <div className="opacity-70"><FaceEmoji id={baseFace.id} size={32} /></div>
          <div className="text-xs text-slate-400">now {pm.baseline}</div>
        </div>
        <motion.div
          aria-hidden
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-brand-leaf"
        >
          ➜
        </motion.div>
        <div className={`relative rounded-xl px-3 py-1 text-center ${projFace.bg} glow-ring`}>
          <motion.div key={pm.projected + projFace.id} initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="flex justify-center">
            <FaceEmoji id={projFace.id} size={40} />
          </motion.div>
          <div className={`text-xs font-bold ${projFace.colour}`}>
            model <AnimatedNumber value={pm.projected} decimals={pm.projected % 1 === 0 ? 0 : 1} />
          </div>
        </div>
      </div>

      {/* Bar with uncertainty band + shimmer */}
      <div className="mt-3">
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute top-0 h-full rounded-full bg-slate-300/60"
            style={{ left: `${pm.low * 10}%`, width: `${(pm.high - pm.low) * 10}%` }}
          />
          <motion.div
            className="shine absolute top-0 h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #0e5196, #2c7be5)' }}
            initial={false}
            animate={{ width: `${pm.projected * 10}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>calm</span>
          {delta !== 0 && (
            <motion.span
              key={delta}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className={delta < 0 ? 'font-bold text-safe' : 'font-bold text-doctor'}
            >
              {delta < 0 ? '▼' : '▲'} {Math.abs(delta)}
            </motion.span>
          )}
          <span>severe</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden border-t border-slate-100 pt-3"
          >
            <p className="mb-1 text-xs font-bold text-slate-500">Why did this number move?</p>
            <ul className="space-y-1.5">
              {explainMetric(pm).map((line, i) => (
                <li key={i} className="text-xs text-slate-600">
                  {line}
                </li>
              ))}
            </ul>
            {pm.contributions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {pm.contributions.map((c, i) => (
                  <span key={i} className={`pill bg-slate-50 ${numberLabelMeta[c.label].colour}`}>
                    {numberLabelMeta[c.label].label}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
