/** Core domain types for AutismCompass. Data is kept separate from UI. */

/** The 13 behaviour KPIs tracked across the tool. 0 = calm, 10 = severe. */
export type MetricKey =
  | 'looping'
  | 'irritability'
  | 'aggressionRisk'
  | 'selfInjuryRisk'
  | 'skinPicking'
  | 'hyperactivity'
  | 'stereotypy'
  | 'sleepOnsetDelay'
  | 'nightWaking'
  | 'foodSeeking'
  | 'sedation'
  | 'gutUpset'
  | 'sideEffectPressure'

export type Metrics = Record<MetricKey, number>

/** How confident we are in a projected number. Drives colour + labelling. */
export type EvidenceLevel =
  | 'strong'
  | 'moderate'
  | 'emerging'
  | 'mixed'
  | 'weak'
  | 'theoretical'
  | 'negative'
  | 'doctorOnly'

/** The six honesty labels every number must carry (master prompt). */
export type NumberLabel =
  | 'direct' // 1. Direct study finding
  | 'estimated' // 2. Estimated from study finding
  | 'theoretical' // 3. Theoretical only
  | 'insufficient' // 4. Not enough evidence
  | 'doctorOnly' // 5. Medication, doctor only
  | 'negative' // 6. Negative trial / no clear added benefit

export type TreatmentCategory =
  | 'Medication'
  | 'Prescription adjunct'
  | 'Supplement'
  | 'Vitamin'
  | 'Amino acid'
  | 'Fatty acid'
  | 'Mineral'
  | 'Fibre'
  | 'Plant extract'
  | 'Sleep support'
  | 'Gut support'
  | 'Not recommended'
  | 'No intervention model'

export type HarmLevel = 'low' | 'moderate' | 'high' | 'doctorOnly'

export interface EffectModelEntry {
  /** Which metric this effect touches. */
  metric: MetricKey
  /**
   * Maximum fractional change at the studied effective dose, as a proportion of
   * the baseline score. Negative = improvement (score goes down). Positive =
   * worsening (e.g. risperidone raising sedation / foodSeeking).
   */
  maxEffect: number
  /** Honesty label for this specific number. */
  label: NumberLabel
  /** +/- uncertainty band as a fraction (e.g. 0.3 => +/-30% of the effect). */
  uncertainty: number
  /** One-sentence plain-English reason this number moved. */
  reason: string
}

export interface StudyReference {
  id: string
  citation: string
  year: number
}

export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  type: string
  doctorOnly: boolean
  /** Human-readable studied dose range, e.g. "600-2700 mg/day". */
  studiedDoseRange: string
  /** Can the user move a slider for this, or is it a toggle / locked button. */
  userAdjustable: boolean
  evidenceLevel: EvidenceLevel
  targetMetrics: MetricKey[]
  effectModel: EffectModelEntry[]
  sideEffects: string[]
  interactionWarnings: string[]
  sourceSummary: string
  studyReferences: string[]
  confidenceNote: string
  plainEnglishSummary: string
  harmLevel: HarmLevel
  monitoringNeeded: string[]
  safetyFlags: string[]
  doctorQuestions: string[]
}
