"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export type TutorialStep = 'intro' | 'rhythm-101' | 'grid-demo' | 'interaction' | 'effects' | 'complete';

interface RhythmCoachProps {
  step: TutorialStep;
  onNext: () => void;
  onComplete: () => void;
}

const steps = {
  'intro': {
    title: "Welcome to the Lab",
    text: "I'm 'The Producer'. I'm here to help you make your first beat. Ready to start?",
    action: "Let's Go"
  },
  'rhythm-101': {
    title: "The Heartbeat",
    text: "Music is math in time. We are in 4/4 time, meaning 4 beats per bar. See those highlighted numbers? Those are the downbeats.",
    action: "Got it"
  },
  'grid-demo': {
    title: "The Grid",
    text: "The rows are your instruments. The columns are when they play. The Kick Drum is the foundation of most beats.",
    action: "Show me"
  },
  'interaction': {
    title: "Interactive Challenge",
    text: "Let's make a heartbeat. Place a Kick on Beat 1 (Step 1) and Beat 3 (Step 9).",
    action: null // Auto-advance
  },
  'effects': {
    title: "Painting with Sound",
    text: "Dry signal is boring. Let's add space. Turn the Reverb slider up to at least 50%.",
    action: null // Auto-advance
  },
  'complete': {
    title: "You're a Producer!",
    text: "You've got the basics down. Now experiment properly! Add some Snare, Hi-Hats, and Melodies.",
    action: "Free Play"
  }
};

export function RhythmCoach({ step, onNext, onComplete }: RhythmCoachProps) {

  // Confetti on complete
  useEffect(() => {
    if (step === 'complete') {
      const end = Date.now() + 1000;
      const colors = ['#D16666', '#550C18', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [step]);

  const content = steps[step];

  if (!content && step !== 'complete') return null;

  return (
    <>
      {/* Overlay - Only show for specific steps where we want to dim the background */}
      {/* Step 'intro' and 'complete' don't need overlay dimming or have their own style */}
      {step !== 'intro' && step !== 'complete' && (
        <div className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Coach Card */}
      <div className="fixed bottom-8 right-8 z-[100] max-w-sm w-full perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0, scale: 0.95, rotateX: 10 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: -20, opacity: 0, scale: 0.95, rotateX: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-music-dark/95 backdrop-blur-xl border border-music-primary shadow-[0_10px_40px_-10px_rgba(209,102,102,0.5)] p-6 relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-music-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-music-primary to-music-secondary flex items-center justify-center border-2 border-white/20 shadow-lg relative z-10">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-music-primary rounded-full animate-ping opacity-20" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-lg">The Producer</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-music-light uppercase tracking-widest font-mono">Rhythm Coach</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <motion.h4
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl font-bold text-music-primary mb-2"
                        >
                            {content?.title}
                        </motion.h4>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-300 text-sm leading-relaxed"
                        >
                            {content?.text}
                        </motion.p>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                        {content?.action ? (
                             <Button
                                onClick={step === 'complete' ? onComplete : onNext}
                                className="w-full bg-music-primary hover:bg-music-secondary text-white font-bold group shadow-lg shadow-music-primary/20"
                            >
                                {content.action}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                             <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 border border-white/5 text-music-light text-xs font-mono animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-music-primary" />
                                Waiting for interaction...
                            </div>
                        )}
                    </div>
                </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
