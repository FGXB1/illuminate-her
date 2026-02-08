import { Vector3 } from "three";

export type CarPart = "chassis" | "front-left-tire" | "front-right-tire" | "rear-left-tire" | "rear-right-tire" | "engine" | "spoiler" | "fuel-port";

interface PartConfig {
  pos: [number, number, number]; // Camera position relative to car
  lookAt: [number, number, number]; // Camera target relative to car (also hotspot center)
  hotspotSize: [number, number, number]; // Size of hotspot box
}

export const PART_CONFIG: Record<string, PartConfig> = {
  "front-left-tire": {
      pos: [-2.5, 1.0, 2.5],
      lookAt: [-1.2, 0.4, 1.8],
      hotspotSize: [0.8, 0.8, 0.8]
  },
  "front-right-tire": {
      pos: [2.5, 1.0, 2.5],
      lookAt: [1.2, 0.4, 1.8],
      hotspotSize: [0.8, 0.8, 0.8]
  },
  "rear-left-tire": {
      pos: [-2.5, 1.0, -2.5],
      lookAt: [-1.2, 0.5, -1.8],
      hotspotSize: [0.9, 0.9, 0.9]
  },
  "rear-right-tire": {
      pos: [2.5, 1.0, -2.5],
      lookAt: [1.2, 0.5, -1.8],
      hotspotSize: [0.9, 0.9, 0.9]
  },
  "engine": {
      pos: [0, 3.0, -3.0],
      lookAt: [0, 0.5, -0.5],
      hotspotSize: [1.2, 0.8, 1.5]
  },
  "spoiler": {
      pos: [0, 2.0, -4.0],
      lookAt: [0, 1.0, -2.2],
      hotspotSize: [2.5, 0.5, 1.0]
  },
  "chassis": {
      pos: [3.0, 2.0, 3.0],
      lookAt: [0, 0.5, 0],
      hotspotSize: [2.0, 0.5, 4.0]
  },
  "fuel-port": {
      pos: [1.5, 2.0, 0],
      lookAt: [0.5, 0.6, 0.2],
      hotspotSize: [0.3, 0.3, 0.3]
  }
};
