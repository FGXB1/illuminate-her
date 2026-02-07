import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Square } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

export function Controls({ isPlaying, onTogglePlay, tempo, onTempoChange }: ControlsProps) {
  return (
    <div className="flex items-center gap-6 p-4 bg-music-dark/50 backdrop-blur-md rounded-xl border border-music-light/10 text-white">
      <Button
        onClick={onTogglePlay}
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full border-2 border-music-primary text-music-primary hover:bg-music-primary hover:text-white transition-all shadow-[0_0_15px_rgba(209,102,102,0.3)]"
      >
        {isPlaying ? <Square className="fill-current" /> : <Play className="fill-current ml-1" />}
      </Button>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between text-sm font-medium text-music-light">
          <span>Tempo</span>
          <span className="text-music-primary font-bold">{tempo} BPM</span>
        </div>
        <Slider
          value={[tempo]}
          min={60}
          max={180}
          step={1}
          onValueChange={(vals) => onTempoChange(vals[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
