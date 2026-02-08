"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import CarModel, { CarPart, ProceduralCar } from "./CarModel";
import { GameState, CarStats } from "../lib/types";
import { useEffect, useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import React from 'react';

interface GameCanvasProps {
  gameState: GameState;
  stats: CarStats;
  distance: number;
  onPartClick: (part: CarPart) => void;
}

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Model Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const TRACK_SCALE = 20; // Scale of the track visual
const LAP_DISTANCE = 5000; // Meters in simulation

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
].map(v => v.multiplyScalar(TRACK_SCALE));

function CarContainer({ stats, distance, onPartClick, gameState }: { stats: CarStats, distance: number, onPartClick: any, gameState: GameState }) {
  const groupRef = useRef<THREE.Group>(null);
  const visualDistance = useRef(distance);

  const trackCurve = useMemo(() => new THREE.CatmullRomCurve3(TRACK_POINTS, true), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const speedMS = stats.speed / 3.6; // km/h to m/s

    // Only animate forward if racing
    if (gameState === 'racing') {
        visualDistance.current += speedMS * delta;

        // Simple drift correction
        const diff = distance - visualDistance.current;
        // If drift is small, correct slowly. If large (wrap around or glitch), snap or ignore.
        // Wrap around check: LAP_DISTANCE is 5000.
        // If distance jumped from 4999 to 5001 (lap changed), diff might be huge if visual didn't wrap yet?
        // No, distance is total distance. So diff is simple.

        // Correct drift
        if (Math.abs(diff) > 20) {
             visualDistance.current += diff * 0.1;
        }
    } else {
        // If stopped, sync to actual distance
        visualDistance.current = distance;
    }

    // Calculate normalized progress t [0, 1]
    const loopDistance = visualDistance.current % LAP_DISTANCE;
    const t = loopDistance / LAP_DISTANCE;

    // Get position and orientation
    const position = trackCurve.getPointAt(t);
    const tangent = trackCurve.getTangentAt(t).normalize();

    groupRef.current.position.copy(position);

    // Look ahead
    const lookAtPos = position.clone().add(tangent);
    groupRef.current.lookAt(lookAtPos);

    // Optional: Bank the car based on curve curvature? Too complex for now.
  });

  return (
    <group ref={groupRef}>
      <ErrorBoundary fallback={
          <ProceduralCar onPartClick={onPartClick} isRacing={gameState === 'racing'} />
      }>
        <Suspense fallback={<ProceduralCar onPartClick={onPartClick} isRacing={gameState === 'racing'} />}>
             <CarModel onPartClick={onPartClick} isRacing={gameState === 'racing'} />
        </Suspense>
      </ErrorBoundary>
    </group>
  );
}

function TrackMesh() {
    const geometry = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(TRACK_POINTS, true);
        const points = curve.getPoints(200);
        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    return (
        <lineLoop>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial color="white" opacity={0.3} transparent linewidth={2} />
        </lineLoop>
    )
}

export default function GameCanvas({ gameState, stats, distance, onPartClick }: GameCanvasProps) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (gameState === 'racing') {
         controlsRef.current.autoRotate = false;
      }
    }
  }, [gameState]);

  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 40, 40]} fov={60} />

        <ambientLight intensity={1.5} />
        <directionalLight
            position={[50, 50, 25]}
            angle={0.5}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
        />

        <group position={[0, -0.5, 0]}>
          <CarContainer stats={stats} distance={distance} onPartClick={onPartClick} gameState={gameState} />
          <TrackMesh />
          <ContactShadows resolution={1024} scale={200} blur={2} opacity={0.5} far={1} color="#000000" />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
          </mesh>
        </group>

        <Environment preset="city" />
        <OrbitControls ref={controlsRef} enablePan={true} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={200} />
      </Canvas>
    </div>
  );
}
