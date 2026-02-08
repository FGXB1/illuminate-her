"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CarStats, INITIAL_STATS, PitStopAction } from '../lib/types';
import { updateRaceLogic, RaceLogicState } from '../lib/gameLogic';

const TICK_RATE = 50; // ms

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('pit_stop');
  const [stats, setStats] = useState<CarStats>(INITIAL_STATS);
  const [distance, setDistance] = useState(0);

  // Race timing state
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [totalRaceTime, setTotalRaceTime] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState(0);

  // Refs to access latest state inside interval
  // We store the ENTIRE simulation state in a ref to avoid stale closures
  const stateRef = useRef<RaceLogicState>({
    gameState: 'pit_stop',
    stats: INITIAL_STATS,
    distance: 0,
    lapTimes: [],
    currentLapTime: 0,
    totalRaceTime: 0
  });

  const startRace = useCallback(() => {
    setGameState('racing');
    stateRef.current.gameState = 'racing';
  }, []);

  const resetRace = useCallback(() => {
    const newState: RaceLogicState = {
        gameState: 'racing',
        stats: INITIAL_STATS,
        distance: 0,
        lapTimes: [],
        currentLapTime: 0,
        totalRaceTime: 0
    };
    stateRef.current = newState;

    // Sync React state
    setGameState('racing');
    setStats(INITIAL_STATS);
    setDistance(0);
    setLapTimes([]);
    setTotalRaceTime(0);
    setCurrentLapTime(0);
  }, []);

  const enterPitStop = useCallback(() => {
    setGameState('pit_stop');
    stateRef.current.gameState = 'pit_stop';

    // Increment pit stops
    const newStats = {
        ...stateRef.current.stats,
        pitStops: stateRef.current.stats.pitStops + 1
    };
    stateRef.current.stats = newStats;
    setStats(newStats);
  }, []);

  const applyPitStopAction = useCallback((action: PitStopAction) => {
    const prevStats = stateRef.current.stats;
    let newStats = { ...prevStats };
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
    stateRef.current.stats = newStats;
    setStats(newStats);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Logic
      const prevState = stateRef.current;

      if (prevState.gameState === 'racing') {
          const newState = updateRaceLogic(prevState, TICK_RATE);
          stateRef.current = newState;

          // 2. Sync to React State
          setStats(newState.stats);
          setDistance(newState.distance);
          setLapTimes(newState.lapTimes);
          setTotalRaceTime(newState.totalRaceTime);
          setCurrentLapTime(newState.currentLapTime);

          if (newState.gameState !== gameState) {
              setGameState(newState.gameState);
              // Also sync internal ref if it changed (it did, via updateRaceLogic)
          }
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState]);

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
