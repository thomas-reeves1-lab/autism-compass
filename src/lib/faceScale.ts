/** Maps a 0-10 metric score to an emoji face + colour (master prompt FACE SCALE). */

export interface FaceStep {
  emoji: string
  label: string
  /** Tailwind text colour class. */
  colour: string
  /** Tailwind background tint class. */
  bg: string
}

export function faceFor(score: number): FaceStep {
  const s = Math.max(0, Math.min(10, score))
  if (s <= 2) return { emoji: '🙂', label: 'calm', colour: 'text-safe', bg: 'bg-safe-soft' }
  if (s <= 4) return { emoji: '😐', label: 'okay', colour: 'text-caution', bg: 'bg-caution-soft' }
  if (s <= 6) return { emoji: '😟', label: 'worried', colour: 'text-doctor', bg: 'bg-doctor-soft' }
  if (s <= 8)
    return { emoji: '😣', label: 'frazzled', colour: 'text-danger', bg: 'bg-danger-soft' }
  return { emoji: '😠', label: 'unsafe', colour: 'text-danger', bg: 'bg-danger-soft' }
}

/** Direction-of-change face for the What Changed detector. */
export function changeFace(delta: number): { emoji: string; label: string } {
  if (delta <= -1) return { emoji: '🙂', label: 'improved' }
  if (delta >= 1) return { emoji: '😟', label: 'worse' }
  return { emoji: '😐', label: 'no clear change' }
}
