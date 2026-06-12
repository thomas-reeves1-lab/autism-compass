import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, LayoutDashboard, Plane, HeartPulse, Workflow, History,
  ClipboardList, BookOpen, FileText, ShoppingBag, Rocket, HandHeart, X,
} from './components/icons'
import { TopWarningBanner, EmergencyWarning, SiteFooter } from './components/SafetyShell'
import { ConsentBanner } from './components/ConsentBanner'
import { Disclaimer, AnimatedNumber } from './components/ui'
import { LeadCapture } from './features/growth/LeadCapture'
import { TrustSection } from './features/growth/TrustSection'
import type { LegalDoc } from './features/legal/Legal'
// Dashboard core — eager (this is the landing view)
import { BaselineEditor, DoseSliders, EvidenceModeToggle } from './features/calculator/Controls'
import { KpiGrid } from './features/calculator/KpiGrid'
import { ScoreRings } from './features/calculator/ScoreRings'
import { NacFeature } from './features/calculator/NacFeature'
import { AddOns } from './features/calculator/AddOns'
// Heavy / other tabs — lazy-loaded as separate chunks
const ChartsGrid = lazy(() => import('./features/calculator/Charts').then((m) => ({ default: m.ChartsGrid })))
const EvidenceTable = lazy(() => import('./features/calculator/EvidenceTable').then((m) => ({ default: m.EvidenceTable })))
const StudyLibrary = lazy(() => import('./features/calculator/StudyLibrary').then((m) => ({ default: m.StudyLibrary })))
const StackChecker = lazy(() => import('./features/stackChecker/StackChecker').then((m) => ({ default: m.StackChecker })))
const MedicationSafety = lazy(() => import('./features/safety/MedicationSafety').then((m) => ({ default: m.MedicationSafety })))
const LoopMap = lazy(() => import('./features/loopMap/LoopMap').then((m) => ({ default: m.LoopMap })))
const WhatChanged = lazy(() => import('./features/whatChanged/WhatChanged').then((m) => ({ default: m.WhatChanged })))
const Tracker = lazy(() => import('./features/tracker/Tracker').then((m) => ({ default: m.Tracker })))
const DoctorPack = lazy(() => import('./features/doctorPack/DoctorPack').then((m) => ({ default: m.DoctorPack })))
const StorePreview = lazy(() => import('./features/store/StorePreview').then((m) => ({ default: m.StorePreview })))
const GrowthPreview = lazy(() => import('./features/growth/GrowthPreview').then((m) => ({ default: m.GrowthPreview })))
const Supports = lazy(() => import('./features/supports/Supports').then((m) => ({ default: m.Supports })))
const FreeGuide = lazy(() => import('./features/growth/FreeGuide').then((m) => ({ default: m.FreeGuide })))
const Legal = lazy(() => import('./features/legal/Legal').then((m) => ({ default: m.Legal })))

function TabFallback() {
  return (
    <div className="space-y-4 p-2">
      {/* Skeleton rows — gives a sense of content shape while loading */}
      <div className="glass overflow-hidden rounded-2xl p-5">
        <div className="mb-3 h-4 w-1/3 animate-pulse rounded-md bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse rounded-xl bg-slate-100" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
      <div className="glass h-40 animate-pulse rounded-2xl bg-slate-50/80" />
      <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-300">
        <span className="h-2 w-2 animate-ping rounded-full bg-brand-leaf opacity-60" /> Loading content
      </div>
    </div>
  )
}

type TabId =
  | 'dashboard' | 'stack' | 'supports' | 'safety' | 'loop' | 'changed'
  | 'tracker' | 'evidence' | 'doctor' | 'store' | 'plans'

