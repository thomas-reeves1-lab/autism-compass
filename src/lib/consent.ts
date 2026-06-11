/**
 * Privacy-first consent + analytics.
 * Nothing is tracked until the person says yes. Choice is stored on their device.
 * Required by the Privacy Act 1988 (APPs) for a site that handles health-related info.
 */
const KEY = 'autismcompass-consent-v1'

export type Consent = 'granted' | 'denied' | null

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(v: Exclude<Consent, null>): void {
  try {
    localStorage.setItem(KEY, v)
  } catch {
    /* ignore */
  }
}

/**
 * Track a funnel event. No-op unless the user has consented AND an analytics
 * endpoint is configured. Safe to call anywhere. We never send health details,
 * only the event name.
 */
export function track(event: string, props?: Record<string, string | number>): void {
  if (getConsent() !== 'granted') return
  const w = window as unknown as { plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void }
  if (typeof w.plausible === 'function') {
    w.plausible(event, props ? { props } : undefined)
  }
}
