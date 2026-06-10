import { useState } from 'react'
import { Rocket, Gift, Mail, Check, Sparkles } from 'lucide-react'
import { ethics } from './ethics'
import { sampleOffer, totalStackValue, quizQuestions } from './offers/offer'
import { formatAud } from '../store/catalogue'
import { isLive } from '../../config/featureFlags'
import { GlassCard, SectionTitle, Pill, Disclaimer } from '../../components/ui'

const TIERS = [
  { name: 'Free', price: 0, features: ['Full evidence calculator', 'Safe Stack Checker', 'Basic family tracker', 'All safety tools'], cta: 'Always free' },
  { name: 'Premium', price: 9, features: ['Everything in Free', 'PDF exports', 'History beyond 30 days', 'Monthly evidence digest'], cta: 'Coming soon' },
  { name: 'Practitioner', price: 49, features: ['Everything in Premium', 'White-label reports', 'Bulk export', 'Clinical-note format', 'Referral cards'], cta: 'Coming soon' },
]

/**
 * Growth module (DORMANT). Renders in dev preview only. Ethics rail enforced:
 * honest defaults, no dark patterns, safety content never gated.
 */
export function GrowthPreview() {
  const live = isLive('GROWTH_LIVE')

  return (
    <div className="space-y-6">
      {!live && (
        <div className="rounded-xl border border-theoretical/30 bg-theoretical-soft p-3 text-xs text-theoretical">
          <span className="font-bold">Preview mode.</span> The growth engine is built but not live.
          Ethics rail: dark patterns OFF, honest persuasion ON. Safety content can never be gated.
        </div>
      )}

      {/* Subscription tiers */}
      <GlassCard>
        <SectionTitle icon={<Rocket size={20} />} title="Plans" subtitle="The core tool is free forever. Paid tiers only add convenience and white-label features." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-4 ${t.name === 'Premium' ? 'border-brand-navy bg-brand-sky/40' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-brand-deep">{t.name}</h3>
                {t.name === 'Premium' && <Pill tone="info">popular</Pill>}
              </div>
              <p className="mt-1 text-2xl font-extrabold text-brand-navy">
                {t.price === 0 ? 'Free' : `$${t.price}`}
                {t.price > 0 && <span className="text-sm font-normal text-slate-400">/mo</span>}
              </p>
              <ul className="mt-3 space-y-1.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check size={14} className="mt-0.5 shrink-0 text-safe" /> {f}
                  </li>
                ))}
              </ul>
              <button disabled={!live} className={`mt-4 w-full text-sm ${t.price === 0 ? 'btn-ghost' : 'btn-primary'}`}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Grand-slam offer (value stack) */}
      <GlassCard>
        <SectionTitle icon={<Sparkles size={20} />} title="Offer builder" subtitle="Honest value stacking. Every line is a real deliverable — no inflated promises." />
        <div className="rounded-2xl border border-brand-navy/20 bg-white p-5">
          <h3 className="text-lg font-extrabold text-brand-deep">{sampleOffer.headline}</h3>
          <p className="text-sm text-slate-600">{sampleOffer.promise}</p>
          <ul className="mt-3 space-y-1.5">
            {sampleOffer.items.map((it) => (
              <li key={it.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{it.name} <span className="text-xs text-slate-400">— {it.realDeliverable}</span></span>
                <span className="text-slate-400 line-through">{formatAud(it.value * 100)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm text-slate-500">Total value {formatAud(totalStackValue(sampleOffer) * 100)}</span>
            <span className="text-xl font-extrabold text-brand-navy">{formatAud(sampleOffer.price * 100)}/mo</span>
          </div>
          {ethics.realGuarantees && (
            <p className="mt-3 rounded-lg bg-safe-soft px-3 py-2 text-xs text-safe">
              <span className="font-bold">Guarantee: </span>
              {sampleOffer.guarantee}
            </p>
          )}
        </div>
      </GlassCard>

      {/* Lead magnet quiz + email capture */}
      <GlassCard>
        <SectionTitle icon={<Gift size={20} />} title="Free guide (lead magnet)" subtitle="Give value first. A short, educational quiz, then an optional email guide. Consent is never assumed." />
        <LeadMagnet />
      </GlassCard>

      <Disclaimer />
    </div>
  )
}

function LeadMagnet() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)
  const live = isLive('GROWTH_LIVE')

  if (done) {
    return <p className="rounded-lg bg-safe-soft px-3 py-2 text-sm text-safe">Thank you. Your guide is on its way (preview — not live).</p>
  }

  if (step < quizQuestions.length) {
    const q = quizQuestions[step]
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <p className="text-xs font-bold text-slate-400">Question {step + 1} of {quizQuestions.length}</p>
        <p className="mt-1 text-sm font-bold text-brand-deep">{q.q}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setStep((s) => s + 1)} className="btn-ghost text-sm">Yes</button>
          <button onClick={() => setStep((s) => s + 1)} className="btn-ghost text-sm">No</button>
          <button onClick={() => setStep((s) => s + 1)} className="btn-ghost text-sm">Not sure</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-sm font-bold text-brand-deep">Get your free plain-English guide</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-slate-200 p-2 text-sm"
        />
        <button
          disabled={!email.includes('@') || !consent || !live}
          onClick={() => setDone(true)}
          className="btn-primary text-sm"
        >
          <Mail size={16} /> {live ? 'Send my guide' : 'Coming soon'}
        </button>
      </div>
      <label className="mt-2 flex items-start gap-2 text-xs text-slate-500">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-brand-navy" />
        Yes, email me the guide and occasional updates. (Never pre-ticked. You can opt out anytime.)
      </label>
    </div>
  )
}
