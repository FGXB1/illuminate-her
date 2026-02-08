"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"
import { Html } from "@react-three/drei"

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
// BRANDED BUILDING (NYC Skyscraper style)
// ==========================================

// Brand colors for major banks
const BRAND_COLORS: Record<string, { primary: string; accent: string; windowTint: string }> = {
  "JPMorgan Chase": { primary: "#0a3d6b", accent: "#1a73b5", windowTint: "#4fc3f7" },
  "Goldman Sachs":  { primary: "#00263a", accent: "#0071bc", windowTint: "#81d4fa" },
  "Citigroup":      { primary: "#003b70", accent: "#e31837", windowTint: "#90caf9" },
  "Morgan Stanley": { primary: "#002b5c", accent: "#00b0f0", windowTint: "#b3e5fc" },
}

export function BlockyBuilding({
    height = 5,
    color = "#94a3b8",
    width = 4,
    depth = 4,
    windows = true,
    brandName,
}: {
    height?: number;
    color?: string;
    width?: number;
    depth?: number;
    windows?: boolean;
    brandName?: string;
}) {

  const brand = brandName ? BRAND_COLORS[brandName] : null
  const buildingColor = brand ? brand.primary : color
  const windowColor = brand ? brand.windowTint : "#fbbf24"
  const accentColor = brand ? brand.accent : "#334155"

  // Calculate tiered heights
  const tier1Height = height * 0.6
  const tier2Height = height * 0.25
  const tier3Height = height * 0.15

  // Generate windows for a specific box
  const generateWindows = (w: number, h: number, d: number, yOffset: number) => {
    const pos: { position: [number, number, number]; face: string }[] = []
    const rows = Math.floor(h) - 1
    if (rows < 1) return []

    for (let y = 1; y <= rows; y++) {
        const yPos = yOffset + y + 0.5 - h/2 // Adjust Y to be relative to the box center logic if needed, but here we place absolute
        // Actually, let's keep it simple: relative to bottom of the tier
        const absoluteY = yOffset + y - 0.5

        for(let x = -w/2 + 0.8; x < w/2; x += 1.0) {
             // Front
             pos.push({ position: [x, absoluteY, d/2 + 0.08], face: "front" })
             // Back
             pos.push({ position: [x, absoluteY, -d/2 - 0.08], face: "back" })
        }
        for(let z = -d/2 + 0.8; z < d/2; z += 1.0) {
             pos.push({ position: [w/2 + 0.08, absoluteY, z], face: "right" })
             pos.push({ position: [-w/2 - 0.08, absoluteY, z], face: "left" })
        }
    }
    return pos
  }

  const allWindows = useMemo(() => {
    if (!windows) return []
    const tier1Windows = generateWindows(width, tier1Height, depth, 0)
    const tier2Windows = generateWindows(width * 0.75, tier2Height, depth * 0.75, tier1Height)
    const tier3Windows = generateWindows(width * 0.5, tier3Height, depth * 0.5, tier1Height + tier2Height)
    return [...tier1Windows, ...tier2Windows, ...tier3Windows]
  }, [width, height, depth, windows, tier1Height, tier2Height, tier3Height])

  return (
    <group>
      {/* Base / Lobby entrance */}
      <mesh position={[0, 0.4, depth/2 + 0.3]} castShadow>
        <boxGeometry args={[width * 0.4, 0.8, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Tier 1 (Base) */}
      <mesh position={[0, tier1Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, tier1Height, depth]} />
        <meshStandardMaterial color={buildingColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Tier 2 (Mid) */}
      <mesh position={[0, tier1Height + tier2Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.75, tier2Height, depth * 0.75]} />
        <meshStandardMaterial color={buildingColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Tier 3 (Top) */}
      <mesh position={[0, tier1Height + tier2Height + tier3Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.5, tier3Height, depth * 0.5]} />
        <meshStandardMaterial color={buildingColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Antenna/Spire */}
      <mesh position={[0, height + 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 3, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows (all faces) */}
      {allWindows.map((w, i) => {
        const rotation: [number, number, number] =
          w.face === "right" ? [0, Math.PI/2, 0] :
          w.face === "left" ? [0, -Math.PI/2, 0] :
          w.face === "back" ? [0, Math.PI, 0] :
          [0, 0, 0]
        return (
          <mesh key={i} position={w.position} rotation={rotation}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.9}
            />
          </mesh>
        )
      })}

      {/* Accent stripe on Tier 1 */}
      <mesh position={[0, tier1Height - 0.5, depth/2 + 0.09]}>
        <planeGeometry args={[width - 0.2, 0.3]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Brand name sign on Tier 2 front face */}
      {brandName && (
        <Html
          position={[0, tier1Height + tier2Height/2, depth * 0.75 / 2 + 0.2]}
          transform
          occlude
          center
          distanceFactor={10}
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            color: "#ffffff",
            fontSize: "14px", // Increased size
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}`,
            whiteSpace: "nowrap",
            userSelect: "none",
            backgroundColor: "rgba(0,0,0,0.5)", // Added background for readability
            padding: "4px 8px",
            borderRadius: "4px",
            border: `1px solid ${accentColor}`
          }}>
            {brandName}
          </div>
        </Html>
      )}
    </group>
  )
}
