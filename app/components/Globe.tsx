'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber'; // Import useFrame hook
import * as THREE from 'three'; // Import THREE for types

const Globe: React.FC<{ scale?: number; position?: [number, number, number] }> = ({
  scale = 1,
  position = [0, 0, 0],
}) => {
  const { scene } = useGLTF('/models/scene.gltf'); // Load the GLTF model
  const globeRef = useRef<THREE.Group>(null); // Create a reference for the globe model

  // Smoothly rotate the globe using the useFrame hook
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005; // Adjust rotation speed (e.g., 0.005 for smooth rotation)
    }
  });

  return (
    <primitive ref={globeRef} object={scene} scale={scale} position={position} />
  );
};

// Preload the GLTF model
useGLTF.preload('/models/scene.gltf');

export default Globe;
