import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Metrics, MetricKey } from '../lib/types'
import { defaultMetrics, type EvidenceMode } from '../lib/calculator'

/** A single daily tracker entry (stored locally only). */
export interface TrackerEntry {
  date: string
  sleepHours: number
  sleepOnsetMinutes: number
  loopingEpisodes: number
  aggressionEpisodes: number
  selfInjuryEpisodes: number
  skinPickingEpisodes: number
  prnUsed: boolean
  foodSeeking: number
  bowelIssues: number
  sedation: number
  painSigns: number
  notes: string
}

/** A "what changed" timeline event. */
export interface ChangeEvent {
  id: string
  date: string
  type: string
  notes: string
}

interface AppState {
  // baseline + calculator inputs
  baselineMetrics: Metrics
  enabledMetrics: Record<MetricKey, boolean>
  risperidoneDose: number
  nacDose: number
  selectedAdjuncts: string[]
  evidenceMode: EvidenceMode

  // tracker + change log (local only)
  trackerEntries: TrackerEntry[]
  changeEvents: ChangeEvent[]

  // actions
  setMetric: (k: MetricKey, v: number) => void
  toggleMetric: (k: MetricKey) => void
  setRisperidone: (v: number) => void
  setNac: (v: number) => void
  toggleAdjunct: (id: string) => void
  setEvidenceMode: (m: EvidenceMode) => void
  addTrackerEntry: (e: TrackerEntry) => void
  addChangeEvent: (e: ChangeEvent) => void
  resetBaseline: () => void
}

const allMetricsEnabled = (): Record<MetricKey, boolean> => {
  const m = {} as Record<MetricKey, boolean>
  for (const k of Object.keys(defaultMetrics()) as MetricKey[]) m[k] = true
  return m
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      baselineMetrics: defaultMetrics(),
      enabledMetrics: allMetricsEnabled(),
      risperidoneDose: 3,
      nacDose: 0,
      selectedAdjuncts: [],
      evidenceMode: 'practical',
      trackerEntries: [],
      changeEvents: [],

      setMetric: (k, v) =>
        set((s) => ({ baselineMetrics: { ...s.baselineMetrics, [k]: v } })),
      toggleMetric: (k) =>
        set((s) => ({ enabledMetrics: { ...s.enabledMetrics, [k]: !s.enabledMetrics[k] } })),
      setRisperidone: (v) => set({ risperidoneDose: v }),
      setNac: (v) => set({ nacDose: v }),
      toggleAdjunct: (id) =>
        set((s) => ({
          selectedAdjuncts: s.selectedAdjuncts.includes(id)
            ? s.selectedAdjuncts.filter((x) => x !== id)
            : [...s.selectedAdjuncts, id],
        })),
      setEvidenceMode: (m) => set({ evidenceMode: m }),
      addTrackerEntry: (e) => set((s) => ({ trackerEntries: [e, ...s.trackerEntries] })),
      addChangeEvent: (e) => set((s) => ({ changeEvents: [e, ...s.changeEvents] })),
      resetBaseline: () => set({ baselineMetrics: defaultMetrics() }),
    }),
    { name: 'autismcompass-v1' },
  ),
)
