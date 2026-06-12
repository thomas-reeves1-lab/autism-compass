import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, Download, Lock, Plus } from '../../components/icons'
import { useAppStore, type TrackerEntry } from '../../store/useAppStore'
import { downloadTrackerCsv } from '../../lib/exports'
import { showDormant } from '../../config/featureFlags'
import { GlassCard, SectionTitle, Pill } from '../../components/ui'

const blank = (): TrackerEntry => ({
  date: '',
  sleepHours: 8,
  sleepOnsetMinutes: 30,
  loopingEpisodes: 0,
  aggressionEpisodes: 0,
  selfInjuryEpisodes: 0,
  skinPickingEpisodes: 0,
  prnUsed: false,
  foodSeeking: 5,
  bowelIssues: 0,
  sedation: 4,
  painSigns: 0,
  notes: '',
})

type NumField = { k: keyof TrackerEntry; label: string; min?: number; max?: number }

const SLEEP_FIELDS: NumField[] = [
  { k: 'sleepHours', label: 'Sleep hours', min: 0, max: 24 },
  { k: 'sleepOnsetMinutes', label: 'Mins to fall asleep', min: 0, max: 180 },
  { k: 'sedation', label: 'Sedation (0-10)', min: 0, max: 10 },
]
const BEHAVIOUR_FIELDS: NumField[] = [
  { k: 'loopingEpisodes', label: 'Looping episodes', min: 0 },
  { k: 'aggressionEpisodes', label: 'Aggression episodes', min: 0 },
  { k: 'selfInjuryEpisodes', label: 'Self-injury episodes', min: 0 },
  { k: 'skinPickingEpisodes', label: 'Skin picking', min: 0 },
]
const PHYSICAL_FIELDS: NumField[] = [
  { k: 'foodSeeking', label: 'Food seeking (0-10)', min: 0, max: 10 },
  { k: 'bowelIssues', label: 'Bowel issues (0-10)', min: 0, max: 10 },
  { k: 'painSigns', label: 'Pain signs (0-10)', min: 0, max: 10 },
]

function FormSection({ accent, title, children }: { accent: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: accent }}>{title}</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">{children}</div>
    </div>
  )
}

function NumInput({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <label className="text-xs font-bold text-slate-500">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 field"
      />
    </label>
  )
}

