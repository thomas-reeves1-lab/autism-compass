import type { SVGProps } from 'react'

/**
 * Autism Compass custom icon set — a bespoke clinical line family.
 * Drop-in replacement for the lucide icons we used: same component names,
 * same { size, className } API. House style: 24px grid, 1.75 stroke, round
 * caps/joins, currentColor, a touch more geometric/medical than lucide.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
  strokeWidth?: number
}

function Svg({ size = 24, strokeWidth = 1.75, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const Compass = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="16 8 13.5 13.5 8 16 10.5 10.5" fill="currentColor" stroke="none" opacity="0.9" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const LayoutDashboard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="5" rx="1.5" />
    <rect x="13.5" y="11" width="7.5" height="10" rx="1.5" />
    <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
  </Svg>
)

export const Plane = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 15.5v-2l-8-5V4a1.4 1.4 0 0 0-2.8 0v4.5l-8 5v2l8-2.5V18l-2 1.5V21l3.4-1 3.4 1v-1.5L13 18v-5z" />
  </Svg>
)

export const HeartPulse = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 13.6c1.5-1.5 3-3.2 3-5.5A5 5 0 0 0 16.5 3c-1.7 0-3 .6-4.5 2-1.5-1.4-2.8-2-4.5-2A5 5 0 0 0 2 8.1c0 1.2.4 2.3 1 3.4" />
    <path d="M2.5 12.5H7l1.5-2.5 2.5 6 2.5-8 1.5 4h4.5" />
  </Svg>
)

export const Workflow = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="6.5" height="6.5" rx="1.5" />
    <rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" />
    <path d="M6.25 9.5v4a3 3 0 0 0 3 3h5.25" />
  </Svg>
)

export const History = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 9.5a9 9 0 1 1-.4 5" />
    <path d="M3 4v5.5h5.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
)

export const ClipboardList = (p: IconProps) => (
  <Svg {...p}>
    <rect x="8" y="2.5" width="8" height="4" rx="1.2" />
    <path d="M16 4.5h2A1.8 1.8 0 0 1 19.8 6.3V20A1.8 1.8 0 0 1 18 21.8H6A1.8 1.8 0 0 1 4.2 20V6.3A1.8 1.8 0 0 1 6 4.5h2" />
    <path d="M8.5 11h7M8.5 15h4.5" />
  </Svg>
)
export const ClipboardCheck = (p: IconProps) => (
  <Svg {...p}>
    <rect x="8" y="2.5" width="8" height="4" rx="1.2" />
    <path d="M16 4.5h2A1.8 1.8 0 0 1 19.8 6.3V20A1.8 1.8 0 0 1 18 21.8H6A1.8 1.8 0 0 1 4.2 20V6.3A1.8 1.8 0 0 1 6 4.5h2" />
    <path d="M9 14l2 2 4-4" />
  </Svg>
)

export const BookOpen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 7.5v13" />
    <path d="M3 5h5.5A3.5 3.5 0 0 1 12 8.5 3.5 3.5 0 0 1 15.5 5H21v13h-5.5a3.5 3.5 0 0 0-3.5 3 3.5 3.5 0 0 0-3.5-3H3z" />
  </Svg>
)

export const FileText = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 2.5H6.5A1.8 1.8 0 0 0 4.7 4.3v15.4A1.8 1.8 0 0 0 6.5 21.5h11a1.8 1.8 0 0 0 1.8-1.8V8z" />
    <path d="M14 2.5V8h5.3" />
    <path d="M8.5 13h7M8.5 17h7" />
  </Svg>
)

export const ShoppingBag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 2.5 3.5 6v13.5A1.8 1.8 0 0 0 5.3 21.5h13.4A1.8 1.8 0 0 0 20.5 19.5V6L18 2.5z" />
    <path d="M3.5 6h17" />
    <path d="M15.5 9.5a3.5 3.5 0 0 1-7 0" />
  </Svg>
)

export const Rocket = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 15l-3-3a20 20 0 0 1 2-3.8A12 12 0 0 1 21.5 2.5C21.5 5 20.8 9.4 16 12.6A20 20 0 0 1 12 15z" />
    <path d="M9 12H5s.5-2.8 1.8-3.7c1.5-1 4.2 0 4.2 0" />
    <path d="M12 15v4s2.8-.5 3.7-1.8c1-1.5 0-4.2 0-4.2" />
    <path d="M5 16.5c-1.3 1.1-1.7 4.5-1.7 4.5s3.4-.4 4.5-1.7a1.9 1.9 0 1 0-2.8-2.8z" />
  </Svg>
)

export const HandHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.5 11.2 12 12.7l1.5-1.5a1.4 1.4 0 0 0-2-2 .3.3 0 0 1-.5 0 1.4 1.4 0 0 0-2 2z" />
    <path d="M3 13.5 6 11l3 2.5" />
    <path d="M3 13.5V19a1.5 1.5 0 0 0 1.5 1.5H15l5.5-3.2a1.5 1.5 0 0 0-1.8-2.4L15 17" />
  </Svg>
)

const shieldPath = 'M12 21.5s7.5-3.8 7.5-9.4V5.3L12 2.5 4.5 5.3v6.8C4.5 17.7 12 21.5 12 21.5z'
export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d={shieldPath} />
    <path d="M9 11.8l2 2 4-4" />
  </Svg>
)
export const ShieldPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d={shieldPath} />
    <path d="M12 8v6M9 11h6" />
  </Svg>
)
export const ShieldAlert = (p: IconProps) => (
  <Svg {...p}>
    <path d={shieldPath} />
    <path d="M12 8v4" />
    <circle cx="12" cy="15.6" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

export const Megaphone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10v4h4l8 4.5V5.5L7 10H3z" />
    <path d="M17 9.5a3 3 0 0 1 0 5" />
  </Svg>
)

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Svg>
)
export const CheckCircle2 = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-5" />
  </Svg>
)

export const AlertTriangle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.3 4 2.7 17.5A2 2 0 0 0 4.4 20.5h15.2a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z" />
    <path d="M12 9.5v4" />
    <circle cx="12" cy="16.6" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 3.5h3l1.6 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.6V19a1.8 1.8 0 0 1-2 1.8A16.5 16.5 0 0 1 3.2 5.5 1.8 1.8 0 0 1 5 3.5z" />
  </Svg>
)

export const Printer = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 9V2.5h11V9" />
    <path d="M6.5 18H5a1.8 1.8 0 0 1-1.8-1.8v-3.4A1.8 1.8 0 0 1 5 11h14a1.8 1.8 0 0 1 1.8 1.8v3.4A1.8 1.8 0 0 1 19 18h-1.5" />
    <rect x="6.5" y="14.5" width="11" height="7" rx="1.2" />
  </Svg>
)

export const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.5" y="11" width="15" height="10" rx="2.2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
  </Svg>
)

export const Puzzle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3.2a2 2 0 0 1 4 0c0 .7-.2 1 .6 1H16a1 1 0 0 1 1 1v2.4c0 .8.3.6 1 .6a2 2 0 0 1 0 4c-.7 0-1-.2-1 .6V19a1 1 0 0 1-1 1h-2.4c-.8 0-.6.3-.6 1a2 2 0 0 1-4 0c0-.7.2-1-.6-1H6a1 1 0 0 1-1-1v-2.4c0-.8-.3-.6-1-.6a2 2 0 0 1 0-4c.7 0 1 .2 1-.6V6a1 1 0 0 1 1-1h2.4c.8 0 .6-.3.6-1z" />
  </Svg>
)

export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

export const Stethoscope = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 2.5v5a4.5 4.5 0 0 0 9 0v-5" />
    <path d="M9.5 16.5a4.5 4.5 0 0 0 9 0v-2.5" />
    <circle cx="18.5" cy="11" r="2.2" />
  </Svg>
)

export const Pill = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.5 20.4 3.6 13.5a5 5 0 0 1 7-7l6.9 6.9a5 5 0 0 1-7 7z" />
    <path d="M8.5 8.5l7 7" />
  </Svg>
)

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5v11.5" />
    <path d="M7.5 11l4.5 4 4.5-4" />
    <path d="M5 20.5h14" />
  </Svg>
)

export const Leaf = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11.5 20.5A7.5 7.5 0 0 1 4 13C4 6.7 11 4 20.5 4 20.5 13.5 17 20.5 11.5 20.5z" />
    <path d="M4 20.5c4-4.2 7.5-6.5 12.5-7.5" />
  </Svg>
)

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </Svg>
)

export const ChevronUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 14.5l-6-6-6 6" />
  </Svg>
)

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l1.7 4.6L18.3 9.3 13.7 11 12 15.6 10.3 11 5.7 9.3 10.3 7.6z" />
    <path d="M19 14.5l.7 1.9 1.9.6-1.9.7-.7 1.8-.7-1.8-1.8-.7 1.8-.6z" />
  </Svg>
)

export const TrendingUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 16.5l6-6 4 4 7-7" />
    <path d="M16.5 7.5h4v4" />
  </Svg>
)

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15.5" />
    <path d="M13.5 6l6 6-6 6" />
  </Svg>
)

export const Gift = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.2" y="8" width="17.6" height="4" rx="1.2" />
    <path d="M12 8v13" />
    <path d="M5 12v7.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V12" />
    <path d="M12 8S10.6 3.5 8 3.5a2 2 0 0 0 0 4M12 8s1.4-4.5 4-4.5a2 2 0 0 1 0 4" />
  </Svg>
)

export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Svg>
)

export const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
)
