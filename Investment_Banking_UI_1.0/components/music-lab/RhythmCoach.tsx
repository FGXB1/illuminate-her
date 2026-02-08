"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, X, Play, Volume2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export type TutorialStep = 'intro' | 'kick' | 'snare' | 'hihat' | 'bass' | 'synth' | 'reverb' | 'complete';

interface RhythmCoachProps {
  step: TutorialStep | null; // Null means minimized
  tracks: { [key: string]: boolean[] };
  reverbMix: number;
  onNext: (nextStep: TutorialStep) => void;
  onClose: () => void;
  onStart: () => void;
  onRestart?: () => void;
}

const steps: Record<string, { title: string; text: string; action: string | null; target?: string }> = {
  'intro': {
    title: "Welcome to the Lab",
    text: "I'm 'The Producer'. I'm here to help you make your first House beat. Ready to start?",
    action: "Let's Make a Beat"
  },
  'kick': {
    title: "Step 1: The Foundation",
    text: "Every house track needs a solid foundation. Place a Kick drum on the downbeats: columns 1, 5, 9, and 13.",
    action: null, // Auto-advance on pattern match
    target: "kick"
  },
  'snare': {
    title: "Step 2: The Snap",
    text: "Now for the energy. The Snare makes you clap. Place a Snare on columns 5 and 13 (layered with the kick).",
    action: null,
    target: "snare"
  },
  'hihat': {
    title: "Step 3: The Drive",
    text: "It's too empty between beats. Fill the gaps. Place Hi-Hats on every odd number (3, 7, 11, 15).",
    action: null,
    target: "hihat"
  },
  'bass': {
    title: "Step 4: The Grounding",
    text: "Drums are the skeleton. Bass is the muscle. It connects rhythm to melody. Let's add a simple bass groove on the 'off-beats' (columns 3, 7, 11, 15) to create bounce.",
    action: null,
    target: "bass"
  },
  'synth': {
    title: "Step 5: The Harmony",
    text: "Now for the emotion. Synths provide the chords or 'hooks'. Let's add some stabs to fill the space on columns 5 and 13.",
    action: null,
    target: "synth"
  },
  'reverb': {
    title: "Step 6: The Vibe",
    text: "Now blend it all together with Reverb. Click 'Reverb' to turn it on, then set the slider to around 40%.",
    action: null,
    target: "reverb"
  },
  'complete': {
    title: "You're a Producer!",
    text: "You just built a standard House drum pattern with bass and synth layers. This is the skeleton of modern pop music.",
    action: "Free Play"
  }
};

