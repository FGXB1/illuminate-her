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
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fca5a5" /> {/* Skin tone */}
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.35, 1, 0]}>
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
  "JPMorgan Chase": { primary: "#0a3d6b", accent: "#1a73b5", windowTint: "#e3f2fd" },
  "Goldman Sachs":  { primary: "#0f172a", accent: "#7dd3fc", windowTint: "#f0f9ff" },
  "Citigroup":      { primary: "#003b70", accent: "#ef4444", windowTint: "#eff6ff" },
  "Morgan Stanley": { primary: "#1e1b4b", accent: "#fbbf24", windowTint: "#fffbeb" },
}

export function BlockyBuilding({
    height = 8,
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

  // Calculate tiered heights for NYC setback style
  // Tier 1: Base (Tall lobby)
  // Tier 2: Mid-section (Bulk)
  // Tier 3: Upper-section (Setback)
  // Tier 4: Spire/Top (Narrow)

  const tier1Height = height * 0.2
  const tier2Height = height * 0.4
  const tier3Height = height * 0.25
  const tier4Height = height * 0.15

  // Generate windows for a specific box
  const generateWindows = (w: number, h: number, d: number, yOffset: number) => {
    const pos: { position: [number, number, number]; face: string }[] = []
    const rows = Math.floor(h) - 1
    if (rows < 1) return []

    // Window grid logic
    for (let y = 1; y <= rows; y++) {
        const absoluteY = yOffset + y - 0.5

        // Front/Back
        const colsX = Math.floor(w) - 1
        for(let x = 0; x < colsX; x++) {
             const xPos = -w/2 + 1 + x
             // Avoid corners
             if (Math.abs(xPos) < w/2 - 0.2) {
                 pos.push({ position: [xPos, absoluteY, d/2 + 0.15], face: "front" }) // Increased Z offset
                 pos.push({ position: [xPos, absoluteY, -d/2 - 0.15], face: "back" })
             }
        }

        // Left/Right
        const colsZ = Math.floor(d) - 1
        for(let z = 0; z < colsZ; z++) {
             const zPos = -d/2 + 1 + z
             if (Math.abs(zPos) < d/2 - 0.2) {
                 pos.push({ position: [w/2 + 0.15, absoluteY, zPos], face: "right" })
                 pos.push({ position: [-w/2 - 0.15, absoluteY, zPos], face: "left" })
             }
        }
    }
    return pos
  }

  const allWindows = useMemo(() => {
    if (!windows) return []
    const tier1Windows = generateWindows(width, tier1Height, depth, 0)
    const tier2Windows = generateWindows(width * 0.8, tier2Height, depth * 0.8, tier1Height)
    const tier3Windows = generateWindows(width * 0.6, tier3Height, depth * 0.6, tier1Height + tier2Height)
    return [...tier1Windows, ...tier2Windows, ...tier3Windows]
  }, [width, height, depth, windows, tier1Height, tier2Height, tier3Height])

  return (
    <group>
      {/* Base / Lobby entrance */}
      <mesh position={[0, 1.5, depth/2 + 0.2]} castShadow>
        <boxGeometry args={[width * 0.5, 3, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Revolving doors glow */}
      <mesh position={[0, 1.5, depth/2 + 0.46]}>
        <planeGeometry args={[width * 0.4, 2.5]} />
        <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      {/* Tier 1 (Base) */}
      <mesh position={[0, tier1Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, tier1Height, depth]} />
        <meshStandardMaterial color={buildingColor} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Tier 2 (Mid) */}
      <mesh position={[0, tier1Height + tier2Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, tier2Height, depth * 0.8]} />
        <meshStandardMaterial color={buildingColor} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Tier 3 (Top) */}
      <mesh position={[0, tier1Height + tier2Height + tier3Height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.6, tier3Height, depth * 0.6]} />
        <meshStandardMaterial color={buildingColor} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Tier 4 (Crown/Spire Base) */}
      <mesh position={[0, tier1Height + tier2Height + tier3Height + tier4Height / 2, 0]} castShadow receiveShadow>
         <boxGeometry args={[width * 0.4, tier4Height, depth * 0.4]} />
         <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Spire Needle */}
      <mesh position={[0, height + 2, 0]}>
        <cylinderGeometry args={[0.05, 0.2, 4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Warning light on spire */}
      <mesh position={[0, height + 4, 0]}>
         <sphereGeometry args={[0.15]} />
         <meshBasicMaterial color="red" />
      </mesh>
      <pointLight position={[0, height + 4, 0]} color="red" intensity={2} distance={10} />


      {/* Windows (all faces) */}
      {allWindows.map((w, i) => {
        const rotation: [number, number, number] =
          w.face === "right" ? [0, Math.PI/2, 0] :
          w.face === "left" ? [0, -Math.PI/2, 0] :
          w.face === "back" ? [0, Math.PI, 0] :
          [0, 0, 0]

        // Randomly turn off some lights
        const isLit = (i * 123) % 10 > 2

        return (
          <mesh key={i} position={w.position} rotation={rotation}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial
              color={isLit ? windowColor : "#1e293b"}
              emissive={isLit ? windowColor : "#000000"}
              emissiveIntensity={isLit ? 0.8 : 0}
              transparent
              opacity={0.95}
            />
          </mesh>
        )
      })}

      {/* Accent stripes */}
      <mesh position={[0, tier1Height - 0.2, depth/2 + 0.16]}>
        <planeGeometry args={[width - 0.4, 0.2]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
      </mesh>

      {/* Brand name sign on Tier 1 (Lobby level) */}
      {brandName && (
        <Html
          position={[0, tier1Height + tier2Height * 0.8, depth * 0.8 / 2 + 0.3]} // Higher up on the building
          transform
          occlude
          center
          distanceFactor={12}
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            whiteSpace: "nowrap",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "8px 16px",
            borderRadius: "4px",
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 15px ${accentColor}`
          }}>
            {brandName}
          </div>
        </Html>
      )}
    </group>
  )
}
