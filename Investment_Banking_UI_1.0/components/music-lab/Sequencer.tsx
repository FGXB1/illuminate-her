import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SequencerProps {
  tracks: { [key: string]: boolean[] };
  currentStep: number;
  onToggleStep: (track: string, step: number) => void;
}

const trackColors: { [key: string]: string } = {
  kick: 'bg-music-primary',
  snare: 'bg-music-secondary',
  hihat: 'bg-music-accent',
  clap: 'bg-music-dark',
  synth: 'bg-indigo-500',
  piano: 'bg-blue-500',
  bass: 'bg-purple-900',
};

const trackNames: { [key: string]: string } = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-Hat',
  clap: 'Clap',
  synth: 'Synth',
  piano: 'Piano',
  bass: 'Bass',
};

export function Sequencer({ tracks, currentStep, onToggleStep }: SequencerProps) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-music-light/10">
      {/* Header */}
      <div className="flex gap-4 items-center mb-2">
         <div className="w-20 text-xs font-bold text-music-light opacity-50 text-right shrink-0"></div>
         <div className="flex-1 grid grid-cols-16 gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
           {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={cn("text-[10px] text-center text-music-light opacity-50", i % 4 === 0 && "font-bold")}>
                  {i + 1}
              </div>
           ))}
         </div>
      </div>

      {/* Rows */}
      {Object.entries(tracks).map(([trackName, steps]) => (
        <div key={trackName} className="flex gap-4 items-center">
          <div className="w-20 text-sm font-bold text-music-light capitalize text-right shrink-0">
            {trackNames[trackName] || trackName}
          </div>
          <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {steps.map((isActive, stepIndex) => (
              <button
                key={stepIndex}
                onClick={() => onToggleStep(trackName, stepIndex)}
                className={cn(
                  "w-full aspect-square rounded-sm transition-all duration-200 border border-white/5",
                  isActive
                    ? (trackColors[trackName] || 'bg-music-primary') + " shadow-[0_0_8px_currentColor]"
                    : "bg-music-light/10 hover:bg-music-light/30",
                  currentStep === stepIndex && "ring-1 ring-white ring-offset-1 ring-offset-transparent transform scale-105 z-10",
                  stepIndex % 4 === 0 && !isActive && "bg-music-light/20"
                )}
                aria-label={`Toggle ${trackName} step ${stepIndex + 1}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
