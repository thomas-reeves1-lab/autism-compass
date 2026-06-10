import type { MetricKey, EvidenceLevel, NumberLabel } from './types'

/** Plain-English metric names (grade-3 wording, master prompt PLAIN ENGLISH RULES). */
export const metricLabels: Record<MetricKey, string> = {
  looping: 'Stuck in a loop',
  irritability: 'Gets upset fast',
  aggressionRisk: 'Aggression risk',
  selfInjuryRisk: 'Self-injury risk',
  skinPicking: 'Skin or body picking',
  hyperactivity: 'Body cannot settle',
  stereotypy: 'Repeating movement or sound',
  sleepOnsetDelay: 'Takes a long time to fall asleep',
  nightWaking: 'Waking in the night',
  foodSeeking: 'Always looking for food',
  sedation: 'Too sleepy in the day',
  gutUpset: 'Tummy or bowel trouble',
  sideEffectPressure: 'Overall side-effect pressure',
}

export const metricHelp: Record<MetricKey, string> = {
  looping: 'Stuck repeating the same thought, action, or demand.',
  irritability: 'Gets upset or frustrated quickly.',
  aggressionRisk: 'Risk of hitting, kicking, or lashing out.',
  selfInjuryRisk: 'Risk of hurting themselves.',
  skinPicking: 'Picking at skin or body.',
  hyperactivity: 'Body cannot stay still or settle.',
  stereotypy: 'Repeating the same movement or sound.',
  sleepOnsetDelay: 'How long it takes to fall asleep.',
  nightWaking: 'Waking up during the night.',
  foodSeeking: 'Always hungry or looking for food.',
  sedation: 'Sleepy or slowed down in the daytime.',
  gutUpset: 'Constipation, pain, or bowel trouble.',
  sideEffectPressure: 'How much side effects are weighing on things overall.',
}

/** Evidence-level badge text + colour class. */
export const evidenceLevelMeta: Record<EvidenceLevel, { label: string; colour: string; bg: string }> = {
  strong: { label: 'Strong', colour: 'text-safe', bg: 'bg-safe-soft' },
  moderate: { label: 'Moderate', colour: 'text-safe', bg: 'bg-safe-soft' },
  emerging: { label: 'Emerging', colour: 'text-info', bg: 'bg-info-soft' },
  mixed: { label: 'Mixed', colour: 'text-caution', bg: 'bg-caution-soft' },
  weak: { label: 'Weak', colour: 'text-caution', bg: 'bg-caution-soft' },
  theoretical: { label: 'Theoretical', colour: 'text-theoretical', bg: 'bg-theoretical-soft' },
  negative: { label: 'Negative trial', colour: 'text-danger', bg: 'bg-danger-soft' },
  doctorOnly: { label: 'Doctor only', colour: 'text-doctor', bg: 'bg-doctor-soft' },
}

/** The six honesty labels every number carries. */
export const numberLabelMeta: Record<NumberLabel, { label: string; colour: string }> = {
  direct: { label: 'Direct study finding', colour: 'text-safe' },
  estimated: { label: 'Estimated from study', colour: 'text-info' },
  theoretical: { label: 'Theoretical only', colour: 'text-theoretical' },
  insufficient: { label: 'Not enough evidence', colour: 'text-theoretical' },
  doctorOnly: { label: 'Medicine, doctor only', colour: 'text-doctor' },
  negative: { label: 'Negative trial', colour: 'text-danger' },
}
