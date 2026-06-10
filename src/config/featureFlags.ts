/**
 * Master kill switches for AutismCompass.
 *
 * Everything builds and is previewable in dev, but is invisible / non-purchasable
 * to the public until the matching flag is flipped to true.
 *
 * SAFETY RULE: no flag may ever gate clinical-safety content. The evidence
 * calculator, Safe Stack Checker, emergency warning, and all medication-safety
 * information are ALWAYS available regardless of any flag. This is enforced by a
 * unit test in src/features/growth/ethics.test.ts.
 */
export interface FeatureFlags {
  /** The whole store (digital + physical) is purchasable. */
  STORE_LIVE: boolean
  /** Physical supplement catalogue (shipping, stock) is exposed. */
  PHYSICAL_STORE_LIVE: boolean
  /** Premium export formatting + history beyond 30 days requires a paid tier. */
  PREMIUM_LIVE: boolean
  /** The Hormozi growth engine (offers, funnels, upsells, primitives) is shown. */
  GROWTH_LIVE: boolean
  /** Sponsor / advertiser slots (therapies, supplements, sensory) are shown to the public. */
  SPONSORS_LIVE: boolean
}

export const featureFlags: FeatureFlags = {
  STORE_LIVE: false,
  PHYSICAL_STORE_LIVE: false,
  PREMIUM_LIVE: false,
  GROWTH_LIVE: false,
  SPONSORS_LIVE: false,
}

/**
 * In dev, modules render in a clearly-marked PREVIEW state so they can be built
 * and reviewed without being exposed to the public. In production they stay
 * hidden until their flag is true.
 */
export const isPreview = import.meta.env.DEV

export function isLive(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag]
}

/** Show a dormant module to the builder (dev preview) but never to public prod. */
export function showDormant(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag] || isPreview
}
