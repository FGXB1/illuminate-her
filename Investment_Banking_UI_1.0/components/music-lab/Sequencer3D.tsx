"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// Mapping from Tailwind classes/names to Hex colors for Three.js
// Strict Palette: C1C1C1, 2C4251, D16666, 550C18, 240115
const trackColors: { [key: string]: string } = {
  kick: '#D16666',   // Red
  snare: '#550C18',  // Dark Red
  hihat: '#C1C1C1',  // Light Grey
  clap: '#2C4251',   // Dark Blue
  synth: '#2C4251',  // Dark Blue (mapped to palette)
  piano: '#C1C1C1',  // Light Grey (mapped to palette)
  bass: '#240115',   // Dark Purple (mapped to palette)
};

// Brighter emissive versions for Bloom
const trackEmissive: { [key: string]: string } = {
  kick: '#FF4444',   // Bright Red
  snare: '#FF0033',  // Bright Red/Pink
  hihat: '#FFFFFF',  // White
  clap: '#4488AA',   // Bright Blue
  synth: '#66AACC',  // Bright Cyan/Blue
  piano: '#FFFFFF',  // White
  bass: '#880044',   // Bright Purple/Pink
};

const trackNames: { [key: string]: string } = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-Hat',
  clap: 'Clap',
  synth: 'Synth',
  piano: 'Piano',
  bass: 'Bass',
};

interface Sequencer3DProps {
  tracks: { [key: string]: boolean[] };
  currentStep: number;
  onToggleStep: (track: string, step: number) => void;
  highlightRow?: string | null;
  highlightColumns?: number[];
  isInteractive?: boolean;
}

// Re-use logic:
// Grid is 16 steps (X) by 7 tracks (Y).
// Let's center the grid. 16 steps * spacing ~ 16 units wide.
// 7 tracks * spacing ~ 7 units high.

const STEP_SPACING_X = 1.2;
const STEP_SPACING_Y = 1.2;

function StepBox({
  position,
  isActive,
  isCurrent,
  color,
  emissiveColor,
  onClick,
  isInteractive,
  isHighlighted,
  trackName,
  stepIndex
}: {
  position: [number, number, number],
  isActive: boolean,
  isCurrent: boolean,
  color: string,
  emissiveColor: string,
  onClick: () => void,
  isInteractive: boolean,
  isHighlighted: boolean,
  trackName: string,
  stepIndex: number
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animation logic
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Pulse scale if playing/current
    const targetScale = isCurrent && isActive ? 1.4 : (hovered && isInteractive ? 1.1 : 1);

    // Smooth lerp for scale
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);

    // Highlight pulse for tutorial
    if (isHighlighted && !isActive) {
       const pulse = (Math.sin(state.clock.elapsedTime * 10) + 1) / 2; // 0 to 1
       // We can modulate opacity or color manually if needed, but scale/emissive is easier
       // Let's make it pulse in size slightly
       const highlightScale = 1 + pulse * 0.2;
       if (!hovered) meshRef.current.scale.setScalar(highlightScale);
    }
  });

  const materialColor = isActive ? color : '#222';
  const materialEmissive = isActive ? emissiveColor : (isHighlighted ? '#555555' : '#000');
  const materialEmissiveIntensity = isActive ? (isCurrent ? 4 : 2) : (isHighlighted ? 1 : 0);
  const materialOpacity = isActive ? 0.9 : 0.3;

  return (
    <RoundedBox
        ref={meshRef}
        args={[1, 1, 0.2]} // Width, Height, Depth
        position={position}
        radius={0.1}
        smoothness={4}
        onClick={(e) => {
            e.stopPropagation();
            if (isInteractive) onClick();
        }}
        onPointerOver={() => isInteractive && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
        >
        {isActive ? (
            <meshBasicMaterial
                color={materialEmissive} // Use brighter emissive color for neon look
                toneMapped={false}
            />
        ) : (
            <meshStandardMaterial
                color={materialColor}
                emissive={materialEmissive}
                emissiveIntensity={materialEmissiveIntensity}
                transparent
                opacity={materialOpacity}
                roughness={0.2}
                metalness={0.1}
                toneMapped={false}
            />
        )}
    </RoundedBox>
  );
}

function Playhead({ currentStep }: { currentStep: number }) {
  const ref = useRef<THREE.Group>(null);

  // Calculate X position based on currentStep
  // Grid starts at X = 0? No, let's center it.
  // 16 columns (0 to 15). Center is 7.5.
  // x = (step - 7.5) * spacing

  const targetX = (currentStep - 7.5) * STEP_SPACING_X;

  useFrame(() => {
    if (ref.current) {
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.2);
    }
  });

  return (
    <group ref={ref}>
        {/* Laser Line */}
        <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[0.1, 9, 0.1]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Glow */}
        <pointLight color="#ffffff" intensity={2} distance={5} decay={2} />
    </group>
  );
}

