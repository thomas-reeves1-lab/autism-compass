import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, LayoutDashboard, Plane, HeartPulse, Workflow, History,
  ClipboardList, BookOpen, FileText, ShoppingBag, Rocket, HandHeart,
} from './components/icons'
import { TopWarningBanner, EmergencyWarning, SiteFooter } from './components/SafetyShell'
import { Disclaimer } from './components/ui'
import { BaselineEditor, DoseSliders, EvidenceModeToggle } from './features/calculator/Controls'
import { KpiGrid } from './features/calculator/KpiGrid'
import { ScoreRings } from './features/calculator/ScoreRings'
import { NacFeature } from './features/calculator/NacFeature'
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
import { Supports } from './features/supports/Supports'

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

  return (
    <div className="min-h-screen">
      <TopWarningBanner />

      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <motion.img
            src={`${import.meta.env.BASE_URL}brand/autism-compass-mark.svg`}
            alt="Autism Compass"
            initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="h-12 w-12"
          />
          <div className="leading-none">
            <h1 className="font-display text-[1.4rem] leading-none">
              <span className="font-medium tracking-[0.22em] text-brand-navy">AUTISM</span>
              <span className="font-black tracking-tight text-brand-deep">&nbsp;COMPASS</span>
            </h1>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Clinical metrics &amp; guidance tool
            </p>
          </div>
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
                aria-current={active ? 'page' : undefined}
                className={`group relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-navy text-white'
                    : 'text-slate-500 hover:bg-white hover:text-brand-navy'
                }`}
                style={
                  active
                    ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 16px -8px rgba(14,81,150,0.7)' }
                    : undefined
                }
              >
                <Icon size={16} className={active ? 'text-brand-leaf' : ''} /> {t.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-[6px] h-[3px] rounded-full bg-brand-leaf"
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pill mb-3 inline-flex bg-white/80 text-brand-navy glow-ring"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-leaf" /> 40 studied options · evidence-labelled
            </motion.span>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              <span className="text-gradient-bright">Understand the evidence.</span>
              <br />
              <span className="text-white">Walk in prepared.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              See what published studies found about common ASD behaviour and supplement pathways.
              Track changes. Prepare for the doctor.{' '}
              <span className="font-bold text-white">This is not medical advice.</span>
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
                <ScoreRings />
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
                <NacFeature />
                <AddOns />
                <Disclaimer />
              </div>
            )}
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
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  )
}
