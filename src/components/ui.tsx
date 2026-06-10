import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { EvidenceLevel } from '../lib/types'
import { evidenceLevelMeta } from '../lib/labels'

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`glass p-5 ${className}`}>{children}</div>
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

export function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="tabular-nums"
    >
      {value}
    </motion.span>
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
