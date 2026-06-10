import type { Sponsor } from '../components/SponsorSlot'
import type { EffectModelEntry } from '../lib/types'

/**
 * Common sensory items. SUPPORTS, not medicines. TOGGLEABLE into the model with
 * gentle, clearly-estimated effects. Each pairs with a plain-English safety
 * caution and can carry a dormant sponsor / product slot.
 */
export interface SensoryItem {
  id: string
  name: string
  helpsWith: string[]
  plainEnglish: string
  caution: string
  effects: EffectModelEntry[]
  sponsor?: Sponsor // dormant — none yet
}

const est = (metric: EffectModelEntry['metric'], maxEffect: number, reason: string): EffectModelEntry => ({
  metric,
  maxEffect,
  label: 'estimated',
  uncertainty: 0.55,
  reason,
})

export const sensoryItems: SensoryItem[] = [
  {
    id: 'weighted-blanket',
    name: 'Weighted blanket',
    helpsWith: ['calm', 'sleep', 'deep pressure'],
    plainEnglish: 'Gentle, even weight that can feel calming and help some people settle for sleep.',
    caution: 'Weight and age matter. Must be removed independently. Not for infants. Check with an OT.',
    effects: [est('sleepOnsetDelay', -0.12, 'Deep pressure helps some settle for sleep.'), est('nightWaking', -0.08, 'May help some stay settled overnight.'), est('irritability', -0.06, 'Calming input can ease arousal.')],
  },
  {
    id: 'ear-defenders',
    name: 'Ear defenders / noise-cancelling headphones',
    helpsWith: ['noise sensitivity', 'sensory overload'],
    plainEnglish: 'Lowers loud or busy noise to reduce overload in shops, school or transport.',
    caution: 'Allow breaks so hearing is not always blocked. Keep them clean.',
    effects: [est('irritability', -0.12, 'Less noise overload can mean less upset.'), est('hyperactivity', -0.08, 'Lower overload can help settle.')],
  },
  {
    id: 'chew-necklace',
    name: 'Chewable necklace (chewelry)',
    helpsWith: ['oral sensory needs', 'focus', 'self-regulation'],
    plainEnglish: 'A safe thing to chew for people who seek oral input or chew on clothes.',
    caution: 'Choose food-grade silicone and the right toughness. Replace when worn — choking risk.',
    effects: [est('stereotypy', -0.08, 'Meets an oral sensory need safely.'), est('hyperactivity', -0.06, 'Oral input can be regulating.')],
  },
  {
    id: 'fidget',
    name: 'Fidget toys',
    helpsWith: ['focus', 'restlessness', 'self-regulation'],
    plainEnglish: 'Small toys for the hands that can help focus and calm restlessness.',
    caution: 'Small parts can be a choking risk for young children.',
    effects: [est('hyperactivity', -0.08, 'Busy hands can help a restless body focus.'), est('looping', -0.05, 'A fidget can interrupt stuck patterns.')],
  },
  {
    id: 'compression-vest',
    name: 'Compression vest / clothing',
    helpsWith: ['deep pressure', 'body awareness', 'calm'],
    plainEnglish: 'Snug clothing that gives steady pressure some people find grounding.',
    caution: 'Fit matters; use as guided by an OT. Watch for overheating.',
    effects: [est('hyperactivity', -0.1, 'Steady pressure can be grounding.'), est('irritability', -0.06, 'Grounding input can ease arousal.')],
  },
  {
    id: 'visual-timer',
    name: 'Visual timer',
    helpsWith: ['transitions', 'waiting', 'routine'],
    plainEnglish: 'Shows time passing as a picture, which helps with waiting and transitions.',
    caution: 'Introduce gently; for some, a countdown can add pressure.',
    effects: [est('looping', -0.08, 'Seeing time pass can ease stuck waiting.'), est('irritability', -0.06, 'Predictable transitions can lower upset.')],
  },
  {
    id: 'sensory-swing',
    name: 'Sensory swing',
    helpsWith: ['vestibular input', 'calm', 'regulation'],
    plainEnglish: 'Gentle swinging movement that can be organising and calming.',
    caution: 'Needs safe rigging and supervision. Set up with an OT.',
    effects: [est('hyperactivity', -0.1, 'Movement input can be organising.'), est('irritability', -0.06, 'Rhythmic movement can calm.')],
  },
  {
    id: 'body-sock',
    name: 'Body sock',
    helpsWith: ['deep pressure', 'body awareness', 'play'],
    plainEnglish: 'A stretchy fabric that gives resistance and pressure during movement play.',
    caution: 'Supervise use; ensure the person can get out easily.',
    effects: [est('hyperactivity', -0.08, 'Resistance play can use up restless energy.')],
  },
  {
    id: 'weighted-lap-pad',
    name: 'Weighted lap pad',
    helpsWith: ['focus', 'calm', 'sitting'],
    plainEnglish: 'A small weighted pad for the lap to help with sitting and focus.',
    caution: 'Use the right weight; remove if uncomfortable.',
    effects: [est('hyperactivity', -0.08, 'Lap weight can help with sitting and focus.'), est('looping', -0.04, 'Grounding can ease restlessness.')],
  },
  {
    id: 'sunglasses-cap',
    name: 'Sunglasses / brimmed cap',
    helpsWith: ['light sensitivity', 'overload'],
    plainEnglish: 'Cuts harsh or flickering light that can cause discomfort or overload.',
    caution: 'Choose proper UV protection for outdoor use.',
    effects: [est('irritability', -0.08, 'Less light overload can mean less distress.')],
  },
  {
    id: 'bubble-tube',
    name: 'Bubble tube / liquid motion',
    helpsWith: ['visual calm', 'focus', 'wind-down'],
    plainEnglish: 'Slow visual movement that can be calming and help wind down.',
    caution: 'Check for flicker; some find fast motion over-stimulating.',
    effects: [est('sleepOnsetDelay', -0.08, 'A calm wind-down can help sleep onset.'), est('irritability', -0.05, 'Slow visuals can soothe.')],
  },
  {
    id: 'therapy-putty',
    name: 'Therapy putty',
    helpsWith: ['hand strength', 'focus', 'fidget'],
    plainEnglish: 'Resistant putty for the hands — good for strength and calm focus.',
    caution: 'Not for mouthing; small children need supervision.',
    effects: [est('hyperactivity', -0.06, 'Hand work can help focus.'), est('skinPicking', -0.08, 'A hand fidget can offer an alternative to picking.')],
  },
]

export const sensoryById = (id: string) => sensoryItems.find((s) => s.id === id)
