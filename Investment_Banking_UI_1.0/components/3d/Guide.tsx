"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3, Group, MathUtils } from "three"
import { BlockyCharacter } from "./MinecraftAssets"
import { Html } from "@react-three/drei"
import { GUIDE_NAME, GUIDE_TITLE } from "@/lib/negotiation-data"

interface GuideProps {
  currentNode: number
  nodePositions: { id: number; position: [number, number, number] }[]
}

export function GuideCharacter({ currentNode, nodePositions }: GuideProps) {
  const groupRef = useRef<Group>(null)
  const targetPos = useRef(new Vector3(0, 0, 0))

  // Use state for animation to force re-render when movement state changes
  const [isMoving, setIsMoving] = useState(false)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const currentPos = groupRef.current.position

    // Calculate target position based on current node
    const currentNodeData = nodePositions.find((n) => n.id === currentNode)

    if (currentNodeData) {
        // Player is at x = -2 or 2. Let's place guide at x = 0 (center of street)
        // But also align with the node's Z
        // We add a slight Z offset so the guide stands slightly behind or ahead?
        // Let's say slightly behind (z + 2) assuming we move into negative Z.
        // Wait, z goes -24, -48 etc. So "behind" means larger Z (closer to 0).
        targetPos.current.set(0, 0, currentNodeData.position[2] + 2)
    }

    const dist = currentPos.distanceTo(targetPos.current)
    const moving = dist > 0.1
    if (moving !== isMoving) setIsMoving(moving)

    // Smoothly move guide (slightly slower than player for natural feel? or same speed)
    currentPos.lerp(targetPos.current, delta * 2.5)

    // Rotation logic
    if (moving) {
        // Look at movement target
        const lookTarget = targetPos.current.clone()
        lookTarget.y = currentPos.y
        groupRef.current.lookAt(lookTarget)
    } else if (currentNodeData) {
        // Face the player (who is at x +/- 2)
        // Player is at [+/-2, 0, nodeZ]
        // Guide is at [0, 0, nodeZ + 2]
        // So guide should look at player.
        // Let's approximate player position
        const playerX = currentNodeData.position[0] < 0 ? -2 : 2
        const playerZ = currentNodeData.position[2]

        const lookTarget = new Vector3(playerX, 1, playerZ)

        // Slerp rotation towards player
        const startQ = groupRef.current.quaternion.clone()
        groupRef.current.lookAt(lookTarget)
        const endQ = groupRef.current.quaternion.clone()

        // Reset and interpolate
        groupRef.current.quaternion.copy(startQ).slerp(endQ, delta * 5)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 2]}>
        {/* Start slightly offset from player start [0,0,0] */}

        <BlockyCharacter
            color="#10b981" // Emerald green for Guide
            isMoving={isMoving}
        />

        {/* Guide Label */}
        <Html position={[0, 2.2, 0]} center distanceFactor={8}>
            <div className="flex flex-col items-center">
                <div className="bg-emerald-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap border border-emerald-400">
                    {GUIDE_NAME}
                </div>
                <div className="bg-black/50 backdrop-blur-sm text-white text-[6px] px-1 py-0.5 rounded mt-0.5 whitespace-nowrap">
                   {GUIDE_TITLE}
                </div>
            </div>
        </Html>

        {/* Shadow blob */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.4, 16]} />
            <meshBasicMaterial color="black" opacity={0.3} transparent />
        </mesh>
    </group>
  )
}
