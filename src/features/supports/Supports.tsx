import { HandHeart, Puzzle, Info, Plus, Check } from 'lucide-react'
import { therapies, type TherapyEvidence } from '../../data/therapies'
import { sensoryItems } from '../../data/sensory'
import { SponsorSlot } from '../../components/SponsorSlot'
import { GlassCard, SectionTitle, Pill, SafetyScoreChip, CTAButton } from '../../components/ui'
import { useAppStore } from '../../store/useAppStore'
import { isLive } from '../../config/featureFlags'

const EV_META: Record<TherapyEvidence, { label: string; tone: 'safe' | 'info' | 'caution' | 'theoretical' }> = {
  strong: { label: 'Strong', tone: 'safe' },
  moderate: { label: 'Moderate', tone: 'safe' },
  emerging: { label: 'Emerging', tone: 'info' },
  mixed: { label: 'Mixed', tone: 'caution' },
  individual: { label: 'Individual', tone: 'theoretical' },
}

export function Supports() {
  const sponsorsLive = isLive('SPONSORS_LIVE')
  const selectedTherapies = useAppStore((s) => s.selectedTherapies)
  const selectedSensory = useAppStore((s) => s.selectedSensory)
  const toggleTherapy = useAppStore((s) => s.toggleTherapy)
  const toggleSensory = useAppStore((s) => s.toggleSensory)

  return (
    <div className="space-y-6">
      <div className="grad-border p-[2px]">
        <div className="rounded-[1.4rem] bg-gradient-to-br from-white via-brand-sky to-safe-soft/60 p-5">
          <SectionTitle
            icon={<HandHeart size={20} />}
            title="Supports come first"
            subtitle="Therapies and sensory supports are usually the first line — alongside checking sleep, pain and environment — before or with any medication. Switch them on to see how the model changes."
          />
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
              <Info size={13} className="mb-0.5 mr-1 inline" />
              Supports, not medicines. Many are NDIS-fundable. They gently lower behaviour scores in the model.
            </p>
            <CTAButton live={sponsorsLive}>Find a provider near you</CTAButton>
          </div>
        </div>
      </div>

      {/* Therapies / allied health */}
      <GlassCard>
        <SectionTitle icon={<HandHeart size={20} />} title="Therapies & allied health" subtitle="Add any to the model to see the effect. Each is a gentle, evidence-informed support." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {therapies.map((t) => {
            const ev = EV_META[t.evidence]
            const on = selectedTherapies.includes(t.id)
            return (
              <div key={t.id} className={`bento p-4 ${on ? 'ring-2 ring-brand-leaf' : ''}`}>
                {on && <div className="accent-bar" />}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.discipline}</p>
                  </div>
                  <Pill tone={ev.tone}>{ev.label}</Pill>
                </div>
                <div className="mt-2"><SafetyScoreChip score={92} /></div>
                <p className="mt-2 text-xs text-slate-600">{t.plainEnglish}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.helpsWith.slice(0, 4).map((h) => (
                    <span key={h} className="pill bg-white/70 text-slate-500">{h}</span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-bold text-brand-navy">NDIS: {t.ndisCategory}</p>
                <button
                  onClick={() => toggleTherapy(t.id)}
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    on ? 'bg-brand-leaf text-white' : 'btn-ghost'
                  }`}
                >
                  {on ? <><Check size={15} /> Added to model</> : <><Plus size={15} /> Add to model</>}
                </button>
                <SponsorSlot kind="therapy" sponsor={t.sponsor} />
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Sensory items */}
      <GlassCard>
        <SectionTitle icon={<Puzzle size={20} />} title="Common sensory items" subtitle="Add any to the model. Everyday tools many families use — always with a safety note." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sensoryItems.map((s) => {
            const on = selectedSensory.includes(s.id)
            return (
              <div key={s.id} className={`bento-leaf bento p-4 ${on ? 'ring-2 ring-brand-leaf' : ''}`}>
                {on && <div className="accent-bar" />}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-brand-deep">{s.name}</h3>
                  <SafetyScoreChip score={84} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{s.plainEnglish}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.helpsWith.map((h) => (
                    <span key={h} className="pill bg-white/70 text-safe">{h}</span>
                  ))}
                </div>
                <p className="mt-2 rounded-lg bg-caution-soft px-2 py-1.5 text-[11px] text-caution">
                  <span className="font-bold">Safety: </span>{s.caution}
                </p>
                <button
                  onClick={() => toggleSensory(s.id)}
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    on ? 'bg-brand-leaf text-white' : 'btn-ghost'
                  }`}
                >
                  {on ? <><Check size={15} /> Added to model</> : <><Plus size={15} /> Add to model</>}
                </button>
                <SponsorSlot kind="sensory" sponsor={s.sponsor} />
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
