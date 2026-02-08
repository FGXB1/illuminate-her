"use client";

import { CarStats, PitStopAction } from "../lib/types";
import { CarPart } from "../lib/carConfig";
import { Wrench, Fuel, Disc, PlayCircle, RotateCcw, ArrowLeft, Info, Gauge, Activity } from "lucide-react";
import React from "react";

interface PitStopOverlayProps {
  stats: CarStats;
  onAction: (action: PitStopAction) => void;
  onResume: () => void;
  selectedPart: CarPart | null;
  onBack: () => void;
}

export default function PitStopOverlay({ stats, onAction, onResume, selectedPart, onBack }: PitStopOverlayProps) {

  // Render Part Detail Panel
  const renderDetailPanel = () => {
    if (!selectedPart) return null;

    let title = "";
    let description = "";
    let action: PitStopAction | null = null;
    let actionLabel = "";
    let cost = 0;
    let icon = null;
    let currentStatValue = 0;
    let statLabel = "";

    // Map parts to actions
    if (selectedPart.includes("tire")) {
      title = "Tires Compound";
      description = "Change tires to restore grip. Worn tires significantly reduce cornering speed.";
      action = "change_tires";
      actionLabel = "Change Tires";
      cost = 3.0;
      icon = <Disc className="text-blue-500" size={32} />;
      currentStatValue = 100 - Math.round(stats.tireWear);
      statLabel = "Current Health";
    } else if (selectedPart === "engine") {
      title = "Engine Unit";
      description = "Repair mechanical wear. Engine health affects top speed and acceleration.";
      action = "fix_engine";
      actionLabel = "Repair Engine";
      cost = 8.0;
      icon = <Wrench className="text-purple-500" size={32} />;
      currentStatValue = Math.round(stats.engineHealth);
      statLabel = "Integrity";
    } else if (selectedPart === "fuel-port" || selectedPart === "chassis") {
      title = "Fuel System";
      description = "Refuel the car. More fuel adds weight but ensures you finish the race.";
      action = "refuel";
      actionLabel = "Refuel";
      cost = 5.0;
      icon = <Fuel className="text-yellow-500" size={32} />;
      currentStatValue = Math.round(stats.fuel);
      statLabel = "Fuel Level";
    } else {
        // Generic part inspection
        title = selectedPart.replace(/-/g, " ").toUpperCase();
        description = "Inspect this component. No actions available.";
        icon = <Info className="text-white" size={32} />;
    }

    return (
      <div className="absolute right-0 top-0 h-full w-96 bg-black/80 backdrop-blur-md border-l border-white/10 p-8 flex flex-col z-50 animate-in slide-in-from-right duration-300">
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">Back to Overview</span>
        </button>

        <div className="mb-6">
            <div className="bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        </div>

        {statLabel && (
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase tracking-widest text-neutral-500">{statLabel}</span>
                    <span className={`font-mono font-bold ${currentStatValue < 30 ? 'text-red-500' : 'text-green-500'}`}>
                        {currentStatValue}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${currentStatValue < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${currentStatValue}%` }}
                    />
                </div>
            </div>
        )}

        <div className="mt-auto">
            {action && (
                <button
                    onClick={() => {
                        onAction(action!);
                        onBack(); // Optional: go back after action? Or stay? Let's go back.
                    }}
                    className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 px-6 rounded-xl uppercase tracking-widest flex items-center justify-between gap-4 transition-transform hover:scale-105 mb-4"
                >
                    <span>{actionLabel}</span>
                    <span className="bg-black/10 px-2 py-1 rounded text-xs font-mono">+{cost}s</span>
                </button>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Top Bar Info */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto">
         <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
                <Activity className="text-blue-500 animate-pulse" />
                Pit Stop
            </h1>
            <div className="flex gap-6 mt-2 text-sm font-mono text-neutral-400">
                <span>LAP {stats.lap - 1} COMPLETED</span>
                {/* stats.lap is currently the *next* lap. So we just finished lap - 1. */}
                <span className="text-white">|</span>
                <span>PIT WINDOW OPEN</span>
            </div>
         </div>
      </div>

      {/* Overview Hint - Only show if no part selected */}
      {!selectedPart && (
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-auto animate-pulse">
            <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 mb-2 inline-flex items-center gap-2">
                <Info size={16} className="text-blue-400" />
                <span className="text-white text-sm">Click glowing parts to inspect & repair</span>
            </div>
         </div>
      )}

      {/* Exit Button - Only show if no part selected (or maybe always?) */}
      {!selectedPart && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
             <button
                onClick={onResume}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-full uppercase tracking-widest text-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-transform hover:scale-105 flex items-center gap-2"
            >
                <PlayCircle size={24} />
                Exit Pit Lane
            </button>
        </div>
      )}

      {/* Detail Panel */}
      <div className="pointer-events-auto">
        {renderDetailPanel()}
      </div>
    </div>
  );
}
