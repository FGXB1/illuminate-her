"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { CarPart, ProceduralCar } from "./CarModel";
import { GameState, CarStats, LAP_DISTANCE } from "../lib/types";
import { useEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import React from "react";

/** Car-part IDs that have hotspots (pit stop only). */
export const HOTSPOT_PARTS: CarPart[] = [
  "front-left-tire", "front-right-tire", "rear-left-tire", "rear-right-tire",
  "engine", "spoiler", "chassis"
];

/** Local-space positions for each car part (used for camera focus).
 *  Derived from GLTF wheel-node translations, transformed through the model's
 *  internal 0.01 scale, primitive scale=150 (net 1.5×), rotation=[0,π,0],
 *  and position=[0,-0.2,0]. */
export const PART_OFFSETS: Record<CarPart, THREE.Vector3> = {
  chassis: new THREE.Vector3(0, 0.25, 0),
  "front-left-tire": new THREE.Vector3(-1.05, 0.27, -1.90),
  "front-right-tire": new THREE.Vector3(1.05, 0.27, -1.90),
  "rear-left-tire": new THREE.Vector3(-1.12, 0.27, 1.92),
  "rear-right-tire": new THREE.Vector3(1.12, 0.27, 1.92),
  engine: new THREE.Vector3(0, 0.55, 1.0),
  spoiler: new THREE.Vector3(0, 1.2, 2.3),
};

interface GameCanvasProps {
  gameState: GameState;
  /** Ref-based distance for the 3D scene — read inside useFrame, no re-renders. */
  distanceRef: React.MutableRefObject<number>;
  onPartClick: (part: CarPart) => void;
  selectedPart?: CarPart | null;
}

const TRACK_SCALE = 20; // Scale of the track visual

// Shared track points logic
const TRACK_POINTS = [
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(8, 0, 10),
  new THREE.Vector3(0, 0, 15),
  new THREE.Vector3(-8, 0, 10),
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(-8, 0, -10),
  new THREE.Vector3(0, 0, -15),
  new THREE.Vector3(8, 0, -10),
].map((v) => v.multiplyScalar(TRACK_SCALE));

// Start camera behind the car (car at t=0). Use Y-only rotation so GLTF axis stays correct.
const _initialCurve = new THREE.CatmullRomCurve3(TRACK_POINTS, true);
const _carPos0 = _initialCurve.getPointAt(0);
const _tangent0 = _initialCurve.getTangentAt(0).normalize();
const _angle0 = Math.atan2(_tangent0.x, _tangent0.z);
const _camOffset = new THREE.Vector3(0, 14, -25).applyAxisAngle(new THREE.Vector3(0, 1, 0), _angle0);
const INITIAL_CAM_POS = _carPos0.clone().add(_camOffset);

// Ease-in-out for camera tween (smoothstep)
function easeInOut(t: number) {
  return t * t * (3 - 2 * t);
}

const CAM_CHASE_OFFSET = new THREE.Vector3(0, 14, -25);
const CAM_PIT_OFFSET = new THREE.Vector3(0, 6, -12);
const CAM_PART_OFFSET = new THREE.Vector3(0, 4, 10); // camera offset when focused on a part (gentle zoom)
const CAM_TWEEN_DURATION = 1.2;

// Zoom limits during racing (multiplier on chase offset distance)
const ZOOM_MIN = 0.5;  // closest (half distance)
const ZOOM_MAX = 1.6;  // farthest
const ZOOM_SPEED = 0.0008; // scroll sensitivity

// Camera: chase / pit overview / part zoom. Smooth tweens on all transitions.
// During pit stop with no part selected, once the initial tween finishes the rig
// yields to OrbitControls so the user can freely orbit 360° around the car.
function CameraRig({
  distanceRef,
  gameState,
  selectedPart,
  controlsRef,
  zoomRef,
}: {
  distanceRef: React.MutableRefObject<number>;
  gameState: GameState;
  selectedPart: CarPart | null | undefined;
  controlsRef: React.RefObject<any>;
  /** User-controlled zoom multiplier for the chase camera (1 = default). */
  zoomRef: React.MutableRefObject<number>;
}) {
  const smoothDistance = useRef(distanceRef.current);
  const trackCurve = useMemo(() => new THREE.CatmullRomCurve3(TRACK_POINTS, true), []);
  const pitTweenProgress = useRef(0);
  const partZoomProgress = useRef(0);
  /** true once the pit-entry tween has settled and orbit is free */
  const orbitFree = useRef(false);
  /** tracks whether we were previously in part-zoom (so we re-tween out) */
  const wasPartZoom = useRef(false);
  /** counter that forces a brief re-tween after deselecting a part */
  const reacquireTimer = useRef(0);

  useFrame((state, delta) => {
    // Read distance from ref (updated by game loop, no React re-renders)
    const distance = distanceRef.current;

    // Smooth exponential interpolation toward the authoritative distance
    const lerpFactor = 1 - Math.pow(0.001, delta); // ~0.12 at 60fps — very smooth
    smoothDistance.current += (distance - smoothDistance.current) * lerpFactor;

    const loopDistance = ((smoothDistance.current % LAP_DISTANCE) + LAP_DISTANCE) % LAP_DISTANCE;
    const t = loopDistance / LAP_DISTANCE;
    const carPos = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t).normalize();
    const angle = Math.atan2(tangent.x, tangent.z);
    const yAxis = new THREE.Vector3(0, 1, 0);

    const targetPitProgress = gameState === "pit_stop" ? 1 : 0;
    const step = Math.min(1, (delta / CAM_TWEEN_DURATION) * 2.5);
    pitTweenProgress.current += (targetPitProgress - pitTweenProgress.current) * step;

    const hasPartSelection = gameState === "pit_stop" && selectedPart != null && selectedPart in PART_OFFSETS;
    const partTarget = hasPartSelection ? 1 : 0;
    partZoomProgress.current += (partTarget - partZoomProgress.current) * step;
    partZoomProgress.current = Math.max(0, Math.min(1, partZoomProgress.current));

    // Detect when user deselects a part so we briefly re-tween before freeing orbit
    if (wasPartZoom.current && !hasPartSelection) {
      reacquireTimer.current = 0.6; // seconds to smoothly return to pit overview
      orbitFree.current = false;
    }
    wasPartZoom.current = hasPartSelection;

    if (reacquireTimer.current > 0) reacquireTimer.current -= delta;

    // Keep OrbitControls target centered on the car during pit stop
    if (controlsRef.current && gameState === "pit_stop") {
      controlsRef.current.target.lerp(carPos, 0.15);
      controlsRef.current.update();
    }

    // ---------- Determine if CameraRig should control the camera ----------
    const pitTweenSettled = gameState === "pit_stop" && pitTweenProgress.current > 0.95;
    const noPartAndSettled = pitTweenSettled && !hasPartSelection && reacquireTimer.current <= 0;

    // Once tween settles with no part selected → free orbit
    if (noPartAndSettled) orbitFree.current = true;
    // Any other state → rig takes over
    if (gameState !== "pit_stop" || hasPartSelection) orbitFree.current = false;

    // When orbit is free, don't touch the camera – OrbitControls handles it
    if (orbitFree.current) return;

    // ---------- Compute target camera position ----------
    const easedPit = easeInOut(pitTweenProgress.current);

    // Apply user zoom to chase offset (scroll wheel during racing)
    const chaseOffset = CAM_CHASE_OFFSET.clone().multiplyScalar(zoomRef.current).applyAxisAngle(yAxis, angle);
    const pitOffset = CAM_PIT_OFFSET.clone().applyAxisAngle(yAxis, angle);
    const chasePos = carPos.clone().add(chaseOffset);
    const pitPos = carPos.clone().add(pitOffset);

    let targetPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    let targetFov: number;

    if (hasPartSelection && selectedPart) {
      const localPart = PART_OFFSETS[selectedPart as keyof typeof PART_OFFSETS].clone();
      const partWorld = localPart.applyAxisAngle(yAxis, angle).add(carPos);
      const partCamOff = CAM_PART_OFFSET.clone().applyAxisAngle(yAxis, angle);
      targetPos = partWorld.clone().add(partCamOff);
      targetLookAt = partWorld;
      targetFov = 54;
    } else {
      targetPos = chasePos.clone().lerp(pitPos, easedPit);
      targetLookAt = carPos;
      targetFov = 60 - (60 - 52) * easedPit;
    }

    state.camera.position.lerp(targetPos, hasPartSelection ? 0.12 : 0.1);
    state.camera.lookAt(targetLookAt);
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const currentFov = (state.camera as THREE.PerspectiveCamera).fov;
      (state.camera as THREE.PerspectiveCamera).fov = currentFov + (targetFov - currentFov) * 0.08;
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

function CarContainer({
  distanceRef,
  onPartClick,
  gameState,
  selectedPart,
}: {
  distanceRef: React.MutableRefObject<number>;
  onPartClick: (part: CarPart) => void;
  gameState: GameState;
  selectedPart?: CarPart | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothDistance = useRef(distanceRef.current);
  const trackCurve = useMemo(() => new THREE.CatmullRomCurve3(TRACK_POINTS, true), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Read distance from ref (no React re-render needed)
    const distance = distanceRef.current;

    // Smooth exponential interpolation — no dead-reckoning, no snap corrections
    const lerpFactor = 1 - Math.pow(0.001, delta); // ~0.12 at 60fps
    smoothDistance.current += (distance - smoothDistance.current) * lerpFactor;

    const loopDistance = ((smoothDistance.current % LAP_DISTANCE) + LAP_DISTANCE) % LAP_DISTANCE;
    const t = loopDistance / LAP_DISTANCE;
    const position = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t).normalize();
    const angle = Math.atan2(tangent.x, tangent.z);

    groupRef.current.position.copy(position);
    groupRef.current.position.y = 0.26;
    // GLTF model has rotation=[0, Math.PI, 0] so its front faces -Z in group space.
    // Add Math.PI so the visual car faces forward along the track tangent.
    groupRef.current.rotation.set(0, angle + Math.PI, 0);
  });

  return (
    <group ref={groupRef}>
      <ProceduralCar
        onPartClick={onPartClick}
        isRacing={gameState === "racing"}
        isPitStop={gameState === "pit_stop"}
        selectedPart={selectedPart ?? null}
      />
    </group>
  );
}

const ROAD_WIDTH = 12;
const ROAD_HALF = ROAD_WIDTH / 2;
const EDGE_OFFSET = 5.5;
const ROAD_Y = 0.01;
const LINE_Y = 0.02; // slightly above road to prevent z-fighting
const UP = new THREE.Vector3(0, 1, 0);
const LINE_HALF_WIDTH = 0.15; // half-width of painted road lines
const DASH_LENGTH = 1.5;
const GAP_LENGTH = 1.5;

/** Build a ribbon (flat quad strip) along a set of center-points with a given half-width. */
function buildRibbon(points: THREE.Vector3[], halfW: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const prev = points[(i - 1 + points.length) % points.length];
    const next = points[(i + 1) % points.length];
    const tangent = next.clone().sub(prev).normalize();
    const perp = new THREE.Vector3().crossVectors(tangent, UP).normalize();
    const left = points[i].clone().addScaledVector(perp, -halfW);
    const right = points[i].clone().addScaledVector(perp, halfW);
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    indices.push(a, b, d, a, d, c);
  }
  // close the loop
  const last = (points.length - 1) * 2;
  indices.push(last, last + 1, 1, last, 1, 0);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function RoadSurface() {
  const { roadGeom, leftEdgeGeom, rightEdgeGeom, centerDashGeom } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(TRACK_POINTS, true);
    const n = 400;
    const roadPositions: number[] = [];
    const leftEdgePoints: THREE.Vector3[] = [];
    const rightEdgePoints: THREE.Vector3[] = [];
    const centerPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const perp = new THREE.Vector3().crossVectors(tangent, UP).normalize();

      const left = pos.clone().addScaledVector(perp, -ROAD_HALF).setY(ROAD_Y);
      const right = pos.clone().addScaledVector(perp, ROAD_HALF).setY(ROAD_Y);

      roadPositions.push(left.x, left.y, left.z, right.x, right.y, right.z);
      leftEdgePoints.push(pos.clone().addScaledVector(perp, -EDGE_OFFSET).setY(LINE_Y));
      rightEdgePoints.push(pos.clone().addScaledVector(perp, EDGE_OFFSET).setY(LINE_Y));
      centerPoints.push(pos.clone().setY(LINE_Y));
    }

    // Road surface geometry
    const roadGeom = new THREE.BufferGeometry();
    const roadIndices: number[] = [];
    for (let i = 0; i < n; i++) {
      const a = i * 2, b = a + 1;
      const c = ((i + 1) % (n + 1)) * 2, d = c + 1;
      roadIndices.push(a, b, d, a, d, c);
    }
    roadGeom.setAttribute("position", new THREE.Float32BufferAttribute(roadPositions, 3));
    roadGeom.setIndex(roadIndices);
    roadGeom.computeVertexNormals();

    // Edge line ribbons (solid continuous loops)
    const leftEdgeGeom = buildRibbon(leftEdgePoints, LINE_HALF_WIDTH);
    const rightEdgeGeom = buildRibbon(rightEdgePoints, LINE_HALF_WIDTH);

    // Center dashed line: build individual dash segments as quads
    const totalLength = curve.getLength();
    const dashPositions: number[] = [];
    const dashIndices: number[] = [];
    let along = 0;
    let vertIdx = 0;
    while (along < totalLength) {
      const dashEnd = Math.min(along + DASH_LENGTH, totalLength);
      // build a mini ribbon for this dash
      const segPoints: THREE.Vector3[] = [];
      const steps = 6; // subdivisions per dash for curve fidelity
      for (let s = 0; s <= steps; s++) {
        const d = along + (dashEnd - along) * (s / steps);
        const tt = d / totalLength;
        segPoints.push(curve.getPointAt(Math.min(tt, 1)).clone().setY(LINE_Y));
      }
      for (let s = 0; s < segPoints.length; s++) {
        const prev = segPoints[Math.max(0, s - 1)];
        const next = segPoints[Math.min(segPoints.length - 1, s + 1)];
        const tan = next.clone().sub(prev).normalize();
        const perp = new THREE.Vector3().crossVectors(tan, UP).normalize();
        const l = segPoints[s].clone().addScaledVector(perp, -LINE_HALF_WIDTH);
        const r = segPoints[s].clone().addScaledVector(perp, LINE_HALF_WIDTH);
        dashPositions.push(l.x, l.y, l.z, r.x, r.y, r.z);
      }
      for (let s = 0; s < steps; s++) {
        const a = vertIdx + s * 2, b = a + 1, c = a + 2, d = a + 3;
        dashIndices.push(a, b, d, a, d, c);
      }
      vertIdx += (steps + 1) * 2;
      along = dashEnd + GAP_LENGTH;
    }
    const centerDashGeom = new THREE.BufferGeometry();
    centerDashGeom.setAttribute("position", new THREE.Float32BufferAttribute(dashPositions, 3));
    centerDashGeom.setIndex(dashIndices);
    centerDashGeom.computeVertexNormals();

    return { roadGeom, leftEdgeGeom, rightEdgeGeom, centerDashGeom };
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={roadGeom} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh geometry={leftEdgeGeom}>
        <meshBasicMaterial color="#C1C1C1" />
      </mesh>
      <mesh geometry={rightEdgeGeom}>
        <meshBasicMaterial color="#C1C1C1" />
      </mesh>
      <mesh geometry={centerDashGeom}>
        <meshBasicMaterial color="#D16666" />
      </mesh>
    </group>
  );
}

