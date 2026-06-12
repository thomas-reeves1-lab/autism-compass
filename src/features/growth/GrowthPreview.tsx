import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Gift, Mail, Check, Sparkles } from '../../components/icons'
import { ethics } from './ethics'
import { sampleOffer, totalStackValue, quizQuestions } from './offers/offer'
import { formatAud } from '../store/catalogue'
import { isLive } from '../../config/featureFlags'
import { GlassCard, SectionTitle, Disclaimer } from '../../components/ui'

const TIERS = [
  { name: 'Free', price: 0, accent: '#15803D', features: ['Full evidence calculator', 'Safe Stack Checker', 'Basic family tracker', 'All safety tools'], cta: 'Always free' },
  { name: 'Premium', price: 9, accent: '#0E5196', features: ['Everything in Free', 'PDF exports', 'History beyond 30 days', 'Monthly evidence digest'], cta: 'Coming soon' },
  { name: 'Practitioner', price: 49, accent: '#7C3AED', features: ['Everything in Premium', 'White-label reports', 'Bulk export', 'Clinical-note format', 'Referral cards'], cta: 'Coming soon' },
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
        <div
          className="flex items-start gap-2.5 rounded-xl p-3 text-xs"
          style={{
            background: 'rgba(100,116,139,0.07)',
            border: '1px solid rgba(100,116,139,0.18)',
          }}
        >
          <Sparkles size={14} className="mt-0.5 shrink-0 text-theoretical" />
          <p className="text-theoretical">
            <span className="font-bold">Preview mode.</span> The growth engine is built but not live.
            Ethics rail: dark patterns OFF, honest persuasion ON. Safety content can never be gated.
          </p>
        </div>
      )}

      {/* Subscription tiers */}
      <GlassCard>
        <SectionTitle icon={<Rocket size={18} />} title="Plans" subtitle="The core tool is free forever. Paid tiers only add convenience and white-label features." />
        <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-3">
          {TIERS.map((t, i) => {
            const popular = t.name === 'Premium'
            const acc = t.accent
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 220, damping: 22 }}
                className={`relative overflow-hidden rounded-2xl p-4 ${popular ? 'md:-mt-2 md:scale-[1.03]' : ''}`}
                style={{
                  background: `linear-gradient(135deg, white, color-mix(in srgb, ${acc} 5%, white))`,
                  border: popular ? `1.5px solid ${acc}55` : `1px solid ${acc}22`,
                  boxShadow: popular ? `0 8px 28px -10px ${acc}40` : '0 2px 10px -6px rgba(6,32,63,0.12)',
                }}
              >
                {/* Left accent bar */}
                <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl" style={{ background: acc }} />
                {popular && (
                  <span
                    className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg px-3 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
                    style={{ background: `linear-gradient(110deg, ${acc}, color-mix(in srgb, ${acc} 70%, #1d4ed8))` }}
                  >
                    Most popular
                  </span>
                )}
                <h3 className="mt-1 font-extrabold" style={{ color: acc }}>{t.name}</h3>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-brand-deep">{t.price === 0 ? 'Free' : `$${t.price}`}</span>
                  {t.price > 0 && <span className="text-xs font-bold text-slate-400">/mo</span>}
                </p>
                {t.price > 0 && (
                  <p className="text-[11px] font-semibold text-slate-400">about ${(t.price / 30).toFixed(2)} a day</p>
                )}
                <ul className="mt-3 space-y-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: acc }} /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={!live}
                  className="mt-4 w-full rounded-xl py-2 text-sm font-bold text-white transition"
                  style={{ background: `linear-gradient(110deg, ${acc}, color-mix(in srgb, ${acc} 70%, #1d4ed8))` }}
                >
                  {t.cta}
                </button>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>

      {/* Grand-slam offer (value stack) */}
      <GlassCard>
        <SectionTitle icon={<Sparkles size={20} />} title="Offer builder" subtitle="Honest value stacking. Every line is a real deliverable — no inflated promises." />
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, white, color-mix(in srgb, #0E5196 4%, white))',
            border: '1px solid rgba(14,81,150,0.14)',
            boxShadow: '0 4px 18px -8px rgba(14,81,150,0.18)',
          }}
        >
          <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl" style={{ background: '#0E5196' }} />
          <h3 className="text-lg font-extrabold text-brand-deep">{sampleOffer.headline}</h3>
          <p className="mt-1 text-sm text-slate-600">{sampleOffer.promise}</p>
          <ul className="mt-3 space-y-2">
            {sampleOffer.items.map((it) => (
              <li key={it.name} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">
                  {it.name}
                  <span className="ml-1 text-xs text-slate-400">— {it.realDeliverable}</span>
                </span>
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 text-xs font-bold text-slate-400 line-through"
                  style={{ background: 'rgba(100,116,139,0.08)' }}
                >
                  {formatAud(it.value * 100)}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="mt-4 flex items-center justify-between rounded-xl px-3 py-2"
            style={{ background: 'rgba(14,81,150,0.06)', border: '1px solid rgba(14,81,150,0.1)' }}
          >
            <span className="text-sm text-slate-500">Total value {formatAud(totalStackValue(sampleOffer) * 100)}</span>
            <span className="text-xl font-extrabold text-brand-navy">{formatAud(sampleOffer.price * 100)}/mo</span>
          </div>
          {ethics.realGuarantees && (
            <div
              className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-xs"
              style={{ background: 'rgba(21,128,61,0.07)', border: '1px solid rgba(21,128,61,0.12)', color: '#166534' }}
            >
              <Check size={13} className="mt-0.5 shrink-0 text-safe" />
              <p><span className="font-bold">Guarantee: </span>{sampleOffer.guarantee}</p>
            </div>
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
          className="field flex-1"
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
