"use client";

import { useGameLoop } from "@/hooks/useGameLoop";
import GameCanvas from "@/components/GameCanvas";
import Dashboard from "@/components/Dashboard";
import PitStopOverlay from "@/components/PitStopOverlay";
import { CarPart } from "@/components/CarModel";
import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, RefreshCcw, Clock, Gauge, Activity, AlertTriangle, X, Map } from "lucide-react";
import CareerRoadmap from "@/components/CareerRoadmap";

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
    distanceRef,
    lapTimes,
    totalRaceTime,
    pitStopHistory,
    pitStopElapsedMs,
    failureReason,
    startRace,
    resetRace,
    enterPitStop,
    applyPitStopAction
  } = useGameLoop();

  const [showIntro, setShowIntro] = useState(true);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [hasChosenFixThisPit, setHasChosenFixThisPit] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialShown, setTutorialShown] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [funFactText, setFunFactText] = useState("");
  const [funFactSource, setFunFactSource] = useState<"gemini" | "fallback">("fallback");
  const [funFactLoading, setFunFactLoading] = useState(false);
  const [showCareerRoadmap, setShowCareerRoadmap] = useState(false);
  const pitStopCountRef = useRef(0);

  const fetchFunFact = useCallback(async () => {
    setFunFactLoading(true);
    try {
      const res = await fetch("/api/fun-fact");
      const data = await res.json();
      setFunFactText(data.fact);
      setFunFactSource(data.source);
    } catch {
      setFunFactText("**Berta Benz** completed the first long-distance automobile trip in 1888, driving 66 miles and essentially inventing the road trip.");
      setFunFactSource("fallback");
    }
    setFunFactLoading(false);
  }, []);

  const handlePartClick = (part: CarPart) => {
    if (gameState === "pit_stop") setSelectedPart(part);
  };

  const handleApplyFix = (action: "change_tires" | "refuel" | "fix_engine") => {
    applyPitStopAction(action);
    setHasChosenFixThisPit(true);
  };

  const handleExitPit = () => {
    setSelectedPart(null);
    setHasChosenFixThisPit(false);
    startRace();
  };

  const prevGameState = useRef(gameState);
  useEffect(() => {
    if (prevGameState.current !== "pit_stop" && gameState === "pit_stop") {
      setHasChosenFixThisPit(false);
      setSelectedPart(null);
      pitStopCountRef.current += 1;
      // Show tutorial on the very first pit stop
      if (pitStopCountRef.current === 1 && !tutorialShown) {
        setShowTutorial(true);
        setTutorialShown(true);
      }
      // Show a Gemini-generated fun fact on every pit stop after the first
      if (pitStopCountRef.current >= 2) {
        fetchFunFact().then(() => setShowFunFact(true));
      }
    }
    prevGameState.current = gameState;
  }, [gameState, tutorialShown]);

  const handleStart = () => {
    setShowIntro(false);
    startRace();
  };

  const handleRestart = () => {
    pitStopCountRef.current = 0;
    setTutorialShown(false);
    setShowTutorial(false);
    setShowFunFact(false);
    setShowCareerRoadmap(false);
    resetRace();
  };

  // Calculate Average Speed
  // total distance / total time (ms) -> m/ms -> * 3600000 / 1000 -> km/h
  // Wait, stats.speed is updated every tick. distance is total distance.
  const avgSpeed = totalRaceTime > 0 ? (distance / (totalRaceTime / 3600000)) / 1000 : 0;
  // Wait, distance is in meters. totalRaceTime in ms.
  // meters / hours = meters / (ms / 3600000) = (meters * 3600000) / ms.
  // km/h = (meters / 1000) * 3600000 / ms = meters * 3600 / ms.
  // Sanity check: distance (m) in time (ms) -> m * 3600 / ms = km/h.
  const calculatedAvgSpeed = totalRaceTime > 0 ? (distance * 3600) / totalRaceTime : 0;


  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "#240115" }}>
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <GameCanvas
            gameState={gameState}
            distanceRef={distanceRef}
            onPartClick={handlePartClick}
            selectedPart={selectedPart}
        />
      </div>

      {/* UI Overlay: hide during pit stop and failure */}
      {gameState !== "pit_stop" && gameState !== "car_failure" && (
        <Dashboard
          stats={stats}
          gameState={gameState}
          distance={distance}
          onPitStop={enterPitStop}
        />
      )}

      {/* Compact stat bars during pit stop */}
      {gameState === "pit_stop" && !showIntro && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="backdrop-blur-md rounded-xl px-5 py-3 shadow-2xl flex items-center gap-5" style={{ backgroundColor: "rgba(36,1,21,0.85)", border: "1px solid rgba(209,102,102,0.2)" }}>
            {/* Fuel */}
            <div className="flex items-center gap-2 w-32">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "#C1C1C1" }}>Fuel</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2C4251" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, stats.fuel))}%`, backgroundColor: stats.fuel > 50 ? "#22c55e" : stats.fuel > 20 ? "#eab308" : "#ef4444" }} />
              </div>
              <span className="text-[10px] font-mono font-bold text-white w-7 text-right">{Math.round(stats.fuel)}%</span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: "rgba(209,102,102,0.2)" }} />
            {/* Tires */}
            <div className="flex items-center gap-2 w-32">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "#C1C1C1" }}>Tires</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2C4251" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, 100 - stats.tireWear))}%`, backgroundColor: (100 - stats.tireWear) > 50 ? "#22c55e" : (100 - stats.tireWear) > 20 ? "#eab308" : "#ef4444" }} />
              </div>
              <span className="text-[10px] font-mono font-bold text-white w-7 text-right">{Math.round(100 - stats.tireWear)}%</span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: "rgba(209,102,102,0.2)" }} />
            {/* Engine */}
            <div className="flex items-center gap-2 w-32">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "#C1C1C1" }}>Engine</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2C4251" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, stats.engineHealth))}%`, backgroundColor: stats.engineHealth > 80 ? "#22c55e" : stats.engineHealth > 40 ? "#eab308" : "#ef4444" }} />
              </div>
              <span className="text-[10px] font-mono font-bold text-white w-7 text-right">{Math.round(stats.engineHealth)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Pit stop: car stopped, slim overlay (title, lap, timer, Exit Pit) + part detail panel when part selected */}
      {gameState === "pit_stop" && !showIntro && (
        <PitStopOverlay
          stats={stats}
          lap={stats.lap}
          totalLaps={stats.totalLaps}
          pitStopElapsedMs={pitStopElapsedMs}
          selectedPart={selectedPart}
          hasChosenFixThisPit={hasChosenFixThisPit}
          onBack={() => setSelectedPart(null)}
          onExitPit={handleExitPit}
          onApplyFix={handleApplyFix}
          onPartClick={handlePartClick}
        />
      )}

      {/* First Pit Stop Tutorial */}
      {showTutorial && gameState === "pit_stop" && (
        <div className="absolute right-6 top-52 z-50 pointer-events-auto w-80 max-h-[48vh] flex flex-col backdrop-blur-md rounded-xl shadow-2xl" style={{ backgroundColor: "rgba(36,1,21,0.95)", border: "1px solid rgba(209,102,102,0.3)" }}>
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: "#D16666" }}>Pit Stop Guide</h3>
          </div>

          <div className="flex-1 overflow-y-scroll px-5 pb-2 pit-guide-scroll" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(209,102,102,0.4) transparent" }}>
            <p className="text-base mb-4 leading-relaxed" style={{ color: "#C1C1C1" }}>
              Your car has just completed its first lap! During a pit stop the car is stationary and you get to
              <span className="text-white font-semibold"> inspect every part</span> by clicking on it. But you can only
              <span className="font-semibold" style={{ color: "#D16666" }}> fix one thing</span> per stop, so choose wisely.
            </p>

            <div className="space-y-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(44,66,81,0.3)" }}>
                <p className="font-bold text-sm mb-1 text-white">Tires</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(193,193,193,0.7)" }}>
                  Worn tires reduce grip and slow you down. Changing them restores full speed, but means you
                  can't fix anything else this stop.
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(44,66,81,0.3)" }}>
                <p className="font-bold text-sm mb-1 text-white">Fuel</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(193,193,193,0.7)" }}>
                  Low fuel is lighter (slightly faster) but if it hits zero your engine stalls and
                  <span className="font-semibold" style={{ color: "#D16666" }}> the race is over</span>. Refueling fills the tank but adds weight.
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(44,66,81,0.3)" }}>
                <p className="font-bold text-sm mb-1" style={{ color: "#C1C1C1" }}>Engine</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(193,193,193,0.7)" }}>
                  Engine wear directly cuts your top speed. A full repair restores peak power, but degrades
                  slowly -- you might get away with skipping it early on.
                </p>
              </div>
            </div>

            <div className="pt-3 mb-3" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(193,193,193,0.7)" }}>
                <span className="font-bold" style={{ color: "#D16666" }}>Warning:</span> If any stat reaches zero the car
                breaks down and you lose the race. Every part matters!
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
              style={{ backgroundColor: "#550C18", color: "#C1C1C1", border: "1px solid rgba(209,102,102,0.3)" }}
            >
              Got it -- let me inspect
            </button>
          </div>
        </div>
      )}

      {/* Did you know — separate left-side popup */}
      {showTutorial && gameState === "pit_stop" && (
        <div className="absolute left-6 bottom-28 z-50 pointer-events-auto w-80">
          <div className="backdrop-blur-md rounded-xl p-5 shadow-2xl" style={{ backgroundColor: "rgba(44,66,81,0.9)", border: "1px solid rgba(209,102,102,0.25)" }}>
            <p className="font-bold text-sm mb-2" style={{ color: "#D16666" }}>Did you know?</p>
            <p className="text-xs leading-relaxed" style={{ color: "#C1C1C1" }}>
              <span className="text-white font-semibold">Hannah Schmitz</span>, Red Bull Racing's Head of Strategy, has won multiple World Championships with her split-second pit stop calls. Just like her, you'll need to pick the right tradeoff!
            </p>
          </div>
        </div>
      )}

      {/* Gemini-generated Fun Fact (every pit stop after the first) */}
      {showFunFact && gameState === "pit_stop" && (
        <div className="absolute left-6 bottom-28 z-50 pointer-events-auto w-80">
          <div className="backdrop-blur-md rounded-xl p-5 shadow-2xl" style={{ backgroundColor: "rgba(44,66,81,0.9)", border: "1px solid rgba(209,102,102,0.25)" }}>
            <p className="font-bold text-sm mb-2" style={{ color: "#D16666" }}>Fun Fact</p>
            {funFactLoading ? (
              <p className="text-xs italic" style={{ color: "rgba(193,193,193,0.6)" }}>Loading a fun fact...</p>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "#C1C1C1" }}>
                {/* Parse **Name** markers and render names highlighted */}
                {funFactText.split(/(\*\*[^*]+\*\*)/).map((segment, i) => {
                  if (segment.startsWith("**") && segment.endsWith("**")) {
                    const name = segment.slice(2, -2);
                    return <span key={i} className="font-bold" style={{ color: "#D16666" }}>{name}</span>;
                  }
                  return <span key={i}>{segment}</span>;
                })}
              </p>
            )}
            <button
              onClick={() => setShowFunFact(false)}
              className="mt-3 w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ backgroundColor: "rgba(209,102,102,0.2)", color: "#C1C1C1" }}
            >
              Got it!
            </button>
            <p className="mt-2 text-center" style={{ color: "rgba(193,193,193,0.35)", fontSize: "9px" }}>
              Generated by Gemini
            </p>
          </div>
        </div>
      )}

      {/* Car Failure Overlay */}
      {gameState === "car_failure" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md" style={{ backgroundColor: "rgba(36,1,21,0.92)" }}>
          <AlertTriangle size={80} className="mb-6" style={{ color: "#D16666" }} />
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#D16666" }}>CAR BREAKDOWN</h1>
          <p className="text-2xl text-white mb-2">
            {failureReason === "fuel" && "You ran out of fuel!"}
            {failureReason === "tires" && "Your tires blew out!"}
            {failureReason === "engine" && "Your engine failed!"}
          </p>
          <p className="text-center max-w-lg mb-6 leading-relaxed" style={{ color: "#C1C1C1" }}>
            Your car couldn't continue because
            {failureReason === "fuel" && " the fuel tank ran dry. Without fuel the engine stalls and there's no coming back."}
            {failureReason === "tires" && " the tires wore down completely. With no grip the car can't safely continue."}
            {failureReason === "engine" && " the engine took too much damage. A seized engine means the race is over."}
          </p>

          <div className="rounded-xl p-6 max-w-md text-center mb-6" style={{ backgroundColor: "rgba(44,66,81,0.4)", border: "1px solid rgba(209,102,102,0.25)" }}>
            <p className="text-white font-semibold mb-2">Every part matters.</p>
            <p className="text-sm leading-relaxed" style={{ color: "#C1C1C1" }}>
              In F1, a single overlooked component can end a race in seconds. The key is balancing which part needs
              attention most urgently -- you only get one fix per pit stop, so prioritize the stat closest to zero.
            </p>
            <p className="text-sm mt-3 italic" style={{ color: "rgba(193,193,193,0.6)" }}>
              Don't worry -- this happens to everyone at first. Even the best strategists learn through trial and error.
              Hannah Schmitz didn't become Red Bull's championship-winning strategist overnight!
            </p>
          </div>

          <div className="rounded-lg p-4 max-w-sm mb-8" style={{ backgroundColor: "rgba(44,66,81,0.3)", border: "1px solid rgba(209,102,102,0.15)" }}>
            <p className="text-xs text-center" style={{ color: "#C1C1C1" }}>
              <span className="text-white font-bold">Tip:</span> Watch the stat bars during the race. Whichever one is
              dropping fastest is the one you should fix at the next pit stop.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-colors hover:scale-105"
            style={{ backgroundColor: "#550C18", color: "#C1C1C1", border: "1px solid #D16666" }}
          >
            <RefreshCcw size={20} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md" style={{ backgroundColor: "rgba(36,1,21,0.85)" }}>
            <h1 className="text-6xl font-bold mb-4 tracking-tighter bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, #D16666, #C1C1C1)" }}>
                APEX ENGINEERING
            </h1>
            <p className="text-xl mb-8 max-w-lg text-center" style={{ color: "#C1C1C1" }}>
                Experience the thrill of F1 strategy. Manage your car's tires, fuel, and engine to win the race.
            </p>
            <button
                onClick={handleStart}
                className="font-bold py-4 px-10 rounded-full text-xl uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl"
                style={{ backgroundColor: "#C1C1C1", color: "#240115" }}
            >
                Start Engine
            </button>
        </div>
      )}

      {/* Finished Overlay */}
      {gameState === 'finished' && !showCareerRoadmap && (
         <div className="absolute inset-0 z-50 flex flex-col items-center overflow-y-auto backdrop-blur-md roadmap-scroll" style={{ backgroundColor: "rgba(36,1,21,0.92)" }}>
            <div className="flex flex-col items-center w-full py-10 px-4">
              <Trophy size={80} className="mb-6 animate-bounce shrink-0" style={{ color: "#D16666" }} />
              <h1 className="text-6xl font-bold mb-4 text-white">RACE FINISHED</h1>

              <div className="p-8 rounded-2xl mb-8 min-w-[400px] max-w-[550px] w-full" style={{ backgroundColor: "rgba(44,66,81,0.35)", border: "1px solid rgba(209,102,102,0.25)" }}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C1C1C1" }}>Total Time</span>
                          <span className="font-mono font-bold text-3xl text-white flex items-center gap-2">
                               <Clock size={20} style={{ color: "#D16666" }} />
                               {formatTime(totalRaceTime)}
                          </span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C1C1C1" }}>Avg Speed</span>
                          <span className="font-mono font-bold text-3xl text-white flex items-center gap-2">
                               <Gauge size={20} style={{ color: "#C1C1C1" }} />
                               {Math.round(calculatedAvgSpeed)} <span className="text-lg" style={{ color: "rgba(193,193,193,0.5)" }}>KM/H</span>
                          </span>
                      </div>
                       <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C1C1C1" }}>Pit Stops</span>
                          <span className="font-mono font-bold text-3xl text-white flex items-center gap-2">
                               <Activity size={20} style={{ color: "#D16666" }} />
                               {stats.pitStops}
                          </span>
                      </div>
                       <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C1C1C1" }}>Total Laps</span>
                          <span className="font-mono font-bold text-3xl text-white">
                               {stats.totalLaps}
                          </span>
                      </div>
                  </div>

                  <div className="pt-4" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
                      <span className="text-xs uppercase tracking-widest mb-3 block" style={{ color: "#C1C1C1" }}>Lap Times</span>
                      <div className="space-y-2">
                          {lapTimes.map((time, i) => (
                              <div key={i} className="flex justify-between items-center p-2 rounded text-sm" style={{ backgroundColor: "rgba(36,1,21,0.5)" }}>
                                  <span style={{ color: "rgba(193,193,193,0.5)" }}>Lap {i + 1}</span>
                                  <span className="font-mono font-bold text-white">{formatTime(time)}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {pitStopHistory.length > 0 && (
                    <div className="pt-4 mt-4" style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}>
                      <span className="text-xs uppercase tracking-widest mb-3 block" style={{ color: "#C1C1C1" }}>Pit Stop Summary</span>
                      <div className="space-y-2">
                        {pitStopHistory.map((stop, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded text-sm" style={{ backgroundColor: "rgba(36,1,21,0.5)" }}>
                            <span style={{ color: "rgba(193,193,193,0.5)" }}>Lap {stop.lap}</span>
                            <span className="font-mono text-white">{formatTime(stop.durationMs)}</span>
                            <span className="text-xs" style={{ color: "#C1C1C1" }}>
                              {stop.changes.length ? stop.changes.map((c) => c.replace("_", " ")).join(", ") : "Inspection only"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex items-center gap-4 shrink-0 pb-4">
                <button
                    onClick={handleRestart}
                    className="font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                    style={{ backgroundColor: "rgba(44,66,81,0.5)", color: "#C1C1C1", border: "1px solid rgba(209,102,102,0.25)" }}
                >
                    <RefreshCcw size={20} />
                    <span>Race Again</span>
                </button>
                <button
                    onClick={() => setShowCareerRoadmap(true)}
                    className="font-bold py-3 px-8 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                    style={{ backgroundColor: "#550C18", color: "#C1C1C1", border: "1px solid #D16666" }}
                >
                    <Map size={20} />
                    <span>Explore Your Career</span>
                </button>
              </div>
            </div>
        </div>
      )}

      {/* Career Roadmap Overlay */}
      {gameState === 'finished' && showCareerRoadmap && (
        <CareerRoadmap
          onClose={() => setShowCareerRoadmap(false)}
          onPlayAgain={handleRestart}
        />
      )}
    </main>
  );
}