export default function GameCanvas({ gameState, distanceRef, onPartClick, selectedPart = null }: GameCanvasProps) {
  const controlsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Zoom multiplier for chase camera — modified by scroll wheel during racing. */
  const zoomRef = useRef(1);

  useEffect(() => {
    if (controlsRef.current && gameState === "racing") {
      controlsRef.current.autoRotate = false;
    }
  }, [gameState]);

  // Scroll-to-zoom during racing (doesn't interfere with OrbitControls during pit stop)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (gameState !== "racing") return; // let OrbitControls handle pit stop zoom
      e.preventDefault();
      zoomRef.current = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomRef.current + e.deltaY * ZOOM_SPEED));
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [gameState]);

  return (
    <div ref={containerRef} className="w-full h-screen" style={{ backgroundColor: "#240115" }}>
      <Canvas shadows onCreated={({ camera }) => camera.lookAt(_carPos0)} style={{ background: "linear-gradient(to bottom, #2C4251, #240115)" }}>
        <PerspectiveCamera makeDefault position={[INITIAL_CAM_POS.x, INITIAL_CAM_POS.y, INITIAL_CAM_POS.z]} fov={60} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[50, 50, 25]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />

        <CameraRig distanceRef={distanceRef} gameState={gameState} selectedPart={selectedPart} controlsRef={controlsRef} zoomRef={zoomRef} />

        <group position={[0, -0.5, 0]}>
          <RoadSurface />
          <CarContainer distanceRef={distanceRef} onPartClick={onPartClick} gameState={gameState} selectedPart={selectedPart} />
          <ContactShadows resolution={1024} scale={200} blur={2} opacity={0.5} far={1} color="#000000" />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#1a0a12" roughness={0.85} metalness={0.15} />
          </mesh>
        </group>

        <Environment preset="city" />
        <OrbitControls
          ref={controlsRef}
          enabled={gameState === "pit_stop"}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.2}
          minDistance={5}
          maxDistance={40}
          rotateSpeed={0.8}
          zoomSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
