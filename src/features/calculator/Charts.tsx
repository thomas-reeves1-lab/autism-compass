import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LabelList,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import type { MetricKey } from '../../lib/types'
import { metricLabels, evidenceLevelMeta } from '../../lib/labels'
import { useProjection } from '../../lib/useProjection'
import { useAppStore } from '../../store/useAppStore'
import { treatments } from '../../data/evidence'
import { GlassCard, SectionTitle } from '../../components/ui'
import { TrendingUp, ShieldCheck } from '../../components/icons'

interface TooltipEntry {
  name?: string
  value?: number | string
  fill?: string
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
}

/** Dark-glass tooltip shared across all charts — matches the app's aurora aesthetic. */
function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="min-w-[120px] rounded-xl p-2.5"
      style={{
        background: 'rgba(7,26,54,0.92)',
        backdropFilter: 'blur(18px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 24px -8px rgba(6,32,63,0.65)',
      }}
    >
      {label != null && (
        <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white/45">
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: entry.fill ?? entry.color ?? '#fff' }}
          />
          <span className="text-white/70">{entry.name}</span>
          <span className="ml-auto font-extrabold text-white">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const FOCUS: MetricKey[] = [
  'irritability',
  'looping',
  'aggressionRisk',
  'skinPicking',
  'hyperactivity',
  'sleepOnsetDelay',
]

const C = {
  navy: '#0E5196',
  leaf: '#5FA52E',
  safe: '#15803D',
  caution: '#B45309',
  doctor: '#C2410C',
  danger: '#B91C1C',
  info: '#1D4ED8',
  grey: '#64748B',
}

/** All four charts in the dashboard grid (lazy-loaded so recharts stays out of the initial bundle). */
export function ChartsGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BehaviourChart />
      <StackChart />
      <BenefitHarmChart />
      <EvidenceConfidenceChart />
    </div>
  )
}

/** 1. Behaviour change: baseline vs projected for focus metrics. */
// Coloured delta label drawn above each "model" bar.
function DeltaLabel(props: { x?: number; y?: number; width?: number; value?: number; index?: number; data: { delta: number }[] }) {
  const { x = 0, y = 0, width = 0, index = 0, data } = props
  const d = data[index]?.delta ?? 0
  if (Math.abs(d) < 0.05) return null
  const colour = d < 0 ? '#2e9e5b' : '#e8730c'
  return (
    <text x={x + width / 2} y={y - 6} fill={colour} fontSize={11} fontWeight={800} textAnchor="middle">
      {d < 0 ? '▼' : '▲'}
      {Math.abs(d).toFixed(1)}
    </text>
  )
}

export function BehaviourChart() {
  const p = useProjection()
  const data = FOCUS.map((m) => ({
    name: metricLabels[m].length > 16 ? metricLabels[m].slice(0, 15) + '…' : metricLabels[m],
    now: p[m].baseline,
    model: p[m].projected,
    delta: +(p[m].projected - p[m].baseline).toFixed(1),
  }))
  const improved = data.filter((d) => d.delta < 0).length
  const worse = data.filter((d) => d.delta > 0).length
  const net = +data.reduce((a, d) => a + d.delta, 0).toFixed(1)
  return (
    <GlassCard>
      <SectionTitle title="Behaviour: now vs model" subtitle="Lower is calmer. Coloured numbers show how much each metric changes. The model is an estimate, not a promise." />
      <ResponsiveContainer width="100%" height={268}>
        <BarChart data={data} margin={{ top: 22, right: 8, left: -18, bottom: 36 }}>
          <defs>
            <linearGradient id="gNow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#aab4c0" />
              <stop offset="100%" stopColor="#7a8794" />
            </linearGradient>
            <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c7be5" />
              <stop offset="100%" stopColor="#0e5196" />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#94a3b8' }} height={60} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(44,123,229,0.05)' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
          <Bar dataKey="now" name="Now" fill="url(#gNow)" radius={[6, 6, 0, 0]} animationDuration={700} />
          <Bar dataKey="model" name="Model" fill="url(#gModel)" radius={[6, 6, 0, 0]} animationDuration={900}>
            <LabelList dataKey="model" content={(props) => <DeltaLabel {...(props as Record<string, number>)} data={data} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {[
          { text: `▼ ${improved} improved`, cls: 'pill bg-safe-soft text-safe' },
          { text: `▲ ${worse} worse`, cls: 'pill bg-doctor-soft text-doctor' },
          { text: `Net change ${net > 0 ? '+' : ''}${net}`, cls: `pill ${net <= 0 ? 'bg-safe-soft text-safe' : 'bg-doctor-soft text-doctor'}` },
        ].map((b, i) => (
          <motion.span
            key={b.text}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 }}
            className={b.cls}
          >
            {b.text}
          </motion.span>
        ))}
      </div>
    </GlassCard>
  )
}

