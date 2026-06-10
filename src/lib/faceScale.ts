import type { FaceId } from '../components/FaceEmoji'

/** Maps a 0-10 metric score to a face id + colour (AutismCompass emoji pack). */
export interface FaceStep {
  id: FaceId
  label: string
  /** Tailwind text colour class. */
  colour: string
  /** Tailwind background tint class. */
  bg: string
}

/** Distress scale: 0 = calm/good, 10 = severe/unsafe. */
export function faceFor(score: number): FaceStep {
  const s = Math.max(0, Math.min(10, score))
  if (s <= 1) return { id: 'superhappy', label: 'great', colour: 'text-safe', bg: 'bg-safe-soft' }
  if (s <= 3) return { id: 'happy', label: 'good', colour: 'text-safe', bg: 'bg-safe-soft' }
  if (s <= 4) return { id: 'neutral', label: 'okay', colour: 'text-caution', bg: 'bg-caution-soft' }
  if (s <= 6) return { id: 'stressed', label: 'stressed', colour: 'text-doctor', bg: 'bg-doctor-soft' }
  if (s <= 8) return { id: 'panicked', label: 'frazzled', colour: 'text-danger', bg: 'bg-danger-soft' }
  return { id: 'angry', label: 'unsafe', colour: 'text-danger', bg: 'bg-danger-soft' }
}

/** Alertness scale for sedation: higher score = sleepier. */
export function alertnessFace(score: number): FaceStep {
  const s = Math.max(0, Math.min(10, score))
  if (s <= 3) return { id: 'superawake', label: 'bright', colour: 'text-safe', bg: 'bg-safe-soft' }
  if (s <= 6) return { id: 'awake', label: 'awake', colour: 'text-caution', bg: 'bg-caution-soft' }
  return { id: 'sleep', label: 'sleepy', colour: 'text-doctor', bg: 'bg-doctor-soft' }
}

/** Direction-of-change face id for the What Changed detector. */
export function changeFace(delta: number): { id: FaceId; label: string } {
  if (delta <= -1) return { id: 'happy', label: 'improved' }
  if (delta >= 1) return { id: 'stressed', label: 'worse' }
  return { id: 'neutral', label: 'no clear change' }
}
