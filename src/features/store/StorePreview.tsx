import { motion } from 'framer-motion'
import { ShoppingBag, Lock, Sparkles } from '../../components/icons'
import { products, formatAud } from './catalogue'
import { isLive, showDormant } from '../../config/featureFlags'
import { GlassCard, SectionTitle, Disclaimer, Pill } from '../../components/ui'

const PRODUCT_ACCENT: Record<string, string> = {
  digital: '#0E5196',
  physical: '#15803D',
}

/**
 * Store (DORMANT). Renders in dev preview so it can be built and reviewed, but is
 * never purchasable in production until featureFlags.STORE_LIVE is true.
 */
export function StorePreview() {
  const live = isLive('STORE_LIVE')

  return (
    <GlassCard>
      <SectionTitle
        icon={<ShoppingBag size={18} />}
        title="Store"
        subtitle="Coming soon. The calculator and all safety tools are always free. The store will only ever offer matched, evidence-appropriate products and guides."
      />

      {!live && (
        <div
          className="mb-4 flex items-start gap-2.5 rounded-xl p-3 text-xs"
          style={{ background: 'rgba(100,116,139,0.07)', border: '1px solid rgba(100,116,139,0.18)' }}
        >
          <Sparkles size={13} className="mt-0.5 shrink-0 text-theoretical" />
          <p className="text-theoretical">
            <span className="font-bold">Preview mode.</span> The store is built but not live. Nothing can be purchased yet.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((p) => {
          const acc = PRODUCT_ACCENT[p.type] ?? '#0E5196'
          return (
            <div
              key={p.id}
              className="relative overflow-hidden rounded-2xl p-4"
              style={{
                background: `linear-gradient(135deg, white, color-mix(in srgb, ${acc} 4%, white))`,
                border: `1px solid ${acc}20`,
                boxShadow: `0 4px 16px -8px ${acc}30`,
              }}
            >
              <span className="absolute bottom-0 left-0 top-0 w-[3.5px] rounded-l-2xl" style={{ background: acc }} />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-brand-deep">{p.name}</h3>
                  <Pill tone={p.type === 'digital' ? 'info' : 'safe'}>{p.type}</Pill>
                </div>
                <span
                  className="rounded-lg px-2.5 py-1 text-sm font-black text-white"
                  style={{ background: `linear-gradient(110deg, ${acc}, color-mix(in srgb, ${acc} 70%, #1d4ed8))` }}
                >
                  {formatAud(p.priceCents)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">{p.description}</p>
              <div className="mt-3">
                <Disclaimer variant={p.type === 'physical' ? 'product' : 'tool'} />
              </div>
              <div className="mt-3">
                {live && p.active ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="btn-primary w-full text-sm"
                  >
                    Add to cart
                  </motion.button>
                ) : (
                  <button disabled className="btn-ghost w-full cursor-not-allowed text-sm opacity-60">
                    <Lock size={14} /> Coming soon
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showDormant('STORE_LIVE') && (
        <p className="mt-4 text-center text-xs text-slate-400">
          When ready, set <code>STORE_LIVE = true</code> in <code>src/config/featureFlags.ts</code>{' '}
          and connect Stripe + Supabase (see README).
        </p>
      )}
    </GlassCard>
  )
}
