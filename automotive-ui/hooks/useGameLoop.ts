"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CarStats, INITIAL_STATS, PitStopAction } from '../lib/types';

const TICK_RATE = 100; // ms
const LAP_DISTANCE = 5000; // virtual meters
const BASE_SPEED = 280; // km/h

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('pit_stop'); // Start in pit stop to customize? Or ready? Let's say pit_stop as "garage"
  const [stats, setStats] = useState<CarStats>(INITIAL_STATS);
  const [distance, setDistance] = useState(0);

  const statsRef = useRef(stats);
  statsRef.current = stats;

  const startRace = useCallback(() => {
    setGameState('racing');
  }, []);

  const enterPitStop = useCallback(() => {
    setGameState('pit_stop');
  }, []);

  const applyPitStopAction = useCallback((action: PitStopAction) => {
    setStats((prev) => {
      let newStats = { ...prev };
      switch (action) {
        case 'change_tires':
          newStats.tireWear = 0;
          break;
        case 'refuel':
          newStats.fuel = 100;
          break;
        case 'fix_engine':
          newStats.engineHealth = 100;
          break;
      }
      return newStats;
    });
  }, []);

  useEffect(() => {
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      setStats((prev) => {
        // Calculate deltas
        // Speed fluctuation based on engine health and tires
        const healthFactor = (prev.engineHealth / 100);
        const tireFactor = (1 - (prev.tireWear / 100));

        // Degrade stats
        // Fuel consumption: 0.05 per tick
        const fuelConsumption = 0.05;
        // Tire wear: 0.08 per tick
        const tireWearRate = 0.08;
        // Engine wear: 0.02 per tick
        const engineWearRate = 0.02;

        const newFuel = Math.max(0, prev.fuel - fuelConsumption);
        const newTireWear = Math.min(100, prev.tireWear + tireWearRate);
        const newEngineHealth = Math.max(0, prev.engineHealth - engineWearRate);

        // Speed calculation
        let currentSpeed = BASE_SPEED * healthFactor * (0.8 + 0.2 * tireFactor);
        // Add some noise
        currentSpeed += (Math.random() - 0.5) * 10;

        // If out of fuel or blown tires, stop
        if (newFuel <= 0 || newTireWear >= 100 || newEngineHealth <= 0) {
           currentSpeed = 0;
           // Force pit stop? Or Game Over? Let's just stop for now or force pit stop
           // But we need to handle state change outside reducer-like update if possible, or use effect
        }

        return {
          ...prev,
          speed: currentSpeed,
          fuel: newFuel,
          tireWear: newTireWear,
          engineHealth: newEngineHealth,
        };
      });

      // Update distance and laps
      setDistance((prevDistance) => {
        // distance = speed (km/h) * time (h)
        // time = TICK_RATE / 3600000
        const speed = statsRef.current.speed;
        const distDelta = (speed * 1000) * (TICK_RATE / 3600000); // meters
        const newDist = prevDistance + distDelta;

        if (newDist >= LAP_DISTANCE) {
           // Lap completed
           setStats((s) => {
             const newLap = s.lap + 1;
             // Allow lap to go over totalLaps to trigger finish state in useEffect
             return { ...s, lap: newLap };
           });
           return newDist - LAP_DISTANCE;
        }
        return newDist;
      });

    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState]);

  // Watch for state transitions based on stats
  useEffect(() => {
    if (gameState === 'racing') {
        if (stats.lap > stats.totalLaps) {
            setGameState('finished');
        }
        // Auto pit stop if things are critical? Or let user fail?
        // Let's force pit stop if critical
        if (stats.fuel < 5 || stats.tireWear > 90 || stats.engineHealth < 10) {
            setGameState('pit_stop');
        }
    }
  }, [stats, gameState]);

  return {
    gameState,
    stats,
    startRace,
    enterPitStop,
    applyPitStopAction
  };
}
