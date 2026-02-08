'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

// --- Types ---
interface TelemetryStats {
  speed: number;
  control: number;
  tireWear: number;
  engineHealth: number;
  lapTime: number; // in seconds
}

// --- Configuration ---
const FRAME_COUNT = 120;
const SCROLL_HEIGHT = '400vh'; // Total scroll distance

// --- Telemetry Data Logic ---
// Base stats at start
const BASE_STATS: TelemetryStats = {
  speed: 70,
  control: 70,
  tireWear: 100, // 100% health
  engineHealth: 100, // 100% health
  lapTime: 95.0, // seconds
};

export default function F1ScrollDemo() {
  // --- Refs & State ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Scroll hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll progress for the frame index to avoid jumpiness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  // --- Telemetry State ---
  const [stats, setStats] = useState<TelemetryStats>(BASE_STATS);

  // --- Asset Preloading ---
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const loadImages = async () => {
      // 1-based indexing for filenames: frame_0001.webp to frame_0120.webp
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Pad with leading zeros
        const frameNum = i.toString().padStart(4, '0');
        img.src = `/f1-frames/frame_${frameNum}.webp`;
        
        // We'll rely on onload to track progress
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
          if (loadedCount === FRAME_COUNT) {
            setImagesLoaded(true);
          }
        };
        // If error (e.g. missing file), we set a placeholder color in draw
        img.onerror = () => {
           loadedCount++;
           setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
           if (loadedCount === FRAME_COUNT) {
             setImagesLoaded(true); // Still "loaded" even if some fail, to avoid blocking
           }
        };

        imgArray.push(img);
      }
      setImages(imgArray);
    };

    loadImages();
  }, []);

  // --- Canvas Rendering Loop ---
  useEffect(() => {
    // We only start rendering loop if we have a canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper to draw a frame
    const render = (index: number) => {
       // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Guard: images not ready
      if (!images[index]) {
         // Create a placeholder gradient if image is missing/loading
         const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
         grd.addColorStop(0, '#111');
         grd.addColorStop(1, '#333');
         ctx.fillStyle = grd;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         
         ctx.fillStyle = '#fff';
         ctx.font = '30px sans-serif';
         ctx.textAlign = 'center';
         ctx.fillText(`Frame ${index + 1}`, canvas.width / 2, canvas.height / 2);
         return;
      }
      
      const img = images[index];

      // "Contain" logic
      // We want to draw the image centered, maintaining aspect ratio, fully visible
      // However, if the image failed to load or has 0 width, skip
      if (!img.complete || img.naturalWidth === 0) {
         // Placeholder
         ctx.fillStyle = '#222';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         return;
      }

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image -> fit by height
        drawHeight = canvas.height;
        drawWidth = img.naturalWidth * (canvas.height / img.naturalHeight);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Canvas is taller/narrower -> fit by width
        drawWidth = canvas.width;
        drawHeight = img.naturalHeight * (canvas.width / img.naturalWidth);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Use unsubscribe to clean up motion value listener if needed, 
    // but here we just want to render on change.
    const unsubscribe = smoothProgress.on('change', (latest) => {
      // Map 0..1 to 0..(FRAME_COUNT - 1)
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(latest * (FRAME_COUNT - 1)))
      );
      
      requestAnimationFrame(() => render(frameIndex));
    });

    // Initial draw
    render(0);

    // Handle Resize
    const handleResize = () => {
      // Set canvas internal resolution to match display size * pixel ratio
      const dpr = window.devicePixelRatio || 1;
      // We rely on CSS to set the display size (w-full h-screen)
      // canvas.width/height attributes set the buffer size.
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Normalize coordinate system if needed, or just let drawImage handle it?
      // Usually easier to just draw scaled.
      // But let's scale the context so we can draw using logical pixels if we were doing vectos,
      // For images, we just calculated draw coords based on canvas.width/height (buffer size).
      // So no context scale needed given our render logic uses canvas.width directly.
      
      // Trigger a re-render of current frame
      const currentProgress = smoothProgress.get();
      const frameIndex = Math.min(
         FRAME_COUNT - 1, 
         Math.max(0, Math.round(currentProgress * (FRAME_COUNT - 1)))
      );
      render(frameIndex);
    };

    window.addEventListener('resize', handleResize);
    // Call once to setup
    handleResize();

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [images, smoothProgress, imagesLoaded]);


  // --- Logic for Telemetry Updates based on Scroll ---
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
     // Default
     let newStats = { ...BASE_STATS };

     // 25% Scroll: Tires
     // Choices: "Grip, balanced, or speed." 
     // We'll simulate a choice made automatically for this linear demo: "Balanced" -> +Control, small speed gain
     if (latest > 0.22) {
       newStats.control += 10;
       newStats.speed += 2;
       newStats.tireWear -= 5; // Better rubber
       newStats.lapTime -= 0.5;
     }

     // 50% Scroll: Engine
     // "Performance boost" -> +Speed, -Reliability
     if (latest > 0.47) {
       newStats.speed += 15;
       newStats.engineHealth -= 10; // Pushing it harder
       newStats.lapTime -= 1.2;
     }

     // 75% Scroll: Aero
     // "Stability" -> +Control, slight drag
     if (latest > 0.72) {
        newStats.control += 15;
        newStats.speed -= 2; // Drag
        newStats.lapTime -= 0.8; // Better cornering makes up for drag
     }

     // Clamp values
     setStats({
       speed: Math.min(100, Math.max(0, newStats.speed)),
       control: Math.min(100, Math.max(0, newStats.control)),
       tireWear: Math.min(100, Math.max(0, newStats.tireWear)),
       engineHealth: Math.min(100, Math.max(0, newStats.engineHealth)),
       lapTime: Number(newStats.lapTime.toFixed(2)),
     });
  });

  // --- Loading Screen ---
  if (!imagesLoaded) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white z-50">
        <div className="text-2xl font-bold mb-4 font-display">INITIALIZING SYSTEMS</div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-400 font-mono">{loadingProgress}%</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative bg-black w-full" style={{ height: SCROLL_HEIGHT }}>
      
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full object-contain"
        />
        
        {/* Telemetry Overlay (Pinned Bottom Right) */}
        <TelemetryPanel stats={stats} />
      </div>

      {/* Scroll-triggered Text Overlays */}
      {/* Absolute positioning relative to the container is tricky since container is 400vh.
          Instead, we can use fixed overlays that fade in/out based on scroll progress, 
          OR absolute divs placed at specific % of the container height.
          
          Let's use absolute divs at percentages.
      */}
      
      {/* 0% - Start */}
      <OverlaySection top="5%" align="center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-display">
          PIT STOP CHALLENGE
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-lg mx-auto">
          Make quick decisions. Watch the car evolve.
        </p>
        <div className="mt-8 animate-bounce text-gray-500">
           Scroll to Start ↓
        </div>
      </OverlaySection>

      {/* 25% - Tires */}
      <OverlaySection top="25%" align="left">
        <div className="md:ml-20 ml-8 max-w-md">
           <h2 className="text-4xl font-bold text-red-500 mb-2 font-display">TIRES</h2>
           <p className="text-2xl text-white mb-1">Compound Selection</p>
           <p className="text-lg text-gray-400">
             Choose between grip, balance, or raw speed. <br/>
             <span className="text-red-400 text-sm block mt-2">Current: Balanced Compound</span>
           </p>
        </div>
      </OverlaySection>

      {/* 50% - Engine */}
      <OverlaySection top="50%" align="right">
        <div className="md:mr-20 mr-8 max-w-md text-right ml-auto">
           <h2 className="text-4xl font-bold text-yellow-500 mb-2 font-display">ENGINE MAP</h2>
           <p className="text-2xl text-white mb-1">Power Unit Config</p>
           <p className="text-lg text-gray-400">
             Prioritize qualifying performance or race reliability. <br/>
             <span className="text-yellow-400 text-sm block mt-2">Current: Aggressive Map</span>
           </p>
        </div>
      </OverlaySection>

      {/* 75% - Aero */}
      <OverlaySection top="75%" align="left">
        <div className="md:ml-20 ml-8 max-w-md">
           <h2 className="text-4xl font-bold text-blue-500 mb-2 font-display">AERODYNAMICS</h2>
           <p className="text-2xl text-white mb-1">Wing Angle</p>
           <p className="text-lg text-gray-400">
             High downforce for potential cornering or low drag for staights. <br/>
             <span className="text-blue-400 text-sm block mt-2">Current: High Downforce</span>
           </p>
        </div>
      </OverlaySection>

      {/* 92% - Finish */}
      <OverlaySection top="92%" align="center">
         <h2 className="text-6xl font-bold text-white mb-6 font-display">READY TO RACE</h2>
         <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xl transition-transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            ENTER TRACK
         </button>
      </OverlaySection>

    </div>
  );
}

