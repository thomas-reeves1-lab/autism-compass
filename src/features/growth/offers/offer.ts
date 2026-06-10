/**
 * Offer engine (Hormozi $100M Offers). DORMANT until GROWTH_LIVE.
 * Honest framing only — claims must be true. No "cure" language.
 */

export interface ValueEquationInputs {
  dreamOutcome: number // 1-10 how big the desired result
  perceivedLikelihood: number // 1-10 how believable
  timeDelay: number // 1-10 how long to result (higher = worse)
  effortSacrifice: number // 1-10 how hard (higher = worse)
}

/** Hormozi value equation: (Dream x Likelihood) / (Time x Effort). Higher = stronger offer. */
export function valueScore(i: ValueEquationInputs): number {
  const denom = Math.max(1, i.timeDelay) * Math.max(1, i.effortSacrifice)
  return +((i.dreamOutcome * i.perceivedLikelihood) / denom).toFixed(2)
}

export interface OfferItem {
  name: string
  value: number // anchored AUD value
  realDeliverable: string // what they actually get — must be true
}

export interface Offer {
  id: string
  headline: string
  promise: string
  items: OfferItem[]
  price: number
  guarantee: string
}

export const totalStackValue = (o: Offer) => o.items.reduce((a, it) => a + it.value, 0)

/** A sample honest grand-slam offer for the Practitioner edition. */
export const sampleOffer: Offer = {
  id: 'practitioner-offer',
  headline: 'Walk into every review meeting prepared',
  promise: 'Turn scattered notes into a clean, evidence-labelled pack the whole team trusts.',
  items: [
    { name: 'White-label report builder', value: 49, realDeliverable: 'Reports with your clinic logo' },
    { name: 'Bulk client export', value: 39, realDeliverable: 'Export many clients at once' },
    { name: 'Clinical-note format', value: 29, realDeliverable: 'Output formatted for case notes' },
    { name: 'Referral pathway cards', value: 19, realDeliverable: 'Who-to-ask cards for families' },
    { name: 'Monthly evidence digest', value: 15, realDeliverable: 'Plain-English updates each month' },
  ],
  price: 49,
  guarantee: '30-day money-back guarantee. If it does not save you time, we refund you and help you export your data.',
}

/** Quiz lead magnet questions ("what might be driving the behaviour?"). Educational. */
export const quizQuestions = [
  { q: 'Has sleep changed recently?', tag: 'sleep' },
  { q: 'Any constipation or tummy pain?', tag: 'gut' },
  { q: 'Any new medicine or supplement?', tag: 'medication' },
  { q: 'More demands, noise, or routine change?', tag: 'environment' },
  { q: 'Any signs of pain or illness?', tag: 'pain' },
]
