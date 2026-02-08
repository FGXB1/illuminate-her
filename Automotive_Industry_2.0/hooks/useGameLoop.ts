"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CarStats, INITIAL_STATS, PitStopAction, LAP_DISTANCE } from '../lib/types';

const TICK_RATE = 100; // ms
const BASE_SPEED = 280; // km/h

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('pit_stop');
  const [stats, setStats] = useState<CarStats>(INITIAL_STATS);
  const [distance, setDistance] = useState(0);

  // Race timing state
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [totalRaceTime, setTotalRaceTime] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState(0);

  // Refs to access latest state inside interval without triggering re-renders or recreating interval
  const stateRef = useRef({
    gameState,
    stats,
    distance,
    lapTimes,
    totalRaceTime,
    currentLapTime
  });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      gameState,
      stats,
      distance,
      lapTimes,
      totalRaceTime,
      currentLapTime
    };
  }, [gameState, stats, distance, lapTimes, totalRaceTime, currentLapTime]);

  const startRace = useCallback(() => {
    setGameState('racing');
    // If resetting race (e.g. from finished state or fresh start)
    // We check if lap > totalLaps or just reset if desired.
    // For now, let's just set to racing. If we want restart, we need a reset function.
  }, []);

  const resetRace = useCallback(() => {
    setStats(INITIAL_STATS);
    setDistance(0);
    setLapTimes([]);
    setTotalRaceTime(0);
    setCurrentLapTime(0);
    setGameState('racing');
  }, []);

  const enterPitStop = useCallback(() => {
    setGameState('pit_stop');
    setStats(prev => ({ ...prev, pitStops: prev.pitStops + 1 }));
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
    // Only run loop if racing
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      const {
        stats: prevStats,
        distance: prevDist,
        lapTimes: prevLapTimes,
        totalRaceTime: prevTotalTime,
        currentLapTime: prevCurrentLapTime
      } = stateRef.current;

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
           // In this simplified version, we just stop.
           // In a real game, this might trigger a 'retired' state.
      }

      // 2. Calculate Distance
      // distance = speed (km/h) * time (h) * 1000 (m/km)
      const distDelta = (currentSpeed * 1000) * (TICK_RATE / 3600000);
      const newTotalDistance = prevDist + distDelta;

      // 3. Calculate Lap
      // Lap starts at 1.
      // Distance 0 to LAP_DISTANCE is Lap 1.
      // Distance LAP_DISTANCE to 2*LAP_DISTANCE is Lap 2.
      const currentLap = Math.floor(newTotalDistance / LAP_DISTANCE) + 1;

      // 4. Update Time
      let newTotalTime = prevTotalTime + TICK_RATE;
      let newCurrentLapTime = prevCurrentLapTime + TICK_RATE;
      let newLapTimes = [...prevLapTimes];

      // Check for Lap Completion
      if (currentLap > prevStats.lap) {
          // Lap just finished
          // Record the time for the completed lap
          newLapTimes.push(newCurrentLapTime);
          newCurrentLapTime = 0;
      }

      // 5. Update State
      const newStats = {
          ...prevStats,
          speed: currentSpeed,
          fuel: newFuel,
          tireWear: newTireWear,
          engineHealth: newEngineHealth,
          lap: currentLap,
          position: prevStats.position // Position logic not implemented (single player)
      };

      // Check Finish Condition
      if (currentLap > prevStats.totalLaps) {
          setGameState('finished');
          // Update stats one last time to show final state
          setStats(newStats);
          setDistance(newTotalDistance);
          setLapTimes(newLapTimes);
          setTotalRaceTime(newTotalTime);
          setCurrentLapTime(newCurrentLapTime);
      } else {
          setStats(newStats);
          setDistance(newTotalDistance);
          setLapTimes(newLapTimes);
          setTotalRaceTime(newTotalTime);
          setCurrentLapTime(newCurrentLapTime);
      }

    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState]); // Only re-run if gameState changes (start/stop)

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
