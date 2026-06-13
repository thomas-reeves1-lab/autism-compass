import { motion } from 'framer-motion'
import { ShieldPlus, Stethoscope, ClipboardCheck, HeartPulse, CheckCircle2, AlertTriangle, Info } from '../../components/icons'
import {
  sideEffectMatrix,
  monitoringChecklist,
  behaviourFirstChecklist,
  specialists,
} from './sideEffects'
import type { TrafficLight } from '../../lib/safety'
import { GlassCard, SectionTitle } from '../../components/ui'

const URGENCY: Record<TrafficLight, { label: string; hex: string; bg: string; textCls: string; grad: string }> = {
  green:  { label: 'Track only',          hex: '#15803D', bg: 'rgba(21,128,61,0.07)',  textCls: 'text-safe',    grad: 'linear-gradient(135deg, #1CA356, #15803D)' },
  yellow: { label: 'Book review',         hex: '#B45309', bg: 'rgba(180,83,9,0.07)',   textCls: 'text-caution', grad: 'linear-gradient(135deg, #D08214, #B45309)' },
  orange: { label: 'Prompt doctor',       hex: '#C2410C', bg: 'rgba(194,65,12,0.07)',  textCls: 'text-doctor',  grad: 'linear-gradient(135deg, #E0631F, #C2410C)' },
  red:    { label: 'Urgent medical help', hex: '#B91C1C', bg: 'rgba(185,28,28,0.08)',  textCls: 'text-danger',  grad: 'linear-gradient(135deg, #D03030, #B91C1C)' },
}

const SPECIALIST_ACCENT = ['#0E5196', '#1D4ED8', '#7C3AED', '#15803D', '#B45309', '#C2410C']