export function RhythmCoach({ step, tracks, reverbMix, onNext, onClose, onStart, onRestart }: RhythmCoachProps) {

  // Validation Logic
  useEffect(() => {
    if (!step) return;

    let timeout: NodeJS.Timeout;

    const checkPattern = () => {
      if (step === 'kick') {
        // Kick on 0, 4, 8, 12 (1, 5, 9, 13)
        const k = tracks['kick'];
        if (k[0] && k[4] && k[8] && k[12]) {
           timeout = setTimeout(() => onNext('snare'), 500);
        }
      } else if (step === 'snare') {
        // Snare on 4, 12 (5, 13)
        const s = tracks['snare'];
        if (s[4] && s[12]) {
           timeout = setTimeout(() => onNext('hihat'), 500);
        }
      } else if (step === 'hihat') {
        // Hi-Hat on 2, 6, 10, 14 (3, 7, 11, 15)
        const h = tracks['hihat'];
        if (h[2] && h[6] && h[10] && h[14]) {
           timeout = setTimeout(() => onNext('bass'), 500);
        }
      } else if (step === 'bass') {
        // Bass on 2, 6, 10, 14 (3, 7, 11, 15)
        const b = tracks['bass'];
        if (b[2] && b[6] && b[10] && b[14]) {
           timeout = setTimeout(() => onNext('synth'), 500);
        }
      } else if (step === 'synth') {
        // Synth on 4, 12 (5, 13)
        const sy = tracks['synth'];
        if (sy[4] && sy[12]) {
           timeout = setTimeout(() => onNext('reverb'), 500);
        }
      } else if (step === 'reverb') {
        // Reverb around 40% (35-45 range)
        if (reverbMix >= 35 && reverbMix <= 45) {
           timeout = setTimeout(() => onNext('complete'), 500);
        }
      }
    };

    checkPattern();

    return () => clearTimeout(timeout);
  }, [step, tracks, reverbMix, onNext]);

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

  const isCenter = step === 'intro';
  const isMinimized = !step;
  const content = step ? steps[step] : null;

  return (
    <AnimatePresence mode="wait">
        {/* Minimized State */}
        {isMinimized && (
            <motion.div
                key="minimized"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    variant="default"
                    size="icon"
                    onClick={onRestart || onStart}
                    className="w-12 h-12 rounded-full bg-music-primary hover:bg-music-secondary shadow-lg shadow-music-primary/30 text-white"
                >
                    <HelpCircle className="w-6 h-6" />
                </Button>
            </motion.div>
        )}

        {/* Active Tutorial State */}
        {!isMinimized && step && (
            <div className={`fixed inset-0 z-[100] pointer-events-none flex ${isCenter ? 'items-center justify-center bg-black/50 backdrop-blur-sm' : ''}`}>
                {/* Corner Layout Container */}
                {!isCenter && (
                     // Fixed container at bottom-right for Corner state
                    <div className="fixed bottom-6 right-6 w-[350px] z-40 pointer-events-none flex items-end justify-end">
                        {/* We use a wrapper here to ensure layout matches requirements */}
                         <motion.div
                            layoutId="tutorial-card"
                            className="w-full pointer-events-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <TutorialCard
                                step={step}
                                content={content!}
                                isCenter={false}
                                onNext={onNext}
                                onClose={onClose}
                                onStart={onStart}
                            />
                        </motion.div>
                    </div>
                )}

                {/* Center Layout */}
                {isCenter && (
                    <motion.div
                        layoutId="tutorial-card"
                        className="pointer-events-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                         <TutorialCard
                            step={step}
                            content={content!}
                            isCenter={true}
                            onNext={onNext}
                            onClose={onClose}
                            onStart={onStart}
                        />
                    </motion.div>
                )}
            </div>
        )}
    </AnimatePresence>
  );
}

// Subcomponent for cleaner render
function TutorialCard({ step, content, isCenter, onNext, onClose, onStart }: {
    step: TutorialStep,
    content: { title: string, text: string, action: string | null },
    isCenter: boolean,
    onNext: (s: TutorialStep) => void,
    onClose: () => void,
    onStart: () => void
}) {
    return (
        <Card className={`
            bg-music-dark/95 backdrop-blur-xl border border-music-primary shadow-[0_10px_40px_-10px_rgba(209,102,102,0.5)]
            relative overflow-hidden transition-all duration-500
            ${isCenter ? 'max-w-md p-8' : 'w-full p-6'}
        `}>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-music-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Close Button (only if not intro) */}
            {!isCenter && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 text-music-light/50 hover:text-white transition-colors z-20"
                    aria-label="Close tutorial"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <div className="relative z-10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-music-primary to-music-secondary flex items-center justify-center border-2 border-white/20 shadow-lg relative z-10">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-music-primary rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-white text-lg">The Producer</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${step === 'complete' ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`} />
                            <span className="text-[10px] text-music-light uppercase tracking-widest font-mono">Rhythm Coach</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <motion.h4
                        key={step + "title"}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-bold text-music-primary mb-2"
                    >
                        {content?.title}
                    </motion.h4>
                    <motion.p
                        key={step + "text"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-sm leading-relaxed"
                    >
                        {content?.text}
                    </motion.p>
                </div>

                {/* Waveform Animation (Only on Complete) */}
                {step === 'complete' && (
                    <div className="h-12 w-full bg-black/20 rounded-lg flex items-center justify-center gap-1 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-music-primary/50 rounded-full"
                                animate={{ height: [10, 30, 10] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.5 + Math.random() * 0.5,
                                    delay: Math.random() * 0.5
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Action */}
                <div className="pt-2">
                    {content?.action ? (
                            <Button
                            onClick={step === 'intro' ? onStart : onClose}
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
    );
}
