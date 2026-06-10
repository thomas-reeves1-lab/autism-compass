/**
 * Store catalogue (DORMANT). Nothing here is purchasable until featureFlags.STORE_LIVE.
 * No product may be described as treating autism. Every product carries a TGA disclaimer.
 */
export type ProductType = 'digital' | 'physical'

export interface Product {
  id: string
  slug: string
  name: string
  type: ProductType
  /** Price in AUD cents. */
  priceCents: number
  /** Maps to an evidence-tool option where relevant (for honest, matched listing). */
  evidenceId?: string
  description: string
  /** Required on every product. */
  tgaDisclaimer: string
  /** Live only when its flag is on. */
  active: boolean
  stripePriceId?: string
}

const TGA = 'This product is not a medicine. It is not approved to treat autism. Speak to your doctor or pharmacist before use.'

export const products: Product[] = [
  // --- Digital (premium / practitioner) ---
  {
    id: 'premium-monthly',
    slug: 'premium',
    name: 'AutismCompass Premium',
    type: 'digital',
    priceCents: 900,
    description: 'PDF exports, tracker history beyond 30 days, and a monthly plain-English evidence digest. The calculator and all safety tools stay free forever.',
    tgaDisclaimer: 'Education tool only. Not medical advice.',
    active: false,
  },
  {
    id: 'practitioner',
    slug: 'practitioner',
    name: 'Practitioner Edition',
    type: 'digital',
    priceCents: 4900,
    description: 'White-label reports with your clinic logo, bulk export for multiple clients, clinical-note format, and referral pathway cards.',
    tgaDisclaimer: 'Professional education tool. Not medical advice.',
    active: false,
  },
  // --- Physical (supplement guides — NOT the supplements as treatment) ---
  {
    id: 'guide-sleep',
    slug: 'sleep-support-guide',
    name: 'Sleep Support Family Guide',
    type: 'physical',
    evidenceId: 'melatonin',
    priceCents: 1900,
    description: 'A printed plain-English guide to sleep routines and what the evidence says about sleep support. Educational reading, not a medicine.',
    tgaDisclaimer: TGA,
    active: false,
  },
  {
    id: 'guide-gut',
    slug: 'gut-comfort-guide',
    name: 'Gut Comfort Family Guide',
    type: 'physical',
    evidenceId: 'probiotics',
    priceCents: 1900,
    description: 'A printed guide to bowel comfort, fibre safety, and what the evidence says. Educational reading, not a medicine.',
    tgaDisclaimer: TGA,
    active: false,
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
export const formatAud = (cents: number) => `$${(cents / 100).toFixed(2)} AUD`
