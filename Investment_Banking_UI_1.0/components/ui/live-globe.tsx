"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";

interface Pioneer {
  name: string;
  industry: string;
  location: [number, number];
  story: string;
  impact: string;
  emotion: string;
}

export function LiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pioneers, setPioneers] = useState<Pioneer[]>([]);
  const [activePioneer, setActivePioneer] = useState<Pioneer | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [narrationLoading, setNarrationLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/api/pioneer-stories");
        const data = await res.json();
        setPioneers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    }

    fetchStories();
    const interval = setInterval(fetchStories, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: pioneers.map((p) => ({
        location: p.location,
        size: activePioneer?.name === p.name ? 0.1 : 0.05,
      })),
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, [pioneers, activePioneer]);

  const handleMarkerClick = async (pioneer: Pioneer) => {
    setActivePioneer(pioneer);
    if (isAudioEnabled) {
      setNarrationLoading(true);
      try {
        const res = await fetch("/api/narrate-pioneer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pioneer),
        });
        const data = await res.json();
        if (data.audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audio = new Audio(data.audioUrl);
          audioRef.current = audio;
          audio.play();
        }
      } catch (err) {
        console.error("Narration failed:", err);
      } finally {
        setNarrationLoading(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[600px]">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition ${
            isAudioEnabled ? "bg-teal-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          {isAudioEnabled ? "Audio On" : "Audio Off"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
        className="cursor-grab active:cursor-grabbing"
      />

      <div className="absolute bottom-8 w-full max-w-lg px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {activePioneer && (
            <motion.div
              key={activePioneer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-6 rounded-3xl pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{activePioneer.name}</h3>
                <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">
                  {activePioneer.industry}
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">
                {activePioneer.story}
              </p>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-tighter mb-1">Impact</p>
                <p className="text-sm text-teal-200">{activePioneer.impact}</p>
              </div>
              {narrationLoading && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-teal-400 uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  Generating Narration...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-2 px-4 max-w-4xl">
        {pioneers.map((p) => (
          <button
            key={p.name}
            onClick={() => handleMarkerClick(p)}
            className={`w-full py-2 rounded-lg text-[10px] font-medium transition truncate px-1 border ${
              activePioneer?.name === p.name
                ? "border-teal-500 bg-teal-500/20 text-white"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
            }`}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
