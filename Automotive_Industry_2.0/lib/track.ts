import * as THREE from "three";

export const TRACK_SCALE = 20; // Scale of the track visual
export const LAP_DISTANCE = 5000; // Meters in simulation

// Shared track points logic
export const TRACK_POINTS = [
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(8, 0, 10),
  new THREE.Vector3(0, 0, 15),
  new THREE.Vector3(-8, 0, 10),
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-8, 0, -10),
  new THREE.Vector3(0, 0, -15),
  new THREE.Vector3(8, 0, -10),
].map(v => v.multiplyScalar(TRACK_SCALE));

// Create curve once
export const TRACK_CURVE = new THREE.CatmullRomCurve3(TRACK_POINTS, true);
