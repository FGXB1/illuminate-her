"use client"

import { useMemo } from "react"
import { Grid, Environment, Cloud } from "@react-three/drei"

function SimpleBuilding({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function CityEnvironment() {
  // Generate random background buildings
  const backgroundBuildings = useMemo(() => {
    const buildings = []
    // Left side (-20 to -60)
    for (let z = 20; z > -200; z -= 8) {
      // Row 1 (Close)
      if (Math.random() > 0.3) {
         buildings.push({
            position: [-14, 4 + Math.random() * 8, z] as [number, number, number],
            args: [6, 12 + Math.random() * 16, 6] as [number, number, number],
            color: Math.random() > 0.5 ? "#475569" : "#334155"
         })
      }
      // Row 2 (Far)
       if (Math.random() > 0.3) {
         buildings.push({
            position: [-24, 6 + Math.random() * 10, z] as [number, number, number],
            args: [8, 20 + Math.random() * 20, 8] as [number, number, number],
            color: "#1e293b"
         })
      }
    }

    // Right side (20 to 60)
    for (let z = 20; z > -200; z -= 8) {
      // Row 1 (Close)
      if (Math.random() > 0.3) {
         buildings.push({
            position: [14, 4 + Math.random() * 8, z] as [number, number, number],
            args: [6, 12 + Math.random() * 16, 6] as [number, number, number],
            color: Math.random() > 0.5 ? "#475569" : "#334155"
         })
      }
      // Row 2 (Far)
       if (Math.random() > 0.3) {
         buildings.push({
            position: [24, 6 + Math.random() * 10, z] as [number, number, number],
            args: [8, 20 + Math.random() * 20, 8] as [number, number, number],
            color: "#1e293b"
         })
      }
    }
    return buildings
  }, [])

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]} receiveShadow>
        <planeGeometry args={[16, 250]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, 0.1, -80]} receiveShadow>
        <planeGeometry args={[4, 250]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9, 0.1, -80]} receiveShadow>
        <planeGeometry args={[4, 250]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Decorative Grid (Subtle) */}
      <Grid
        position={[0, 0.15, 0]}
        args={[20, 200]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={60}
      />

      {/* Background Buildings */}
      {backgroundBuildings.map((b, i) => (
        <SimpleBuilding key={i} {...b} />
      ))}

      {/* Environment */}
      <Environment preset="night" />
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 20, -50]} />
    </group>
  )
}
