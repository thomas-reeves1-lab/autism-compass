import type { Metrics, MetricKey, NumberLabel } from './types'
import { treatments, treatmentById, baselineDefaults } from '../data/evidence'

/**
 * The projection engine. Educational only — NOT a prescribing or dosing tool.
 *
 * Design notes:
 *  - Dose response is NOT linear. We use a saturating curve so most of the
 *    modelled effect arrives in the studied range and then flattens.
 *  - We never claim certainty: every projected metric carries an uncertainty
 *    band and the honesty label of the dominant contributing effect.
 *  - Effects are additive in "remaining room" space to avoid double counting and
 *    to stop any single metric being driven below 0 or above 10.
 */

export type EvidenceMode = 'direct' | 'practical' | 'explore'

export interface CalculatorInputs {
  baselineMetrics: Metrics
  /** Risperidone total daily dose in mg (0.5-3). */
  risperidoneDose: number
  /** NAC total daily dose in mg (0-2700). */
  nacDose: number
  /** Ids of selected adjunct treatments (toggles). */
  selectedAdjuncts: string[]
  evidenceMode: EvidenceMode
}

export interface MetricContribution {
  treatmentId: string
  treatmentName: string
  /** Signed change applied to this metric (negative = improvement). */
  delta: number
  label: NumberLabel
  reason: string
}

export interface ProjectedMetric {
  metric: MetricKey
  baseline: number
  projected: number
  /** +/- band on the projected value (0-10 clamped). */
  low: number
  high: number
  contributions: MetricContribution[]
}

export type Projection = Record<MetricKey, ProjectedMetric>

const METRIC_KEYS = Object.keys(baselineDefaults) as MetricKey[]

/** Saturating dose fraction: 0 at zero dose, ~1 at/above the studied max. */
function saturate(dose: number, studiedMax: number): number {
  if (dose <= 0 || studiedMax <= 0) return 0
  // Hill-style curve: reaches ~0.5 at half the studied max, flattens after.
  const x = dose / studiedMax
  return Math.min(1, (1.15 * x) / (0.4 + x))
}

/** Should an effect with this label be counted in the given evidence mode? */
function labelAllowed(label: NumberLabel, mode: EvidenceMode): boolean {
  if (mode === 'direct') return label === 'direct'
  if (mode === 'practical') return label === 'direct' || label === 'estimated'
  return true // explore: show everything, including theoretical
}

/** Dose fraction (0-1) for a treatment given the inputs. */
function doseFraction(treatmentId: string, inputs: CalculatorInputs): number {
  if (treatmentId === 'risperidone') return saturate(inputs.risperidoneDose, 3)
  if (treatmentId === 'nac') return saturate(inputs.nacDose, 2700)
  // Toggled adjuncts apply their full studied effect when selected.
  return inputs.selectedAdjuncts.includes(treatmentId) ? 1 : 0
}

/** Which treatments are active in this calculation. */
function activeTreatments(inputs: CalculatorInputs): string[] {
  const active = new Set<string>(inputs.selectedAdjuncts)
  if (inputs.risperidoneDose > 0) active.add('risperidone')
  if (inputs.nacDose > 0) active.add('nac')
  return [...active]
}

export function calculateProjectedMetrics(inputs: CalculatorInputs): Projection {
  const projection = {} as Projection
  const active = activeTreatments(inputs)

  for (const metric of METRIC_KEYS) {
    const baseline = clamp(inputs.baselineMetrics[metric] ?? baselineDefaults[metric])
    const contributions: MetricContribution[] = []
    let bandTotal = 0

    // Apply each treatment's effect on this metric in "remaining room" space.
    // Improvements consume room toward 0; worsenings consume room toward 10.
    let improveRoom = baseline // room to fall
    let worsenRoom = 10 - baseline // room to rise
    let value = baseline

    for (const id of active) {
      const t = treatmentById(id)
      if (!t) continue
      const frac = doseFraction(id, inputs)
      if (frac <= 0) continue

      for (const e of t.effectModel) {
        if (e.metric !== metric) continue
        if (!labelAllowed(e.label, inputs.evidenceMode)) continue

        // Target change as a proportion of baseline, scaled by dose fraction.
        const targetChange = e.maxEffect * baseline * frac
        let applied: number
        if (targetChange < 0) {
          applied = -Math.min(Math.abs(targetChange), improveRoom)
          improveRoom += applied // applied is negative -> reduces room
        } else {
          applied = Math.min(targetChange, worsenRoom)
          worsenRoom -= applied
        }
        if (Math.abs(applied) < 0.001) continue

        value += applied
        bandTotal += Math.abs(applied) * e.uncertainty
        contributions.push({
          treatmentId: id,
          treatmentName: t.name,
          delta: round1(applied),
          label: e.label,
          reason: e.reason,
        })
      }
    }

    const projected = clamp(value)
    projection[metric] = {
      metric,
      baseline: round1(baseline),
      projected: round1(projected),
      low: clamp(projected - bandTotal),
      high: clamp(projected + bandTotal),
      contributions,
    }
  }

  return projection
}

/** Build a default full Metrics object from the baseline defaults. */
export function defaultMetrics(): Metrics {
  const m = {} as Metrics
  for (const k of METRIC_KEYS) m[k] = baselineDefaults[k]
  return m
}

/** Plain-English "why did this number move?" explanation for a metric. */
export function explainMetric(pm: ProjectedMetric): string[] {
  if (pm.contributions.length === 0) {
    return ['No active option changes this metric in the current evidence mode.']
  }
  return pm.contributions.map((c) => {
    const dir = c.delta < 0 ? 'improved' : 'raised'
    return `${c.treatmentName} ${dir} this by ${Math.abs(c.delta)} — ${c.reason}`
  })
}

/** Total count of effect numbers and how many are study-direct (for honesty UI). */
export function evidenceStats() {
  let total = 0
  let direct = 0
  for (const t of treatments) {
    for (const e of t.effectModel) {
      total += 1
      if (e.label === 'direct') direct += 1
    }
  }
  return { total, direct }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(10, n))
}
function round1(n: number): number {
  return Math.round(n * 10) / 10
}
