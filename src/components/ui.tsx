import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck } from './icons'
import type { EvidenceLevel } from '../lib/types'
import { evidenceLevelMeta } from '../lib/labels'
import { safetyMeta } from '../lib/safety'

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass p-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {icon && <div className="mt-1 text-brand-navy">{icon}</div>}
      <div>
        <h2 className="text-xl font-extrabold text-brand-deep">{title}</h2>
        {subtitle && <p className="mt-0.5 max-w-2xl text-sm text-slate-600">{subtitle}</p>}
      </div>
    </div>
  )
}

/** Animated safety-score chip (0-100, higher = safer). Colour-coded. */
export function SafetyScoreChip({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const m = safetyMeta(score)
  const big = size === 'lg'
  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${m.bg} ${big ? 'px-3 py-1.5' : 'px-2.5 py-1'}`}>
      <ShieldCheck size={big ? 16 : 13} className={m.text} />
      <span className={`font-extrabold ${m.text} ${big ? 'text-base' : 'text-xs'}`}>
        <AnimatedNumber value={score} duration={900} />
        <span className="opacity-60">/100</span>
      </span>
      <div className={`relative ${big ? 'h-1.5 w-16' : 'h-1 w-10'} overflow-hidden rounded-full bg-white/60`}>
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: m.bar }}
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className={`hidden font-bold sm:inline ${m.text} ${big ? 'text-xs' : 'text-[10px]'}`}>{m.label}</span>
    </div>
  )
}

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const m = evidenceLevelMeta[level]
  return <span className={`pill ${m.bg} ${m.colour}`}>{m.label}</span>
}

export function Pill({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: 'safe' | 'caution' | 'doctor' | 'danger' | 'info' | 'theoretical'
}) {
  const map = {
    safe: 'bg-safe-soft text-safe',
    caution: 'bg-caution-soft text-caution',
    doctor: 'bg-doctor-soft text-doctor',
    danger: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
    theoretical: 'bg-theoretical-soft text-theoretical',
  }
  return <span className={`pill ${map[tone]}`}>{children}</span>
}

/** Smooth spring count-up to a target value. Animates whenever `value` changes. */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 700,
  className = '',
}: {
  value: number
  decimals?: number
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={`tabular-nums ${className}`}>{display.toFixed(decimals)}</span>
}

/** Animated circular gauge with gradient stroke + glow. value 0..max. */
export function RingGauge({
  value,
  max = 10,
  size = 116,
  stroke = 11,
  colour = '#2c7be5',
  label,
  sublabel,
}: {
  value: number
  max?: number
  size?: number
  stroke?: number
  colour?: string
  label?: string
  sublabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / max))
  const id = `g-${colour.replace('#', '')}`

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colour} />
            <stop offset="100%" stopColor="#7bc043" />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,81,150,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          filter={`url(#${id}-glow)`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: inView ? circ * (1 - pct) : circ }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center rotate-0">
        <span className="text-2xl font-extrabold text-brand-deep">
          <AnimatedNumber value={value} decimals={value % 1 === 0 ? 0 : 1} />
        </span>
        {label && <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>}
        {sublabel && <span className="text-[10px] text-slate-400">{sublabel}</span>}
      </div>
    </div>
  )
}

/** Animated gradient CTA. Honest by default: shows "coming soon" until live. */
export function CTAButton({
  children,
  live = false,
  onClick,
  className = '',
}: {
  children: ReactNode
  live?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={live ? onClick : undefined}
      disabled={!live}
      className={`btn-cta ${!live ? 'opacity-90' : ''} ${className}`}
    >
      {children} {!live && <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">soon</span>}
    </button>
  )
}

/** TGA / not-medical-advice disclaimer block (reusable). */
export function Disclaimer({ variant = 'tool' }: { variant?: 'tool' | 'product' }) {
  if (variant === 'product') {
    return (
      <p className="rounded-lg bg-doctor-soft px-3 py-2 text-xs text-doctor">
        This product is not a medicine. It is not approved to treat autism. Speak to your doctor
        or pharmacist before use.
      </p>
    )
  }
  return (
    <p className="rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
      Education only. Not medical advice. Not a diagnosis or dosing tool. Always speak to the
      treating doctor before changing anything.
    </p>
  )
}
