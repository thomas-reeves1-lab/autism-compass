/**
 * AutismCompass face set — recreated from the brand emoji pack as crisp SVGs.
 * To use your exact PNG pack instead, drop files in public/brand/emojis/<id>.png
 * and flip USE_PNG to true.
 */
export type FaceId =
  | 'sad' | 'stressed' | 'panicked' | 'angry'
  | 'calm' | 'neutral' | 'happy' | 'superhappy'
  | 'sleep' | 'awake' | 'superawake'

const USE_PNG = false

const PALETTE: Record<FaceId, { skin: string; cheek?: string }> = {
  sad: { skin: '#7fa8e0', cheek: '#a7c4ee' },
  stressed: { skin: '#f0a35a', cheek: '#f6c08a' },
  panicked: { skin: '#f08a4b', cheek: '#f6b58a' },
  angry: { skin: '#e8654e', cheek: '#f08a78' },
  calm: { skin: '#9fd6cf', cheek: '#bfe6e0' },
  neutral: { skin: '#d6dadf', cheek: '#e6e9ec' },
  happy: { skin: '#f6c560', cheek: '#f7d98f' },
  superhappy: { skin: '#f7c84e', cheek: '#f7da86' },
  sleep: { skin: '#6f8fd8', cheek: '#9fb6e8' },
  awake: { skin: '#e3e0d6', cheek: '#eeece4' },
  superawake: { skin: '#f7c84e', cheek: '#f7da86' },
}

export function FaceEmoji({ id, size = 40, className = '' }: { id: FaceId; size?: number; className?: string }) {
  if (USE_PNG) {
    return <img src={`${import.meta.env.BASE_URL}brand/emojis/${id}.png`} width={size} height={size} alt={id} className={className} />
  }
  const p = PALETTE[id]
  const cx = 50
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} role="img" aria-label={id}>
      <defs>
        <radialGradient id={`f-${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="35%" stopColor={p.skin} />
          <stop offset="100%" stopColor={p.skin} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy="50" r="44" fill={`url(#f-${id})`} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      {p.cheek && id !== 'neutral' && id !== 'angry' && (
        <g fill={p.cheek} opacity="0.7">
          <ellipse cx="30" cy="60" rx="7" ry="4" />
          <ellipse cx="70" cy="60" rx="7" ry="4" />
        </g>
      )}
      <Features id={id} />
    </svg>
  )
}

function Features({ id }: { id: FaceId }) {
  const eye = '#33404d'
  switch (id) {
    case 'sad':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="46" r="4" /><circle cx="64" cy="46" r="4" />
          <path d="M36 70 Q50 60 64 70" fill="none" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case 'stressed':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="46" r="4" /><circle cx="64" cy="46" r="4" />
          <path d="M34 70 q4 -5 8 0 q4 5 8 0 q4 -5 8 0" fill="none" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M76 30 q6 8 0 14 q-6 -6 0 -14z" fill="#7fc4ff" stroke="none" />
        </g>
      )
    case 'panicked':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="45" r="7" fill="#fff" /><circle cx="36" cy="45" r="3.5" />
          <circle cx="64" cy="45" r="7" fill="#fff" /><circle cx="64" cy="45" r="3.5" />
          <ellipse cx="50" cy="71" rx="8" ry="10" fill="#33404d" stroke="none" />
        </g>
      )
    case 'angry':
      return (
        <g fill={eye} stroke={eye}>
          <path d="M28 40 L44 46" strokeWidth="4" strokeLinecap="round" />
          <path d="M72 40 L56 46" strokeWidth="4" strokeLinecap="round" />
          <circle cx="36" cy="50" r="4" /><circle cx="64" cy="50" r="4" />
          <path d="M36 72 Q50 64 64 72" fill="none" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case 'calm':
      return (
        <g fill="none" stroke={eye} strokeWidth="3.5" strokeLinecap="round">
          <path d="M30 48 Q36 53 42 48" /><path d="M58 48 Q64 53 70 48" />
          <path d="M38 66 Q50 73 62 66" />
        </g>
      )
    case 'neutral':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="47" r="4" /><circle cx="64" cy="47" r="4" />
          <path d="M36 67 L64 67" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case 'happy':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="46" r="4" /><circle cx="64" cy="46" r="4" />
          <path d="M34 64 Q50 76 66 64" fill="none" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case 'superhappy':
      return (
        <g fill={eye} stroke={eye}>
          <path d="M30 46 Q36 40 42 46" fill="none" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M58 46 Q64 40 70 46" fill="none" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M30 60 Q50 82 70 60 Z" fill="#33404d" stroke="none" />
          <path d="M36 62 Q50 70 64 62" fill="#e8654e" stroke="none" />
        </g>
      )
    case 'sleep':
      return (
        <g fill="none" stroke={eye} strokeWidth="3.5" strokeLinecap="round">
          <path d="M30 48 Q36 53 42 48" /><path d="M58 48 Q64 53 70 48" />
          <path d="M40 66 Q50 70 60 66" />
          <text x="64" y="34" fontSize="16" fill="#6f8fd8" stroke="none" fontWeight="700">z</text>
          <text x="74" y="24" fontSize="12" fill="#6f8fd8" stroke="none" fontWeight="700">z</text>
        </g>
      )
    case 'awake':
      return (
        <g fill={eye} stroke={eye}>
          <circle cx="36" cy="46" r="4.5" /><circle cx="64" cy="46" r="4.5" />
          <path d="M40 66 Q50 71 60 66" fill="none" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )
    case 'superawake':
      return (
        <g fill={eye} stroke={eye}>
          <Star cx={36} cy={46} /><Star cx={64} cy={46} />
          <path d="M38 64 Q50 73 62 64" fill="none" strokeWidth="3.5" strokeLinecap="round" />
          <g stroke="#f0a83a" strokeWidth="3" strokeLinecap="round">
            <path d="M20 24 L26 30" /><path d="M80 24 L74 30" /><path d="M50 14 L50 22" />
          </g>
        </g>
      )
  }
}

function Star({ cx, cy }: { cx: number; cy: number }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 7 : 3
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return <polygon points={pts.join(' ')} fill="#f0a83a" stroke="none" />
}
