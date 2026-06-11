import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getConsent, setConsent, type Consent } from '../lib/consent'

/** Slim consent banner. Analytics stay off until the person chooses. */
export function ConsentBanner() {
  const [choice, setChoice] = useState<Consent>(getConsent())
  if (choice) return null

  const decide = (v: 'granted' | 'denied') => {
    setConsent(v)
    setChoice(v)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-2xl"
      >
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-glass ring-1 ring-brand-deep/15 sm:flex-row sm:items-center">
          <p className="flex-1 text-xs text-slate-600">
            <span className="font-bold text-brand-deep">We respect your privacy.</span> We only turn
            on simple, anonymous analytics if you say yes. We never sell your data. You can change
            your mind any time.
          </p>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => decide('denied')} className="btn-ghost px-3 py-2 text-xs">
              No thanks
            </button>
            <button onClick={() => decide('granted')} className="btn-primary px-3 py-2 text-xs">
              Yes, that is fine
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
