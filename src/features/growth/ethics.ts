/**
 * The Growth Ethics Rail.
 *
 * Every persuasion mechanism in the growth module reads this config. It ships
 * with HONEST DEFAULTS. The audience is vulnerable families in a health / TGA
 * context, so dark patterns are OFF by default and must be deliberately enabled.
 *
 * Honest-equivalent flags (e.g. honestUrgency) let you use a mechanism ONLY when
 * it reflects something genuinely true (a real deadline, real limited stock).
 */
export interface EthicsConfig {
  // --- Dark patterns: OFF by default, never auto-enable ---
  /** Invented "only 2 left" pressure with no real basis. */
  fakeScarcity: boolean
  /** Countdown timers that reset / are not tied to a real deadline. */
  fakeCountdowns: boolean
  /** Selling by amplifying fear about a child's health. */
  fearSelling: boolean
  /** Exit-intent popups that interrupt someone trying to leave. */
  exitIntent: boolean

  // --- Honest persuasion: ON by default ---
  /** Real, written guarantees (refunds, "results or we help you"). */
  realGuarantees: boolean
  /** Value-stack presentation of a genuine offer. */
  valueStacks: boolean
  /** Urgency shown ONLY for a genuine, real deadline. */
  honestUrgency: boolean
  /** Stock counters shown ONLY when stock is genuinely limited. */
  honestStock: boolean
}

export const ethics: EthicsConfig = {
  fakeScarcity: false,
  fakeCountdowns: false,
  fearSelling: false,
  exitIntent: false,

  realGuarantees: true,
  valueStacks: true,
  honestUrgency: true,
  honestStock: false,
}

/**
 * Content keys that are CLINICAL SAFETY content. These can never be paywalled,
 * gated, or used as bait by any growth or store mechanism. The list is asserted
 * in tests; any attempt to gate one of these should fail the build.
 */
export const NEVER_GATED = [
  'evidence-calculator',
  'safe-stack-checker',
  'emergency-warning',
  'medication-safety',
  'behaviour-first-checklist',
  'who-to-ask',
] as const

export type NeverGatedKey = (typeof NEVER_GATED)[number]

/** True if a piece of content is clinical-safety content that must stay free. */
export function isSafetyContent(key: string): key is NeverGatedKey {
  return (NEVER_GATED as readonly string[]).includes(key)
}

/**
 * Guard used by store/growth gating helpers. Throws in dev if anyone tries to
 * lock safety content behind a paywall or growth mechanism.
 */
export function assertGatable(key: string): void {
  if (isSafetyContent(key)) {
    throw new Error(
      `Ethics violation: "${key}" is clinical-safety content and can never be gated, paywalled, or used as bait.`,
    )
  }
}
