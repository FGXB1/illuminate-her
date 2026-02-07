import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Card } from '@/components/ui/card';
import { Sparkles, Activity, Zap } from 'lucide-react';

interface EffectsProps {
  effects: {
    reverb: boolean;
    delay: boolean;
    distortion: boolean;
  };
  onToggleEffect: (effect: 'reverb' | 'delay' | 'distortion', active: boolean) => void;
}

export function Effects({ effects, onToggleEffect }: EffectsProps) {
  return (
    <Card className="p-4 bg-music-dark/50 backdrop-blur-md rounded-xl border border-music-light/10 text-white">
      <div className="flex flex-wrap gap-4 justify-center">
        <Toggle
          pressed={effects.reverb}
          onPressedChange={(active) => onToggleEffect('reverb', active)}
          className="bg-white/10 text-music-light data-[state=on]:bg-music-primary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(209,102,102,0.5)] border border-transparent transition-all"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Reverb
        </Toggle>

        <Toggle
          pressed={effects.delay}
          onPressedChange={(active) => onToggleEffect('delay', active)}
          className="bg-white/10 text-music-light data-[state=on]:bg-music-secondary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(85,12,24,0.5)] border border-transparent transition-all"
        >
          <Activity className="mr-2 h-4 w-4" />
          Echo
        </Toggle>

        <Toggle
          pressed={effects.distortion}
          onPressedChange={(active) => onToggleEffect('distortion', active)}
          className="bg-white/10 text-music-light data-[state=on]:bg-music-accent data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(36,1,21,0.5)] border border-transparent transition-all"
        >
          <Zap className="mr-2 h-4 w-4" />
          Distortion
        </Toggle>
      </div>
    </Card>
  );
}
