import { useState } from 'react'
import { motion } from 'framer-motion'
import { Workflow, ArrowRight, Info } from '../../components/icons'
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
              <motion.button
                key={t}
                onClick={() => setTrigger(on ? '' : t)}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="rounded-lg px-2.5 py-1.5 text-xs font-bold"
                style={on ? {
                  background: 'linear-gradient(135deg, #0E5196, #1d4ed8)',
                  color: 'white',
                  boxShadow: '0 2px 10px -4px rgba(14,81,150,0.55)',
                } : {
                  background: 'white',
                  color: '#475569',
                  boxShadow: '0 0 0 1px rgba(7,26,54,0.14)',
                }}
              >
                {t}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-1 items-stretch gap-1.5">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.09, type: 'spring', stiffness: 240, damping: 22 }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
              className="relative flex-1 overflow-hidden rounded-2xl p-3.5"
              style={{
                background: `linear-gradient(160deg, white 0%, color-mix(in srgb, ${STAGE_COLOUR[stage]} 6%, white) 100%)`,
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 20px -12px ${STAGE_COLOUR[stage]}66`,
              }}
            >
              {/* Left accent bar with stage colour */}
              <div
                className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
                style={{ background: STAGE_COLOUR[stage] }}
              />
              <div className="ml-2 flex items-center gap-2.5">
                {/* Number badge */}
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white shadow-md"
                  style={{ background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${STAGE_COLOUR[stage]} 85%, white), ${STAGE_COLOUR[stage]})` }}
                >
                  {i + 1}
                </span>
                <p className="text-sm font-extrabold" style={{ color: STAGE_COLOUR[stage] }}>{stage}</p>
              </div>
              {i === 0 && trigger && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-2 mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-bold"
                  style={{ background: `${STAGE_COLOUR[stage]}18`, color: STAGE_COLOUR[stage] }}
                >
                  e.g. {trigger}
                </motion.p>
              )}
              <ul className="ml-2 mt-2.5 space-y-1.5">
                {SUPPORTS[stage].map((s) => (
                  <li key={s} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-600">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STAGE_COLOUR[stage], opacity: 0.6 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Arrow connector */}
            {i < STAGES.length - 1 && (
              <motion.div
                animate={{ x: [0, 4, 0], opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                className="hidden shrink-0 self-center md:block"
              >
                <ArrowRight size={16} className="text-slate-400" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
        style={{ background: 'linear-gradient(90deg, rgba(14,81,150,0.07), rgba(14,81,150,0.03))', border: '1px solid rgba(14,81,150,0.12)' }}
      >
        <Info size={14} className="mt-0.5 shrink-0 text-brand-navy" />
        <p className="text-xs font-semibold text-brand-navy">
          <span className="font-extrabold">Remember:</span> checking sleep, pain, bowels, sensory needs,
          demands, and communication usually comes before a medication review.
        </p>
      </div>
    </GlassCard>
  )
}
