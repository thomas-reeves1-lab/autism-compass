import { useState } from 'react'
import { ClipboardList, Download, Lock } from 'lucide-react'
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

  const numFields: { k: keyof TrackerEntry; label: string }[] = [
    { k: 'sleepHours', label: 'Sleep hours' },
    { k: 'sleepOnsetMinutes', label: 'Mins to fall asleep' },
    { k: 'loopingEpisodes', label: 'Looping episodes' },
    { k: 'aggressionEpisodes', label: 'Aggression episodes' },
    { k: 'selfInjuryEpisodes', label: 'Self-injury episodes' },
    { k: 'skinPickingEpisodes', label: 'Skin-picking episodes' },
    { k: 'foodSeeking', label: 'Food seeking (0-10)' },
    { k: 'bowelIssues', label: 'Bowel issues (0-10)' },
    { k: 'sedation', label: 'Sedation (0-10)' },
    { k: 'painSigns', label: 'Pain signs (0-10)' },
  ]

  return (
    <GlassCard>
      <SectionTitle
        icon={<ClipboardList size={20} />}
        title="Family tracker"
        subtitle="Log a day in under a minute. Data stays on this device only unless you export it."
      />

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold text-slate-500">
            Date
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm" />
          </label>
          {numFields.map((f) => (
            <label key={f.k} className="text-xs font-bold text-slate-500">
              {f.label}
              <input
                type="number"
                value={form[f.k] as number}
                onChange={(e) => set(f.k, Number(e.target.value) as never)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
              />
            </label>
          ))}
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <input type="checkbox" checked={form.prnUsed} onChange={(e) => set('prnUsed', e.target.checked)} className="h-4 w-4 accent-brand-navy" />
            PRN medication used
          </label>
        </div>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Notes"
          rows={2}
          className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-sm"
        />
        <button onClick={submit} className="btn-primary mt-3 text-sm">
          Save day
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => downloadTrackerCsv(entries)} className="btn-ghost text-sm" disabled={entries.length === 0}>
          <Download size={16} /> Export CSV
        </button>
        {/* Premium export — gated; shown as dormant in dev preview */}
        {showDormant('PREMIUM_LIVE') && (
          <span title="Premium export — not live yet">
            <Pill tone="doctor">
              <Lock size={12} /> PDF export (premium — coming soon)
            </Pill>
          </span>
        )}
        <span className="text-xs text-slate-400">{entries.length} day(s) logged</span>
      </div>

      {entries.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400">
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Sleep</th>
                <th className="px-2 py-1">Looping</th>
                <th className="px-2 py-1">Aggression</th>
                <th className="px-2 py-1">PRN</th>
                <th className="px-2 py-1">Notes</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 14).map((e, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1 font-bold text-brand-deep">{e.date}</td>
                  <td className="px-2 py-1">{e.sleepHours}h</td>
                  <td className="px-2 py-1">{e.loopingEpisodes}</td>
                  <td className="px-2 py-1">{e.aggressionEpisodes}</td>
                  <td className="px-2 py-1">{e.prnUsed ? 'yes' : 'no'}</td>
                  <td className="px-2 py-1 text-slate-500">{e.notes.slice(0, 30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
        This tracker stores data on this device only unless you export it. No data is sent anywhere.
      </p>
    </GlassCard>
  )
}
