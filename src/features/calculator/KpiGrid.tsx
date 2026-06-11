import { useState, type PointerEvent } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Info } from '../../components/icons'
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
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
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
  const projFace = scale(pm.projected)
  const delta = +(pm.projected - pm.baseline).toFixed(1)

  // Subtle pointer tilt for depth
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 18 })
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
      className="card lift overflow-hidden p-2.5"
    >
      <div className="flex items-center gap-2.5">
        {/* Premium face token */}
        <motion.div
          key={projFace.id}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ring-black/5 ${projFace.bg}`}
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 6px 14px -9px rgba(6,32,63,0.5)' }}
        >
          <FaceEmoji id={projFace.id} size={30} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-[11px] font-extrabold leading-tight text-brand-deep line-clamp-2">
              {metricLabels[metric]}
            </h3>
            <button
              onClick={() => setOpen((o) => !o)}
              className="-mr-0.5 -mt-0.5 shrink-0 rounded-full p-0.5 text-slate-300 transition hover:text-brand-navy"
              aria-label="Why did this number move?"
            >
              <Info size={13} />
            </button>
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className={`text-lg font-black leading-none ${projFace.colour}`}>
              <AnimatedNumber value={pm.projected} decimals={pm.projected % 1 === 0 ? 0 : 1} />
            </span>
            {delta !== 0 && (
              <motion.span
                key={delta}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded px-1 py-0.5 text-[9px] font-extrabold ${delta < 0 ? 'bg-safe-soft text-safe' : 'bg-doctor-soft text-doctor'}`}
              >
                {delta < 0 ? '▼' : '▲'}{Math.abs(delta)}
              </motion.span>
            )}
            <span className="ml-auto text-[9px] font-semibold text-slate-400">was {pm.baseline}</span>
          </div>
        </div>
      </div>

      {/* Slim bar: uncertainty band, baseline tick, gradient fill */}
      <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute top-0 h-full rounded-full bg-slate-300/60"
          style={{ left: `${pm.low * 10}%`, width: `${(pm.high - pm.low) * 10}%` }}
        />
        <motion.div
          className="absolute top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #0e5196, #1D4ED8)' }}
          initial={false}
          animate={{ width: `${pm.projected * 10}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
        <span
          className="absolute top-[-2px] h-[10px] w-[2px] rounded bg-brand-deep/40"
          style={{ left: `calc(${pm.baseline * 10}% - 1px)` }}
          aria-hidden
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <p className="mb-1 mt-2 text-[10px] font-bold text-slate-500">Why did this move?</p>
            <ul className="space-y-1">
              {explainMetric(pm).map((line, i) => (
                <li key={i} className="text-[10px] leading-snug text-slate-600">
                  {line}
                </li>
              ))}
            </ul>
            {pm.contributions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {pm.contributions.map((c, i) => (
                  <span key={i} className={`pill bg-slate-50 text-[9px] ${numberLabelMeta[c.label].colour}`}>
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
