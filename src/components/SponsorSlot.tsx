import { Megaphone } from './icons'
import { isLive, showDormant } from '../config/featureFlags'

export interface Sponsor {
  name: string
  blurb: string
  url: string
  logo?: string
}

/**
 * A dormant sponsor / advertiser slot. Nothing shows to the public until
 * featureFlags.SPONSORS_LIVE is true AND a sponsor is supplied. In dev preview
 * it shows a labelled placeholder so the layout is visible while being built.
 *
 * `disclaimer` is required for health-product slots (TGA): a sponsor can never
 * be presented as treating autism.
 */
export function SponsorSlot({
  sponsor,
  kind,
  disclaimer,
}: {
  sponsor?: Sponsor
  kind: 'therapy' | 'supplement' | 'sensory'
  disclaimer?: string
}) {
  const live = isLive('SPONSORS_LIVE')

  if (live && sponsor) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="mt-3 block rounded-xl border border-info/30 bg-info-soft/60 p-3 transition hover:bg-info-soft"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-info">{sponsor.name}</span>
          <span className="pill bg-white/70 text-[10px] text-slate-500">Sponsored</span>
        </div>
        <p className="mt-1 text-xs text-slate-600">{sponsor.blurb}</p>
        {disclaimer && <p className="mt-1 text-[10px] text-doctor">{disclaimer}</p>}
      </a>
    )
  }

  if (!showDormant('SPONSORS_LIVE')) return null

  // Dev preview placeholder (never shown to the public in production)
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-3 py-2 text-[11px] text-slate-400">
      <Megaphone size={13} />
      Sponsor / ad slot for {kind} — available (dormant)
    </div>
  )
}