const TABS: { id: TabId; label: string; icon: typeof Compass }[] = [
  { id: 'dashboard', label: 'Calculator', icon: LayoutDashboard },
  { id: 'supports', label: 'Supports', icon: HandHeart },
  { id: 'stack', label: 'Safe Stack', icon: Plane },
  { id: 'safety', label: 'Med Safety', icon: HeartPulse },
  { id: 'loop', label: 'Loop Map', icon: Workflow },
  { id: 'changed', label: 'What Changed', icon: History },
  { id: 'tracker', label: 'Tracker', icon: ClipboardList },
  { id: 'evidence', label: 'Evidence', icon: BookOpen },
  { id: 'doctor', label: 'Doctor Pack', icon: FileText },
  { id: 'store', label: 'Store', icon: ShoppingBag },
  { id: 'plans', label: 'Plans', icon: Rocket },
]

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const [overlay, setOverlay] = useState<null | 'guide' | LegalDoc>(null)

  return (
    <div className="min-h-screen">
      <TopWarningBanner />

      <header
        className="border-b backdrop-blur-xl"
        style={{
          background: 'rgba(255,255,255,0.88)',
          borderColor: 'rgba(7,26,54,0.1)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6), 0 2px 8px -4px rgba(7,26,54,0.08)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-2.5">
          <motion.img
            src={`${import.meta.env.BASE_URL}brand/autism-compass-mark.svg`}
            alt="Autism Compass"
            initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="h-9 w-9 sm:h-10 sm:w-10"
          />
          <span
            className="font-display text-base font-black tracking-tight sm:text-lg"
            style={{
              background: 'linear-gradient(110deg, #0E5196 10%, #2c7be5 55%, #7bc043 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Autism Compass
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 22 }}
            className="ml-2 hidden items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] sm:inline-flex"
            style={{
              background: 'rgba(14,81,150,0.07)',
              border: '1px solid rgba(14,81,150,0.14)',
              color: '#0E5196',
            }}
          >
            Education only
          </motion.span>
          <div className="ml-auto hidden items-center gap-1 sm:flex">
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white"
              style={{ background: 'linear-gradient(90deg, #0E5196, #1d4ed8)' }}
            >
              Free
            </span>
          </div>
        </div>
      </header>

      <nav
        className="sticky top-0 z-40 border-b border-white/20"
        style={{ background: 'rgba(7,26,54,0.82)', backdropFilter: 'blur(16px) saturate(1.5)' }}
      >
        <div className="mx-auto flex max-w-6xl gap-0.5 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                className={`group relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-white/45 hover:bg-white/8 hover:text-white/80'
                }`}
                style={
                  active
                    ? {
                        background: 'rgba(14,81,150,0.55)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 1px rgba(44,123,229,0.35), 0 4px 20px -6px rgba(44,123,229,0.6)',
                      }
                    : undefined
                }
              >
                <Icon size={15} className={active ? 'text-brand-leaf' : 'opacity-60'} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-[6px] h-[2.5px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7bc043, #2c7be5)' }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 overflow-hidden rounded-3xl p-6 shine sm:p-8"
            style={{
              background: 'linear-gradient(135deg, #071a36 0%, #0b2347 45%, #08305c 100%)',
              boxShadow: '0 24px 60px -28px rgba(6,32,63,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* aurora glow accents */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(40% 60% at 88% 8%, rgba(44,123,229,0.45), transparent 60%), radial-gradient(34% 50% at 8% 95%, rgba(123,192,67,0.35), transparent 60%)',
              }}
            />
            <div className="relative">
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-leaf" /> <AnimatedNumber value={40} duration={900} className="tabular-nums" /> studied options · evidence-labelled
              </motion.span>
              <h1 className="font-display text-[1.7rem] font-black leading-[1.05] tracking-tight sm:text-5xl">
                <span className="text-gradient-bright">ASD Clinical Metrics</span>
                <br />
                <span className="text-white">&amp; Guidance Tool</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/90 sm:text-base">
                See what published studies found about common ASD behaviour and supplement pathways.
                Adjust an option to see the estimated effect, then walk into the appointment prepared.{' '}
                <span className="font-bold text-white">This is not medical advice.</span>
              </p>

              {/* Credibility trust strip */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { text: 'Registered NDIS provider' },
                  { text: 'Reviewed by a Registered Nurse' },
                  { text: '200+ peer-reviewed studies' },
                  { text: 'Data stays on your device' },
                ].map((b, i) => (
                  <motion.span
                    key={b.text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2, scale: 1.04, background: 'rgba(255,255,255,0.14)' }}
                    transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                    className="inline-flex cursor-default items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white/80 sm:text-xs"
                    style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-leaf opacity-90" />
                    {b.text}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <EmergencyWarning />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            {tab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <EvidenceModeToggle />
                </div>
                <ScoreRings />
                <DoseSliders />
                <BaselineEditor />
                <KpiGrid />
                <Suspense fallback={<TabFallback />}>
                  <ChartsGrid />
                </Suspense>
                <NacFeature />
                <AddOns />
                <TrustSection />
                <LeadCapture source="dashboard" onOpenGuide={() => setOverlay('guide')} />
                <Disclaimer />
              </div>
            )}
            <Suspense fallback={<TabFallback />}>
              {tab === 'supports' && <Supports />}
              {tab === 'stack' && <StackChecker />}
              {tab === 'safety' && <MedicationSafety />}
              {tab === 'loop' && <LoopMap />}
              {tab === 'changed' && <WhatChanged />}
              {tab === 'tracker' && <Tracker />}
              {tab === 'evidence' && (
                <div className="space-y-6">
                  <EvidenceTable />
                  <StudyLibrary />
                </div>
              )}
              {tab === 'doctor' && <DoctorPack />}
              {tab === 'store' && <StorePreview />}
              {tab === 'plans' && <GrowthPreview />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter onOpen={(d) => setOverlay(d)} />

      <ConsentBanner />

      <AnimatePresence>
        {overlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setOverlay(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="mx-auto my-6 max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex justify-end">
                <motion.button
                  onClick={() => setOverlay(null)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X size={14} /> Close
                </motion.button>
              </div>
              <Suspense fallback={<TabFallback />}>
                {overlay === 'guide' ? <FreeGuide /> : <Legal doc={overlay} />}
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
