"use client";

import * as THREE from "three";

/**
 * 3D scene content for use inside Canvas (e.g. Wall Street / game board).
 * Export a minimal scene so imports from @/components/3d/Scene resolve.
 */
export function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}

export default Scene;
