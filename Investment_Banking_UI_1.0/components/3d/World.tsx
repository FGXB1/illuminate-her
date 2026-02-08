"use client"

import { useThree } from "@react-three/fiber"
import { Grid, Environment } from "@react-three/drei"

export function World() {
  const { scene } = useThree()
  scene.background = null // clear background color if any

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Ground */}
      <Grid
        position={[0, -0.01, 0]}
        args={[100, 100]} // Size
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={50}
        infiniteGrid
      />

      {/* Sky/Environment */}
      <Environment preset="city" />

      {/* Street Mesh (Optional visual) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -50]}>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}
