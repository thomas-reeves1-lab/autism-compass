import { useEffect, useState } from 'react'
import { ethics } from '../ethics'

/**
 * Persuasion primitives. Each reads the ethics rail and renders NOTHING unless its
 * HONEST flag is on. Dark-pattern variants are off by default and must be enabled
 * deliberately. They never apply to clinical-safety content.
 */

/** Countdown — only renders for a genuine, real deadline (ethics.honestUrgency). */
export function HonestCountdown({ deadlineIso, label }: { deadlineIso: string; label: string }) {
  const [left, setLeft] = useState('')
  useEffect(() => {
    if (!ethics.honestUrgency) return
    const tick = () => {
      const ms = new Date(deadlineIso).getTime() - Date.now()
      if (ms <= 0) return setLeft('ended')
      const h = Math.floor(ms / 3.6e6)
      const m = Math.floor((ms % 3.6e6) / 6e4)
      setLeft(`${h}h ${m}m`)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [deadlineIso])

  // Honest-urgency gate. Fake countdowns are never shown.
  if (!ethics.honestUrgency || ethics.fakeCountdowns) return null
  return (
    <span className="pill bg-caution-soft text-caution">
      {label}: {left}
    </span>
  )
}

/** Stock counter — only renders when stock is genuinely limited (ethics.honestStock). */
export function HonestStock({ remaining }: { remaining: number }) {
  if (!ethics.honestStock || ethics.fakeScarcity) return null
  return <span className="pill bg-info-soft text-info">{remaining} genuinely left</span>
}

/** Exit-intent — OFF by default. Never used on safety content. */
export function ExitIntent({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!ethics.exitIntent) return
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) setShow(true)
    }
    document.addEventListener('mouseout', handler)
    return () => document.removeEventListener('mouseout', handler)
  }, [])
  if (!ethics.exitIntent || !show) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">{children}</div>
}
