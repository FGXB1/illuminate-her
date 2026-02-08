"use client"

import { Html } from "@react-three/drei"

interface NodeProps {
  node: any
  isCompleted: boolean
  isCurrent: boolean
  onClick: () => void
}

export function Building({ node, isCompleted, isCurrent, onClick }: NodeProps) {
  const color = isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"

  return (
    <group position={node.position} onClick={onClick}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 5, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, 6, 0]} center>
        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border shadow-sm">
          <p className="text-xs font-bold whitespace-nowrap">{node.label}</p>
        </div>
      </Html>
    </group>
  )
}
