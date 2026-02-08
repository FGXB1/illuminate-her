"use client"

import { useMemo } from "react"
import { Grid, Environment } from "@react-three/drei"

// NYC-style background building with windows
function NYCBuilding({ position, args, color, windowColor = "#fbbf24" }: {
  position: [number, number, number],
  args: [number, number, number],
  color: string,
  windowColor?: string,
}) {
  const [w, h, d] = args
  // Generate window grid for front face
  const windows = useMemo(() => {
    const wins: [number, number][] = []
    const cols = Math.floor(w / 1.2)
    const rows = Math.floor(h / 1.5)
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.15) { // Some windows dark
          wins.push([
            position[0] - w / 2 + 0.6 + c * (w / cols),
            position[1] - h / 2 + r * (h / (rows + 1))
          ])
        }
      }
    }
    return wins
  }, [w, h, d, position])

  return (
    <group>
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Window lights on front face */}
      {windows.map((wp, i) => (
        <mesh key={i} position={[wp[0], wp[1], position[2] + d / 2 + 0.08]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshStandardMaterial
            color={windowColor}
            emissive={windowColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {/* Roof trim */}
      <mesh position={[position[0], position[1] + h / 2, position[2]]}>
        <boxGeometry args={[w + 0.2, 0.15, d + 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

// Street lamp
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.3, 2.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Light */}
      <mesh position={[0.5, 3, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Point light */}
      <pointLight position={[0.5, 3, 0]} color="#fbbf24" intensity={0.8} distance={8} />
    </group>
  )
}

// Wall Street sign
function StreetSign({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 6]} />
        <meshStandardMaterial color="#2d5016" metalness={0.3} />
      </mesh>
      {/* Sign plate */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.4, 0.3, 0.05]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
    </group>
  )
}

// Yellow taxi cab
function TaxiCab({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.3, 1.6]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.5, -0.1]}>
        <boxGeometry args={[0.7, 0.25, 0.8]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Windows */}
      <mesh position={[0.36, 0.5, -0.1]}>
        <boxGeometry args={[0.01, 0.18, 0.7]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.36, 0.5, -0.1]}>
        <boxGeometry args={[0.01, 0.18, 0.7]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      {[[-0.35, 0.1, 0.5], [0.35, 0.1, 0.5], [-0.35, 0.1, -0.6], [0.35, 0.1, -0.6]].map((wp, i) => (
        <mesh key={i} position={wp as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  )
}

// Fire hydrant
function FireHydrant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function CityEnvironment() {
  const backgroundBuildings = useMemo(() => {
    const buildings: { position: [number, number, number]; args: [number, number, number]; color: string; windowColor: string }[] = []
    const buildingColors = ["#1e293b", "#334155", "#475569", "#1a1a2e", "#0f172a", "#1e1b4b", "#172554"]
    const windowColors = ["#fbbf24", "#fef3c7", "#bae6fd", "#c4b5fd", "#ffffff"]

    // Left side buildings
    for (let z = 20; z > -280; z -= 7) {
      if (Math.random() > 0.2) {
        const h = 14 + Math.random() * 22
        buildings.push({
          position: [-14, h / 2, z] as [number, number, number],
          args: [5 + Math.random() * 2, h, 5 + Math.random() * 2] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
      if (Math.random() > 0.25) {
        const h = 20 + Math.random() * 30
        buildings.push({
          position: [-22 - Math.random() * 4, h / 2, z] as [number, number, number],
          args: [6 + Math.random() * 4, h, 6 + Math.random() * 4] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
      // Third row far
      if (Math.random() > 0.4) {
        const h = 30 + Math.random() * 35
        buildings.push({
          position: [-32 - Math.random() * 6, h / 2, z] as [number, number, number],
          args: [8 + Math.random() * 5, h, 8 + Math.random() * 5] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
    }

    // Right side buildings
    for (let z = 20; z > -280; z -= 7) {
      if (Math.random() > 0.2) {
        const h = 14 + Math.random() * 22
        buildings.push({
          position: [14, h / 2, z] as [number, number, number],
          args: [5 + Math.random() * 2, h, 5 + Math.random() * 2] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
      if (Math.random() > 0.25) {
        const h = 20 + Math.random() * 30
        buildings.push({
          position: [22 + Math.random() * 4, h / 2, z] as [number, number, number],
          args: [6 + Math.random() * 4, h, 6 + Math.random() * 4] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
      if (Math.random() > 0.4) {
        const h = 30 + Math.random() * 35
        buildings.push({
          position: [32 + Math.random() * 6, h / 2, z] as [number, number, number],
          args: [8 + Math.random() * 5, h, 8 + Math.random() * 5] as [number, number, number],
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          windowColor: windowColors[Math.floor(Math.random() * windowColors.length)],
        })
      }
    }
    return buildings
  }, [])

  // Lamp positions along the sidewalks
  const lampPositions = useMemo(() => {
    const lamps: [number, number, number][] = []
    for (let z = 10; z > -270; z -= 18) {
      lamps.push([-8, 0, z])
      lamps.push([8, 0, z])
    }
    return lamps
  }, [])

  // Taxi positions (parked on street)
  const taxis = useMemo(() => {
    const t: { position: [number, number, number]; rotation: number }[] = []
    for (let z = 5; z > -250; z -= 35) {
      if (Math.random() > 0.3) {
        t.push({ position: [3 + Math.random() * 2, 0, z], rotation: 0 })
      }
      if (Math.random() > 0.5) {
        t.push({ position: [-3 - Math.random() * 2, 0, z - 15], rotation: Math.PI })
      }
    }
    return t
  }, [])

  // Fire hydrants
  const hydrants = useMemo(() => {
    const h: [number, number, number][] = []
    for (let z = 0; z > -260; z -= 40) {
      if (Math.random() > 0.4) {
        h.push([Math.random() > 0.5 ? -8.5 : 8.5, 0, z])
      }
    }
    return h
  }, [])

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.35} color="#c5cae9" />
      <directionalLight
        position={[50, 60, 25]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#e8eaf6"
      />
      {/* Moonlight from behind */}
      <directionalLight
        position={[-30, 40, -60]}
        intensity={0.3}
        color="#bbdefb"
      />

      {/* Main Street (dark asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -130]} receiveShadow>
        <planeGeometry args={[16, 320]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Road center line (yellow dashes) */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={`line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 15 - i * 8]}>
          <planeGeometry args={[0.15, 3]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Sidewalks (concrete colored, slightly raised) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9.5, 0.12, -130]} receiveShadow>
        <planeGeometry args={[5, 320]} />
        <meshStandardMaterial color="#6b7280" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.5, 0.12, -130]} receiveShadow>
        <planeGeometry args={[5, 320]} />
        <meshStandardMaterial color="#6b7280" roughness={0.95} />
      </mesh>

      {/* Curb edges */}
      <mesh position={[-7, 0.08, -130]}>
        <boxGeometry args={[0.15, 0.16, 320]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[7, 0.08, -130]}>
        <boxGeometry args={[0.15, 0.16, 320]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Crosswalks at intervals */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`crosswalk-${i}`}>
          {Array.from({ length: 6 }, (_, j) => (
            <mesh key={j} rotation={[-Math.PI / 2, 0, 0]} position={[-5 + j * 2, 0.015, -30 * i]}>
              <planeGeometry args={[1.2, 0.3]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Decorative Grid (Subtle) */}
      <Grid
        position={[0, 0.15, 0]}
        args={[20, 200]}
        cellSize={2}
        cellThickness={0.3}
        cellColor="#333"
        sectionSize={10}
        sectionThickness={0.6}
        sectionColor="#555"
        fadeDistance={50}
      />

      {/* Background Buildings with windows */}
      {backgroundBuildings.map((b, i) => (
        <NYCBuilding key={i} {...b} />
      ))}

      {/* Street Lamps */}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} />
      ))}

      {/* Street Signs */}
      <StreetSign position={[-7.5, 0, 2]} text="WALL ST" />
      <StreetSign position={[7.5, 0, -50]} text="BROAD ST" />
      <StreetSign position={[-7.5, 0, -120]} text="PINE ST" />

      {/* Taxis */}
      {taxis.map((t, i) => (
        <group key={`taxi-${i}`} rotation={[0, t.rotation, 0]}>
          <TaxiCab position={t.position} />
        </group>
      ))}

      {/* Fire hydrants */}
      {hydrants.map((pos, i) => (
        <FireHydrant key={`hydrant-${i}`} position={pos} />
      ))}

      {/* Environment */}
      <Environment preset="night" />

      {/* Fog effect */}
      <fog attach="fog" args={["#0a0a1a", 30, 180]} />
    </group>
  )
}
