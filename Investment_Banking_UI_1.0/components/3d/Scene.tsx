"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import { type GameNode } from "@/lib/game-data"
import { CityEnvironment } from "./CityEnvironment"
import { Player } from "./Player"
import { GuideCharacter } from "./Guide"
import { BlockyCharacter, BlockyBuilding } from "./MinecraftAssets"
import { PerspectiveCamera, Loader, Html, OrbitControls } from "@react-three/drei"

interface SceneProps {
  currentNode: number
  completedNodes: Set<number>
  onNodeClick: (nodeId: number) => void
  nodes: GameNode[]
}

function NodeWrapper({ node, isCompleted, isCurrent, onClick, position }: any) {
    const isBuilding = node.type === 'building'
    const isCharacter = node.type === 'character'
    const isNegotiation = node.type === 'negotiation'

    // Building/Character components need to be positioned relative to the group
    // The group itself is at `position`

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {/* Visual Representation */}
            {isBuilding ? (
                 <BlockyBuilding
                    height={10 + (node.id % 5)} // Varied height (deterministic)
                    width={5}
                    depth={5}
                    color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"}
                    brandName={node.companyName}
                    windows={true}
                />
            ) : isCharacter ? (
                 <BlockyCharacter color={isCompleted ? "#fbbf24" : isCurrent ? "#ef4444" : "#cbd5e1"} />
            ) : isNegotiation ? (
                <group>
                  <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                    <octahedronGeometry args={[1.3]} />
                    <meshStandardMaterial
                      color={isCompleted ? "#fbbf24" : isCurrent ? "#f59e0b" : "#cbd5e1"}
                      emissive={isCurrent ? "#f59e0b" : "#000000"}
                      emissiveIntensity={isCurrent ? 0.5 : 0}
                    />
                  </mesh>
                  {isCurrent && (
                    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
                      <ringGeometry args={[1.5, 1.8, 32]} />
                      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} transparent opacity={0.4} />
                    </mesh>
                  )}
                </group>
            ) : (
                // Event Marker (Octahedron for generic events)
                <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <octahedronGeometry args={[1]} />
                    <meshStandardMaterial color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"} />
                </mesh>
            )}

            {/* Label */}
            <Html position={[0, isBuilding ? 14 : 3.5, 0]} center distanceFactor={15}>
                <div
                    className={`
                        px-3 py-1.5 rounded-lg border shadow-lg backdrop-blur-md transition-all cursor-pointer select-none
                        ${isCurrent
                            ? "bg-primary text-primary-foreground border-primary scale-110 z-50 animate-bounce font-bold"
                            : "bg-background/90 text-foreground/80 border-border hover:bg-background hover:scale-105"
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                    }}
                >
                <p className="text-xs whitespace-nowrap">{node.label}</p>
                </div>
            </Html>
        </group>
    )
}

export function Scene({ currentNode, completedNodes, onNodeClick, nodes }: SceneProps) {
  // Precompute node positions along the street
  // Alternate left/right side of the street
  const nodePositions = useMemo(() => {
    return nodes.map((node, index) => {
      const z = -index * 28 // Increased spacing
      const x = index % 2 === 0 ? -12 : 12
      return { ...node, position: [x, 0, z] as [number, number, number] }
    })
  }, [nodes])

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-900">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 20], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Controls */}
          {/* OrbitControls disabled for gameplay, can enable for debugging */}
          {/* <OrbitControls makeDefault /> */}

          {/* Environment */}
          <CityEnvironment />

          {/* Player & Guide */}
          <Player currentNode={currentNode} nodePositions={nodePositions} />
          <GuideCharacter currentNode={currentNode} nodePositions={nodePositions} />

          {/* Nodes */}
          {nodePositions.map((node) => {
            const isCompleted = completedNodes.has(node.id)
            const isCurrent = node.id === currentNode

            return (
                <NodeWrapper
                    key={node.id}
                    node={node}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    onClick={() => onNodeClick(node.id)}
                    position={node.position}
                />
            )
          })}
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