/** 2. Stack contribution: how much each active option moves the totals. */
export function StackChart() {
  const p = useProjection()
  const totals = new Map<string, { name: string; improve: number; worsen: number }>()
  for (const m of Object.values(p)) {
    for (const c of m.contributions) {
      const t = totals.get(c.treatmentId) ?? { name: c.treatmentName, improve: 0, worsen: 0 }
      if (c.delta < 0) t.improve += -c.delta
      else t.worsen += c.delta
      totals.set(c.treatmentId, t)
    }
  }
  const data = [...totals.values()].map((t) => ({
    name: t.name.split(' ')[0],
    improvement: +t.improve.toFixed(1),
    sideEffect: +t.worsen.toFixed(1),
  }))
  return (
    <GlassCard>
      <SectionTitle title="What each option contributes" subtitle="Green = modelled improvement. Orange = modelled side-effect pressure." />
      {data.length === 0 ? (
        <div className="py-8 text-center">
          <div
            className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #0E5196, #1d4ed8)' }}
          >
            <TrendingUp size={20} className="text-white" />
          </div>
          <p className="text-sm text-slate-400">Add an option to see its contribution.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
            <defs>
              <linearGradient id="gImprove" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="gSide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(44,123,229,0.05)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
            <Bar dataKey="improvement" name="Improvement" stackId="a" fill="url(#gImprove)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sideEffect" name="Side-effect" stackId="a" fill="url(#gSide)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  )
}

/** 3. Benefit vs harm balance. */
export function BenefitHarmChart() {
  const p = useProjection()
  let benefit = 0
  let harm = 0
  for (const m of Object.values(p)) {
    for (const c of m.contributions) {
      if (c.delta < 0) benefit += -c.delta
      else harm += c.delta
    }
  }
  const data = [
    { name: 'Likely benefit', value: +benefit.toFixed(1), fill: C.safe },
    { name: 'Side-effect pressure', value: +harm.toFixed(1), fill: C.doctor },
  ]
  return (
    <GlassCard>
      <SectionTitle title="Benefit vs side-effect balance" subtitle="A rough balance of modelled improvements against modelled side effects." />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 16, left: 30, bottom: 8 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={130} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(44,123,229,0.05)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={500}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}

/** 4. Evidence confidence: count of selected options by evidence level. */
export function EvidenceConfidenceChart() {
  const selected = useAppStore((s) => s.selectedAdjuncts)
  const risperidoneDose = useAppStore((s) => s.risperidoneDose)
  const nacDose = useAppStore((s) => s.nacDose)
  const ids = new Set(selected)
  if (risperidoneDose > 0) ids.add('risperidone')
  if (nacDose > 0) ids.add('nac')

  const counts = new Map<string, number>()
  for (const t of treatments) {
    if (!ids.has(t.id)) continue
    counts.set(t.evidenceLevel, (counts.get(t.evidenceLevel) ?? 0) + 1)
  }
  const colourMap: Record<string, string> = {
    strong: C.safe,
    moderate: C.safe,
    emerging: C.info,
    mixed: C.caution,
    weak: C.caution,
    theoretical: C.grey,
    negative: C.danger,
    doctorOnly: C.doctor,
  }
  const data = [...counts.entries()].map(([level, count]) => ({
    name: evidenceLevelMeta[level as keyof typeof evidenceLevelMeta].label,
    count,
    fill: colourMap[level] ?? C.grey,
  }))

  return (
    <GlassCard>
      <SectionTitle title="Evidence confidence of your selection" subtitle="How strong the evidence is behind the options you have switched on." />
      {data.length === 0 ? (
        <div className="py-8 text-center">
          <div
            className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #15803D, #22c55e)' }}
          >
            <ShieldCheck size={20} className="text-white" />
          </div>
          <p className="text-sm text-slate-400">Switch on options to see their evidence strength.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <RadialBarChart innerRadius="25%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="count" background>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </RadialBar>
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Tooltip content={<ChartTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  )
}
