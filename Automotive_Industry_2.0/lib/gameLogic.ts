import { CarStats, GameState } from './types';

export const LAP_DISTANCE = 1600; // Matches visual track scale (approx)
export const TOTAL_LAPS = 5;

// Need a combined state for the logic update
export interface RaceLogicState {
  stats: CarStats;
  gameState: GameState;
  distance: number;
  lapTimes: number[];
  currentLapTime: number;
  totalRaceTime: number;
}

export function updateRaceLogic(state: RaceLogicState, deltaMs: number): RaceLogicState {
  if (state.gameState !== 'racing') return state;

  const deltaSeconds = deltaMs / 1000;
  const { stats } = state;

  // Constants
  const MAX_SPEED = 350; // km/h
  const ACCELERATION = 80; // km/h per second (increased for snappiness)
  const DRAG = 10; // km/h per second

  // 1. Calculate new speed
  let newSpeed = stats.speed;

  // Assume auto-acceleration if fuel/engine/tires are good
  if (stats.fuel > 0 && stats.engineHealth > 0 && stats.tireWear < 100) {
      if (newSpeed < MAX_SPEED) {
          newSpeed += (ACCELERATION * deltaSeconds);
      }
  } else {
      newSpeed -= (ACCELERATION * deltaSeconds); // Decelerate if broken
  }

  // Apply drag
  if (newSpeed > 0) newSpeed -= (DRAG * deltaSeconds);

  // Clamp speed
  newSpeed = Math.max(0, Math.min(newSpeed, MAX_SPEED));

  // 2. Calculate distance
  // speed (km/h) -> m/s: / 3.6
  const speedMS = newSpeed / 3.6;
  const distDelta = speedMS * deltaSeconds;
  const newDistance = state.distance + distDelta;

  // 3. Calculate Lap
  // Lap 1: 0 - 5000. floor(0/5000) + 1 = 1.
  const calculatedLap = Math.floor(newDistance / LAP_DISTANCE) + 1;

  // 4. Update Times
  const newCurrentLapTime = state.currentLapTime + deltaMs;
  const newTotalRaceTime = state.totalRaceTime + deltaMs;

  // Check for lap completion
  let newLapTimes = [...state.lapTimes];
  let newLap = stats.lap;
  let resetLapTime = false;

  // If we moved to a new lap (and haven't finished yet)
  if (calculatedLap > stats.lap) {
      // Completed a lap!
      newLapTimes.push(newCurrentLapTime);
      newLap = calculatedLap;
      resetLapTime = true;
  }

  // Check for Finish
  let newStatus = state.gameState;

  if (newLap > TOTAL_LAPS) {
      newStatus = 'finished';
      newLap = TOTAL_LAPS; // Clamp
  }

  // 5. Update Resources
  // Simple consumption
  const fuelConsumption = 0.4 * deltaSeconds; // % per second (approx 250s endurance)
  const tireWearRate = 0.4 * deltaSeconds; // % per second (approx 250s endurance)
  const engineWearRate = (newSpeed > 300 ? 0.1 : 0.02) * deltaSeconds;

  const newStats: CarStats = {
      ...stats,
      speed: newSpeed,
      lap: newLap,
      fuel: Math.max(0, stats.fuel - fuelConsumption),
      tireWear: Math.min(100, stats.tireWear + tireWearRate),
      engineHealth: Math.max(0, stats.engineHealth - engineWearRate),
      pitStops: stats.pitStops,
      position: stats.position,
      totalLaps: stats.totalLaps
  };

  return {
    ...state,
    stats: newStats,
    gameState: newStatus,
    distance: newDistance,
    lapTimes: newLapTimes,
    currentLapTime: resetLapTime ? 0 : newCurrentLapTime,
    totalRaceTime: newTotalRaceTime
  };
}
