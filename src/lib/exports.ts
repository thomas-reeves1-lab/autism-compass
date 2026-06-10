import type { TrackerEntry } from '../store/useAppStore'

/** Convert tracker entries to CSV and trigger a local download. No data leaves the device. */
export function downloadTrackerCsv(entries: TrackerEntry[]): void {
  const headers = [
    'date', 'sleepHours', 'sleepOnsetMinutes', 'loopingEpisodes', 'aggressionEpisodes',
    'selfInjuryEpisodes', 'skinPickingEpisodes', 'prnUsed', 'foodSeeking', 'bowelIssues',
    'sedation', 'painSigns', 'notes',
  ]
  const escape = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`
  const rows = entries.map((e) =>
    headers.map((h) => escape(e[h as keyof TrackerEntry] as string | number | boolean)).join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  downloadBlob(csv, 'autismcompass-tracker.csv', 'text/csv')
}

export function downloadBlob(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
