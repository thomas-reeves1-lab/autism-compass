import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { calculateProjectedMetrics, type Projection } from './calculator'

/** Live projection derived from the global store. */
export function useProjection(): Projection {
  const baselineMetrics = useAppStore((s) => s.baselineMetrics)
  const risperidoneDose = useAppStore((s) => s.risperidoneDose)
  const nacDose = useAppStore((s) => s.nacDose)
  const selectedAdjuncts = useAppStore((s) => s.selectedAdjuncts)
  const evidenceMode = useAppStore((s) => s.evidenceMode)

  return useMemo(
    () =>
      calculateProjectedMetrics({
        baselineMetrics,
        risperidoneDose,
        nacDose,
        selectedAdjuncts,
        evidenceMode,
      }),
    [baselineMetrics, risperidoneDose, nacDose, selectedAdjuncts, evidenceMode],
  )
}
