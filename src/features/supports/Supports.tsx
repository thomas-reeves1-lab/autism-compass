import { HandHeart, Puzzle, Info } from 'lucide-react'
import { therapies, type TherapyEvidence } from '../../data/therapies'
import { sensoryItems } from '../../data/sensory'
import { SponsorSlot } from '../../components/SponsorSlot'
import { GlassCard, SectionTitle, Pill } from '../../components/ui'

const EV_META: Record<TherapyEvidence, { label: string; tone: 'safe' | 'info' | 'caution' | 'theoretical' }> = {
  strong: { label: 'Strong', tone: 'safe' },
  moderate: { label: 'Moderate', tone: 'safe' },
  emerging: { label: 'Emerging', tone: 'info' },
  mixed: { label: 'Mixed', tone: 'caution' },
  individual: { label: 'Individual', tone: 'theoretical' },
}

export function Supports() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionTitle
          icon={<HandHeart size={20} />}
          title="Supports come first"
          subtitle="Therapies, allied health and sensory supports are usually the first line — alongside checking sleep, pain and environment — before or with any medication."
        />
        <p className="rounded-lg bg-info-soft px-3 py-2 text-xs text-info">
          <Info size={13} className="mb-0.5 mr-1 inline" />
          These are supports, not medicines. Many are NDIS-fundable. Speak to your planner, GP or
          treating team about what fits.
        </p>
      </GlassCard>

      {/* Therapies / allied health */}
      <GlassCard>
        <SectionTitle icon={<HandHeart size={20} />} title="Therapies & allied health" subtitle="Common supports and what they help with." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {therapies.map((t) => {
            const ev = EV_META[t.evidence]
            return (
              <div key={t.id} className="card lift p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.discipline}</p>
                  </div>
                  <Pill tone={ev.tone}>{ev.label}</Pill>
                </div>
                <p className="mt-2 text-xs text-slate-600">{t.plainEnglish}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.helpsWith.slice(0, 4).map((h) => (
                    <span key={h} className="pill bg-slate-50 text-slate-500">{h}</span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-400">{t.evidenceNote}</p>
                <p className="mt-1 text-[11px] font-bold text-brand-navy">NDIS: {t.ndisCategory}</p>
                <SponsorSlot kind="therapy" sponsor={t.sponsor} />
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Sensory items */}
      <GlassCard>
        <SectionTitle icon={<Puzzle size={20} />} title="Common sensory items" subtitle="Everyday tools many families use. Always with a safety note." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sensoryItems.map((s) => (
            <div key={s.id} className="card lift p-4">
              <h3 className="font-extrabold text-brand-deep">{s.name}</h3>
              <p className="mt-1 text-xs text-slate-600">{s.plainEnglish}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.helpsWith.map((h) => (
                  <span key={h} className="pill bg-safe-soft text-safe">{h}</span>
                ))}
              </div>
              <p className="mt-2 rounded-lg bg-caution-soft px-2 py-1.5 text-[11px] text-caution">
                <span className="font-bold">Safety: </span>{s.caution}
              </p>
              <SponsorSlot kind="sensory" sponsor={s.sponsor} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
