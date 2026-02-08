import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Sparkles, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EffectsProps {
  effects: {
    reverb: boolean;
    delay: boolean;
    distortion: boolean;
  };
  reverbMix: number;
  onToggleEffect: (effect: 'reverb' | 'delay' | 'distortion', active: boolean) => void;
  onReverbMixChange: (value: number) => void;
  isHighlighted?: boolean;
}

export function Effects({
  effects,
  reverbMix,
  onToggleEffect,
  onReverbMixChange,
  isHighlighted
}: EffectsProps) {
  return (
    <Card className={cn(
      "p-4 bg-music-dark/50 backdrop-blur-md rounded-xl border border-music-light/10 text-white transition-all duration-500",
      isHighlighted ? "relative z-50 ring-2 ring-music-primary shadow-[0_0_30px_rgba(209,102,102,0.3)] bg-music-dark" : ""
    )}>
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-music-light uppercase tracking-wider mb-1">Effects Rack</h3>

        {/* Reverb Control */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Toggle
                pressed={effects.reverb}
                onPressedChange={(active) => onToggleEffect('reverb', active)}
                className="bg-white/10 text-music-light data-[state=on]:bg-music-primary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(209,102,102,0.5)] border border-transparent transition-all h-8 text-xs"
                >
                <Sparkles className="mr-2 h-3 w-3" />
                Reverb
                </Toggle>
                <span className="text-xs text-music-light font-mono">{Math.round(reverbMix)}%</span>
            </div>
            <Slider
                disabled={!effects.reverb}
                value={[reverbMix]}
                max={100}
                step={1}
                onValueChange={(vals) => onReverbMixChange(vals[0])}
                className={cn("cursor-pointer", !effects.reverb && "opacity-50")}
            />
        </div>

        <div className="flex flex-wrap gap-2">
            <Toggle
            pressed={effects.delay}
            onPressedChange={(active) => onToggleEffect('delay', active)}
            className="flex-1 bg-white/10 text-music-light data-[state=on]:bg-music-secondary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(85,12,24,0.5)] border border-transparent transition-all h-8 text-xs"
            >
            <Activity className="mr-2 h-3 w-3" />
            Echo
            </Toggle>

            <Toggle
            pressed={effects.distortion}
            onPressedChange={(active) => onToggleEffect('distortion', active)}
            className="flex-1 bg-white/10 text-music-light data-[state=on]:bg-music-accent data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(36,1,21,0.5)] border border-transparent transition-all h-8 text-xs"
            >
            <Zap className="mr-2 h-3 w-3" />
            Grit
            </Toggle>
        </div>
      </div>
    </Card>
  );
}
