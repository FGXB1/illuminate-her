"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CarStats, INITIAL_STATS, PitStopAction } from '../lib/types';
import { LAP_DISTANCE } from '../lib/track';

const TICK_RATE = 100; // ms
const BASE_SPEED = 120; // km/h

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('pit_stop');

  // React State for UI rendering
  const [stats, setStats] = useState<CarStats>(INITIAL_STATS);
  const [distance, setDistance] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [totalRaceTime, setTotalRaceTime] = useState(0);

  // Authoritative Simulation State
  const simState = useRef({
    stats: { ...INITIAL_STATS },
    distance: 0,
    lapTimes: [] as number[],
    totalRaceTime: 0,
    currentLapTime: 0
  });

  // Sync ref to state for rendering
  const syncState = useCallback(() => {
    setStats({ ...simState.current.stats });
    setDistance(simState.current.distance);
    setLapTimes([...simState.current.lapTimes]);
    setTotalRaceTime(simState.current.totalRaceTime);
  }, []);

  const startRace = useCallback(() => {
    setGameState('racing');
  }, []);

  const resetRace = useCallback(() => {
    simState.current = {
      stats: { ...INITIAL_STATS },
      distance: 0,
      lapTimes: [],
      totalRaceTime: 0,
      currentLapTime: 0
    };
    syncState();
    setGameState('racing');
  }, [syncState]);

  const enterPitStop = useCallback(() => {
    setGameState('pit_stop');
    simState.current.stats.speed = 0;
    simState.current.stats.pitStops.push({
      lap: simState.current.stats.lap,
      durationMs: 0,
      changes: []
    });
    syncState();
  }, [syncState]);

  const applyPitStopAction = useCallback((action: PitStopAction) => {
    const s = simState.current.stats;
    const currentStop = s.pitStops[s.pitStops.length - 1];

    let cost = 0;
    switch (action) {
      case 'change_tires':
        s.tireWear = 0;
        cost = 3000;
        break;
      case 'refuel':
        s.fuel = 100;
        cost = 5000;
        break;
      case 'fix_engine':
        s.engineHealth = 100;
        cost = 8000;
        break;
    }

    if (currentStop) {
        currentStop.changes.push({ action, cost });
        currentStop.durationMs += cost;
    }
    simState.current.totalRaceTime += cost;

    syncState();
  }, [syncState]);

  useEffect(() => {
    // Only run loop if racing
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      const currentSim = simState.current;
      const prevStats = currentSim.stats;

      // 1. Calculate Stat Degradation
        const healthFactor = (prevStats.engineHealth / 100);
        const tireFactor = (1 - (prevStats.tireWear / 100));

        const fuelConsumption = 0.05;
        const tireWearRate = 0.08;
        const engineWearRate = 0.02;

        let newFuel = Math.max(0, prevStats.fuel - fuelConsumption);
        let newTireWear = Math.min(100, prevStats.tireWear + tireWearRate);
        let newEngineHealth = Math.max(0, prevStats.engineHealth - engineWearRate);

        let currentSpeed = BASE_SPEED * healthFactor * (0.8 + 0.2 * tireFactor);

        // Add randomness
        currentSpeed += (Math.random() - 0.5) * 10;
        currentSpeed = Math.max(0, currentSpeed);

        // Force stop if critical failure
        if (newFuel <= 0 || newTireWear >= 100 || newEngineHealth <= 0) {
            currentSpeed = 0;
        }

        // 2. Calculate Distance
        const distDelta = (currentSpeed * 1000) * (TICK_RATE / 3600000);
        const newTotalDistance = currentSim.distance + distDelta;

        // 3. Calculate Lap
        const currentLap = Math.floor(newTotalDistance / LAP_DISTANCE) + 1;

        // 4. Update Time
        currentSim.totalRaceTime += TICK_RATE;
        currentSim.currentLapTime += TICK_RATE;

        // 5. Check for Lap Completion
        const oldLap = prevStats.lap; // Capture old lap BEFORE update
        const totalLaps = prevStats.totalLaps;

        let nextGameState: GameState = 'racing';

        // Update Stats Object
        currentSim.stats.speed = currentSpeed;
        currentSim.stats.fuel = newFuel;
        currentSim.stats.tireWear = newTireWear;
        currentSim.stats.engineHealth = newEngineHealth;
        currentSim.stats.lap = currentLap;
        currentSim.distance = newTotalDistance;

        if (currentLap > oldLap) {
            // Lap just finished
            currentSim.lapTimes.push(currentSim.currentLapTime);
            currentSim.currentLapTime = 0;

            if (currentLap > totalLaps) {
                nextGameState = 'finished';
            } else {
                nextGameState = 'pit_stop';
                currentSim.stats.speed = 0;
                currentSim.stats.pitStops.push({
                    lap: oldLap,
                    durationMs: 0,
                    changes: []
                });
            }
        }

        // Sync to React State
        syncState();

        if (nextGameState !== 'racing') {
            setGameState(nextGameState);
        }

    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState, syncState]); // Re-run if gameState changes

  return {
    gameState,
    stats,
    distance,
    lapTimes,
    totalRaceTime,
    startRace,
    resetRace,
    enterPitStop,
    applyPitStopAction
  };
}
