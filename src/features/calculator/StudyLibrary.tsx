import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search } from '../../components/icons'
import { studies } from '../../data/studies'
import { GlassCard, SectionTitle } from '../../components/ui'

const CARD_ACCENTS = ['#0E5196', '#1D4ED8', '#7C3AED', '#0891B2', '#15803D', '#B45309', '#BE185D']

export function StudyLibrary() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return studies
    return studies.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.outcome.toLowerCase().includes(q) ||
        s.plainEnglish.toLowerCase().includes(q) ||
        s.design.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <GlassCard>
      <SectionTitle
        icon={<BookOpen size={20} />}
        title="Study library"
        subtitle="The published studies behind the numbers, in plain English. Every projection traces back to here."
      />

      {/* Trust strip */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          `${studies.length} studies`,
          'Peer-reviewed only',
          'RN reviewed',
          'Limitations shown',
        ].map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, background: 'rgba(14,81,150,0.13)' }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 22 }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold"
            style={{ background: 'rgba(14,81,150,0.08)', color: '#0E5196', border: '1px solid rgba(14,81,150,0.14)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-navy opacity-60" />
            {label}
          </motion.span>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search studies, treatments, or findings…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field w-full pl-9 text-sm"
        />
        {query && (
          <motion.button
            onClick={() => setQuery('')}
            whileHover={{ scale: 1.1, color: '#0e5196' }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400"
          >
            clear
          </motion.button>
        )}
      </div>

      {/* Result count */}
      {query && (
        <p className="mb-3 text-xs text-slate-400">
          {filtered.length === 0
            ? 'No studies matched that search.'
            : `${filtered.length} of ${studies.length} studies`}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length]
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -3, boxShadow: `0 14px 32px -12px ${accent}55, 0 0 0 1px ${accent}30`, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                transition={{ delay: query ? 0 : (i % 2) * 0.04, duration: 0.35, type: 'spring', stiffness: 260, damping: 24 }}
                className="relative overflow-hidden rounded-2xl p-4 pl-6"
                style={{
                  background: `linear-gradient(135deg, white, color-mix(in srgb, ${accent} 4%, white))`,
                  border: `1px solid ${accent}22`,
                  boxShadow: `0 3px 12px -6px ${accent}44`,
                }}
              >
                {/* Left accent bar */}
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
                  style={{ background: accent }}
                />

                {/* Header row */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold leading-snug text-brand-deep">{s.name}</h3>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tabular-nums"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    {s.year}
                  </span>
                </div>

                {/* Meta chips */}
                <div className="mb-2.5 flex flex-wrap gap-1">
                  {[s.design, s.sample, s.dose].filter(Boolean).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-slate-500"
                      style={{ background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.12)' }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Finding */}
                <p className="mb-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Found: </span>
                  {s.outcome}
                </p>

                {/* Plain English */}
                <div
                  className="mb-2 rounded-lg px-2.5 py-2 text-xs"
                  style={{ background: 'rgba(21,128,61,0.07)', color: '#166534', border: '1px solid rgba(21,128,61,0.12)' }}
                >
                  <span className="font-bold">Plain English: </span>
                  {s.plainEnglish}
                </div>

                {/* Limits */}
                <div
                  className="rounded-lg px-2.5 py-1.5 text-[11px]"
                  style={{ background: 'rgba(180,83,9,0.06)', color: '#B45309', border: '1px solid rgba(180,83,9,0.1)' }}
                >
                  <span className="font-bold">Limits: </span>
                  {s.limitations}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && query && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-2xl border border-dashed border-slate-200 py-8 text-center"
        >
          <div
            className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #0E5196, #1d4ed8)' }}
          >
            <Search size={20} className="text-white" />
          </div>
          <p className="text-sm font-bold text-slate-400">No studies matched</p>
          <p className="text-xs text-slate-300">Try a treatment name like NAC, omega-3, or risperidone.</p>
        </motion.div>
      )}
    </GlassCard>
  )
}
