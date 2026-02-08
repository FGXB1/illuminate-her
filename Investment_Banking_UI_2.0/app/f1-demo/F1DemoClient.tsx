'use client'

import { useEffect, useMemo, useState } from 'react'
import { Space_Grotesk, Sora } from 'next/font/google'
import CarScene, { Hotspot } from '@/components/f1/CarScene'
import TelemetryPanel from '@/components/f1/TelemetryPanel'
import TrackMap from '@/components/f1/TrackMap'
import RaceTimeline from '@/components/f1/RaceTimeline'
import PitStopPanel from '@/components/f1/PitStopPanel'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

const steps = ['Start', 'Lap 1', 'Lap 2', 'Pit Stop', 'Lap 3', 'Finish']
const pitIndex = steps.indexOf('Pit Stop')

const baseStats = {
  speed: 72,
  control: 68,
  tireWear: 60,
  engineHealth: 70,
  lapTime: 92.4,
}

type UpgradeOption = {
  id: string
  label: string
  description: string
  deltas: Partial<typeof baseStats>
  lapTimeDelta: number
}

type UpgradeCategory = {
  id: string
  label: string
  options: UpgradeOption[]
}

const upgradeCategories: UpgradeCategory[] = [
  {
    id: 'tires',
    label: 'Tires',
    options: [
      { id: 'grip-tires', label: 'Grip Tires', description: 'More control and reduced wear, ideal for clean lines.', deltas: { control: 10, tireWear: 6 }, lapTimeDelta: -1.2 },
      { id: 'speed-tires', label: 'Speed Tires', description: 'Higher top speed, but easier to lose control.', deltas: { speed: 10, control: -4, tireWear: -6 }, lapTimeDelta: -1.4 },
      { id: 'endurance-tires', label: 'Endurance Tires', description: 'Balanced grip and stability for long stints.', deltas: { control: 6, tireWear: 10 }, lapTimeDelta: -0.6 },
    ],
  },
  {
    id: 'frame',
    label: 'Frame and Aero',
    options: [
      { id: 'downforce-kit', label: 'Downforce Kit', description: 'Sharper cornering, slight drag on straights.', deltas: { control: 8, speed: -3 }, lapTimeDelta: -0.8 },
      { id: 'lightweight-frame', label: 'Lightweight Frame', description: 'Boost acceleration and control with lighter mass.', deltas: { speed: 6, control: 4 }, lapTimeDelta: -1.0 },
    ],
  },
  {
    id: 'engine',
    label: 'Fuel and Engine',
    options: [
      { id: 'reliability-tune', label: 'Reliability Tune', description: 'Smoother engine temps, keeps performance stable.', deltas: { engineHealth: 12, speed: -2 }, lapTimeDelta: -0.4 },
      { id: 'boost-mode', label: 'Boost Mode', description: 'Short burst of speed, risk on engine health.', deltas: { speed: 10, engineHealth: -6 }, lapTimeDelta: -1.6 },
      { id: 'fuel-efficiency', label: 'Fuel Efficiency', description: 'Longer run time with steady pace.', deltas: { engineHealth: 8, control: 2 }, lapTimeDelta: -0.5 },
    ],
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const hotspots: Hotspot[] = [
  { id: 'tires', label: 'Tires', category: 'tires', position: [1.8, -0.3, 1.6] },
  { id: 'front', label: 'Front', category: 'frame', position: [2.2, 0.2, 0.2] },
  { id: 'engine', label: 'Engine', category: 'engine', position: [-0.4, 0.4, -1.4] },
  { id: 'aero', label: 'Aero', category: 'frame', position: [-1.6, 0.6, -2.2] },
]

export default function F1DemoClient() {
  const [view, setView] = useState<'race' | 'pit' | 'result'>('race')
  const [currentStep, setCurrentStep] = useState(1)
  const [activeCategory, setActiveCategory] = useState('tires')
  const [activeHotspot, setActiveHotspot] = useState<string | undefined>()
  const [selectedUpgrades, setSelectedUpgrades] = useState<Record<string, string | null>>({
    tires: null,
    frame: null,
    engine: null,
  })

  useEffect(() => {
    if (view !== 'race') return
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) return prev
        const next = prev + 1
        if (next === pitIndex) {
          setView('pit')
          return next
        }
        if (next >= steps.length - 1) {
          setView('result')
          return steps.length - 1
        }
        return next
      })
    }, 4200)
    return () => clearInterval(interval)
  }, [view])

  useEffect(() => {
    if (view !== 'race') return
    if (currentStep === pitIndex) setView('pit')
    if (currentStep >= steps.length - 1) setView('result')
  }, [currentStep, view])

  useEffect(() => {
    if (view !== 'pit' || activeHotspot) return
    const spot = hotspots.find((s) => s.category === activeCategory)
    setActiveHotspot(spot?.id)
  }, [activeCategory, activeHotspot, view])

  const focusPoint = useMemo(() => {
    const spot = hotspots.find((s) => s.id === activeHotspot)
    return spot ? spot.position : null
  }, [activeHotspot])

  const derivedStats = useMemo(() => {
    let stats = { ...baseStats }
    let lapTime = baseStats.lapTime
    upgradeCategories.forEach((category) => {
      const optionId = selectedUpgrades[category.id]
      if (!optionId) return
      const option = category.options.find((opt) => opt.id === optionId)
      if (!option) return
      Object.entries(option.deltas).forEach(([key, value]) => {
        stats = { ...stats, [key]: (stats as Record<string, number>)[key] + (value ?? 0) }
      })
      lapTime += option.lapTimeDelta
    })
    return {
      speed: clamp(stats.speed, 0, 100),
      control: clamp(stats.control, 0, 100),
      tireWear: clamp(stats.tireWear, 0, 100),
      engineHealth: clamp(stats.engineHealth, 0, 100),
      lapTime: clamp(lapTime, 78, 110),
    }
  }, [selectedUpgrades])

  const hasSelectedUpgrade = Object.values(selectedUpgrades).some(Boolean)
  const progress = currentStep / (steps.length - 1)

  return (
    <main
      className={cn(
        'min-h-screen bg-[radial-gradient(circle_at_top,#2a0f1f,transparent_55%),radial-gradient(circle_at_bottom,#07202a,transparent_50%),linear-gradient(135deg,#0b0a12,#140b1a_45%,#071a22)] text-white',
        spaceGrotesk.variable,
        sora.variable
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-rose-200/70">F1 Pit Stop Decision Lab</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl" style={{ fontFamily: 'var(--font-space)' }}>
                Curiosity Driven Performance
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70" style={{ fontFamily: 'var(--font-sora)' }}>
                Make quick pit stop calls, balance speed with control, and see how your decisions shift the race.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Mode: {view === 'race' ? 'Race View' : view === 'pit' ? 'Pit Stop' : 'Results'}
            </div>
          </div>
        </header>

        <RaceTimeline steps={steps} currentIndex={currentStep} />

        <section className="grid gap-6 lg:grid-cols-[1fr_2.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <TrackMap progress={progress} />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">Mission</p>
              <p className="mt-3 text-base text-white">
                Blend mechanical insight with intuition, each choice shapes the lap story.
              </p>
              <div className="mt-4 space-y-2 text-xs text-white/60">
                <p>Auto progress pauses at pit stop.</p>
                <p>Pick upgrades, then continue the race.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff1a,transparent_60%)]" />
            <div className="relative z-10 flex h-[420px] flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Car Lab</p>
                  <h2 className="mt-2 text-lg font-semibold">RX-7 Decision Rig</h2>
                </div>
                {view === 'race' && currentStep < pitIndex && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">Auto scouting</span>
                )}
                {view === 'pit' && (
                  <span className="rounded-full border border-rose-200/40 bg-rose-400/15 px-3 py-1 text-xs text-rose-100">360 inspection active</span>
                )}
              </div>
              <div className="mt-4 flex-1">
                <CarScene
                  modelUrl="/models/rx7/FINAL_MODEL_RMAGIC.fbx"
                  mode={view === 'pit' ? 'pit' : 'race'}
                  hotspots={view === 'pit' ? hotspots : []}
                  activeHotspot={activeHotspot}
                  focusPoint={focusPoint}
                  onHotspotClick={(hotspot) => {
                    setActiveHotspot(hotspot.id)
                    setActiveCategory(hotspot.category)
                  }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                <span>{view === 'pit' ? 'Tap hotspots to tune upgrades.' : 'Race view has subtle auto rotation.'}</span>
                <span className="uppercase tracking-[0.3em]">Lap {currentStep}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <TelemetryPanel
              stats={{
                speed: derivedStats.speed,
                control: derivedStats.control,
                tireWear: derivedStats.tireWear,
                engineHealth: derivedStats.engineHealth,
              }}
              lapTime={derivedStats.lapTime}
            />
            {view === 'pit' && (
              <PitStopPanel
                categories={upgradeCategories.map((category) => ({
                  id: category.id,
                  label: category.label,
                  options: category.options.map((option) => ({ id: option.id, label: option.label, description: option.description })),
                }))}
                activeCategory={activeCategory}
                selected={selectedUpgrades}
                onSelect={(categoryId, optionId) => {
                  setSelectedUpgrades((prev) => ({ ...prev, [categoryId]: optionId }))
                  setActiveCategory(categoryId)
                  const spot = hotspots.find((s) => s.category === categoryId)
                  setActiveHotspot(spot?.id)
                }}
                onContinue={() => {
                  if (!hasSelectedUpgrade) return
                  setView('race')
                  setCurrentStep((prev) => Math.max(prev, pitIndex + 1))
                }}
                canContinue={hasSelectedUpgrade}
              />
            )}
          </div>
        </section>

        {view === 'result' && (
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/20 via-black/60 to-black/80 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-rose-200/70">Race Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">You finished with confidence</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  Your upgrades shaped a calmer, faster run, and every choice showed a deep feel for the car.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Final Lap Time</p>
                <p className="mt-2 text-4xl font-semibold text-rose-100">{derivedStats.lapTime.toFixed(2)}s</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: 'Speed', value: derivedStats.speed },
                { label: 'Control', value: derivedStats.control },
                { label: 'Tire Wear', value: derivedStats.tireWear },
                { label: 'Engine Health', value: derivedStats.engineHealth },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{Math.round(stat.value)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
