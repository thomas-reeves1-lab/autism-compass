import { useState } from 'react'
import { Plane, AlertTriangle, CheckCircle2, Lock } from '../../components/icons'
import { treatments } from '../../data/evidence'
import { checkStack, type TrafficLight } from '../../lib/safety'
import { GlassCard, SectionTitle } from '../../components/ui'

const LIGHT_META: Record<TrafficLight, { label: string; ring: string; text: string; bg: string }> = {
  green: { label: 'Clear to discuss', ring: 'border-safe', text: 'text-safe', bg: 'bg-safe-soft' },
  yellow: { label: 'Caution — bring to pharmacist', ring: 'border-caution', text: 'text-caution', bg: 'bg-caution-soft' },
  orange: { label: 'Doctor / pharmacist review recommended', ring: 'border-doctor', text: 'text-doctor', bg: 'bg-doctor-soft' },
  red: { label: 'Do not self-start — medical advice needed', ring: 'border-danger', text: 'text-danger', bg: 'bg-danger-soft' },
}

export function StackChecker() {
  const [selected, setSelected] = useState<string[]>(['risperidone'])
  const result = checkStack(selected)
  const meta = LIGHT_META[result.light]

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <GlassCard>
      <SectionTitle
        icon={<Plane size={20} />}
        title="Safe Stack Checker"
        subtitle="A calm pre-flight check of everything together. Tick what is being taken or considered. This is a conversation helper, not medical advice."
      />

      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Pre-flight check — select items</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {treatments
          .filter((t) => t.id !== 'watchful')
          .map((t) => (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`pill border ${
                selected.includes(t.id)
                  ? 'border-brand-navy bg-brand-navy text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {t.doctorOnly && <Lock size={11} />} {t.name}
            </button>
          ))}
      </div>

      {/* Traffic light result */}
      <div className={`rounded-2xl border-2 ${meta.ring} ${meta.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 font-extrabold ${meta.text}`}>
            {result.light === 'green' ? <CheckCircle2 /> : <AlertTriangle />}
            {meta.label}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-extrabold ${meta.text}`}>{result.score}</div>
            <div className="text-[10px] uppercase text-slate-400">stack score /100</div>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="mt-4 space-y-2">
        {result.flags.map((f, i) => {
          const m = LIGHT_META[f.level]
          return (
            <div key={i} className={`rounded-xl border-l-4 ${m.ring} ${m.bg} p-3`}>
              <p className={`text-sm font-bold ${m.text}`}>{f.title}</p>
              <p className="text-xs text-slate-600">{f.detail}</p>
            </div>
          )
        })}
      </div>

      {result.doctorOnlyItems.length > 0 && (
        <p className="mt-3 rounded-lg bg-doctor-soft px-3 py-2 text-xs text-doctor">
          Doctor-only items selected: {result.doctorOnlyItems.join(', ')}. Do not use this website to
          self-start them.
        </p>
      )}

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <p className="font-bold text-slate-700">Questions to ask the pharmacist:</p>
        <ul className="ml-4 list-disc">
          <li>Can these be taken together?</li>
          <li>Could this change risperidone levels?</li>
          <li>Could this make sleepiness worse?</li>
          <li>Could this affect bleeding risk or seizures?</li>
          <li>Should any doses be separated from fibre?</li>
          <li>What should we stop and call you about?</li>
        </ul>
      </div>
    </GlassCard>
  )
}
