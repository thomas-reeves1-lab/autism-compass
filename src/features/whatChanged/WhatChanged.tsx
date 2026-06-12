import { useState } from 'react'
import { motion } from 'framer-motion'
import { History, Plus, ClipboardList, AlertTriangle } from '../../components/icons'
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

      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5fb)', border: '1px solid rgba(14,81,150,0.09)' }}>
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
          placeholder="Optional: add any context that might matter (e.g. they had a cold, school was different)"
          className="mt-3 field"
          rows={2}
        />
        <motion.button
          onClick={submit}
          disabled={!date}
          whileTap={date ? { scale: 0.96 } : {}}
          whileHover={date ? { scale: 1.02 } : {}}
          className="btn-primary mt-3 text-sm"
        >
          <Plus size={16} /> Log this change
        </motion.button>
      </div>

      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-dashed border-slate-200 py-8 text-center"
        >
          <div
            className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #0E5196, #1d4ed8)' }}
          >
            <ClipboardList size={20} className="text-white" />
          </div>
          <p className="text-sm font-bold text-slate-400">No changes logged yet</p>
          <p className="text-xs text-slate-300">Add one above to start building a timeline.</p>
        </motion.div>
      )}

      {events.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Timeline — {events.length} event{events.length !== 1 ? 's' : ''}</p>
          <div className="relative space-y-2 pl-6">
            {/* Gradient connector line */}
            <span
              className="pointer-events-none absolute bottom-2 left-[7px] top-2 w-[2px] rounded-full"
              style={{ background: 'linear-gradient(180deg, #0e5196 0%, rgba(14,81,150,0.25) 80%, transparent)' }}
            />
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
                className="relative rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                  border: '1px solid rgba(14,81,150,0.08)',
                  boxShadow: '0 2px 8px -4px rgba(6,32,63,0.15)',
                }}
              >
                {/* Timeline dot */}
                <span
                  className="absolute -left-[22px] top-3.5 h-3.5 w-3.5 rounded-full border-2 border-white"
                  style={{ background: 'linear-gradient(135deg, #0e5196, #2c7be5)', boxShadow: '0 0 0 3px rgba(14,81,150,0.15)' }}
                />
                <p className="text-sm font-extrabold text-brand-deep">{e.type}</p>
                <p className="text-[11px] font-semibold text-slate-400">{e.date}</p>
                {e.notes && <p className="mt-1 text-xs text-slate-600">{e.notes}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div
        className="mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs"
        style={{ background: 'rgba(180,83,9,0.06)', border: '1px solid rgba(180,83,9,0.18)' }}
      >
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-caution" />
        <p className="text-caution">
          This tool shows patterns only. It does not prove cause. If aggression, self-injury, seizure
          concern or red-flag side effects increase, specialist review is recommended. If there is
          immediate danger, seek urgent help.
        </p>
      </div>
    </GlassCard>
  )
}
