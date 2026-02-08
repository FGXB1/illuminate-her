export type GameState = 'racing' | 'pit_stop' | 'finished';

export type PitStopAction = 'change_tires' | 'refuel' | 'fix_engine';

export interface PitChange {
  action: PitStopAction;
  cost: number;
}

export interface PitStopRecord {
  lap: number;
  durationMs: number;
  changes: PitChange[];
}

export interface CarStats {
  speed: number;        // km/h
  fuel: number;         // percentage 0-100
  tireWear: number;     // percentage 0-100 (0 is new, 100 is blown)
  engineHealth: number; // percentage 0-100 (100 is perfect)
  lap: number;
  totalLaps: number;
  position: number;
  pitStops: PitStopRecord[]; // History of pit stops
}

export const INITIAL_STATS: CarStats = {
  speed: 0,
  fuel: 100,
  tireWear: 0,
  engineHealth: 100,
  lap: 1,
  totalLaps: 5,
  position: 1,
  pitStops: [],
};

export interface PitStopOption {
  id: PitStopAction;
  label: string;
  description: string;
  costTime: number; // seconds added to race time
  effect: (stats: CarStats) => CarStats;
}
