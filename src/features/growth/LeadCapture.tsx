import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check, BookOpen, ShieldCheck } from '../../components/icons'
import { track } from '../../lib/consent'

/**
 * Free-guide email capture. The Grand Slam Offer hook.
 * Privacy Act compliant: explicit consent (never pre-ticked), a clear "why we
 * ask" line, and an unsubscribe note. TGA-safe: it offers a guide, not a cure.
 */
export function LeadCapture({ source = 'site', onOpenGuide }: { source?: string; onOpenGuide?: () => void }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const valid = /\S+@\S+\.\S+/.test(email) && consent

  const submit = async () => {
    if (!valid || busy) return
    setBusy(true)
    track('lead_submit', { source })
    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source, magnet: 'autism-guide', consent: true }),
        })
      }
    } catch {
      /* still show success; we never block the family on a network hiccup */
    }
    setBusy(false)
    setDone(true)
  }

  return (
    <div className="grad-border p-[2px]">
      <div className="rounded-[1.4rem] bg-gradient-to-br from-white via-brand-sky to-safe-soft/50 p-5">
        {done ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-safe text-white">
              <Check size={26} />
            </div>
            <h3 className="text-lg font-black text-brand-deep">You are in. Check your inbox.</h3>
            <p className="mt-1 text-sm text-slate-600">Your guide is on its way. You can read it now too.</p>
            {onOpenGuide && (
              <button onClick={onOpenGuide} className="btn-primary mt-3 text-sm">
                <BookOpen size={16} /> Read the guide now
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-leaf/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-deep">
                Free
              </span>
              <h3 className="text-lg font-black text-brand-deep">The Calmer Days Autism Guide</h3>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Plain-English. What the studies actually found. How to prepare for the doctor. Plus the
              Doctor Visit Pack and the Safe Stack checklist. It teaches. It is not medical advice.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field flex-1"
                aria-label="Your email"
              />
              <button onClick={submit} disabled={!valid || busy} className="btn-primary text-sm">
                <Mail size={16} /> {busy ? 'Sending…' : 'Send my guide'}
              </button>
            </div>

            <label className="mt-2 flex items-start gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-brand-navy"
              />
              Yes, email me the guide and occasional helpful updates. I can unsubscribe anytime.
            </label>
            <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={12} /> Why we ask: we use your email only to send the guide and
              updates you opted into. We never sell it. See our Privacy Policy.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
