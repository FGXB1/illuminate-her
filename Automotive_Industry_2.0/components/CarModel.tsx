"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useGLTF } from "@react-three/drei";

export type CarPart =
  | "chassis"
  | "front-left-tire"
  | "front-right-tire"
  | "rear-left-tire"
  | "rear-right-tire"
  | "engine"
  | "spoiler";

interface CarModelProps {
  onPartClick?: (part: CarPart) => void;
  isRacing?: boolean;
  isPitStop?: boolean;
  selectedPart?: CarPart | null;
}

// ── Invisible clickable hotspot box ──────────────────────────────
interface HotspotProps {
  position: [number, number, number];
  size: [number, number, number];
  part: CarPart;
  onPartClick?: (part: CarPart) => void;
  isPitStop: boolean;
  hoveredPart: CarPart | null;
  setHoveredPart: (part: CarPart | null) => void;
  selectedPart: CarPart | null;
}

function Hotspot({
  position,
  size,
  part,
  onPartClick,
  isPitStop,
  hoveredPart,
  setHoveredPart,
  selectedPart,
}: HotspotProps) {
  const isHighlight = isPitStop && (hoveredPart === part || selectedPart === part);
  const isSelected = isPitStop && selectedPart === part;

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (isPitStop && onPartClick) onPartClick(part);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (isPitStop) {
          setHoveredPart(part);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHoveredPart(null);
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={isSelected ? "#D16666" : isHighlight ? "#C1C1C1" : "#ffffff"}
        transparent
        opacity={isHighlight ? 0.3 : 0}
        depthWrite={false}
        emissive={isHighlight ? (isSelected ? "#D16666" : "#D16666") : "#000"}
        emissiveIntensity={isHighlight ? 0.7 : 0}
      />
    </mesh>
  );
}

// ── GLTF Car ─────────────────────────────────────────────────────
const CAR_GLTF_URL = "/2020_honda_nsx_na1_lbworks/scene.gltf";

function GLTFCarModel({ isRacing }: { isRacing: boolean }) {
  const { scene } = useGLTF(CAR_GLTF_URL);
  const modelRef = useRef<Group>(null);

  useFrame((state) => {
    if (isRacing && modelRef.current) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.005;
    }
  });

  return (
    <group ref={modelRef} rotation={[0, Math.PI, 0]} position={[0, -0.2, 0]}>
      <primitive object={scene} scale={150} />
    </group>
  );
}

export function ProceduralCar({
  onPartClick,
  isRacing = false,
  isPitStop = false,
  selectedPart = null,
}: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const [hoveredPart, setHoveredPart] = useState<CarPart | null>(null);

  // Racing vibration (for hotspot group)
  useFrame((state) => {
    if (isRacing && groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.005;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* GLTF model loaded via Suspense — fallback shown while loading */}
      <Suspense fallback={<FallbackCar />}>
        <GLTFCarModel isRacing={isRacing} />
      </Suspense>

      {/* Invisible hotspot zones — positions computed from GLTF wheel node
          translations, transformed through the model's internal 0.01 scale,
          primitive scale=150 (net 1.5×), rotation=[0,π,0] (flips X & Z),
          and position=[0,-0.2,0]. */}
      {/* Front-left tire — GLTF "3DWheel Front L" at (0.698, 0.311, 1.267) */}
      <Hotspot
        position={[-1.05, 0.27, -1.90]}
        size={[0.8, 0.8, 0.8]}
        part="front-left-tire"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Front-right tire — GLTF "3DWheel Front R" at (-0.698, 0.311, 1.267) */}
      <Hotspot
        position={[1.05, 0.27, -1.90]}
        size={[0.8, 0.8, 0.8]}
        part="front-right-tire"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Rear-left tire — GLTF "3DWheel Rear L" at (0.746, 0.314, -1.280) */}
      <Hotspot
        position={[-1.12, 0.27, 1.92]}
        size={[0.8, 0.8, 0.8]}
        part="rear-left-tire"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Rear-right tire — GLTF "3DWheel Rear R" at (-0.746, 0.314, -1.280) */}
      <Hotspot
        position={[1.12, 0.27, 1.92]}
        size={[0.8, 0.8, 0.8]}
        part="rear-right-tire"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Engine — NSX is mid-engine, sits between rear wheels */}
      <Hotspot
        position={[0, 0.55, 1.0]}
        size={[1.4, 0.9, 1.6]}
        part="engine"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Chassis / Fuel — center body of the car */}
      <Hotspot
        position={[0, 0.25, 0]}
        size={[2.0, 0.5, 3.5]}
        part="chassis"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
      {/* Spoiler / Rear wing — LB Works big wing at the very rear */}
      <Hotspot
        position={[0, 1.2, 2.3]}
        size={[1.8, 0.4, 0.7]}
        part="spoiler"
        onPartClick={onPartClick}
        isPitStop={isPitStop}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
        selectedPart={selectedPart ?? null}
      />
    </group>
  );
}

// ── Minimal blocky fallback while GLTF loads ─────────────────────
function FallbackCar() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.5, 4.5]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -0.5]}>
        <boxGeometry args={[1.2, 0.6, 2]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}
