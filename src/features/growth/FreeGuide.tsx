import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Printer, ShieldCheck, AlertTriangle, Check } from '../../components/icons'
import { GlassCard } from '../../components/ui'

/**
 * The free lead-magnet guide (first draft). Education only. TGA-safe:
 * it teaches what studies found and how to prepare for the doctor. It never
 * says a supplement treats autism. Voice/clinical review still recommended.
 */

const SECTION_ACCENTS = ['#0E5196', '#1D4ED8', '#15803D', '#7C3AED', '#B45309', '#C2410C']

function GuideSection({ num, title, children }: { num: number; title: string; children: ReactNode }) {
  const accent = SECTION_ACCENTS[(num - 1) % SECTION_ACCENTS.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: 0.03 * num, type: 'spring', stiffness: 260, damping: 26 }}
      className="relative overflow-hidden rounded-2xl p-4 pl-6"
      style={{
        background: `linear-gradient(135deg, white, color-mix(in srgb, ${accent} 4%, white))`,
        border: `1px solid ${accent}22`,
      }}
    >
      <span
        className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
        style={{ background: accent }}
      />
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black text-white"
          style={{ background: accent }}
        >
          {num}
        </span>
        <h3 className="font-extrabold" style={{ color: accent }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

const DOCTOR_QUESTIONS = [
  'What behaviour are we trying to help?',
  'Could pain, sleep, or constipation be part of it?',
  'Is this option safe with our current medicines?',
  'How will we know if it is working?',
  'What should make us stop and call you?',
]

export function FreeGuide() {
  return (
    <GlassCard>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-brand-deep">The Calmer Days Autism Guide</h2>
          <p className="text-xs text-slate-400">Education only · Not medical advice · Built by a registered provider and an RN</p>
        </div>
        <motion.button
          onClick={() => window.print()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="btn-ghost text-sm"
        >
          <Printer size={16} /> Print / save PDF
        </motion.button>
      </div>

      {/* Disclaimer banner */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="mb-5 flex items-start gap-2 rounded-xl p-3 text-xs"
        style={{ background: 'rgba(14,81,150,0.07)', color: '#0E5196', border: '1px solid rgba(14,81,150,0.12)' }}
      >
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        Education only. Not medical advice. Not a diagnosis or dosing tool. Always speak to the
        treating doctor before changing anything.
      </motion.div>

      <div id="free-guide" className="space-y-3">

        <GuideSection num={1} title="Behaviour rarely comes from nowhere">
          <p className="text-sm text-slate-600">
            Before adding anything, check the simple things first. Pain. Constipation. Poor sleep.
            Hunger. Noise. A change in routine. These are common reasons behaviour gets harder. Fix
            the cause, and the behaviour often eases.
          </p>
        </GuideSection>

        <GuideSection num={2} title="What the research actually says">
          <p className="text-sm text-slate-600">
            Some supplements have been studied in autism. Some have good evidence for certain things.
            Many have weak or mixed evidence. A few were studied and did not help. We show all of it
            openly, including the weak parts. Strong evidence is rare. Be careful of anyone who
            promises a cure.
          </p>
        </GuideSection>

        <GuideSection num={3} title="Safety comes first">
          <p className="text-sm text-slate-600">
            "Natural" does not mean safe. Supplements can interact with medicine. Dose and product
            quality matter. Always ask the doctor or pharmacist before starting anything, and never
            stop a prescribed medicine without the prescriber.
          </p>
        </GuideSection>

        <GuideSection num={4} title="How to prepare for the doctor">
          <p className="text-sm text-slate-600">
            Write down the behaviour you want to help. Track it for a week or two. List every
            medicine and supplement, with doses and start dates. Bring your questions. Ask how you
            will measure if something is working after 8 to 12 weeks.
          </p>
        </GuideSection>

        <GuideSection num={5} title="Questions worth asking">
          <ol className="mt-1 space-y-1.5">
            {DOCTOR_QUESTIONS.map((q, i) => (
              <motion.li
                key={q}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 12) * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                  style={{ background: SECTION_ACCENTS[4] }}
                >
                  {i + 1}
                </span>
                {q}
              </motion.li>
            ))}
          </ol>
        </GuideSection>

        {/* Red flags — danger treatment */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 26 }}
          className="relative overflow-hidden rounded-2xl p-4 pl-6"
          style={{
            background: 'linear-gradient(135deg, rgba(185,28,28,0.07), rgba(185,28,28,0.03))',
            border: '1px solid rgba(185,28,28,0.2)',
          }}
        >
          <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl" style={{ background: '#B91C1C' }} />
          <div className="mb-2 flex items-center gap-2.5">
            <AlertTriangle size={18} className="shrink-0 text-danger" />
            <h3 className="font-extrabold text-danger">6. Red flags — get urgent help</h3>
          </div>
          <p className="text-sm text-slate-600">
            Seizure, breathing trouble, collapse, high fever with stiff muscles, a bad allergic
            reaction, or a sudden severe change. In Australia, call 000.
          </p>
        </motion.div>

      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-slate-500"
        style={{ background: 'rgba(14,81,150,0.05)', border: '1px solid rgba(14,81,150,0.08)' }}
      >
        <Check size={13} className="text-safe" />
        Built by a registered NDIS provider and a Registered Nurse. Education only. Not medical advice.
      </motion.div>
    </GlassCard>
  )
}
