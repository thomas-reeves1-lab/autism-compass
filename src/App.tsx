import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, LayoutDashboard, Plane, HeartPulse, Workflow, History,
  ClipboardList, BookOpen, FileText, ShoppingBag, Rocket,
} from 'lucide-react'
import { TopWarningBanner, EmergencyWarning, SiteFooter } from './components/SafetyShell'
import { Disclaimer } from './components/ui'
import { BaselineEditor, DoseSliders, EvidenceModeToggle } from './features/calculator/Controls'
import { KpiGrid } from './features/calculator/KpiGrid'
import { BehaviourChart, StackChart, BenefitHarmChart, EvidenceConfidenceChart } from './features/calculator/Charts'
import { AddOns } from './features/calculator/AddOns'
import { EvidenceTable } from './features/calculator/EvidenceTable'
import { StudyLibrary } from './features/calculator/StudyLibrary'
import { StackChecker } from './features/stackChecker/StackChecker'
import { MedicationSafety } from './features/safety/MedicationSafety'
import { LoopMap } from './features/loopMap/LoopMap'
import { WhatChanged } from './features/whatChanged/WhatChanged'
import { Tracker } from './features/tracker/Tracker'
import { DoctorPack } from './features/doctorPack/DoctorPack'
import { StorePreview } from './features/store/StorePreview'
import { GrowthPreview } from './features/growth/GrowthPreview'

type TabId =
  | 'dashboard' | 'stack' | 'safety' | 'loop' | 'changed'
  | 'tracker' | 'evidence' | 'doctor' | 'store' | 'plans'

const TABS: { id: TabId; label: string; icon: typeof Compass }[] = [
  { id: 'dashboard', label: 'Calculator', icon: LayoutDashboard },
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

  return (
    <div className="min-h-screen">
      <TopWarningBanner />

      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-white">
            <Compass size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-brand-deep">AutismCompass</h1>
            <p className="text-xs text-slate-500">ASD Behaviour Evidence Calculator · education only</p>
          </div>
          <img src="/brand/iel-logo.png" alt="Integrity Empowered Living" className="ml-auto hidden h-9 sm:block" />
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-white/60 bg-brand-sky/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                  active ? 'bg-brand-navy text-white shadow-card' : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-2xl font-extrabold text-brand-deep sm:text-3xl">
              A calm, family-friendly way to understand studied options
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              See what published studies found about common ASD behaviour pathways. Track changes.
              Prepare for the doctor. <span className="font-bold">This is not medical advice.</span>
            </p>
          </motion.div>
        )}

        <div className="mb-6">
          <EmergencyWarning />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <EvidenceModeToggle />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <BaselineEditor />
                  <DoseSliders />
                </div>
                <KpiGrid />
                <div className="grid gap-6 lg:grid-cols-2">
                  <BehaviourChart />
                  <StackChart />
                  <BenefitHarmChart />
                  <EvidenceConfidenceChart />
                </div>
                <AddOns />
                <Disclaimer />
              </div>
            )}
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
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  )
}
