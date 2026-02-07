"use client";

import { CarStats, GameState } from "../lib/types";
import { Gauge, Fuel, Activity, Disc, Flag, Zap, Map as MapIcon, Clock } from "lucide-react";

// Inline helper if needed, but standard string interpolation is fine for simple cases.

function TrackMap() {
  return (
    <div className="relative w-32 h-20 opacity-80">
      <svg viewBox="0 0 200 120" className="w-full h-full stroke-white fill-none stroke-[4]">
        {/* Simple F1-style loop */}
        <path d="M20,60 L50,20 L150,20 L180,60 L150,100 L50,100 Z" strokeLinejoin="round" strokeLinecap="round" />
        {/* Animated dot for car position (simulated) */}
        <circle r="6" fill="#ef4444">
           <animateMotion dur="6s" repeatCount="indefinite" path="M20,60 L50,20 L150,20 L180,60 L150,100 L50,100 Z" />
        </circle>
      </svg>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "bg-green-500", label, icon: Icon }: { value: number, max?: number, color?: string, label: string, icon: any }) {
  // Calculate width for bar
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-neutral-400 font-semibold">
        <div className="flex items-center gap-2">
            <Icon size={16} />
            <span>{label}</span>
        </div>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden border border-white/5">
        <div
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

interface DashboardProps {
  stats: CarStats;
  gameState: GameState;
  onPitStop?: () => void;
}

export default function Dashboard({ stats, gameState, onPitStop }: DashboardProps) {

  // Tire Health logic: 100 is good (Green), 0 is bad (Red).
  const getTireHealthColor = (health: number) => {
    if (health > 50) return "bg-green-500";
    if (health > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Fuel color logic: 100 is full (Green), 0 is empty (Red).
  const getFuelColor = (fuel: number) => {
    if (fuel > 50) return "bg-green-500";
    if (fuel > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Engine color logic: 100 is healthy (Green).
  const getEngineColor = (health: number) => {
      if (health > 80) return "bg-green-500";
      if (health > 40) return "bg-yellow-500";
      return "bg-red-500";
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
      {/* Top Bar: Lap & Position */}
      <div className="flex justify-between items-start w-full">
        <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex gap-8 pointer-events-auto shadow-2xl">
            <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Lap</span>
                <span className="text-3xl font-bold font-mono text-white leading-none mt-1">
                    {stats.lap} <span className="text-neutral-600 text-lg">/ {stats.totalLaps}</span>
                </span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pos</span>
                 <span className="text-3xl font-bold font-mono text-white leading-none mt-1">P{stats.position}</span>
            </div>
        </div>

        {/* Track Map & Time Prediction */}
        <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-xl border border-white/10 flex items-center gap-8 shadow-2xl">
            <TrackMap />
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Clock size={10} /> Est. Lap Time
                </span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                    1:{(64 + (300 - stats.speed) / 10).toFixed(3)}
                </span>
            </div>
        </div>

        {/* Game State Indicator */}
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                    gameState === 'racing' ? 'bg-green-500 animate-pulse' :
                    gameState === 'pit_stop' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'
                }`} />
                <span className={`uppercase font-bold tracking-widest text-sm ${
                    gameState === 'racing' ? 'text-green-500' :
                    gameState === 'pit_stop' ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                    {gameState === 'racing' ? 'RACE LIVE' : gameState.replace('_', ' ')}
                </span>
            </div>
        </div>
      </div>

      {/* Bottom Bar: Telemetry */}
      <div className="flex items-end gap-6 w-full">
        {/* Speedometer */}
        <div className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10 min-w-[180px] pointer-events-auto shadow-2xl flex flex-col justify-center items-center">
             <span className="text-6xl font-bold font-mono text-white tabular-nums tracking-tighter leading-none">
                {Math.round(stats.speed)}
             </span>
             <div className="flex items-center gap-2 mt-2 text-neutral-500">
                <Gauge size={14} />
                <span className="text-[10px] uppercase tracking-widest font-bold">KM/H</span>
             </div>
        </div>

        {/* Stats Panel */}
        <div className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10 flex-1 flex gap-8 pointer-events-auto max-w-3xl shadow-2xl items-center">
            <ProgressBar
                value={stats.fuel}
                label="Fuel Level"
                icon={Fuel}
                color={getFuelColor(stats.fuel)}
            />
            <div className="w-px bg-white/10 h-10" />
            <ProgressBar
                value={100 - stats.tireWear}
                label="Tire Health"
                icon={Disc}
                color={getTireHealthColor(100 - stats.tireWear)}
            />
             <div className="w-px bg-white/10 h-10" />
            <ProgressBar
                value={stats.engineHealth}
                label="Engine Health"
                icon={Activity}
                color={getEngineColor(stats.engineHealth)}
            />
        </div>

        {/* Manual Pit Stop Button */}
        {gameState === 'racing' && (
             <button
                onClick={onPitStop}
                className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-red-900/40 border border-red-500 hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto"
             >
                <Flag size={20} />
                <span>Box Box</span>
             </button>
        )}
      </div>
    </div>
  );
}
