"use client";

import { useGameLoop } from "@/hooks/useGameLoop";
import GameCanvas from "@/components/GameCanvas";
import Dashboard from "@/components/Dashboard";
import PitStopModal from "@/components/PitStopModal";
import { CarPart } from "@/components/CarModel";
import { PitStopAction } from "@/lib/types";
import { useState } from "react";
import { Trophy, RefreshCcw } from "lucide-react";

export default function Home() {
  const { gameState, stats, startRace, enterPitStop, applyPitStopAction } = useGameLoop();
  const [showIntro, setShowIntro] = useState(true);

  const handlePartClick = (part: CarPart) => {
    if (gameState === 'pit_stop') {
      if (part.includes('tire')) {
        applyPitStopAction('change_tires');
      } else if (part === 'engine') {
        applyPitStopAction('fix_engine');
      } else if (part === 'chassis') {
        applyPitStopAction('refuel'); // Simple mapping
      }
    } else {
        // Maybe show info toast?
        console.log(`Clicked ${part} during race`);
    }
  };

  const handleStart = () => {
    setShowIntro(false);
    startRace();
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <GameCanvas gameState={gameState} onPartClick={handlePartClick} />
      </div>

      {/* UI Overlay */}
      <Dashboard
        stats={stats}
        gameState={gameState}
        onPitStop={enterPitStop}
      />

      {/* Pit Stop Modal */}
      {gameState === 'pit_stop' && !showIntro && (
        <PitStopModal
            stats={stats}
            onAction={applyPitStopAction}
            onResume={startRace}
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
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 mb-8 w-96">
                <div className="flex justify-between mb-4">
                    <span className="text-neutral-400">Final Position</span>
                    <span className="font-mono font-bold text-2xl">P{stats.position}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-400">Total Laps</span>
                    <span className="font-mono font-bold text-2xl">{stats.totalLaps}</span>
                </div>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
                <RefreshCcw size={20} />
                <span>Race Again</span>
            </button>
        </div>
      )}
    </main>
  );
}
