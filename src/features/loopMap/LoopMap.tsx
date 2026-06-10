import { useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, ArrowRight } from 'lucide-react'
import { GlassCard, SectionTitle } from '../../components/ui'

const STAGES = ['Trigger', 'Loop', 'Escalation', 'Behaviour', 'Recovery'] as const

const TRIGGERS = [
  'denied access', 'waiting', 'transition', 'hunger', 'noise', 'tired', 'pain',
  'bowel discomfort', 'demand avoidance', 'change in routine', 'staff inconsistency',
  'boredom', 'sensory overload', 'communication frustration',
]

/** Environmental + behavioural supports FIRST, not medication-first. */
const SUPPORTS: Record<(typeof STAGES)[number], string[]> = {
  Trigger: ['visual support', 'low-demand recovery time', 'sensory support', 'pain check', 'bowel plan'],
  Loop: ['communication support', 'choice making', 'predictable routine', 'sensory break'],
  Escalation: ['co-regulation', 'reduce demands', 'safe space', 'calm script'],
  Behaviour: ['behaviour plan', 'safety plan', 'medical review if new/serious'],
  Recovery: ['rest', 'reconnect', 'review what helped', 'log it in the tracker'],
}

export function LoopMap() {
  const [trigger, setTrigger] = useState<string>('')

  return (
    <GlassCard>
      <SectionTitle
        icon={<Workflow size={20} />}
        title="Behaviour Loop Map"
        subtitle="Behaviour usually follows a path. Supports work best early. Environment and behaviour supports come first — not medication."
      />

      <div className="mb-4">
        <p className="mb-2 text-xs font-bold text-slate-500">Pick a trigger you recognise:</p>
        <div className="flex flex-wrap gap-1.5">
          {TRIGGERS.map((t) => (
            <button
              key={t}
              onClick={() => setTrigger(t)}
              className={`pill border ${trigger === t ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-200 bg-white text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-1 items-stretch gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex-1 rounded-xl border border-slate-100 bg-white p-3"
            >
              <p className="text-sm font-extrabold text-brand-deep">{stage}</p>
              {i === 0 && trigger && <p className="mt-1 text-xs text-brand-navy">e.g. {trigger}</p>}
              <ul className="mt-2 space-y-1">
                {SUPPORTS[stage].map((s) => (
                  <li key={s} className="text-[11px] text-slate-500">
                    • {s}
                  </li>
                ))}
              </ul>
            </motion.div>
            {i < STAGES.length - 1 && (
              <ArrowRight className="hidden shrink-0 self-center text-slate-300 md:block" size={18} />
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
        Medication review is one option, but checking sleep, pain, bowels, sensory needs, demands and
        communication usually comes first.
      </p>
    </GlassCard>
  )
}
