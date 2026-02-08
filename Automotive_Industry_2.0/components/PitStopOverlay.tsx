"use client";

import { CarStats, PitStopAction } from "../lib/types";
import { CarPart } from "./CarModel";
import { Disc, Fuel, Wrench, X, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;
}

/** Ordered list of all inspectable parts for arrow navigation */
const PARTS_ORDER: CarPart[] = [
  "front-left-tire",
  "front-right-tire",
  "rear-left-tire",
  "rear-right-tire",
  "engine",
  "chassis",
  "spoiler",
];

interface PitStopOverlayProps {
  stats: CarStats;
  lap: number;
  totalLaps: number;
  pitStopElapsedMs: number;
  selectedPart: CarPart | null;
  hasChosenFixThisPit: boolean;
  onBack: () => void;
  onExitPit: () => void;
  onApplyFix: (action: PitStopAction) => void;
  onPartClick: (part: CarPart) => void;
}

export default function PitStopOverlay({
  stats,
  lap,
  totalLaps,
  pitStopElapsedMs,
  selectedPart,
  hasChosenFixThisPit,
  onBack,
  onExitPit,
  onApplyFix,
  onPartClick,
}: PitStopOverlayProps) {
  const tireHealth = 100 - Math.round(stats.tireWear);
  const gripRating = tireHealth >= 80 ? "High" : tireHealth >= 50 ? "Medium" : "Low";
  const timeImpact = stats.tireWear > 60 ? "+0.5s/lap" : stats.tireWear > 30 ? "+0.2s/lap" : "Minimal";

  const currentIndex = selectedPart ? PARTS_ORDER.indexOf(selectedPart) : -1;

  const goToPrev = () => {
    if (currentIndex < 0) return;
    const prevIndex = (currentIndex - 1 + PARTS_ORDER.length) % PARTS_ORDER.length;
    onPartClick(PARTS_ORDER[prevIndex]);
  };

  const goToNext = () => {
    if (currentIndex < 0) return;
    const nextIndex = (currentIndex + 1) % PARTS_ORDER.length;
    onPartClick(PARTS_ORDER[nextIndex]);
  };

  return (
    <>
      {/* Compact header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center gap-3">
        <div className="backdrop-blur-md rounded-xl px-6 py-4 shadow-2xl flex flex-wrap items-center justify-center gap-6" style={{ backgroundColor: "rgba(36,1,21,0.9)", border: "1px solid rgba(209,102,102,0.3)" }}>
          <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: "#D16666" }}>Pit Stop</h2>
          <span className="text-sm" style={{ color: "#C1C1C1" }}>
            Lap <span className="font-bold text-white">{lap - 1}</span> of {totalLaps} completed
          </span>
          <span className="text-sm flex items-center gap-1" style={{ color: "#C1C1C1" }}>
            <span className="font-mono font-bold text-white tabular-nums">{formatTime(pitStopElapsedMs)}</span>
            <span className="text-xs">elapsed</span>
          </span>
          <button
            onClick={onExitPit}
            className="font-bold py-2 px-5 rounded-lg uppercase tracking-wider text-sm flex items-center gap-2 transition-transform hover:scale-105"
            style={{ backgroundColor: "#C1C1C1", color: "#240115" }}
          >
            <PlayCircle size={18} />
            Exit Pit
          </button>
        </div>
        <p className="text-xs" style={{ color: "rgba(193,193,193,0.6)" }}>Click a part on the car to inspect. You may choose one fix before exiting.</p>
      </div>

      {/* Part detail panel */}
      {selectedPart && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto w-72">
          <div className="backdrop-blur-md rounded-xl p-4 shadow-2xl" style={{ backgroundColor: "rgba(36,1,21,0.95)", border: "1px solid rgba(209,102,102,0.3)" }}>
            {/* Header with title, nav arrows, and back button */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold capitalize">{selectedPart.replace(/-/g, " ")}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrev}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ backgroundColor: "rgba(193,193,193,0.1)" }}
                  aria-label="Previous part"
                >
                  <ChevronLeft size={16} style={{ color: "#C1C1C1" }} />
                </button>
                <button
                  onClick={goToNext}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ backgroundColor: "rgba(193,193,193,0.1)" }}
                  aria-label="Next part"
                >
                  <ChevronRight size={16} style={{ color: "#C1C1C1" }} />
                </button>
                <button
                  onClick={onBack}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10 ml-1"
                  style={{ backgroundColor: "rgba(193,193,193,0.1)" }}
                  aria-label="Close"
                >
                  <X size={16} style={{ color: "#C1C1C1" }} />
                </button>
              </div>
            </div>

            {/* Part index indicator */}
            <p className="text-[10px] mb-2" style={{ color: "rgba(193,193,193,0.4)" }}>
              {currentIndex + 1} / {PARTS_ORDER.length}
            </p>

            {/* Tire(s) */}
            {(selectedPart === "front-left-tire" ||
              selectedPart === "front-right-tire" ||
              selectedPart === "rear-left-tire" ||
              selectedPart === "rear-right-tire") && (
              <div className="space-y-3 text-sm">
                <p className="text-xs italic leading-relaxed" style={{ color: "rgba(193,193,193,0.65)" }}>
                  Tires are the only part of the car that touches the road. They provide grip for turning, braking, and accelerating — worn tires mean less control and slower lap times.
                </p>
                <div className="grid grid-cols-2 gap-2" style={{ color: "#C1C1C1" }}>
                  <span>Tire health</span>
                  <span className="font-mono font-bold text-white">{tireHealth}%</span>
                  <span>Wear rate</span>
                  <span className="font-mono">~8%/lap</span>
                  <span>Grip rating</span>
                  <span style={{ color: tireHealth >= 50 ? "#C1C1C1" : "#D16666" }}>{gripRating}</span>
                  <span>Est. time impact</span>
                  <span className="font-mono">{timeImpact}</span>
                </div>
                <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
                  <button onClick={onBack} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(193,193,193,0.1)", color: "#C1C1C1" }}>Keep</button>
                  <button
                    onClick={() => { onApplyFix("change_tires"); onBack(); }}
                    disabled={hasChosenFixThisPit}
                    className="flex-1 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-1"
                    style={{ backgroundColor: hasChosenFixThisPit ? "#2C4251" : "#2C4251" }}
                  >
                    <Disc size={14} /> Change
                  </button>
                </div>
                {hasChosenFixThisPit && <p className="text-xs" style={{ color: "#D16666" }}>You can only apply one fix per pit stop.</p>}
              </div>
            )}

            {/* Engine */}
            {selectedPart === "engine" && (
              <div className="space-y-3 text-sm">
                <p className="text-xs italic leading-relaxed" style={{ color: "rgba(193,193,193,0.65)" }}>
                  The engine is the heart of the car — it converts fuel into power. As it wears down, the car produces less horsepower and your top speed drops.
                </p>
                <div className="grid grid-cols-2 gap-2" style={{ color: "#C1C1C1" }}>
                  <span>Engine health</span>
                  <span className="font-mono font-bold text-white">{Math.round(stats.engineHealth)}%</span>
                  <span>Power impact</span>
                  <span style={{ color: stats.engineHealth >= 60 ? "#C1C1C1" : "#D16666" }}>
                    {stats.engineHealth >= 80 ? "Full" : stats.engineHealth >= 40 ? "Reduced" : "Low"}
                  </span>
                </div>
                <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
                  <button onClick={onBack} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(193,193,193,0.1)", color: "#C1C1C1" }}>Keep</button>
                  <button
                    onClick={() => { onApplyFix("fix_engine"); onBack(); }}
                    disabled={hasChosenFixThisPit}
                    className="flex-1 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-1"
                    style={{ backgroundColor: "#550C18" }}
                  >
                    <Wrench size={14} /> Repair
                  </button>
                </div>
                {hasChosenFixThisPit && <p className="text-xs" style={{ color: "#D16666" }}>You can only apply one fix per pit stop.</p>}
              </div>
            )}

            {/* Chassis / Fuel */}
            {selectedPart === "chassis" && (
              <div className="space-y-3 text-sm">
                <p className="text-xs italic leading-relaxed" style={{ color: "rgba(193,193,193,0.65)" }}>
                  The chassis is the car's main body and frame — it holds everything together. The fuel tank sits inside it. Running out of fuel means the engine stalls completely.
                </p>
                <div className="grid grid-cols-2 gap-2" style={{ color: "#C1C1C1" }}>
                  <span>Fuel level</span>
                  <span className="font-mono font-bold text-white">{Math.round(stats.fuel)}%</span>
                  <span>Weight penalty</span>
                  <span style={{ color: "#C1C1C1" }}>{stats.fuel > 80 ? "Low" : stats.fuel > 50 ? "Medium" : "High (lighter)"}</span>
                </div>
                <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
                  <button onClick={onBack} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(193,193,193,0.1)", color: "#C1C1C1" }}>Keep</button>
                  <button
                    onClick={() => { onApplyFix("refuel"); onBack(); }}
                    disabled={hasChosenFixThisPit}
                    className="flex-1 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-1"
                    style={{ backgroundColor: "#2C4251" }}
                  >
                    <Fuel size={14} /> Refuel
                  </button>
                </div>
                {hasChosenFixThisPit && <p className="text-xs" style={{ color: "#D16666" }}>You can only apply one fix per pit stop.</p>}
              </div>
            )}

            {/* Spoiler */}
            {selectedPart === "spoiler" && (
              <div className="space-y-3 text-sm">
                <p className="text-xs italic leading-relaxed" style={{ color: "rgba(193,193,193,0.65)" }}>
                  The spoiler (or rear wing) pushes the car down onto the road at high speeds, giving it more grip in corners — but it also creates drag that can limit top speed.
                </p>
                <div className="grid grid-cols-2 gap-2" style={{ color: "#C1C1C1" }}>
                  <span>Downforce</span>
                  <span style={{ color: "#C1C1C1" }}>Active</span>
                  <span>Drag</span>
                  <span style={{ color: "rgba(193,193,193,0.5)" }}>Normal</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(193,193,193,0.5)" }}>No service needed for rear wing.</p>
                <button onClick={onBack} className="w-full py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(193,193,193,0.1)", color: "#C1C1C1" }}>Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