// --- Helper Components ---

function OverlaySection({ 
  children, 
  top, 
  align = 'left' 
}: { 
  children: React.ReactNode; 
  top: string;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <div 
      className={`absolute w-full px-6 pointer-events-none flex`}
      style={{ 
        top: top,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      <div className={`pointer-events-auto bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 ${align === 'center' ? 'text-center' : ''}`}>
        {children}
      </div>
    </div>
  );
}

function TelemetryPanel({ stats }: { stats: TelemetryStats }) {
  return (
    <div className="absolute bottom-6 right-6 w-64 md:w-80 bg-black/80 backdrop-blur-md border border-gray-800 rounded-xl p-4 text-white font-mono z-20 shadow-2xl">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
         <span className="text-xs uppercase tracking-widest text-gray-400">Live Telemetry</span>
         <span className="text-xs text-red-500 animate-pulse">● REC</span>
      </div>

      <div className="space-y-4">
        {/* Speed */}
        <StatBar label="Speed" value={stats.speed} color="bg-cyan-400" />
        
        {/* Control */}
        <StatBar label="Control" value={stats.control} color="bg-purple-400" />
        
        {/* Wear */}
        <StatBar label="Tire Health" value={stats.tireWear} color="bg-green-400" />
        
        {/* Engine */}
        <StatBar label="Engine Integrity" value={stats.engineHealth} color="bg-orange-400" />

        {/* Lap Time */}
        <div className="flex justify-between items-end mt-4 pt-2 border-t border-gray-700">
           <span className="text-xs text-gray-400">Est. Lap Time</span>
           <span className="text-xl font-bold text-white">{stats.lapTime.toFixed(2)}s</span>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-500">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />
      </div>
    </div>
  );
}
