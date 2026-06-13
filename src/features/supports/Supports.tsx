import { motion } from 'framer-motion'
import { HandHeart, Puzzle, Info, Plus, Check } from '../../components/icons'
import { therapies, type TherapyEvidence } from '../../data/therapies'
import { sensoryItems } from '../../data/sensory'
import { SponsorSlot } from '../../components/SponsorSlot'
import { GlassCard, SectionTitle, CTAButton } from '../../components/ui'
import { useAppStore } from '../../store/useAppStore'
import { isLive } from '../../config/featureFlags'

const EV_ACCENT: Record<TherapyEvidence, string> = {
  strong:     '#15803D',
  moderate:   '#16a34a',
  emerging:   '#2563eb',
  mixed:      '#d97706',
  individual: '#64748b',
}

const EV_LABEL: Record<TherapyEvidence, string> = {
  strong:     'Strong',
  moderate:   'Moderate',
  emerging:   'Emerging',
  mixed:      'Mixed',
  individual: 'Individual',
}

export function Supports() {
  const sponsorsLive = isLive('SPONSORS_LIVE')
  const selectedTherapies = useAppStore((s) => s.selectedTherapies)
  const selectedSensory = useAppStore((s) => s.selectedSensory)
  const toggleTherapy = useAppStore((s) => s.toggleTherapy)
  const toggleSensory = useAppStore((s) => s.toggleSensory)

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        className="grad-border p-[2px]"
      >
        <div className="rounded-[1.4rem] bg-gradient-to-br from-white via-brand-sky to-safe-soft/60 p-5">
          <SectionTitle
            icon={<HandHeart size={20} />}
            title="Supports come first"
            subtitle="Therapies and sensory supports are usually the first line — alongside checking sleep, pain and environment — before or with any medication. Switch them on to see how the model changes."
          />
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
              style={{ background: 'rgba(14,81,150,0.08)', color: '#0e5196', border: '1px solid rgba(14,81,150,0.12)' }}
            >
              <Info size={13} className="shrink-0" />
              Supports, not medicines. Many are NDIS-fundable. They gently lower behaviour scores in the model.
            </div>
            <CTAButton live={sponsorsLive}>Find a provider near you</CTAButton>
          </div>
        </div>
      </motion.div>

      {/* Therapies / allied health */}
      <GlassCard>
        <SectionTitle icon={<HandHeart size={20} />} title="Therapies and allied health" subtitle="Add any to the model to see the effect. Each is a gentle, evidence-informed support." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {therapies.map((t, i) => {
            const accent = EV_ACCENT[t.evidence]
            const on = selectedTherapies.includes(t.id)
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                className="relative overflow-hidden rounded-2xl p-4 pl-5 transition-shadow"
                style={{
                  background: on
                    ? `linear-gradient(135deg, color-mix(in srgb, ${accent} 9%, white), color-mix(in srgb, ${accent} 5%, white))`
                    : `linear-gradient(135deg, ${accent}0A, ${accent}05)`,
                  border: on ? `1.5px solid ${accent}44` : `1px solid ${accent}18`,
                  boxShadow: on
                    ? `0 4px 16px -6px ${accent}55`
                    : '0 2px 8px -4px rgba(6,32,63,0.1)',
                }}
              >
                {/* Left accent bar */}
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl transition-all"
                  style={{ background: on ? accent : `${accent}55` }}
                />

                {/* Evidence badge */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.discipline}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    {EV_LABEL[t.evidence]}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{t.plainEnglish}</p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {t.helpsWith.slice(0, 4).map((h) => (
                    <span
                      key={h}
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: `${accent}10`, color: accent }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-[11px] font-bold text-brand-navy">NDIS: {t.ndisCategory}</p>

                <motion.button
                  onClick={() => toggleTherapy(t.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all"
                  style={on ? {
                    background: accent,
                    color: '#fff',
                    boxShadow: `0 3px 12px -4px ${accent}88`,
                  } : {
                    background: 'rgba(255,255,255,0.9)',
                    color: '#475569',
                    boxShadow: `inset 0 0 0 1px ${accent}28`,
                  }}
                >
                  {on ? <><Check size={15} /> Added to model</> : <><Plus size={15} /> Add to model</>}
                </motion.button>
                <SponsorSlot kind="therapy" sponsor={t.sponsor} />
              </motion.div>
            )
          })}
        </div>
      </GlassCard>

      {/* Sensory items */}
      <GlassCard>
        <SectionTitle icon={<Puzzle size={20} />} title="Common sensory items" subtitle="Add any to the model. Everyday tools many families use — always with a safety note." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sensoryItems.map((s, i) => {
            const on = selectedSensory.includes(s.id)
            const accent = '#15803D'
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 3) * 0.05 + Math.floor(i / 3) * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                className="relative overflow-hidden rounded-2xl p-4 pl-5"
                style={{
                  background: on
                    ? 'linear-gradient(135deg, rgba(21,128,61,0.09), rgba(21,128,61,0.05))'
                    : 'linear-gradient(135deg, #ffffff, #f0fdf4)',
                  border: on ? '1.5px solid rgba(21,128,61,0.3)' : '1px solid rgba(21,128,61,0.12)',
                  boxShadow: on ? '0 4px 16px -6px rgba(21,128,61,0.4)' : '0 2px 8px -4px rgba(6,32,63,0.08)',
                }}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
                  style={{ background: on ? accent : `${accent}55` }}
                />
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-brand-deep">{s.name}</h3>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                    style={{ background: 'rgba(21,128,61,0.1)', color: '#15803D' }}
                  >
                    Safe
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{s.plainEnglish}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.helpsWith.map((h) => (
                    <span
                      key={h}
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: 'rgba(21,128,61,0.1)', color: '#15803D' }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-2 rounded-lg px-2 py-1.5 text-[11px]"
                  style={{ background: 'rgba(180,83,9,0.07)', color: '#B45309', border: '1px solid rgba(180,83,9,0.12)' }}
                >
                  <span className="font-bold">Safety: </span>{s.caution}
                </div>
                <motion.button
                  onClick={() => toggleSensory(s.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all"
                  style={on ? {
                    background: '#15803D',
                    color: '#fff',
                    boxShadow: '0 3px 12px -4px rgba(21,128,61,0.5)',
                  } : {
                    background: 'rgba(255,255,255,0.9)',
                    color: '#475569',
                    boxShadow: 'inset 0 0 0 1px rgba(21,128,61,0.22)',
                  }}
                >
                  {on ? <><Check size={15} /> Added to model</> : <><Plus size={15} /> Add to model</>}
                </motion.button>
                <SponsorSlot kind="sensory" sponsor={s.sponsor} />
              </motion.div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
