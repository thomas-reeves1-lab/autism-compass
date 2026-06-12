import { motion } from 'framer-motion'
import { Check, ShieldCheck, X } from '../../components/icons'
import { GlassCard } from '../../components/ui'

const IS_ITEMS = [
  'An education and conversation aid',
  'A visual summary of peer-reviewed studies',
  'Honest about evidence strength and uncertainty',
  'Built by a registered provider and an RN',
]
const ISNT_ITEMS = [
  'Not medical advice or a diagnosis',
  'Not a prescribing or dosing tool',
  'Not a prediction for any one person',
  'Not a replacement for the treating doctor',
]

export function TrustSection() {
  return (
    <GlassCard>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, #0e5196, #2c7be5)', boxShadow: '0 4px 12px -4px rgba(14,81,150,0.5)' }}
        >
          <ShieldCheck size={18} className="text-white" />
        </span>
        <div>
          <h2 className="text-base font-black text-brand-deep">What this is, and what it is not</h2>
          <p className="text-xs text-slate-400">Honest framing builds real trust</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* IS column */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="relative overflow-hidden rounded-2xl p-4 pl-6"
          style={{
            background: 'linear-gradient(135deg, rgba(21,128,61,0.07) 0%, rgba(21,128,61,0.03) 100%)',
            border: '1px solid rgba(21,128,61,0.2)',
            boxShadow: '0 4px 16px -8px rgba(21,128,61,0.25)',
          }}
        >
          <span
            className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
            style={{ background: 'linear-gradient(180deg, #15803D, #4ade80)' }}
          />
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-safe text-white">
              <Check size={13} />
            </span>
            <p className="text-sm font-extrabold text-safe">What it is</p>
          </div>
          <ul className="space-y-2">
            {IS_ITEMS.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 + 0.1, type: 'spring', stiffness: 260, damping: 24 }}
                className="flex items-start gap-2 text-xs text-slate-600"
              >
                <Check size={13} className="mt-0.5 shrink-0 text-safe" />
                {t}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* IS NOT column */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl p-4 pl-6"
          style={{
            background: 'linear-gradient(135deg, rgba(194,65,12,0.07) 0%, rgba(194,65,12,0.03) 100%)',
            border: '1px solid rgba(194,65,12,0.2)',
            boxShadow: '0 4px 16px -8px rgba(194,65,12,0.2)',
          }}
        >
          <span
            className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl"
            style={{ background: 'linear-gradient(180deg, #C2410C, #fb923c)' }}
          />
          <div className="mb-3 flex items-center gap-2">
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-white"
              style={{ background: '#C2410C' }}
            >
              <X size={13} />
            </span>
            <p className="text-sm font-extrabold text-doctor">What it is not</p>
          </div>
          <ul className="space-y-2">
            {ISNT_ITEMS.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: 6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 + 0.15, type: 'spring', stiffness: 260, damping: 24 }}
                className="flex items-start gap-2 text-xs text-slate-600"
              >
                <X size={13} className="mt-0.5 shrink-0 text-doctor" />
                {t}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </GlassCard>
  )
}
