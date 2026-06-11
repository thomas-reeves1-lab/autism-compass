import { useState } from 'react'
import { History, Plus } from '../../components/icons'
import { useAppStore, type ChangeEvent } from '../../store/useAppStore'
import { GlassCard, SectionTitle } from '../../components/ui'

const CHANGE_TYPES = [
  'medication dose change', 'new medication', 'stopped medication', 'missed medication',
  'new supplement', 'sleep got worse', 'constipation', 'illness', 'pain signs', 'dental issue',
  'seizure concern', 'staff change', 'house routine change', 'food change',
  'school/day program change', 'family stress', 'sensory overload', 'less exercise',
  'more screen time', 'major transition', 'restrictive practice change', 'behaviour plan change',
]

export function WhatChanged() {
  const events = useAppStore((s) => s.changeEvents)
  const add = useAppStore((s) => s.addChangeEvent)
  const [type, setType] = useState(CHANGE_TYPES[0])
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  const submit = () => {
    if (!date) return
    const e: ChangeEvent = { id: `${date}-${type}-${events.length}`, date, type, notes }
    add(e)
    setNotes('')
  }

  return (
    <GlassCard>
      <SectionTitle
        icon={<History size={20} />}
        title="What changed?"
        subtitle="Behaviour rarely comes out of nowhere. Log changes here to spot patterns before and after. This shows patterns only — it does not prove cause."
      />

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold text-slate-500">
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 field" />
          </label>
          <label className="text-xs font-bold text-slate-500 sm:col-span-2">
            What changed
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 field">
              {CHANGE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="mt-3 field"
          rows={2}
        />
        <button onClick={submit} className="btn-primary mt-3 text-sm">
          <Plus size={16} /> Add change event
        </button>
      </div>

      {events.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold text-slate-500">Timeline</p>
          <div className="space-y-2 border-l-2 border-brand-navy/20 pl-4">
            {events.map((e) => (
              <div key={e.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-navy" />
                <p className="text-sm font-bold text-brand-deep">{e.type}</p>
                <p className="text-xs text-slate-400">{e.date}</p>
                {e.notes && <p className="text-xs text-slate-600">{e.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 rounded-lg bg-caution-soft px-3 py-2 text-xs text-caution">
        This tool shows patterns only. It does not prove cause. If aggression, self-injury, seizure
        concern or red-flag side effects increase, specialist review is recommended. If there is
        immediate danger, seek urgent help.
      </p>
    </GlassCard>
  )
}
