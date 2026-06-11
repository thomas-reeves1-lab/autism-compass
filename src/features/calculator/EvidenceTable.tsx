import { useMemo, useState } from 'react'
import { treatments } from '../../data/evidence'
import type { EvidenceLevel } from '../../lib/types'
import { evidenceLevelMeta } from '../../lib/labels'
import { GlassCard, SectionTitle, EvidenceBadge, SafetyScoreChip } from '../../components/ui'
import { safetyScore } from '../../lib/safety'
import { Lock } from '../../components/icons'

type SortKey = 'name' | 'category' | 'evidenceLevel' | 'harmLevel'

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  strong: 0,
  moderate: 1,
  emerging: 2,
  mixed: 3,
  weak: 4,
  theoretical: 5,
  negative: 6,
  doctorOnly: 7,
}

const FILTERS: { id: string; label: string; test: (t: (typeof treatments)[number]) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'behaviour', label: 'Strong behaviour evidence', test: (t) => t.evidenceLevel === 'strong' || t.evidenceLevel === 'moderate' },
  { id: 'doctor', label: 'Doctor only', test: (t) => t.doctorOnly },
  { id: 'supplement', label: 'Supplement only', test: (t) => !t.doctorOnly && t.category !== 'Medication' },
  { id: 'theoretical', label: 'Theoretical only', test: (t) => t.evidenceLevel === 'theoretical' },
  { id: 'negative', label: 'Negative / not recommended', test: (t) => t.evidenceLevel === 'negative' || t.category === 'Not recommended' },
]

export function EvidenceTable() {
  const [sort, setSort] = useState<SortKey>('evidenceLevel')
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!.test
    const list = treatments.filter(f)
    return [...list].sort((a, b) => {
      if (sort === 'evidenceLevel') return EVIDENCE_RANK[a.evidenceLevel] - EVIDENCE_RANK[b.evidenceLevel]
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'category') return a.category.localeCompare(b.category)
      return a.harmLevel.localeCompare(b.harmLevel)
    })
  }, [sort, filter])

  return (
    <GlassCard>
      <SectionTitle title="Evidence table" subtitle="Sort and filter every option by evidence and risk. Tap a column to sort." />
      <div className="mb-3 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill border ${filter === f.id ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="max-h-[540px] overflow-auto rounded-xl ring-1 ring-brand-deep/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="sticky top-0 z-10 bg-white/95 text-[11px] uppercase tracking-wide text-slate-500 shadow-[0_1px_0_rgba(14,81,150,0.12)] backdrop-blur">
              <Th onClick={() => setSort('name')}>Option</Th>
              <Th onClick={() => setSort('category')}>Category</Th>
              <Th onClick={() => setSort('evidenceLevel')}>Evidence</Th>
              <th className="px-3 py-2.5">Safety /100</th>
              <th className="px-3 py-2.5">Studied target</th>
              <Th onClick={() => setSort('harmLevel')}>Risk</Th>
              <th className="px-3 py-2.5">Doctor only</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 transition even:bg-brand-sky/30 hover:bg-brand-sky/70"
              >
                <td className="px-3 py-2.5 font-bold text-brand-deep">{t.name}</td>
                <td className="px-3 py-2.5 text-slate-500">{t.category}</td>
                <td className="px-3 py-2.5">
                  <EvidenceBadge level={t.evidenceLevel} />
                </td>
                <td className="px-3 py-2.5">
                  <SafetyScoreChip score={safetyScore(t)} />
                </td>
                <td className="px-3 py-2.5 text-xs text-slate-500">{t.sourceSummary.slice(0, 60)}…</td>
                <td className="px-3 py-2.5">
                  <span className={harmColour(t.harmLevel)}>{t.harmLevel}</span>
                </td>
                <td className="px-3 py-2.5">
                  {t.doctorOnly ? (
                    <span className="inline-flex items-center gap-1 font-bold text-doctor">
                      <Lock size={13} /> Yes
                    </span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(evidenceLevelMeta) as EvidenceLevel[]).map((l) => (
          <EvidenceBadge key={l} level={l} />
        ))}
      </div>
    </GlassCard>
  )
}

function Th({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <th className="cursor-pointer select-none px-2 py-2 hover:text-brand-navy" onClick={onClick}>
      {children} ↕
    </th>
  )
}

function harmColour(h: string): string {
  if (h === 'doctorOnly') return 'pill bg-doctor-soft text-doctor'
  if (h === 'high') return 'pill bg-danger-soft text-danger'
  if (h === 'moderate') return 'pill bg-caution-soft text-caution'
  return 'pill bg-safe-soft text-safe'
}
