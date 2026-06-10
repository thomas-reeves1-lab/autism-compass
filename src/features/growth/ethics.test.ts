import { describe, it, expect } from 'vitest'
import { ethics, NEVER_GATED, isSafetyContent, assertGatable } from './ethics'

describe('growth ethics rail', () => {
  it('ships with dark patterns OFF by default', () => {
    expect(ethics.fakeScarcity).toBe(false)
    expect(ethics.fakeCountdowns).toBe(false)
    expect(ethics.fearSelling).toBe(false)
    expect(ethics.exitIntent).toBe(false)
  })

  it('ships with honest persuasion ON by default', () => {
    expect(ethics.realGuarantees).toBe(true)
    expect(ethics.valueStacks).toBe(true)
    expect(ethics.honestUrgency).toBe(true)
  })

  it('protects clinical-safety content from ever being gated', () => {
    for (const key of NEVER_GATED) {
      expect(isSafetyContent(key)).toBe(true)
      expect(() => assertGatable(key)).toThrow(/never be gated/)
    }
  })

  it('allows non-safety content to be gated', () => {
    expect(() => assertGatable('premium-pdf-export')).not.toThrow()
    expect(isSafetyContent('premium-pdf-export')).toBe(false)
  })
})
