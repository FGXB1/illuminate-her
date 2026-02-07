"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import { gameNodes } from "@/lib/game-data"
import { CityEnvironment } from "./CityEnvironment"
import { Player } from "./Player"
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

    return (
        <group position={node.position} onClick={onClick}>
            {/* Visual Representation */}
            {isBuilding ? (
                // Building
                 <BlockyBuilding
                    height={node.id % 2 === 0 ? 8 : 10} // Variation
                    width={5}
                    depth={5}
                    color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"}
                />
            ) : isCharacter ? (
                 // Use BlockyCharacter for NPCs
                 <BlockyCharacter color={isCompleted ? "#fbbf24" : isCurrent ? "#ef4444" : "#cbd5e1"} />
            ) : (
                // Event Marker
                <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <octahedronGeometry args={[1]} />
                    <meshStandardMaterial color={isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"} />
                </mesh>
            )}

            {/* Label */}
            <Html position={[0, isBuilding ? 9 : 3.5, 0]} center>
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
      // Start slightly forward so node 1 is visible
      const z = -index * 24 // Increased spacing for density feel
      // Alternate left/right. index 0 is left (-14), index 1 is right (14)
      // Matches the building layout in CityEnvironment (approx +/- 14)
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
