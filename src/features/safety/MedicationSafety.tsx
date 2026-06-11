import { motion } from 'framer-motion'
import { ShieldPlus, Stethoscope, ClipboardCheck, HeartPulse } from '../../components/icons'
import {
  sideEffectMatrix,
  monitoringChecklist,
  behaviourFirstChecklist,
  specialists,
} from './sideEffects'
import type { TrafficLight } from '../../lib/safety'
import { GlassCard, SectionTitle } from '../../components/ui'

const URGENCY: Record<TrafficLight, { label: string; cls: string; colour: string }> = {
  green: { label: 'Track only', cls: 'bg-safe-soft text-safe', colour: '#2e9e5b' },
  yellow: { label: 'Book review', cls: 'bg-caution-soft text-caution', colour: '#e0a800' },
  orange: { label: 'Prompt doctor review', cls: 'bg-doctor-soft text-doctor', colour: '#e8730c' },
  red: { label: 'Urgent medical help', cls: 'bg-danger-soft text-danger', colour: '#d23b3b' },
}

export function MedicationSafety() {
  return (
    <div className="space-y-6">
      {/* Current snapshot + why used */}
      <GlassCard>
        <SectionTitle
          icon={<HeartPulse size={20} />}
          title="Medication safety"
          subtitle="Reference only, not a recommendation. Prescription medication is doctor territory."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-doctor/30 bg-doctor-soft/40 p-4 text-sm">
            <p className="font-extrabold text-brand-deep">Example current reference</p>
            <p>Risperidone 3 mg/day (1.5 morning, 1.5 night). Reference only.</p>
            <p className="mt-1 font-bold text-doctor">Prescription medication. Doctor only.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            <p className="font-extrabold text-brand-deep">Why risperidone is used</p>
            <p>
              Sometimes used when autism-related distress becomes unsafe or very hard to manage. It
              may help aggression, self-injury, severe irritability and unsafe behaviour. It does not
              teach skills, and does not fix pain, constipation, sleep, trauma, boredom, sensory
              overload or communication frustration.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Side-effect matrix */}
      <GlassCard>
        <SectionTitle title="Side-effect risk matrix" subtitle="What families might see, what to track, and when to act. Calm and practical." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sideEffectMatrix.map((r, i) => (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 2) * 0.05 + Math.floor(i / 2) * 0.04, duration: 0.4 }}
              className="accent-card p-3 pl-4"
              style={{ ['--accent' as string]: URGENCY[r.urgency].colour }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-extrabold text-brand-deep">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] text-white"
                    style={{ background: URGENCY[r.urgency].colour }}
                  >
                    {r.key}
                  </span>
                  {r.name}
                </p>
                <span className={`pill ${URGENCY[r.urgency].cls}`}>{URGENCY[r.urgency].label}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                <span className="font-bold">You might see: </span>
                {r.familySigns}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                <span className="font-bold">Track: </span>
                {r.track}
              </p>
              <p className="mt-1 text-xs text-info">
                <span className="font-bold">Ask: </span>
                {r.doctorQuestion}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Reduction education */}
      <GlassCard>
        <SectionTitle title="Understanding medication reduction (doctor only)" subtitle="Educational only. This does not give a taper plan, a target dose, or a speed." />
        <div className="rounded-xl border-2 border-danger/30 bg-danger-soft p-4 text-sm text-danger">
          <p className="font-extrabold">Never reduce risperidone without the prescriber.</p>
          <p>
            Behaviour can rebound. Sleep can break. Distress can increase. Unsafe behaviour can return.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-safe/30 bg-safe-soft/40 p-4 text-sm">
            <p className="font-extrabold text-safe">Possible good changes</p>
            <ul className="ml-4 list-disc text-slate-600">
              <li>less sedation</li>
              <li>less appetite/weight pressure</li>
              <li>less prolactin/movement pressure</li>
              <li>more daytime alertness</li>
            </ul>
          </div>
          <div className="rounded-xl border border-doctor/30 bg-doctor-soft/40 p-4 text-sm">
            <p className="font-extrabold text-doctor">Possible hard changes</p>
            <ul className="ml-4 list-disc text-slate-600">
              <li>more irritability / aggression / self-injury</li>
              <li>more looping and sleep disruption</li>
              <li>more PRN use and family stress</li>
              <li>more restrictive-practice risk</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
          This model is deliberately cautious. It is not saying what will happen. It is showing why
          medication changes need a doctor, a plan, and tracking.
        </p>
      </GlassCard>

      {/* Monitoring checklist */}
      <GlassCard>
        <SectionTitle icon={<ClipboardCheck size={20} />} title="Monitoring checklist" subtitle="What can be monitored. Print and take it to the doctor." />
        <div className="flex flex-wrap gap-1.5">
          {monitoringChecklist.map((m) => (
            <span key={m} className="pill bg-slate-50 text-slate-600">
              {m}
            </span>
          ))}
        </div>
        <button onClick={() => window.print()} className="btn-ghost mt-4 text-sm">
          Print monitoring checklist
        </button>
      </GlassCard>

      {/* Behaviour first */}
      <GlassCard>
        <SectionTitle icon={<ShieldPlus size={20} />} title="Before changing medication" subtitle="Could this behaviour be from something else? Check these first." />
        <div className="flex flex-wrap gap-1.5">
          {behaviourFirstChecklist.map((b) => (
            <span key={b} className="pill bg-info-soft text-info">
              {b}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Medication review works best when the team also checks the reason behind the behaviour.
        </p>
      </GlassCard>

      {/* Specialist pathway */}
      <GlassCard>
        <SectionTitle icon={<Stethoscope size={20} />} title="Who to ask" subtitle="The right person for the right question." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {specialists.map((s, i) => (
            <motion.div
              key={s.role}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: (i % 2) * 0.04, duration: 0.35 }}
              className="accent-card p-3 pl-4"
              style={{ ['--accent' as string]: '#0e5196' }}
            >
              <p className="flex items-center gap-2 text-sm font-extrabold text-brand-deep">
                <Stethoscope size={15} className="text-brand-navy" />
                {s.role}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{s.best}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
