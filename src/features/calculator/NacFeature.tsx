import { motion } from 'framer-motion'
import { Sparkles, Leaf, TrendingUp, ShieldCheck } from '../../components/icons'
import { useAppStore } from '../../store/useAppStore'
import { treatmentById } from '../../data/evidence'
import { safetyScore } from '../../lib/safety'
import { isLive } from '../../config/featureFlags'
import { CTAButton, SafetyScoreChip, Pill } from '../../components/ui'

const NAC_TSP: Record<number, string> = { 0: '—', 600: '¼ tsp', 900: '⅜ tsp', 1200: '½ tsp', 1800: '¾ tsp', 2400: '1 tsp', 2700: '1⅛ tsp' }
const nearestTsp = (mg: number) => {
  if (mg <= 0) return '—'
  const keys = Object.keys(NAC_TSP).map(Number)
  return NAC_TSP[keys.reduce((a, b) => (Math.abs(b - mg) < Math.abs(a - mg) ? b : a))]
}

const HIGHLIGHTS = [
  { icon: TrendingUp, text: 'Two ASD trials found less irritability and more settled behaviour.' },
  { icon: Leaf, text: 'A separate study found it helped skin and body picking.' },
  { icon: ShieldCheck, text: 'Generally gentle and well tolerated — but still ask your pharmacist.' },
]

/** A premium, positive feature block for NAC. Clearly labelled NOT a medication. */
export function NacFeature() {
  const nac = treatmentById('nac')!
  const nacDose = useAppStore((s) => s.nacDose)
  const setNac = useAppStore((s) => s.setNac)
  const score = safetyScore(nac)
  const sponsorsLive = isLive('SPONSORS_LIVE')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      className="grad-border p-[2px]"
    >
      <div className="rounded-[1.4rem] bg-gradient-to-br from-white via-safe-soft/50 to-brand-sky p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #2e9e5b, #7bc043)' }}
            >
              <Leaf size={24} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-brand-deep">NAC — a gentle favourite</h2>
                <Sparkles size={16} className="text-brand-leaf" />
              </div>
              <Pill tone="safe">Supplement — not a medication</Pill>
            </div>
          </div>
          <SafetyScoreChip score={score} size="lg" />
        </div>

        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          N-Acetylcysteine is an antioxidant supplement, not a prescription medicine. It has some of
          the most encouraging supplement evidence in autism for irritability, a body that cannot
          settle, and body-focused picking. It is a popular, lower-risk option to discuss first.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                className="relative overflow-hidden rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(21,128,61,0.09), rgba(21,128,61,0.04))',
                  border: '1px solid rgba(21,128,61,0.18)',
                  boxShadow: '0 2px 8px -4px rgba(21,128,61,0.2)',
                }}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                  style={{ background: 'linear-gradient(180deg, #15803D, #22c55e)' }}
                />
                <div className="pl-1">
                  <div
                    className="mb-1.5 grid h-7 w-7 place-items-center rounded-lg text-white"
                    style={{ background: 'linear-gradient(135deg, #15803D, #22c55e)' }}
                  >
                    <Icon size={15} />
                  </div>
                  <p className="text-xs text-slate-600">{h.text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick NAC dose control */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(240,253,244,0.9))', border: '1px solid rgba(21,128,61,0.12)' }}
        >
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-bold text-brand-deep">Try it in the model</span>
            <span className="font-black text-safe">{nacDose} mg/day {nacDose > 0 && `(~${nearestTsp(nacDose)})`}</span>
          </div>
          <input
            type="range" min={0} max={2700} step={300} value={nacDose}
            onChange={(e) => setNac(+e.target.value)}
            className="w-full accent-brand-leaf"
            aria-label="NAC daily dose"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Kitchen teaspoons are not accurate. Use the label or scales and confirm with a pharmacist.
          </p>
        </div>

        {/* Dormant sales CTA */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-deep/5 p-3">
          <p className="text-xs text-slate-600">
            Want a quality-checked, third-party-tested NAC guide when our shop opens?
          </p>
          <CTAButton live={sponsorsLive}>Get the NAC guide</CTAButton>
        </div>
        <p className="mt-2 text-[10px] text-doctor">
          Not a medicine. Not approved to treat autism. Speak to your doctor or pharmacist before use.
        </p>
      </div>
    </motion.div>
  )
}