export function Tracker() {
  const entries = useAppStore((s) => s.trackerEntries)
  const add = useAppStore((s) => s.addTrackerEntry)
  const [form, setForm] = useState<TrackerEntry>(blank())

  const set = <K extends keyof TrackerEntry>(k: K, v: TrackerEntry[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.date) return
    add(form)
    setForm(blank())
  }

  const avgSleep = entries.length
    ? (entries.reduce((s, e) => s + e.sleepHours, 0) / entries.length).toFixed(1)
    : null

  const totalEpisodes = entries.reduce(
    (s, e) => s + e.aggressionEpisodes + e.selfInjuryEpisodes + e.loopingEpisodes, 0
  )

  const prnDays = entries.filter((e) => e.prnUsed).length

  return (
    <GlassCard>
      <SectionTitle
        icon={<ClipboardList size={20} />}
        title="Family tracker"
        subtitle="Log a day in under a minute. Data stays on this device only unless you export it."
      />

      {/* Form */}
      <div
        className="rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5fb)', border: '1px solid rgba(14,81,150,0.09)' }}
      >
        <label className="mb-3 block text-xs font-bold text-slate-500">
          Date
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="mt-1 field max-w-[180px]" />
        </label>

        <FormSection accent="#0E5196" title="Sleep">
          {SLEEP_FIELDS.map((f) => (
            <NumInput key={String(f.k)} label={f.label} value={form[f.k] as number} onChange={(v) => set(f.k, v as never)} min={f.min} max={f.max} />
          ))}
        </FormSection>

        <FormSection accent="#B45309" title="Behaviours">
          {BEHAVIOUR_FIELDS.map((f) => (
            <NumInput key={String(f.k)} label={f.label} value={form[f.k] as number} onChange={(v) => set(f.k, v as never)} min={f.min} max={f.max} />
          ))}
        </FormSection>

        <FormSection accent="#15803D" title="Physical">
          {PHYSICAL_FIELDS.map((f) => (
            <NumInput key={String(f.k)} label={f.label} value={form[f.k] as number} onChange={(v) => set(f.k, v as never)} min={f.min} max={f.max} />
          ))}
        </FormSection>

        <label className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
          <input
            type="checkbox"
            checked={form.prnUsed}
            onChange={(e) => set('prnUsed', e.target.checked)}
            className="h-4 w-4 accent-brand-navy"
          />
          PRN medication used today
        </label>

        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Notes — anything that stood out today"
          rows={2}
          className="mt-1 field"
        />
        <motion.button
          onClick={submit}
          disabled={!form.date}
          whileTap={form.date ? { scale: 0.96 } : {}}
          whileHover={form.date ? { scale: 1.02 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="btn-primary mt-3 text-sm"
        >
          <Plus size={16} /> Save this day
        </motion.button>
      </div>

      {/* Actions row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <motion.button
          onClick={() => downloadTrackerCsv(entries)}
          disabled={entries.length === 0}
          whileTap={entries.length > 0 ? { scale: 0.96 } : {}}
          whileHover={entries.length > 0 ? { scale: 1.03 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="btn-ghost text-sm"
        >
          <Download size={16} /> Export CSV
        </motion.button>
        {showDormant('PREMIUM_LIVE') && (
          <span title="Premium export — not live yet">
            <Pill tone="doctor">
              <Lock size={12} /> PDF export (coming soon)
            </Pill>
          </span>
        )}
        <span className="text-xs text-slate-400">{entries.length} day{entries.length !== 1 ? 's' : ''} logged</span>
      </div>

      {/* Summary strip */}
      {entries.length > 0 && avgSleep && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Avg sleep', value: `${avgSleep}h`, accent: '#0E5196' },
            { label: 'Total episodes', value: String(totalEpisodes), accent: '#B45309' },
            { label: 'PRN days', value: String(prnDays), accent: '#C2410C' },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ background: `color-mix(in srgb, ${accent} 7%, white)`, border: `1px solid ${accent}22` }}
            >
              <p className="text-base font-black" style={{ color: accent }}>{value}</p>
              <p className="text-[10px] font-bold text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {entries.length === 0 && (
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
            <p className="text-sm font-bold text-slate-400">No days logged yet</p>
            <p className="mt-1 text-xs text-slate-300">Fill in today above to start building your picture.</p>
            <p className="mt-0.5 text-xs text-slate-300">Even 7 days shows patterns a doctor can act on.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log table */}
      {entries.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-brand-deep/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/95 text-[10px] uppercase tracking-wide text-slate-500 shadow-[0_1px_0_rgba(14,81,150,0.1)]">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Sleep</th>
                <th className="px-3 py-2">Looping</th>
                <th className="px-3 py-2">Aggression</th>
                <th className="px-3 py-2">PRN</th>
                <th className="px-3 py-2 hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 14).map((e, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 transition"
                  style={e.prnUsed
                    ? { background: 'linear-gradient(90deg, rgba(194,65,12,0.06), rgba(194,65,12,0.03))' }
                    : i % 2 === 1 ? { background: 'rgba(219,234,254,0.3)' } : undefined
                  }
                >
                  <td className="px-3 py-2 font-bold text-brand-deep">{e.date}</td>
                  <td className="px-3 py-2">{e.sleepHours}h</td>
                  <td className="px-3 py-2">{e.loopingEpisodes}</td>
                  <td className="px-3 py-2">{e.aggressionEpisodes}</td>
                  <td className="px-3 py-2">
                    {e.prnUsed
                      ? <span className="pill bg-doctor-soft text-doctor font-bold">PRN</span>
                      : <span className="text-slate-300">—</span>
                    }
                  </td>
                  <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{e.notes.slice(0, 30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="mt-4 flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs"
        style={{ background: 'rgba(14,81,150,0.06)', border: '1px solid rgba(14,81,150,0.12)' }}
      >
        <Download size={13} className="mt-0.5 shrink-0 text-brand-navy" />
        <p className="text-brand-navy">
          <span className="font-bold">Data stays on this device</span> unless you export it. Nothing is sent anywhere.
        </p>
      </div>
    </GlassCard>
  )
}
