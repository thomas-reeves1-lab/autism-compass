import { treatmentById } from '../data/evidence'

/** Safe Stack Checker + Medication Safety Pressure Score. Conversation helpers, not medical scores. */

export type TrafficLight = 'green' | 'yellow' | 'orange' | 'red'

export interface StackFlag {
  level: TrafficLight
  title: string
  detail: string
}

export interface StackResult {
  score: number // 0-100
  band: 'simple' | 'pharmacist' | 'review' | 'high'
  light: TrafficLight
  flags: StackFlag[]
  doctorOnlyItems: string[]
}

const SEDATING = new Set(['risperidone', 'melatonin', 'magnesium', 'cbd', 'lcarnitine'])
const BLEEDING = new Set(['omega3', 'pycnogenol', 'nac', 'ginkgo'])

/**
 * Check a selected list of treatment ids for stacking risks.
 * Mirrors the master prompt's Safe Stack Checker rules.
 */
export function checkStack(ids: string[]): StackResult {
  const flags: StackFlag[] = []
  const set = new Set(ids)
  let score = 0

  const doctorOnlyItems = ids.filter((id) => treatmentById(id)?.doctorOnly)
  if (doctorOnlyItems.length > 0) {
    score += 18 * doctorOnlyItems.length
    flags.push({
      level: 'orange',
      title: 'Doctor-only items selected',
      detail: 'These require specialist advice. Do not use this website to self-start them.',
    })
  }

  // Sedation stacking
  const sedaters = ids.filter((id) => SEDATING.has(id))
  if (sedaters.length >= 2) {
    score += 14
    flags.push({
      level: 'yellow',
      title: 'Sedation stacking possible',
      detail: 'Track morning sleepiness, falls, and daytime alertness.',
    })
  }

  // CBD + risperidone
  if (set.has('cbd') && set.has('risperidone')) {
    score += 20
    flags.push({
      level: 'red',
      title: 'CBD with risperidone — high caution',
      detail: 'CBD can increase sedation and may interact with medication pathways. Doctor/pharmacist review required.',
    })
  }

  // Melatonin + magnesium + sedating med
  if (set.has('melatonin') && set.has('magnesium') && set.has('risperidone')) {
    score += 8
    flags.push({
      level: 'yellow',
      title: 'Triple sedation source',
      detail: 'Melatonin plus magnesium plus a sedating medicine. Watch morning sleepiness and falls.',
    })
  }

  // Glucomannan + any medicine
  if (set.has('glucomannan') && ids.some((id) => treatmentById(id)?.category === 'Medication' || treatmentById(id)?.category === 'Prescription adjunct')) {
    score += 10
    flags.push({
      level: 'orange',
      title: 'Medication absorption caution',
      detail: 'Fibre can affect how medicine is absorbed. Ask the pharmacist about separating timing.',
    })
  }

  // Bleeding stacking
  const bleeders = ids.filter((id) => BLEEDING.has(id))
  if (bleeders.length >= 2) {
    score += 8
    flags.push({
      level: 'yellow',
      title: 'Bleeding caution',
      detail: 'May matter with blood-thinning medicine or surgery. Ask the pharmacist.',
    })
  }

  // Creatine
  if (set.has('creatine')) {
    flags.push({ level: 'yellow', title: 'Creatine — hydration and kidneys', detail: 'Hydration and kidney history matter. Ask the doctor if kidney issues exist.' })
    score += 4
  }
  // Vitamin D
  if (set.has('vitamind')) {
    flags.push({ level: 'yellow', title: 'Vitamin D — test first', detail: 'Blood testing matters. High-dose vitamin D can be harmful.' })
    score += 4
  }
  // Ginkgo
  if (set.has('ginkgo')) {
    flags.push({ level: 'yellow', title: 'Ginkgo — no clear benefit', detail: 'Studied but no clear added benefit with risperidone. This tool adds no benefit for ginkgo.' })
    score += 3
  }

  score = Math.min(100, score)
  const band = score <= 25 ? 'simple' : score <= 50 ? 'pharmacist' : score <= 75 ? 'review' : 'high'
  const light: TrafficLight = flags.some((f) => f.level === 'red')
    ? 'red'
    : score > 50
      ? 'orange'
      : score > 25
        ? 'yellow'
        : 'green'

  if (flags.length === 0) {
    flags.push({ level: 'green', title: 'Low current concern', detail: 'Still check with your doctor or pharmacist before using anything.' })
  }

  return { score, band, light, flags, doctorOnlyItems }
}

export interface SafetyScoreInputs {
  risperidoneDose: number
  appetitePressure: number // 0-10
  sedation: number // 0-10
  movementSymptoms: boolean
  prolactinSymptoms: boolean
  sleepDisruption: number // 0-10
  constipation: boolean
  otherSedatingMeds: number
  cbdSelected: boolean
  seizureHistory: boolean
  redFlagSymptoms: boolean
}

export interface SafetyScoreResult {
  score: number
  band: 'low' | 'watch' | 'book' | 'urgent'
  urgentOverride: boolean
}

/** Medication Safety Pressure Score (0-100). A conversation helper, not a diagnosis. */
export function safetyPressureScore(i: SafetyScoreInputs): SafetyScoreResult {
  if (i.redFlagSymptoms) {
    return { score: 100, band: 'urgent', urgentOverride: true }
  }
  let s = 0
  s += (i.risperidoneDose / 3) * 18
  s += (i.appetitePressure / 10) * 12
  s += (i.sedation / 10) * 12
  s += (i.sleepDisruption / 10) * 8
  if (i.movementSymptoms) s += 12
  if (i.prolactinSymptoms) s += 8
  if (i.constipation) s += 6
  s += Math.min(i.otherSedatingMeds, 3) * 5
  if (i.cbdSelected) s += 8
  if (i.seizureHistory) s += 6
  s = Math.min(100, Math.round(s))
  const band = s <= 25 ? 'low' : s <= 50 ? 'watch' : s <= 75 ? 'book' : 'urgent'
  return { score: s, band, urgentOverride: false }
}
