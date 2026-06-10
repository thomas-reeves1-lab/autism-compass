import type { Sponsor } from '../components/SponsorSlot'

/**
 * Common sensory items. SUPPORTS, not medicines. Each can carry a dormant
 * sponsor / product slot. Always pair with a plain-English safety caution.
 */
export interface SensoryItem {
  id: string
  name: string
  helpsWith: string[]
  plainEnglish: string
  caution: string
  sponsor?: Sponsor // dormant — none yet
}

export const sensoryItems: SensoryItem[] = [
  {
    id: 'weighted-blanket',
    name: 'Weighted blanket',
    helpsWith: ['calm', 'sleep', 'deep pressure'],
    plainEnglish: 'Gentle, even weight that can feel calming and help some people settle for sleep.',
    caution: 'Weight and age matter. Must be removed independently. Not for infants. Check with an OT.',
  },
  {
    id: 'ear-defenders',
    name: 'Ear defenders / noise-cancelling headphones',
    helpsWith: ['noise sensitivity', 'sensory overload'],
    plainEnglish: 'Lowers loud or busy noise to reduce overload in shops, school or transport.',
    caution: 'Allow breaks so hearing is not always blocked. Keep them clean.',
  },
  {
    id: 'chew-necklace',
    name: 'Chewable necklace (chewelry)',
    helpsWith: ['oral sensory needs', 'focus', 'self-regulation'],
    plainEnglish: 'A safe thing to chew for people who seek oral input or chew on clothes.',
    caution: 'Choose food-grade silicone and the right toughness. Replace when worn — choking risk.',
  },
  {
    id: 'fidget',
    name: 'Fidget toys',
    helpsWith: ['focus', 'restlessness', 'self-regulation'],
    plainEnglish: 'Small toys for the hands that can help focus and calm restlessness.',
    caution: 'Small parts can be a choking risk for young children.',
  },
  {
    id: 'compression-vest',
    name: 'Compression vest / clothing',
    helpsWith: ['deep pressure', 'body awareness', 'calm'],
    plainEnglish: 'Snug clothing that gives steady pressure some people find grounding.',
    caution: 'Fit matters; use as guided by an OT. Watch for overheating.',
  },
  {
    id: 'visual-timer',
    name: 'Visual timer',
    helpsWith: ['transitions', 'waiting', 'routine'],
    plainEnglish: 'Shows time passing as a picture, which helps with waiting and transitions.',
    caution: 'Introduce gently; for some, a countdown can add pressure.',
  },
  {
    id: 'sensory-swing',
    name: 'Sensory swing',
    helpsWith: ['vestibular input', 'calm', 'regulation'],
    plainEnglish: 'Gentle swinging movement that can be organising and calming.',
    caution: 'Needs safe rigging and supervision. Set up with an OT.',
  },
  {
    id: 'body-sock',
    name: 'Body sock',
    helpsWith: ['deep pressure', 'body awareness', 'play'],
    plainEnglish: 'A stretchy fabric that gives resistance and pressure during movement play.',
    caution: 'Supervise use; ensure the person can get out easily.',
  },
  {
    id: 'weighted-lap-pad',
    name: 'Weighted lap pad',
    helpsWith: ['focus', 'calm', 'sitting'],
    plainEnglish: 'A small weighted pad for the lap to help with sitting and focus.',
    caution: 'Use the right weight; remove if uncomfortable.',
  },
  {
    id: 'sunglasses-cap',
    name: 'Sunglasses / brimmed cap',
    helpsWith: ['light sensitivity', 'overload'],
    plainEnglish: 'Cuts harsh or flickering light that can cause discomfort or overload.',
    caution: 'Choose proper UV protection for outdoor use.',
  },
  {
    id: 'bubble-tube',
    name: 'Bubble tube / liquid motion',
    helpsWith: ['visual calm', 'focus', 'wind-down'],
    plainEnglish: 'Slow visual movement that can be calming and help wind down.',
    caution: 'Check for flicker; some find fast motion over-stimulating.',
  },
  {
    id: 'therapy-putty',
    name: 'Therapy putty',
    helpsWith: ['hand strength', 'focus', 'fidget'],
    plainEnglish: 'Resistant putty for the hands — good for strength and calm focus.',
    caution: 'Not for mouthing; small children need supervision.',
  },
]
