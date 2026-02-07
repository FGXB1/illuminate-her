"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '@/lib/audio-engine';
import { Sequencer } from './Sequencer';
import { Controls } from './Controls';
import { Effects } from './Effects';
import { Visualizer } from './Visualizer';
import { Tutorial } from './Tutorial';

export default function MusicLabDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const [tracks, setTracks] = useState<{ [key: string]: boolean[] }>({
    kick: new Array(16).fill(false),
    snare: new Array(16).fill(false),
    hihat: new Array(16).fill(false),
    clap: new Array(16).fill(false),
    synth: new Array(16).fill(false),
    piano: new Array(16).fill(false),
    bass: new Array(16).fill(false),
  });

  const [effects, setEffects] = useState({
    reverb: false,
    delay: false,
    distortion: false,
  });

  const engineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    // Initialize Audio Engine
    engineRef.current = new AudioEngine();
    setAnalyser(engineRef.current.getAnalyser());

    // Set initial callback
    engineRef.current.setOnStepCallback((step) => {
      setCurrentStep(step);
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (engineRef.current) {
      const playing = engineRef.current.togglePlay();
      setIsPlaying(playing);
    }
  };

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
    if (engineRef.current) {
      engineRef.current.setTempo(newTempo);
    }
  };

  const handleToggleStep = (track: string, step: number) => {
    const newTracks = { ...tracks };
    newTracks[track] = [...tracks[track]];
    newTracks[track][step] = !newTracks[track][step];
    setTracks(newTracks);

    if (engineRef.current) {
      engineRef.current.setTrackStep(track, step, newTracks[track][step]);
    }
  };

  const handleToggleEffect = (effect: 'reverb' | 'delay' | 'distortion', active: boolean) => {
    setEffects(prev => ({ ...prev, [effect]: active }));
    if (engineRef.current) {
      engineRef.current.setEffect(effect, active);
    }
  };

  return (
    <div className="min-h-screen bg-music-dark text-white font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-music-dark via-music-accent to-music-secondary opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-6">
        <header className="flex justify-between items-end pb-4 border-b border-music-light/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              <span className="text-music-primary">Music</span> Lab
            </h1>
            <p className="text-music-light/80 text-lg">Make a beat that feels confident</p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-sm font-mono text-music-primary bg-music-accent/30 px-3 py-1 rounded-full border border-music-primary/30 inline-block">
                HACKATHON BUILD 2025
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Sequencer Area */}
          <div className="lg:col-span-8 space-y-6">
            <Sequencer
              tracks={tracks}
              currentStep={currentStep}
              onToggleStep={handleToggleStep}
            />

            <div className="bg-music-accent/20 rounded-xl p-6 border border-music-light/10 backdrop-blur-sm">
                <Visualizer analyser={analyser} />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 space-y-6">
              <Controls
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                tempo={tempo}
                onTempoChange={handleTempoChange}
              />

              <Effects
                effects={effects}
                onToggleEffect={handleToggleEffect}
              />

              <div className="bg-music-light/10 p-6 rounded-xl border border-music-light/20">
                <h3 className="text-music-primary font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-music-primary animate-pulse"></span>
                    Quick Tips
                </h3>
                <ul className="text-sm text-music-light space-y-2 list-disc pl-4">
                    <li>Start with a steady Kick on beats 1, 5, 9, 13.</li>
                    <li>Add a Snare on 5 and 13 for a classic backbeat.</li>
                    <li>Hi-Hats add speed and texture!</li>
                    <li>Use Effects to change the vibe.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tutorial />
    </div>
  );
}
