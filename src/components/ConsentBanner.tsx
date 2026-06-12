import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getConsent, setConsent, type Consent } from '../lib/consent'
import { ShieldCheck } from './icons'

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
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-2xl"
      >
        <div
          className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
          style={{
            background: 'rgba(7,26,54,0.93)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 24px 48px -16px rgba(6,32,63,0.8), 0 0 0 1px rgba(44,123,229,0.2)',
          }}
        >
          <div className="flex flex-1 items-start gap-2.5">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand-leaf" />
            <p className="text-xs text-white/80">
              <span className="font-bold text-white">We respect your privacy.</span>{' '}
              We only turn on simple, anonymous analytics if you say yes. We never sell your data.
              You can change your mind any time.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <motion.button
              onClick={() => decide('denied')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-white/55 transition hover:bg-white/10 hover:text-white/85"
            >
              No thanks
            </motion.button>
            <motion.button
              onClick={() => decide('granted')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg px-3 py-2 text-xs font-bold text-white transition"
              style={{
                background: 'linear-gradient(135deg, rgba(44,123,229,0.65), rgba(14,81,150,0.75))',
                border: '1px solid rgba(44,123,229,0.45)',
                boxShadow: '0 4px 12px -4px rgba(44,123,229,0.5)',
              }}
            >
              Yes, that is fine
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
