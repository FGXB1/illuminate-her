"use client";

import { useGameLoop } from "@/hooks/useGameLoop";
import GameCanvas from "@/components/GameCanvas";
import Dashboard from "@/components/Dashboard";
import PitStopOverlay from "@/components/PitStopOverlay";
import { CarPart } from "@/lib/carConfig";
import { useState } from "react";
import { Trophy, RefreshCcw, Clock, Gauge, Activity } from "lucide-react";

function formatTime(ms: number) {
  if (!ms) return "0:00.000";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = ms % 1000;
  return `${m}:${s.toString().padStart(2, '0')}.${mil.toString().padStart(3, '0')}`;
}

export default function Home() {
  const {
    gameState,
    stats,
    distance,
    lapTimes,
    totalRaceTime,
    startRace,
    resetRace,
    enterPitStop,
    applyPitStopAction
  } = useGameLoop();

  const [showIntro, setShowIntro] = useState(true);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);

  const handlePartClick = (part: CarPart) => {
    if (gameState === 'pit_stop') {
      setSelectedPart(part);
    } else {
        // Maybe show info toast?
        console.log(`Clicked ${part} during race`);
    }
  };

  const handleStart = () => {
    setShowIntro(false);
    startRace();
  };

  const handleRestart = () => {
    resetRace();
    setSelectedPart(null);
  };

  const handleResumeRace = () => {
      setSelectedPart(null);
      startRace();
  };

  // Calculate Average Speed
  // total distance / total time (ms) -> m/ms -> * 3600000 / 1000 -> km/h
  // Wait, stats.speed is updated every tick. distance is total distance.
  const avgSpeed = totalRaceTime > 0 ? (distance / (totalRaceTime / 3600000)) / 1000 : 0;
  // Wait, distance is in meters. totalRaceTime in ms.
  // meters / hours = meters / (ms / 3600000) = (meters * 3600000) / ms.
  // km/h = (meters / 1000) * 3600000 / ms = meters * 3600 / ms.
  // Let's check: 5000m in 60000ms (1 min).
  // 5000 * 3600 / 60000 = 300 km/h. Correct.
  const calculatedAvgSpeed = totalRaceTime > 0 ? (distance * 3600) / totalRaceTime : 0;


  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <GameCanvas
            gameState={gameState}
            stats={stats}
            distance={distance}
            onPartClick={handlePartClick}
            selectedPart={selectedPart}
        />
      </div>

      {/* UI Overlay */}
      <Dashboard
        stats={stats}
        gameState={gameState}
        onPitStop={enterPitStop}
      />

      {/* Pit Stop Overlay */}
      {gameState === 'pit_stop' && !showIntro && (
        <PitStopOverlay
            stats={stats}
            onAction={applyPitStopAction}
            onResume={handleResumeRace}
            selectedPart={selectedPart}
            onBack={() => setSelectedPart(null)}
        />
      )}

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <h1 className="text-6xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                APEX ENGINEERING
            </h1>
            <p className="text-xl text-neutral-300 mb-8 max-w-lg text-center">
                Experience the thrill of F1 strategy. Manage your car's tires, fuel, and engine to win the race.
            </p>
            <button
                onClick={handleStart}
                className="bg-white text-black hover:bg-neutral-200 font-bold py-4 px-10 rounded-full text-xl uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl"
            >
                Start Engine
            </button>
        </div>
      )}

      {/* Finished Overlay */}
      {gameState === 'finished' && (
         <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <Trophy size={80} className="text-yellow-500 mb-6 animate-bounce" />
            <h1 className="text-6xl font-bold mb-4 text-white">RACE FINISHED</h1>

            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 mb-8 min-w-[400px]">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                        <span className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Total Time</span>
                        <span className="font-mono font-bold text-3xl flex items-center gap-2">
                             <Clock size={20} className="text-blue-400" />
                             {formatTime(totalRaceTime)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Avg Speed</span>
                        <span className="font-mono font-bold text-3xl flex items-center gap-2">
                             <Gauge size={20} className="text-green-400" />
                             {Math.round(calculatedAvgSpeed)} <span className="text-lg text-neutral-500">KM/H</span>
                        </span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Pit Stops</span>
                        <span className="font-mono font-bold text-3xl flex items-center gap-2">
                             <Activity size={20} className="text-red-400" />
                             {stats.pitStops.length}
                        </span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Total Laps</span>
                        <span className="font-mono font-bold text-3xl">
                             {stats.totalLaps}
                        </span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <span className="text-neutral-400 text-xs uppercase tracking-widest mb-3 block">Lap Times</span>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {lapTimes.map((time, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded text-sm">
                                <span className="text-neutral-500">Lap {i + 1}</span>
                                <span className="font-mono font-bold">{formatTime(time)}</span>
                            </div>
                        ))}
                         {/* Show current/last lap if finished mid-lap? No, race finished means completed all laps usually. */}
                    </div>
                </div>
            </div>

            <button
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-colors hover:scale-105"
            >
                <RefreshCcw size={20} />
                <span>Race Again</span>
            </button>
        </div>
      )}
    </main>
  );
}
