import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Info } from 'lucide-react';

export function Tutorial() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 bg-music-dark/80 text-music-light border-music-light/20 hover:bg-music-dark hover:text-white transition-all shadow-lg z-50 rounded-full"
      onClick={() => setIsOpen(true)}
    >
      <Info className="w-4 h-4 mr-2" />
      Tips
    </Button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-md w-full bg-music-dark/95 border-music-primary/30 text-white shadow-[0_0_30px_rgba(209,102,102,0.2)]">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-music-light">Music Lab 101</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-music-primary mb-1">Rhythm & Beat</h3>
            <p className="text-sm text-gray-300">
              Think of the grid as time. Each row is a different sound. Tap the squares to make a sound happen at that moment!
              <br/>
              Try placing Kicks on 1, 5, 9, 13 for a steady beat.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-music-primary mb-1">Instruments</h3>
            <p className="text-sm text-gray-300">
              Add some melody with the Synth, Piano, and Bass rows. Experiment with patterns!
            </p>
          </div>

          <div>
            <h3 className="font-bold text-music-primary mb-1">Effects</h3>
            <p className="text-sm text-gray-300">
              Toggle Reverb for space, Echo for repeats, and Distortion for grit!
            </p>
          </div>

          <Button
            className="w-full mt-4 bg-music-primary hover:bg-music-secondary text-white font-bold"
            onClick={() => setIsOpen(false)}
          >
            Let's Make a Beat!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
