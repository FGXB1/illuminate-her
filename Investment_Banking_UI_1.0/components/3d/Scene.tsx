"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import { gameNodes } from "@/lib/game-data"
import { CityEnvironment } from "./CityEnvironment"
import { Player } from "./Player"
import { GuideCharacter } from "./Guide"
import { BlockyCharacter, BlockyBuilding } from "./MinecraftAssets"
import { PerspectiveCamera, Loader, Html } from "@react-three/drei"

interface SceneProps {
  currentNode: number
  completedNodes: Set<number>
  onNodeClick: (nodeId: number) => void
}

function NodeWrapper({ node, isCompleted, isCurrent, onClick }: any) {
    const isBuilding = node.type === 'building'
    const isCharacter = node.type === 'character'
    const isNegotiation = node.type === 'negotiation'

    return (
        <group position={node.position} onClick={onClick}>
            {/* Visual Representation */}
            {isBuilding ? (
                // Building with brand name
                 <BlockyBuilding
                    height={node.id % 2 === 0 ? 8 : 10}
                    width={5}
                    depth={5}
                    color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"}
                    brandName={node.companyName}
                />
            ) : isCharacter ? (
                 // Use BlockyCharacter for NPCs
                 <BlockyCharacter color={isCompleted ? "#fbbf24" : isCurrent ? "#ef4444" : "#cbd5e1"} />
            ) : isNegotiation ? (
                // Negotiation marker — glowing diamond with speech icon feel
                <group>
                  <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <octahedronGeometry args={[1.3]} />
                    <meshStandardMaterial
                      color={isCompleted ? "#fbbf24" : isCurrent ? "#f59e0b" : "#cbd5e1"}
                      emissive={isCurrent ? "#f59e0b" : "#000000"}
                      emissiveIntensity={isCurrent ? 0.5 : 0}
                    />
                  </mesh>
                  {/* Glow ring around negotiation marker */}
                  {isCurrent && (
                    <mesh position={[0, 2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                      <ringGeometry args={[1.5, 1.8, 32]} />
                      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} transparent opacity={0.4} />
                    </mesh>
                  )}
                </group>
            ) : (
                // Event Marker
                <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <octahedronGeometry args={[1]} />
                    <meshStandardMaterial color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"} />
                </mesh>
            )}

            {/* Label */}
            <Html position={[0, isBuilding ? 12 : 3.5, 0]} center>
                <div
                    className={`
                        px-2 py-1 rounded-md border shadow-sm backdrop-blur-sm transition-all cursor-pointer select-none
                        ${isCurrent
                            ? "bg-primary/90 text-primary-foreground border-primary scale-110 z-50 animate-bounce"
                            : "bg-background/80 text-foreground/80 border-border hover:bg-background hover:scale-105"
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                    }}
                >
                <p className="text-xs font-bold whitespace-nowrap">{node.label}</p>
                </div>
            </Html>
        </group>
    )
}

export function Scene({ currentNode, completedNodes, onNodeClick }: SceneProps) {
  // Precompute node positions along the street
  const nodePositions = useMemo(() => {
    return gameNodes.map((node, index) => {
      const z = -index * 24
      const x = index % 2 === 0 ? -14 : 14
      return { ...node, position: [x, 0, z] as [number, number, number] }
    })
  }, [])

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />

          <CityEnvironment />

          <Player currentNode={currentNode} nodePositions={nodePositions} />
          <GuideCharacter currentNode={currentNode} nodePositions={nodePositions} />

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
                />
            )
          })}
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
