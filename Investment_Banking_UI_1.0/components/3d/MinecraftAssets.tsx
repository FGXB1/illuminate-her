"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

// ==========================================
// BLOCKY CHARACTER (Minecraft-style)
// ==========================================

export function BlockyCharacter({ color = "#3b82f6", isMoving = false }: { color?: string; isMoving?: boolean }) {
  const groupRef = useRef<any>(null)

  // Limbs for animation
  const leftLegRef = useRef<Mesh>(null)
  const rightLegRef = useRef<Mesh>(null)
  const leftArmRef = useRef<Mesh>(null)
  const rightArmRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!isMoving) {
        // Reset rotation if not moving
        if(leftLegRef.current) leftLegRef.current.rotation.x = 0
        if(rightLegRef.current) rightLegRef.current.rotation.x = 0
        if(leftArmRef.current) leftArmRef.current.rotation.x = 0
        if(rightArmRef.current) rightArmRef.current.rotation.x = 0
        return
    }

    const t = state.clock.getElapsedTime() * 10
    const angle = Math.sin(t) * 0.5

    if (leftLegRef.current) leftLegRef.current.rotation.x = angle
    if (rightLegRef.current) rightLegRef.current.rotation.x = -angle
    if (leftArmRef.current) leftArmRef.current.rotation.x = -angle
    if (rightArmRef.current) rightArmRef.current.rotation.x = angle
  })

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fca5a5" /> {/* Skin tone */}
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.35, 1, 0]} geometry={undefined}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={color} />
        {/* Pivot adjustment logic would go here, simplistic for now */}
      </mesh>
      <mesh ref={rightArmRef} position={[0.35, 1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.15, 0.2, 0]}>
         <boxGeometry args={[0.2, 0.6, 0.2]} />
         <meshStandardMaterial color="#1e293b" /> {/* Pants */}
      </mesh>
      <mesh ref={rightLegRef} position={[0.15, 0.2, 0]}>
         <boxGeometry args={[0.2, 0.6, 0.2]} />
         <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

// ==========================================
// BLOCKY BUILDING (Minecraft-style)
// ==========================================

export function BlockyBuilding({
    height = 5,
    color = "#94a3b8",
    width = 4,
    depth = 4,
    windows = true
}: {
    height?: number;
    color?: string;
    width?: number;
    depth?: number;
    windows?: boolean;
}) {

  const windowCountY = Math.floor(height) - 1
  const windowCountX = Math.floor(width) - 1

  const windowPositions = useMemo(() => {
    const pos = []
    if (!windows) return []

    for (let y = 1; y <= windowCountY; y++) {
        for(let x = -width/2 + 1; x < width/2; x+= 1.2) {
             // Front face
             pos.push([x, y + 0.5, depth/2 + 0.05])
        }
    }
    return pos
  }, [height, width, depth, windows])

  return (
    <group>
      {/* Main Structure */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Windows (Simple overlay meshes) */}
      {windowPositions.map((pos, i) => (
         <mesh key={i} position={pos as [number, number, number]}>
            <planeGeometry args={[0.6, 0.6]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
         </mesh>
      ))}

      {/* Roof trim */}
      <mesh position={[0, height, 0]}>
         <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
         <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  )
}