function TrackLabel({ position, text, isActive }: { position: [number, number, number], text: string, isActive: boolean }) {
    return (
        <Text
            position={position}
            fontSize={0.4}
            color={isActive ? "#ffffff" : "#888888"}
            anchorX="right"
            anchorY="middle"
        >
            {text}
        </Text>
    );
}

function StepLabel({ position, text, isActive }: { position: [number, number, number], text: string, isActive: boolean }) {
    return (
        <Text
            position={position}
            fontSize={0.3}
            color={isActive ? "#ffffff" : "#444444"}
            anchorX="center"
            anchorY="bottom"
        >
            {text}
        </Text>
    );
}

function Scene({
    tracks,
    currentStep,
    onToggleStep,
    highlightRow,
    highlightColumns,
    isInteractive
}: Sequencer3DProps) {

  // Track keys to iterate
  const trackKeys = Object.keys(tracks);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 15]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={5} color="#4400ff" distance={30} decay={1} />

      {/* Grid */}
      <group position={[0, 0, 0]}>
        {/* Playhead */}
        <Playhead currentStep={currentStep} />

        {/* Rows */}
        {trackKeys.map((trackKey, trackIndex) => {
            // Y position: Map 0..6 to top..bottom or bottom..top?
            // Usually Kick is bottom in DAWs, but Sequencer.tsx has Kick at top visually (index 0).
            // Let's keep Kick at top (positive Y) for consistency with 2D.
            // Center Y: 7 rows (0 to 6). Center is 3.
            // y = (3 - trackIndex) * spacing
            const y = (3 - trackIndex) * STEP_SPACING_Y;

            const steps = tracks[trackKey];
            const isRowHighlighted = highlightRow === trackKey;

            return (
                <group key={trackKey}>
                    {/* Track Label */}
                    <TrackLabel
                        position={[-8.5 * STEP_SPACING_X, y, 0]}
                        text={trackNames[trackKey] || trackKey}
                        isActive={isRowHighlighted}
                    />

                    {/* Steps */}
                    {steps.map((isActive, stepIndex) => {
                         // X position: (step - 7.5) * spacing
                         const x = (stepIndex - 7.5) * STEP_SPACING_X;

                         const isColHighlighted = highlightColumns?.includes(stepIndex) && isRowHighlighted;
                         const isCurrent = currentStep === stepIndex;

                         return (
                            <React.Fragment key={`${trackKey}-${stepIndex}`}>
                                {/* Step Number Label (only for first row or separate header?) */}
                                {trackIndex === 0 && (
                                    <StepLabel
                                        position={[x, y + 0.8, 0]}
                                        text={(stepIndex + 1).toString()}
                                        isActive={isColHighlighted || isCurrent}
                                    />
                                )}

                                <StepBox
                                    position={[x, y, 0]}
                                    isActive={isActive}
                                    isCurrent={isCurrent}
                                    color={trackColors[trackKey] || '#ffffff'}
                                    emissiveColor={trackEmissive[trackKey] || '#ffffff'}
                                    onClick={() => onToggleStep(trackKey, stepIndex)}
                                    isInteractive={isInteractive !== false}
                                    isHighlighted={!!isColHighlighted}
                                    trackName={trackKey}
                                    stepIndex={stepIndex}
                                />
                            </React.Fragment>
                         );
                    })}
                </group>
            );
        })}
      </group>

      <ContactShadows position={[0, -5, 0]} opacity={0.5} scale={40} blur={2} far={4.5} />

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2.0} radius={0.6} />
      </EffectComposer>
    </>
  );
}

export function Sequencer3D(props: Sequencer3DProps) {
  const { tracks, onToggleStep, isInteractive } = props;

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden bg-black/80 border border-music-light/10 relative">
      {/* Hidden Accessibility/Test Overlay */}
      <div className="sr-only">
        {Object.entries(tracks).map(([trackName, steps]) => (
            <div key={trackName}>
                {steps.map((_, stepIndex) => (
                    <button
                        key={stepIndex}
                        onClick={() => isInteractive && onToggleStep(trackName, stepIndex)}
                        aria-label={`Toggle ${trackName} step ${stepIndex + 1}`}
                        disabled={!isInteractive}
                    />
                ))}
            </div>
        ))}
      </div>

      {/* Overlay Instructions or UI if needed */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="text-[10px] text-music-light/50 font-mono">3D VIEW ACTIVE</div>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 24]} fov={50} />
        {/* OrbitControls allowed but restricted for "Dashboard" feel? */}
        <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
        />

        <Scene {...props} />
      </Canvas>
    </div>
  );
}
