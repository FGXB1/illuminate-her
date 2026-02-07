"use client";

import { CarStats, PitStopAction } from "../lib/types";
import { Wrench, Fuel, Disc, PlayCircle, RotateCcw } from "lucide-react";

interface PitStopModalProps {
  stats: CarStats;
  onAction: (action: PitStopAction) => void;
  onResume: () => void;
}

export default function PitStopModal({ stats, onAction, onResume }: PitStopModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-4xl w-full shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">Pit Stop Strategy</h2>
          <p className="text-neutral-400 mb-8">Select maintenance tasks to perform before rejoining the race.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Tires */}
            <button
              onClick={() => onAction('change_tires')}
              className="group relative bg-neutral-800 hover:bg-neutral-700 p-6 rounded-xl border border-white/5 transition-all hover:border-blue-500/50 text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-neutral-900 p-3 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Disc className="text-blue-500" size={24} />
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  stats.tireWear > 80 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {100 - Math.round(stats.tireWear)}% Health
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Change Tires</h3>
              <p className="text-sm text-neutral-400">Restore tire grip. <br/>Cost: 3.0s</p>
            </button>

            {/* Fuel */}
            <button
              onClick={() => onAction('refuel')}
              className="group relative bg-neutral-800 hover:bg-neutral-700 p-6 rounded-xl border border-white/5 transition-all hover:border-yellow-500/50 text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-neutral-900 p-3 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                  <Fuel className="text-yellow-500" size={24} />
                </div>
                 <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  stats.fuel < 20 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {Math.round(stats.fuel)}% Level
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Refuel</h3>
              <p className="text-sm text-neutral-400">Fill tank to max. <br/>Cost: 5.0s</p>
            </button>

            {/* Engine */}
            <button
              onClick={() => onAction('fix_engine')}
              className="group relative bg-neutral-800 hover:bg-neutral-700 p-6 rounded-xl border border-white/5 transition-all hover:border-purple-500/50 text-left"
            >
               <div className="flex justify-between items-start mb-4">
                <div className="bg-neutral-900 p-3 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Wrench className="text-purple-500" size={24} />
                </div>
                 <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  stats.engineHealth < 20 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {Math.round(stats.engineHealth)}% Health
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Repair Engine</h3>
              <p className="text-sm text-neutral-400">Fix mechanical issues. <br/>Cost: 8.0s</p>
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
                onClick={onResume}
                className="bg-white text-black hover:bg-neutral-200 font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-transform hover:scale-105"
            >
                <PlayCircle size={20} />
                <span>Return to Race</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
