import { ShoppingBag, Lock } from '../../components/icons'
import { products, formatAud } from './catalogue'
import { isLive, showDormant } from '../../config/featureFlags'
import { GlassCard, SectionTitle, Disclaimer, Pill } from '../../components/ui'

/**
 * Store (DORMANT). Renders in dev preview so it can be built and reviewed, but is
 * never purchasable in production until featureFlags.STORE_LIVE is true.
 */
export function StorePreview() {
  const live = isLive('STORE_LIVE')

  return (
    <GlassCard>
      <SectionTitle
        icon={<ShoppingBag size={20} />}
        title="Store"
        subtitle="Coming soon. The calculator and all safety tools are always free. The store will only ever offer matched, evidence-appropriate products and guides."
      />

      {!live && (
        <div className="mb-4 rounded-xl border border-theoretical/30 bg-theoretical-soft p-3 text-xs text-theoretical">
          <span className="font-bold">Preview mode.</span> The store is built but not live. Nothing
          can be purchased yet.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="card lift p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-brand-deep">{p.name}</h3>
                <Pill tone={p.type === 'digital' ? 'info' : 'safe'}>{p.type}</Pill>
              </div>
              <span className="rounded-lg bg-brand-sky px-2 py-1 text-sm font-black text-brand-navy">{formatAud(p.priceCents)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">{p.description}</p>
            <div className="mt-3">
              <Disclaimer variant={p.type === 'physical' ? 'product' : 'tool'} />
            </div>
            <div className="mt-3">
              {live && p.active ? (
                <button className="btn-primary w-full text-sm">Add to cart</button>
              ) : (
                <button disabled className="btn-ghost w-full cursor-not-allowed text-sm">
                  <Lock size={14} /> Product guide coming soon
                </button>
              )}
            </div>
          </div>
        ))}
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
