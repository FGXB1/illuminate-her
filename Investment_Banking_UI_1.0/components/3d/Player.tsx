"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, MathUtils, Group, Quaternion } from "three"
import { BlockyCharacter } from "./MinecraftAssets"

interface PlayerProps {
  currentNode: number
  nodePositions: { id: number; position: [number, number, number] }[]
}

export function Player({ currentNode, nodePositions }: PlayerProps) {
  const groupRef = useRef<Group>(null)
  const targetPos = useRef(new Vector3(0, 0, 0))
  const { camera } = useThree()

  // Scroll offset for camera panning
  const scrollOffset = useRef(0)

  // Use state for animation to force re-render when movement state changes
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        // Simple scroll dampening
        // Negative scroll (up) moves camera forward (looking ahead)
        // Positive scroll (down) moves camera backward (looking back)
        scrollOffset.current += e.deltaY * 0.01

        // Clamp scroll offset to a reasonable range relative to player
        scrollOffset.current = MathUtils.clamp(scrollOffset.current, -10, 10)
    }
    window.addEventListener("wheel", handleWheel)
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const playerPos = groupRef.current.position

    // Calculate target position based on current node
    const currentNodeData = nodePositions.find((n) => n.id === currentNode)

    // We calculate target position every frame in case nodePositions change,
    // but ideally this is stable.
    if (currentNodeData) {
        const xOffset = currentNodeData.position[0] < 0 ? -2 : 2
        targetPos.current.set(xOffset, 0, currentNodeData.position[2])
    }

    const dist = playerPos.distanceTo(targetPos.current)
    const moving = dist > 0.1
    if (moving !== isMoving) setIsMoving(moving)

    // Smoothly move player
    playerPos.lerp(targetPos.current, delta * 3)

    // Rotation logic
    if (moving) {
        // Look at movement target
        const lookTarget = targetPos.current.clone()
        lookTarget.y = playerPos.y
        groupRef.current.lookAt(lookTarget)
    } else if (currentNodeData) {
        // Face the node (building/character) when stopped
        const lookTarget = new Vector3(currentNodeData.position[0], 1, currentNodeData.position[2])

        // Slerp rotation towards building
        const startQ = groupRef.current.quaternion.clone()
        groupRef.current.lookAt(lookTarget)
        const endQ = groupRef.current.quaternion.clone()

        // Reset and interpolate
        groupRef.current.quaternion.copy(startQ).slerp(endQ, delta * 5)
    }

    // Camera follows player with an offset + scroll offset
    // Target camera position
    const camX = playerPos.x * 0.3
    const camY = 8
    const camZ = playerPos.z + 12 + scrollOffset.current

    // Smoothly interpolate camera position
    camera.position.x = MathUtils.lerp(camera.position.x, camX, delta * 2)
    camera.position.y = MathUtils.lerp(camera.position.y, camY, delta * 2)
    camera.position.z = MathUtils.lerp(camera.position.z, camZ, delta * 2)

    // Camera looks at player head
    const lookAtTarget = playerPos.clone()
    lookAtTarget.y += 1.5
    camera.lookAt(lookAtTarget)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
        <BlockyCharacter
            color="#3b82f6"
            isMoving={isMoving}
        />
        {/* Shadow blob */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.4, 16]} />
            <meshBasicMaterial color="black" opacity={0.3} transparent />
        </mesh>
    </group>
  )
}
