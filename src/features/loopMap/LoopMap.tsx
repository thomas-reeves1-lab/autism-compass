import { useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, ArrowRight } from '../../components/icons'
import { GlassCard, SectionTitle } from '../../components/ui'

const STAGES = ['Trigger', 'Loop', 'Escalation', 'Behaviour', 'Recovery'] as const

const STAGE_COLOUR: Record<(typeof STAGES)[number], string> = {
  Trigger: '#0E5196',
  Loop: '#1D4ED8',
  Escalation: '#B45309',
  Behaviour: '#C2410C',
  Recovery: '#15803D',
}

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
          {TRIGGERS.map((t) => {
            const on = trigger === t
            return (
              <button
                key={t}
                onClick={() => setTrigger(on ? '' : t)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  on ? 'bg-brand-navy text-white shadow-card' : 'bg-white text-slate-600 ring-1 ring-inset ring-brand-deep/15 hover:ring-brand-navy/40'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 md:flex-row md:items-stretch">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-1 items-stretch gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 220, damping: 22 }}
              className="accent-card flex-1 p-3 pl-4"
              style={{ ['--accent' as string]: STAGE_COLOUR[stage] }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid h-5 w-5 place-items-center rounded-md text-[11px] font-black text-white"
                  style={{ background: STAGE_COLOUR[stage] }}
                >
                  {i + 1}
                </span>
                <p className="text-sm font-extrabold text-brand-deep">{stage}</p>
              </div>
              {i === 0 && trigger && (
                <p className="mt-1 inline-block rounded bg-brand-navy/10 px-1.5 py-0.5 text-xs font-bold text-brand-navy">
                  e.g. {trigger}
                </p>
              )}
              <ul className="mt-2 space-y-1">
                {SUPPORTS[stage].map((s) => (
                  <li key={s} className="text-[11px] leading-snug text-slate-500">• {s}</li>
                ))}
              </ul>
            </motion.div>
            {i < STAGES.length - 1 && (
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                className="hidden shrink-0 self-center text-brand-navy/30 md:block"
              >
                <ArrowRight size={18} />
              </motion.div>
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
