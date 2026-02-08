"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import CarModel, { CarPart, ProceduralCar } from "./CarModel";
import { GameState, CarStats } from "../lib/types";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import React from 'react';
import CameraController from "./CameraController";
import { TRACK_CURVE, LAP_DISTANCE } from "../lib/track";

interface GameCanvasProps {
  gameState: GameState;
  stats: CarStats;
  distance: number;
  onPartClick: (part: CarPart) => void;
  selectedPart: CarPart | null;
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

function CarContainer({ stats, distance, onPartClick, gameState }: { stats: CarStats, distance: number, onPartClick: any, gameState: GameState }) {
  const groupRef = useRef<THREE.Group>(null);
  const visualDistance = useRef(distance);

  // Use shared curve
  const trackCurve = TRACK_CURVE;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const speedMS = stats.speed / 3.6; // km/h to m/s

    // Only animate forward if racing
    if (gameState === 'racing') {
        visualDistance.current += speedMS * delta;

        // Simple drift correction
        const diff = distance - visualDistance.current;

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
        const points = TRACK_CURVE.getPoints(200);
        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    return (
        <lineLoop>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial color="white" opacity={0.3} transparent linewidth={2} />
        </lineLoop>
    )
}

export default function GameCanvas({ gameState, stats, distance, onPartClick, selectedPart }: GameCanvasProps) {
  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 40, 40]} fov={60} />
        <CameraController gameState={gameState} selectedPart={selectedPart} distance={distance} />

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
      </Canvas>
    </div>
  );
}
