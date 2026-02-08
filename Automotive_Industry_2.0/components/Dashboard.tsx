"use client";

import { useRef, useEffect, useState } from "react";
import { CarStats, GameState, LAP_DISTANCE } from "../lib/types";
import { Gauge, Fuel, Activity, Disc, AlertTriangle, Zap, Map as MapIcon, Clock } from "lucide-react";

// Oval track: ellipse centered at (100,60), rx=80, ry=40, drawn as two arcs
const TRACK_PATH_D = "M20,60 A80,40 0 1,1 180,60 A80,40 0 1,1 20,60 Z";

/** Progress 0–1 along the current lap. Dot position is driven by actual distance so one full lap = one circuit. */
function TrackMap({ progress }: { progress: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const totalLength = path.getTotalLength();
    const t = Math.max(0, Math.min(1, progress));
    const p = path.getPointAtLength(t * totalLength);
    setPoint({ x: p.x, y: p.y });
  }, [progress]);

  return (
    <div className="relative w-32 h-20 opacity-80">
      <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-[4]" style={{ stroke: "#C1C1C1" }}>
        <path
          ref={pathRef}
          d={TRACK_PATH_D}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {point != null && (
          <circle r="6" fill="#D16666" cx={point.x} cy={point.y} />
        )}
      </svg>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "bg-green-500", label, icon: Icon }: { value: number, max?: number, color?: string, label: string, icon: any }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-center gap-1.5">
        <Icon size={22} style={{ color: "#D16666", flexShrink: 0 }} />
        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#C1C1C1" }}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: "#2C4251", border: "1px solid rgba(193,193,193,0.1)" }}>
          <div
              className={`h-full transition-all duration-300 ${color}`}
              style={{ width: `${width}%` }}
          />
        </div>
        <span className="text-xs font-mono font-semibold text-white whitespace-nowrap">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

interface DashboardProps {
  stats: CarStats;
  gameState: GameState;
  distance: number;
  onPitStop?: () => void;
}

export default function Dashboard({ stats, gameState, distance, onPitStop }: DashboardProps) {
  const progressInLap = ((distance % LAP_DISTANCE) + LAP_DISTANCE) % LAP_DISTANCE / LAP_DISTANCE;

  const getTireHealthColor = (health: number) => {
    if (health > 50) return "bg-emerald-500";
    if (health > 20) return "bg-amber-500";
    return "bg-red-500";
  };

  const getFuelColor = (fuel: number) => {
    if (fuel > 50) return "bg-emerald-500";
    if (fuel > 20) return "bg-amber-500";
    return "bg-red-500";
  };

  const getEngineColor = (health: number) => {
      if (health > 80) return "bg-emerald-500";
      if (health > 40) return "bg-amber-500";
      return "bg-red-500";
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
      {/* Top Bar: Lap & Position */}
      <div className="flex justify-between items-start w-full">
        <div className="backdrop-blur-md p-4 rounded-xl flex gap-8 pointer-events-auto shadow-2xl" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C1C1C1" }}>Lap</span>
                <span className="text-3xl font-bold font-mono text-white leading-none mt-1">
                    {stats.lap} <span className="text-lg" style={{ color: "#D16666" }}>/ {stats.totalLaps}</span>
                </span>
            </div>
            <div className="w-px" style={{ backgroundColor: "rgba(209,102,102,0.2)" }} />
            <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C1C1C1" }}>Pos</span>
                 <span className="text-3xl font-bold font-mono text-white leading-none mt-1">P{stats.position}</span>
            </div>
        </div>

        {/* Track Map & Time Prediction */}
        <div className="backdrop-blur-md px-6 py-2 rounded-xl flex items-center gap-8 shadow-2xl" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
            <TrackMap progress={progressInLap} />
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: "#C1C1C1" }}>
                    <Clock size={10} /> Est. Lap Time
                </span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                    1:{(64 + (300 - stats.speed) / 10).toFixed(3)}
                </span>
            </div>
        </div>

        {/* Game State Indicator */}
        <div className="backdrop-blur-md px-6 py-3 rounded-xl shadow-2xl" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                    gameState === 'racing' ? 'animate-pulse' :
                    gameState === 'pit_stop' ? 'animate-pulse' : ''
                }`} style={{ backgroundColor: gameState === 'racing' ? '#D16666' : gameState === 'pit_stop' ? '#C1C1C1' : '#D16666' }} />
                <span className="uppercase font-bold tracking-widest text-sm" style={{ color: gameState === 'racing' ? '#D16666' : gameState === 'pit_stop' ? '#C1C1C1' : '#D16666' }}>
                    {gameState === 'racing' ? 'RACE LIVE' : gameState.replace('_', ' ')}
                </span>
            </div>
        </div>
      </div>

      {/* Bottom Bar: Telemetry */}
      <div className="flex items-end gap-6 w-full">
        {/* Speedometer */}
        <div className="backdrop-blur-md p-6 rounded-xl min-w-[180px] pointer-events-auto shadow-2xl flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
             <span className="text-6xl font-bold font-mono text-white tabular-nums tracking-tighter leading-none">
                {Math.round(stats.speed)}
             </span>
             <div className="flex items-center gap-2 mt-2" style={{ color: "#C1C1C1" }}>
                <Gauge size={14} />
                <span className="text-[10px] uppercase tracking-widest font-bold">KM/H</span>
             </div>
        </div>

        {/* Stats Panel */}
        <div className="backdrop-blur-md p-6 rounded-xl flex-1 flex gap-8 pointer-events-auto max-w-3xl shadow-2xl items-center" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
            <ProgressBar
                value={stats.fuel}
                label="Fuel Level"
                icon={Fuel}
                color={getFuelColor(stats.fuel)}
            />
            <div className="w-px h-10" style={{ backgroundColor: "rgba(209,102,102,0.2)" }} />
            <ProgressBar
                value={100 - stats.tireWear}
                label="Tire Health"
                icon={Disc}
                color={getTireHealthColor(100 - stats.tireWear)}
            />
             <div className="w-px h-10" style={{ backgroundColor: "rgba(209,102,102,0.2)" }} />
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
                className="pointer-events-auto font-bold py-3 px-5 rounded-lg uppercase tracking-wider text-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-3 ml-auto"
                style={{ backgroundColor: "#550C18", border: "1px solid #D16666", color: "#C1C1C1", boxShadow: "0 10px 25px rgba(85,12,24,0.5)" }}
             >
                <AlertTriangle size={40} style={{ color: "#D16666", flexShrink: 0 }} />
                <span>Make an Emergency Pit Stop</span>
             </button>
        )}
      </div>
    </div>
  );
}
