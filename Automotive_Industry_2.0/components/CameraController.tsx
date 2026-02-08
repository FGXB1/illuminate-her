"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { GameState } from "../lib/types";
import { CarPart, PART_CONFIG } from "../lib/carConfig";
import { TRACK_CURVE, LAP_DISTANCE } from "../lib/track";

interface CameraControllerProps {
  gameState: GameState;
  selectedPart: CarPart | null;
  distance: number;
}

// Overview camera position relative to car
const PIT_OVERVIEW_OFFSET = new THREE.Vector3(6, 3, 6);
const CHASE_CAM_OFFSET = new THREE.Vector3(0, 5, -10); // Behind and up
const CHASE_CAM_LOOK_OFFSET = new THREE.Vector3(0, 0, 10); // Look ahead

export default function CameraController({ gameState, selectedPart, distance }: CameraControllerProps) {
  const controlsRef = useRef<CameraControls>(null);
  const { scene } = useThree();

  // Helper to get car position and rotation
  const getCarTransform = (dist: number) => {
    const loopDistance = dist % LAP_DISTANCE;
    const t = loopDistance / LAP_DISTANCE;
    const position = TRACK_CURVE.getPointAt(t);
    const tangent = TRACK_CURVE.getTangentAt(t).normalize();

    // Calculate rotation matrix from tangent
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    dummy.lookAt(position.clone().add(tangent));
    return { position, quaternion: dummy.quaternion };
  };

  // 1. Chase Cam during Race
  useFrame((state, delta) => {
    if (gameState === 'racing' && controlsRef.current) {
      const { position: carPos, quaternion: carRot } = getCarTransform(distance);

      // Calculate desired camera position in world space
      // Chase cam: behind car.
      // Offset needs to be rotated by car rotation
      const offset = CHASE_CAM_OFFSET.clone().applyQuaternion(carRot);
      const camPos = carPos.clone().add(offset);

      const lookOffset = CHASE_CAM_LOOK_OFFSET.clone().applyQuaternion(carRot);
      const lookAt = carPos.clone().add(lookOffset);

      // Chase cam mode
      controlsRef.current.setLookAt(camPos.x, camPos.y, camPos.z, lookAt.x, lookAt.y, lookAt.z, false);
    }
  });

  // 2. Handle State Transitions (Pit Stop, Detail Views)
  useEffect(() => {
    if (!controlsRef.current) return;

    if (gameState === 'pit_stop') {
      const { position: carPos, quaternion: carRot } = getCarTransform(distance);

      if (selectedPart) {
        // Detail View
        const config = PART_CONFIG[selectedPart] || PART_CONFIG['chassis'];
        const offset = new THREE.Vector3(...config.pos).applyQuaternion(carRot);
        const lookOffset = new THREE.Vector3(...config.lookAt).applyQuaternion(carRot);

        const targetPos = carPos.clone().add(offset);
        const targetLook = carPos.clone().add(lookOffset);

        controlsRef.current.setLookAt(
            targetPos.x, targetPos.y, targetPos.z,
            targetLook.x, targetLook.y, targetLook.z,
            true // animate
        );
      } else {
        // Overview View
        // Place camera at side
        const offset = PIT_OVERVIEW_OFFSET.clone().applyQuaternion(carRot);
        const targetPos = carPos.clone().add(offset);

        controlsRef.current.setLookAt(
            targetPos.x, targetPos.y, targetPos.z,
            carPos.x, carPos.y, carPos.z,
            true // animate
        );
      }
    }
  }, [gameState, selectedPart, distance]); // distance stable during pit stop

  return <CameraControls ref={controlsRef} enabled={gameState !== 'pit_stop'} />;
}
