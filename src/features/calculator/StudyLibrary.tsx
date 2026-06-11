import { motion } from 'framer-motion'
import { BookOpen } from '../../components/icons'
import { studies } from '../../data/studies'
import { GlassCard, SectionTitle } from '../../components/ui'

export function StudyLibrary() {
  return (
    <GlassCard>
      <SectionTitle
        icon={<BookOpen size={20} />}
        title="Study library"
        subtitle="The published studies behind the numbers, in plain English. Every projection traces back to here."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {studies.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: (i % 2) * 0.04, duration: 0.35 }}
            className="accent-card p-4 pl-5"
            style={{ ['--accent' as string]: '#2c7be5' }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-extrabold text-brand-deep">{s.name}</h3>
              <span className="pill bg-info-soft text-info">{s.year}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {s.design}
              {s.sample ? ` · ${s.sample}` : ''} · {s.dose}
            </p>
            <p className="mt-2 text-xs text-slate-600">
              <span className="font-bold">Found: </span>
              {s.outcome}
            </p>
            <p className="mt-1 text-xs text-safe">
              <span className="font-bold">In plain English: </span>
              {s.plainEnglish}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              <span className="font-bold">Limits: </span>
              {s.limitations}
            </p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
