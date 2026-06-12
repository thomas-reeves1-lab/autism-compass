import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { treatments } from '../../data/evidence'
import type { EvidenceLevel } from '../../lib/types'
import { evidenceLevelMeta } from '../../lib/labels'
import { GlassCard, SectionTitle, EvidenceBadge, SafetyScoreChip } from '../../components/ui'
import { safetyScore } from '../../lib/safety'
import { Lock, ChevronUp, ChevronDown } from '../../components/icons'

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

const FILTERS: { id: string; label: string; accent?: string; test: (t: (typeof treatments)[number]) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'behaviour', label: 'Best evidence', accent: '#15803D', test: (t) => t.evidenceLevel === 'strong' || t.evidenceLevel === 'moderate' },
  { id: 'supplement', label: 'Supplements', accent: '#7bc043', test: (t) => !t.doctorOnly && t.category !== 'Medication' },
  { id: 'doctor', label: 'Doctor only', accent: '#7c3aed', test: (t) => t.doctorOnly },
  { id: 'theoretical', label: 'Theoretical', accent: '#64748b', test: (t) => t.evidenceLevel === 'theoretical' },
  { id: 'negative', label: 'Not recommended', accent: '#B91C1C', test: (t) => t.evidenceLevel === 'negative' || t.category === 'Not recommended' },
]

export function EvidenceTable() {
  const [sort, setSort] = useState<SortKey>('evidenceLevel')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState('all')

  const cycleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSort(key); setSortDir('asc') }
  }

  const rows = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!.test
    const list = treatments.filter(f)
    const sorted = [...list].sort((a, b) => {
      if (sort === 'evidenceLevel') return EVIDENCE_RANK[a.evidenceLevel] - EVIDENCE_RANK[b.evidenceLevel]
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'category') return a.category.localeCompare(b.category)
      return a.harmLevel.localeCompare(b.harmLevel)
    })
    return sortDir === 'desc' ? sorted.reverse() : sorted
  }, [sort, sortDir, filter])

  return (
    <GlassCard>
      <SectionTitle
        title="Evidence table"
        subtitle={`${rows.length} option${rows.length !== 1 ? 's' : ''} shown. Tap any column header to sort.`}
      />

      {/* Filter chips — pill-group style */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <motion.button
              key={f.id}
              onClick={() => setFilter(f.id)}
              whileTap={{ scale: 0.91 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              className="pill text-xs"
              style={
                active
                  ? { background: f.accent ?? '#0e5196', color: '#fff', border: 'none', boxShadow: `0 4px 12px -4px ${f.accent ?? '#0e5196'}99` }
                  : { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }
              }
            >
              {active && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white/80" />}
              {f.label}
            </motion.button>
          )
        })}
      </div>

      <div className="max-h-[560px] overflow-auto rounded-xl" style={{ boxShadow: 'inset 0 0 0 1px rgba(14,81,150,0.1)' }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className="sticky top-0 z-10 text-[11px] uppercase tracking-wide text-slate-500"
              style={{ background: 'rgba(248,250,252,0.97)', backdropFilter: 'blur(8px)', boxShadow: '0 1px 0 rgba(14,81,150,0.1)' }}
            >
              <Th label="Option" sortKey="name" current={sort} dir={sortDir} onClick={cycleSort} />
              <Th label="Category" sortKey="category" current={sort} dir={sortDir} onClick={cycleSort} />
              <Th label="Evidence" sortKey="evidenceLevel" current={sort} dir={sortDir} onClick={cycleSort} />
              <th className="px-3 py-2.5 font-semibold">Safety /100</th>
              <th className="hidden px-3 py-2.5 font-semibold md:table-cell">Studied for</th>
              <Th label="Risk" sortKey="harmLevel" current={sort} dir={sortDir} onClick={cycleSort} />
              <th className="px-3 py-2.5 font-semibold">Rx?</th>
            </tr>
          </thead>
          <AnimatePresence mode="popLayout">
            <tbody>
              {rows.map((t, i) => {
                const isStrong = t.evidenceLevel === 'strong' || t.evidenceLevel === 'moderate'
                return (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.015 }}
                    className="border-b border-slate-100 transition-colors duration-150 hover:bg-brand-sky/50"
                    style={isStrong ? { background: 'linear-gradient(90deg, rgba(21,128,61,0.04), transparent 40%)' } : undefined}
                  >
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-brand-deep">{t.name}</span>
                      {isStrong && <span className="ml-1.5 text-[10px] font-black text-safe opacity-70">*</span>}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">{t.category}</td>
                    <td className="px-3 py-2.5">
                      <EvidenceBadge level={t.evidenceLevel} />
                    </td>
                    <td className="px-3 py-2.5">
                      <SafetyScoreChip score={safetyScore(t)} />
                    </td>
                    <td className="hidden px-3 py-2.5 text-xs text-slate-500 md:table-cell">{t.sourceSummary.slice(0, 55)}{t.sourceSummary.length > 55 ? '…' : ''}</td>
                    <td className="px-3 py-2.5">
                      <span className={harmColour(t.harmLevel)}>{t.harmLevel}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      {t.doctorOnly ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-doctor">
                          <Lock size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-300">No</span>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Legend</span>
        {(Object.keys(evidenceLevelMeta) as EvidenceLevel[]).map((l) => (
          <EvidenceBadge key={l} level={l} />
        ))}
      </div>
    </GlassCard>
  )
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: 'asc' | 'desc'
  onClick: (k: SortKey) => void
}) {
  const active = current === sortKey
  return (
    <th
      className="cursor-pointer select-none px-3 py-2.5 font-semibold"
      onClick={() => onClick(sortKey)}
    >
      <motion.span
        className="inline-flex items-center gap-1 hover:text-brand-navy"
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {label}
        {active ? (
          dir === 'asc' ? <ChevronUp size={11} className="text-brand-navy" /> : <ChevronDown size={11} className="text-brand-navy" />
        ) : (
          <span className="text-slate-300 opacity-50">
            <ChevronUp size={9} />
          </span>
        )}
      </motion.span>
    </th>
  )
}

function harmColour(h: string): string {
  if (h === 'doctorOnly') return 'pill bg-doctor-soft text-doctor'
  if (h === 'high') return 'pill bg-danger-soft text-danger'
  if (h === 'moderate') return 'pill bg-caution-soft text-caution'
  return 'pill bg-safe-soft text-safe'
}
