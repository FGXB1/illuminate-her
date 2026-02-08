"use client"

import { Html } from "@react-three/drei"

interface NodeProps {
  node: any
  isCompleted: boolean
  isCurrent: boolean
  onClick: () => void
}

export function EventMarker({ node, isCompleted, isCurrent, onClick }: NodeProps) {
  const color = isCompleted ? "#fbbf24" : isCurrent ? "#3b82f6" : "#cbd5e1"

  return (
    <group position={node.position} onClick={onClick}>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial color={color} />
      </mesh>
       <Html position={[0, 3, 0]} center>
         <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border shadow-sm">
          <p className="text-xs font-bold whitespace-nowrap">{node.label}</p>
        </div>
      </Html>
    </group>
  )
}
