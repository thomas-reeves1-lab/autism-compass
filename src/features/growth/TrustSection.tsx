import { Check, ShieldCheck } from '../../components/icons'
import { GlassCard } from '../../components/ui'

const IS = [
  'An education and conversation aid',
  'A visual summary of peer-reviewed studies',
  'Honest about evidence strength and uncertainty',
  'Built by a registered provider and an RN',
]
const ISNT = [
  'Not medical advice or a diagnosis',
  'Not a prescribing or dosing tool',
  'Not a prediction for any one person',
  'Not a replacement for the treating doctor',
]

/** Credibility block. Honest framing is what earns trust with this audience. */
export function TrustSection() {
  return (
    <GlassCard>
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck size={20} className="text-brand-navy" />
        <h2 className="text-base font-black text-brand-deep">What this is, and what it is not</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="accent-card p-4 pl-5" style={{ ['--accent' as string]: '#15803D' }}>
          <p className="mb-2 text-sm font-extrabold text-safe">What it is</p>
          <ul className="space-y-1.5">
            {IS.map((t) => (
              <li key={t} className="flex items-start gap-1.5 text-xs text-slate-600">
                <Check size={14} className="mt-0.5 shrink-0 text-safe" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="accent-card p-4 pl-5" style={{ ['--accent' as string]: '#C2410C' }}>
          <p className="mb-2 text-sm font-extrabold text-doctor">What it is not</p>
          <ul className="space-y-1.5">
            {ISNT.map((t) => (
              <li key={t} className="flex items-start gap-1.5 text-xs text-slate-600">
                <span className="mt-0.5 shrink-0 font-black text-doctor">×</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  )
}
