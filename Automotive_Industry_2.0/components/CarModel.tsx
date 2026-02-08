"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { Html, useGLTF } from "@react-three/drei";

export type CarPart = "chassis" | "front-left-tire" | "front-right-tire" | "rear-left-tire" | "rear-right-tire" | "engine" | "spoiler";

interface CarModelProps {
  onPartClick?: (part: CarPart) => void;
  isRacing?: boolean;
}

// ------------------------------------------------------------------
// Original Procedural Car (Fallback)
// ------------------------------------------------------------------

interface WheelProps {
  position: [number, number, number];
  part: CarPart;
  onPartClick?: (part: CarPart) => void;
  isRacing: boolean;
  hoveredPart: CarPart | null;
  setHoveredPart: (part: CarPart | null) => void;
  scale?: number;
}

function Wheel({ position, part, onPartClick, isRacing, hoveredPart, setHoveredPart, scale = 1 }: WheelProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (isRacing && meshRef.current) {
      meshRef.current.rotation.x -= delta * 10; // Rotate wheels
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredPart(part);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = "auto";
  };

   const handleClick = (e: any) => {
    e.stopPropagation();
    if (onPartClick) {
      onPartClick(part);
    }
  };


  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, 0, Math.PI / 2]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <cylinderGeometry args={[0.4 * scale, 0.4 * scale, 0.6, 32]} />
      <meshStandardMaterial color={hoveredPart === part ? "#ff0000" : "#111"} roughness={0.8} />
       {/* Rim */}
       <mesh rotation={[0, 0, 0]} position={[0, 0.31, 0]}>
         <cylinderGeometry args={[0.25 * scale, 0.25 * scale, 0.05, 16]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
       </mesh>
       <mesh rotation={[0, 0, 0]} position={[0, -0.31, 0]}>
         <cylinderGeometry args={[0.25 * scale, 0.25 * scale, 0.05, 16]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
       </mesh>
    </mesh>
  );
}

export function ProceduralCar({ onPartClick, isRacing = false }: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const [hoveredPart, setHoveredPart] = useState<CarPart | null>(null);

  // Wheel rotation animation
  useFrame((state, delta) => {
    if (isRacing && groupRef.current) {
      // Simulate vibration or movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.02;
    }
  });

  const handlePointerOver = (part: CarPart) => (e: any) => {
    e.stopPropagation();
    setHoveredPart(part);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = "auto";
  };

  const handleClick = (part: CarPart) => (e: any) => {
    e.stopPropagation();
    if (onPartClick) {
      onPartClick(part);
    }
  };

  const getMaterialColor = (part: CarPart, defaultColor: string) => {
    return hoveredPart === part ? "#ff0000" : defaultColor; // Highlight on hover
  };

  return (
    <group ref={groupRef} dispose={null}>
      {/* Chassis */}
      <mesh
        position={[0, 0.5, 0]}
        onClick={handleClick("chassis")}
        onPointerOver={handlePointerOver("chassis")}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2, 0.5, 4.5]} />
        <meshStandardMaterial color={getMaterialColor("chassis", "#222")} roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Cockpit / Engine Area */}
      <mesh
        position={[0, 0.8, -0.5]}
        onClick={handleClick("engine")}
        onPointerOver={handlePointerOver("engine")}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.2, 0.6, 2]} />
        <meshStandardMaterial color={getMaterialColor("engine", "#333")} roughness={0.3} metalness={0.6} />
      </mesh>

       {/* Nose */}
      <mesh
        position={[0, 0.4, 2.5]}
        onClick={handleClick("chassis")}
        onPointerOver={handlePointerOver("chassis")}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.0, 0.3, 1.5]} />
        <meshStandardMaterial color={getMaterialColor("chassis", "#222")} roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Spoiler */}
      <mesh
        position={[0, 1.2, -2.2]}
        onClick={handleClick("spoiler")}
        onPointerOver={handlePointerOver("spoiler")}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2.5, 0.1, 0.8]} />
        <meshStandardMaterial color={getMaterialColor("spoiler", "#444")} />
      </mesh>

      {/* Spoiler Supports */}
       <mesh position={[-0.8, 0.9, -2.2]}>
        <boxGeometry args={[0.1, 0.6, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
       <mesh position={[0.8, 0.9, -2.2]}>
        <boxGeometry args={[0.1, 0.6, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>


      {/* Wheels */}
      <Wheel
        position={[-1.2, 0.4, 1.8]}
        part="front-left-tire"
        onPartClick={onPartClick}
        isRacing={isRacing}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />
      <Wheel
        position={[1.2, 0.4, 1.8]}
        part="front-right-tire"
        onPartClick={onPartClick}
        isRacing={isRacing}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />
      <Wheel
        position={[-1.2, 0.5, -1.8]}
        part="rear-left-tire"
        onPartClick={onPartClick}
        isRacing={isRacing}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        scale={1.2} // Rear wheels are bigger
      />
      <Wheel
        position={[1.2, 0.5, -1.8]}
        part="rear-right-tire"
        onPartClick={onPartClick}
        isRacing={isRacing}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
         scale={1.2}
      />
    </group>
  );
}

// ------------------------------------------------------------------
// Main Car Model (GLB Loader)
// ------------------------------------------------------------------

export default function CarModel({ isRacing }: CarModelProps) {
  const { scene } = useGLTF('/models/f1_car.glb');
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
      if (isRacing && groupRef.current) {
          // Add some vibration if racing
           groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.005;
      }
  });

  return (
    <group ref={groupRef} dispose={null}>
        {/* Scale might need adjustment based on the model. F1 cars are about 5m long.
            The procedural car was approx 4.5 units long.
            We'll assume the GLB needs appropriate scaling.
            Standard GLTF is meters. If model is in meters, scale 1 is fine.
        */}
        <primitive object={scene} scale={1.5} rotation={[0, Math.PI, 0]} />
    </group>
  );
}
