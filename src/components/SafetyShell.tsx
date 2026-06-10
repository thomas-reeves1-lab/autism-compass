import { AlertTriangle, Phone, ShieldAlert } from 'lucide-react'

/** Impossible-to-miss top warning banner (master prompt). On every page. */
export function TopWarningBanner() {
  return (
    <div className="border-b-2 border-doctor/30 bg-doctor-soft">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3">
        <ShieldAlert className="mt-0.5 shrink-0 text-doctor" size={22} />
        <div className="text-sm text-doctor">
          <p className="font-extrabold">This is not medical advice.</p>
          <p>
            This tool does not tell you what to take or what dose to use. It is only a visual
            summary of published study findings.{' '}
            <span className="font-bold">Always speak to the treating doctor before changing anything.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/** Emergency warning strip — shown prominently near the top of the app. */
export function EmergencyWarning() {
  return (
    <div className="rounded-2xl border-2 border-danger/40 bg-danger-soft p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-danger" size={22} />
        <div className="text-sm text-danger">
          <p className="font-extrabold">If there is immediate danger, get urgent medical help now.</p>
          <p className="mt-1">
            Serious aggression, self-injury, seizure, breathing trouble, overdose concern, allergic
            reaction, sudden severe behaviour change, collapse, high fever with stiff muscles, or
            chest pain — call emergency services or go to hospital.
          </p>
          <p className="mt-1 inline-flex items-center gap-1 font-bold">
            <Phone size={14} /> In Australia, call 000.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Footer on every page. */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-600">
          Education only. Not medical advice. Not a diagnosis tool. Not a dosing tool.
        </p>
        <p className="mt-1">
          Do not change medication without the prescriber. For urgent risk, seek urgent medical help.
        </p>
        <p className="mt-2 text-slate-400">
          Names have been changed for privacy. A registered provider evidence project.
        </p>
      </div>
    </footer>
  )
}
