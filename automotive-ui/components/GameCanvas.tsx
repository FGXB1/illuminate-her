"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import CarModel, { CarPart } from "./CarModel";
import { GameState } from "../lib/types";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GameCanvasProps {
  gameState: GameState;
  onPartClick: (part: CarPart) => void;
}

export default function GameCanvas({ gameState, onPartClick }: GameCanvasProps) {
  const controlsRef = useRef<any>(null);

  // Adjust camera or controls based on game state
  useEffect(() => {
    if (controlsRef.current) {
      if (gameState === 'racing') {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 2;
      } else {
        controlsRef.current.autoRotate = false;
        // Reset camera position?
      }
    }
  }, [gameState]);

  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <group position={[0, -0.5, 0]}>
          <CarModel onPartClick={onPartClick} isRacing={gameState === 'racing'} />
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={1} color="#000000" />
        </group>

        <Environment preset="city" />
        <OrbitControls ref={controlsRef} enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
}