export function MedicationSafety() {
  return (
    <div className="space-y-6">
      {/* Current snapshot */}
      <GlassCard>
        <SectionTitle
          icon={<HeartPulse size={20} />}
          title="Medication safety"
          subtitle="Reference only, not a recommendation. Prescription medication is doctor territory."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative overflow-hidden rounded-xl p-4 text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(194,65,12,0.06), rgba(194,65,12,0.02))',
              border: '1px solid rgba(194,65,12,0.18)',
            }}
          >
            <span
              className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl"
              style={{ background: '#C2410C' }}
            />
            <p className="mb-1 pl-1 font-extrabold text-brand-deep">Example current reference</p>
            <p className="pl-1 text-slate-700">Risperidone 3 mg/day (1.5 morning, 1.5 night). Reference only.</p>
            <p className="mt-1 pl-1 text-xs font-bold text-doctor">Prescription medication. Doctor only.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 26 }}
            className="relative overflow-hidden rounded-xl p-4 text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(14,81,150,0.05), rgba(14,81,150,0.02))',
              border: '1px solid rgba(14,81,150,0.12)',
            }}
          >
            <span
              className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl"
              style={{ background: '#0E5196' }}
            />
            <p className="mb-1 pl-1 font-extrabold text-brand-deep">Why risperidone is used</p>
            <p className="pl-1 text-slate-600">
              Sometimes used when autism-related distress becomes unsafe or very hard to manage. It
              may help aggression, self-injury, severe irritability and unsafe behaviour. It does not
              teach skills, and does not fix pain, constipation, sleep, trauma, boredom, sensory
              overload or communication frustration.
            </p>
          </motion.div>
        </div>
      </GlassCard>

      {/* Side-effect matrix */}
      <GlassCard>
        <SectionTitle title="Side-effect risk matrix" subtitle="What families might see, what to track, and when to act. Calm and practical." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sideEffectMatrix.map((r, i) => {
            const u = URGENCY[r.urgency]
            return (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 2) * 0.05 + Math.floor(i / 2) * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
                className="relative overflow-hidden rounded-xl p-3 pl-5"
                style={{
                  background: `linear-gradient(135deg, white, color-mix(in srgb, ${u.hex} 5%, white))`,
                  border: `1px solid ${u.hex}22`,
                  boxShadow: `0 2px 8px -4px ${u.hex}33`,
                }}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl"
                  style={{ background: u.hex }}
                />
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-extrabold text-brand-deep">
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-[11px] font-black text-white"
                      style={{ background: u.grad }}
                    >
                      {r.key}
                    </span>
                    {r.name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${u.textCls}`}
                    style={{ background: u.bg }}
                  >
                    {u.label}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">You might see: </span>
                  {r.familySigns}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-bold">Track: </span>
                  {r.track}
                </p>
                <p className="mt-1 text-xs" style={{ color: '#0E5196' }}>
                  <span className="font-bold">Ask: </span>
                  {r.doctorQuestion}
                </p>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>

      {/* Reduction education */}
      <GlassCard>
        <SectionTitle title="Understanding medication reduction (doctor only)" subtitle="Educational only. This does not give a taper plan, a target dose, or a speed." />
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="flex items-start gap-3 rounded-xl p-4 text-sm"
          style={{ background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.2)' }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" />
          <div>
            <p className="font-extrabold text-danger">Never reduce risperidone without the prescriber.</p>
            <p className="text-slate-600">
              Behaviour can rebound. Sleep can break. Distress can increase. Unsafe behaviour can return.
            </p>
          </div>
        </motion.div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative overflow-hidden rounded-xl p-4 text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(21,128,61,0.07), rgba(21,128,61,0.03))',
              border: '1px solid rgba(21,128,61,0.18)',
            }}
          >
            <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: '#15803D' }} />
            <p className="mb-2 pl-1 font-extrabold text-safe">Possible good changes</p>
            <ul className="space-y-1.5 pl-1">
              {['Less sedation', 'Less appetite and weight pressure', 'Less prolactin and movement pressure', 'More daytime alertness'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 size={13} className="shrink-0 text-safe" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: 0.07, type: 'spring', stiffness: 260, damping: 24 }}
            className="relative overflow-hidden rounded-xl p-4 text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(194,65,12,0.07), rgba(194,65,12,0.03))',
              border: '1px solid rgba(194,65,12,0.18)',
            }}
          >
            <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: '#C2410C' }} />
            <p className="mb-2 pl-1 font-extrabold text-doctor">Possible hard changes</p>
            <ul className="space-y-1.5 pl-1">
              {['More irritability, aggression, self-injury', 'More looping and sleep disruption', 'More PRN use and family stress', 'More restrictive-practice risk'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                  <AlertTriangle size={13} className="shrink-0 text-doctor" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="mt-4 flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs"
          style={{ background: 'rgba(14,81,150,0.06)', border: '1px solid rgba(14,81,150,0.12)' }}
        >
          <Info size={14} className="mt-0.5 shrink-0 text-brand-navy" />
          <p className="text-brand-navy">
            This model is deliberately cautious. It is not saying what will happen. It is showing why
            medication changes need a doctor, a plan, and tracking.
          </p>
        </motion.div>
      </GlassCard>

      {/* Monitoring checklist */}
      <GlassCard>
        <SectionTitle icon={<ClipboardCheck size={20} />} title="Monitoring checklist" subtitle="What can be monitored. Print and take it to the doctor." />
        <div className="flex flex-wrap gap-2">
          {monitoringChecklist.map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 12) * 0.03, type: 'spring', stiffness: 280, damping: 22 }}
              whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 320, damping: 20 } }}
              className="inline-flex cursor-default items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-deep"
              style={{ background: 'rgba(14,81,150,0.07)', border: '1px solid rgba(14,81,150,0.12)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy opacity-60" />
              {m}
            </motion.span>
          ))}
        </div>
        <motion.button
          onClick={() => window.print()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="btn-ghost mt-4 text-sm"
        >
          Print monitoring checklist
        </motion.button>
      </GlassCard>

      {/* Behaviour first */}
      <GlassCard>
        <SectionTitle icon={<ShieldPlus size={20} />} title="Before changing medication" subtitle="Could this behaviour be from something else? Check these first." />
        <div className="flex flex-wrap gap-2">
          {behaviourFirstChecklist.map((b, i) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 12) * 0.03, type: 'spring', stiffness: 280, damping: 22 }}
              whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 320, damping: 20 } }}
              className="inline-flex cursor-default items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{ background: 'rgba(44,123,229,0.08)', color: '#0E5196', border: '1px solid rgba(44,123,229,0.15)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#2c7be5', opacity: 0.6 }} />
              {b}
            </motion.span>
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
          {specialists.map((s, i) => {
            const accent = SPECIALIST_ACCENT[i % SPECIALIST_ACCENT.length]
            return (
              <motion.div
                key={s.role}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 2) * 0.04 + Math.floor(i / 2) * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
                className="relative overflow-hidden rounded-xl p-3 pl-5"
                style={{
                  background: `linear-gradient(135deg, white, color-mix(in srgb, ${accent} 5%, white))`,
                  border: `1px solid ${accent}22`,
                }}
              >
                <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-xl" style={{ background: accent }} />
                <p className="flex items-center gap-2 text-sm font-extrabold text-brand-deep">
                  <Stethoscope size={14} style={{ color: accent }} />
                  {s.role}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">{s.best}</p>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
