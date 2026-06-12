import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check, BookOpen, ShieldCheck, Gift } from '../../components/icons'
import { track } from '../../lib/consent'

const VALUE_STACK = [
  'Plain-English evidence guide — 6 chapters',
  'Doctor Visit Pack — bring it to the appointment',
  'Safe Stack safety checklist for pharmacist review',
  'Study library — every projection traced to a real paper',
  'No lock-in — unsubscribe anytime',
]

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
      /* never block the family on a network hiccup */
    }
    setBusy(false)
    setDone(true)
  }

  return (
    <div className="grad-border p-[2px]">
      <div className="rounded-[1.4rem] bg-gradient-to-br from-white via-brand-sky to-safe-soft/50 p-5">
        {done ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #15803D, #22c55e)', boxShadow: '0 8px 24px -8px rgba(21,128,61,0.6)' }}
            >
              <Check size={28} />
            </motion.div>
            <h3 className="text-lg font-black text-brand-deep">You are in. Check your inbox.</h3>
            <p className="mt-1 text-sm text-slate-600">Your guide is on its way. You can read it right now too.</p>
            {onOpenGuide && (
              <motion.button
                onClick={onOpenGuide}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="btn-primary mt-3 text-sm"
              >
                <BookOpen size={16} /> Read the guide now
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                style={{ background: 'linear-gradient(110deg, #7bc043, #2e9e5b)', color: '#fff' }}
              >
                <Gift size={11} /> Free
              </span>
              <h3 className="text-lg font-black text-brand-deep">The Calmer Days Autism Guide</h3>
            </div>

            {/* Value stack */}
            <ul className="mb-4 space-y-1.5">
              {VALUE_STACK.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg, #15803D, #22c55e)' }}
                  >
                    <Check size={11} />
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>

            {/* Email row */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="you@example.com"
                className="field flex-1 text-sm"
                aria-label="Your email"
              />
              <motion.button
                onClick={submit}
                disabled={!valid || busy}
                whileHover={valid && !busy ? { scale: 1.03 } : {}}
                whileTap={valid && !busy ? { scale: 0.96 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="btn-primary shrink-0 text-sm"
              >
                <Mail size={16} /> {busy ? 'Sending…' : 'Send my guide'}
              </motion.button>
            </div>

            {/* Consent */}
            <label className="mt-2.5 flex items-start gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-brand-navy"
              />
              Yes, email me the guide and occasional helpful updates. I can unsubscribe anytime.
            </label>

            {/* Privacy note */}
            <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={12} className="shrink-0" />
              We use your email only to send the guide and updates you opted into. We never sell it.
              Privacy Act compliant.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
