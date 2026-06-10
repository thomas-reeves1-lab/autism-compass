import { describe, it, expect } from 'vitest'
import {
  calculateProjectedMetrics,
  defaultMetrics,
  evidenceStats,
  type CalculatorInputs,
} from './calculator'
import { treatments } from '../data/evidence'

function inputs(partial: Partial<CalculatorInputs> = {}): CalculatorInputs {
  return {
    baselineMetrics: defaultMetrics(),
    risperidoneDose: 3,
    nacDose: 0,
    selectedAdjuncts: [],
    selectedTherapies: [],
    selectedSensory: [],
    evidenceMode: 'practical',
    ...partial,
  }
}

describe('calculateProjectedMetrics', () => {
  it('keeps every metric within 0-10', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 3, nacDose: 2700, selectedAdjuncts: treatments.map((t) => t.id) }))
    for (const m of Object.values(p)) {
      expect(m.projected).toBeGreaterThanOrEqual(0)
      expect(m.projected).toBeLessThanOrEqual(10)
      expect(m.low).toBeGreaterThanOrEqual(0)
      expect(m.high).toBeLessThanOrEqual(10)
    }
  })

  it('risperidone at 3mg reduces irritability vs baseline', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 3 }))
    expect(p.irritability.projected).toBeLessThan(p.irritability.baseline)
  })

  it('risperidone raises food seeking (side effect modelled honestly)', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 3 }))
    expect(p.foodSeeking.projected).toBeGreaterThan(p.foodSeeking.baseline)
  })

  it('direct mode shows fewer or equal contributions than explore mode', () => {
    const direct = calculateProjectedMetrics(inputs({ nacDose: 2700, evidenceMode: 'direct' }))
    const explore = calculateProjectedMetrics(inputs({ nacDose: 2700, evidenceMode: 'explore' }))
    const dCount = Object.values(direct).reduce((a, m) => a + m.contributions.length, 0)
    const eCount = Object.values(explore).reduce((a, m) => a + m.contributions.length, 0)
    expect(dCount).toBeLessThanOrEqual(eCount)
  })

  it('NAC skin-picking benefit comes from NAC only (BFRB evidence)', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 0, nacDose: 2700 }))
    const contribs = p.skinPicking.contributions
    expect(contribs.length).toBeGreaterThan(0)
    expect(contribs.every((c) => c.treatmentId === 'nac')).toBe(true)
  })

  it('ginkgo never improves any metric', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 0, selectedAdjuncts: ['ginkgo'] }))
    for (const m of Object.values(p)) {
      expect(m.contributions.find((c) => c.treatmentId === 'ginkgo')).toBeUndefined()
    }
  })

  it('an allied-health therapy lowers its target metric', () => {
    const base = calculateProjectedMetrics(inputs({ risperidoneDose: 0 }))
    const withPbs = calculateProjectedMetrics(inputs({ risperidoneDose: 0, selectedTherapies: ['pbs'] }))
    expect(withPbs.aggressionRisk.projected).toBeLessThan(base.aggressionRisk.projected)
  })

  it('a sensory item lowers its target metric', () => {
    const base = calculateProjectedMetrics(inputs({ risperidoneDose: 0 }))
    const withBlanket = calculateProjectedMetrics(inputs({ risperidoneDose: 0, selectedSensory: ['weighted-blanket'] }))
    expect(withBlanket.sleepOnsetDelay.projected).toBeLessThan(base.sleepOnsetDelay.projected)
  })

  it('watchful waiting changes nothing', () => {
    const p = calculateProjectedMetrics(inputs({ risperidoneDose: 0, selectedAdjuncts: ['watchful'] }))
    for (const m of Object.values(p)) {
      expect(m.projected).toBe(m.baseline)
    }
  })

  it('exposes evidence honesty stats', () => {
    const s = evidenceStats()
    expect(s.total).toBeGreaterThan(0)
    expect(s.direct).toBeGreaterThan(0)
    expect(s.direct).toBeLessThanOrEqual(s.total)
  })
})

describe('evidence data integrity', () => {
  it('has 40 treatments with unique ids', () => {
    expect(treatments).toHaveLength(40)
    expect(new Set(treatments.map((t) => t.id)).size).toBe(40)
  })

  it('every effect entry carries an honesty label and uncertainty', () => {
    for (const t of treatments) {
      for (const e of t.effectModel) {
        expect(e.label).toBeTruthy()
        expect(e.uncertainty).toBeGreaterThanOrEqual(0)
      }
    }
  })
})
