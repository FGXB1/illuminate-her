"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CarStats, INITIAL_STATS, PitStopAction, PitStopRecord, LAP_DISTANCE } from '../lib/types';

const TICK_RATE = 50; // ms  (20 updates/sec for game logic)
const BASE_SPEED = 180; // km/h
const UI_SYNC_EVERY = 5; // sync React state every 5 ticks (~250ms, 4 UI updates/sec)

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('pit_stop');
  const [stats, setStats] = useState<CarStats>(INITIAL_STATS);
  const [distance, setDistance] = useState(0);

  // Race timing state
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [totalRaceTime, setTotalRaceTime] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState(0);

  // Pit stop history and current pit timing
  const [pitStopHistory, setPitStopHistory] = useState<PitStopRecord[]>([]);
  const [pitStopElapsedMs, setPitStopElapsedMs] = useState(0);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const pitStopStartTimeRef = useRef<number>(0);
  const currentPitActionsRef = useRef<PitStopAction[]>([]);

  // ── Authoritative refs: updated every tick, no React re-renders ──
  /** 3D scene reads this directly via useFrame — always up-to-date at 60 fps. */
  const distanceRef = useRef(0);
  const authStats = useRef<CarStats>(INITIAL_STATS);
  const authDistance = useRef(0);
  const authLapTimes = useRef<number[]>([]);
  const authTotalRaceTime = useRef(0);
  const authCurrentLapTime = useRef(0);
  const tickCount = useRef(0);

  // Ref for reading gameState inside callbacks without stale closures
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const startRace = useCallback(() => {
    // If exiting pit stop, record pit stop and resume race
    if (gameStateRef.current === 'pit_stop') {
      const durationMs = Date.now() - pitStopStartTimeRef.current;
      setPitStopHistory((prev) => [
        ...prev,
        { lap: authStats.current.lap, durationMs, changes: [...currentPitActionsRef.current] }
      ]);
      currentPitActionsRef.current = [];
      const updatedStats = { ...authStats.current, pitStops: authStats.current.pitStops + 1 };
      authStats.current = updatedStats;
      setStats(updatedStats);
    }
    setGameState('racing');
  }, []);

  const resetRace = useCallback(() => {
    // Reset authoritative refs
    authStats.current = INITIAL_STATS;
    authDistance.current = 0;
    distanceRef.current = 0;
    authLapTimes.current = [];
    authTotalRaceTime.current = 0;
    authCurrentLapTime.current = 0;
    tickCount.current = 0;

    // Reset React state
    setStats(INITIAL_STATS);
    setDistance(0);
    setLapTimes([]);
    setTotalRaceTime(0);
    setCurrentLapTime(0);
    setPitStopHistory([]);
    setFailureReason(null);
    currentPitActionsRef.current = [];
    setGameState('racing');
  }, []);

  const enterPitStop = useCallback(() => {
    pitStopStartTimeRef.current = Date.now();
    currentPitActionsRef.current = [];
    setPitStopElapsedMs(0);
    setGameState('pit_stop');
  }, []);

  // One fix per pit stop: only apply if no action has been taken this pit
  const applyPitStopAction = useCallback((action: PitStopAction) => {
    if (currentPitActionsRef.current.length >= 1) return;
    currentPitActionsRef.current.push(action);
    const prev = authStats.current;
    const newStats = { ...prev };
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
    authStats.current = newStats;
    setStats(newStats);
  }, []);

  // Update pit stop elapsed timer while in pit
  useEffect(() => {
    if (gameState !== 'pit_stop') return;
    const interval = setInterval(() => {
      setPitStopElapsedMs(Date.now() - pitStopStartTimeRef.current);
    }, 200);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    // Only run loop if racing
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      const prevStats = authStats.current;
      const prevDist = authDistance.current;
      const prevLapTimes = authLapTimes.current;
      const prevTotalTime = authTotalRaceTime.current;
      const prevCurrentLapTime = authCurrentLapTime.current;

      // 1. Calculate Stat Degradation
      const healthFactor = (prevStats.engineHealth / 100);
      const tireFactor = (1 - (prevStats.tireWear / 100));

      const fuelConsumption = 0.038;
      const tireWearRate = 0.058;
      const engineWearRate = 0.02;

      let newFuel = Math.max(0, prevStats.fuel - fuelConsumption);
      let newTireWear = Math.min(100, prevStats.tireWear + tireWearRate);
      let newEngineHealth = Math.max(0, prevStats.engineHealth - engineWearRate);

      let currentSpeed = BASE_SPEED * healthFactor * (0.8 + 0.2 * tireFactor);

      // Reduced randomness for less visual jitter
      currentSpeed += (Math.random() - 0.5) * 2;
      currentSpeed = Math.max(0, currentSpeed);

      // Critical failure: stat hit 0 → race over
      if (newFuel <= 0 || newTireWear >= 100 || newEngineHealth <= 0) {
        const failReason =
          newFuel <= 0 ? "fuel" :
          newTireWear >= 100 ? "tires" : "engine";
        const failStats = {
          ...prevStats,
          speed: 0,
          fuel: newFuel,
          tireWear: newTireWear,
          engineHealth: newEngineHealth,
          lap: prevStats.lap,
        };
        authStats.current = failStats;
        // Immediate sync for state transition
        setGameState('car_failure');
        setStats(failStats);
        setDistance(prevDist);
        setFailureReason(failReason);
        return;
      }

      // 2. Calculate Distance
      // distance = speed (km/h) * time (h) * 1000 (m/km)
      const distDelta = (currentSpeed * 1000) * (TICK_RATE / 3600000);
      const newTotalDistance = prevDist + distDelta;

      // 3. Calculate Lap
      const currentLap = Math.floor(newTotalDistance / LAP_DISTANCE) + 1;

      // 4. Update Time
      let newTotalTime = prevTotalTime + TICK_RATE;
      let newCurrentLapTime = prevCurrentLapTime + TICK_RATE;
      let newLapTimes = [...prevLapTimes];

      // Check for Lap Completion
      if (currentLap > prevStats.lap) {
          newLapTimes.push(newCurrentLapTime);
          newCurrentLapTime = 0;
      }

      // 5. Build new stats
      const newStats = {
          ...prevStats,
          speed: currentSpeed,
          fuel: newFuel,
          tireWear: newTireWear,
          engineHealth: newEngineHealth,
          lap: currentLap,
          position: prevStats.position
      };

      // ── Always update authoritative refs immediately (no re-renders) ──
      authStats.current = newStats;
      authDistance.current = newTotalDistance;
      distanceRef.current = newTotalDistance;   // 3D scene reads this
      authLapTimes.current = newLapTimes;
      authTotalRaceTime.current = newTotalTime;
      authCurrentLapTime.current = newCurrentLapTime;

      // ── State transitions: sync React state immediately ──
      if (currentLap > prevStats.totalLaps) {
          setGameState('finished');
          setStats(newStats);
          setDistance(newTotalDistance);
          setLapTimes(newLapTimes);
          setTotalRaceTime(newTotalTime);
          setCurrentLapTime(newCurrentLapTime);
      } else if (currentLap > prevStats.lap) {
          // Lap completed → pit stop
          pitStopStartTimeRef.current = Date.now();
          currentPitActionsRef.current = [];
          setPitStopElapsedMs(0);
          setGameState('pit_stop');
          setStats(newStats);
          setDistance(newTotalDistance);
          setLapTimes(newLapTimes);
          setTotalRaceTime(newTotalTime);
          setCurrentLapTime(newCurrentLapTime);
      } else {
          // Normal racing tick: throttle React state updates for UI (Dashboard)
          tickCount.current++;
          if (tickCount.current % UI_SYNC_EVERY === 0) {
            setStats(newStats);
            setDistance(newTotalDistance);
            setLapTimes(newLapTimes);
            setTotalRaceTime(newTotalTime);
            setCurrentLapTime(newCurrentLapTime);
          }
      }

    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState]); // Only re-run if gameState changes (start/stop)

  return {
    gameState,
    stats,
    distance,
    distanceRef,
    lapTimes,
    totalRaceTime,
    pitStopHistory,
    pitStopElapsedMs,
    failureReason,
    startRace,
    resetRace,
    enterPitStop,
    applyPitStopAction
  };
}
