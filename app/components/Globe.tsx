'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';

// The Globe component now accepts props like scale, position directly
const Globe: React.FC<{ scale?: number; position?: [number, number, number] }> = ({
  scale = 5,
  position = [0, 0, 0],
}) => {
  const { scene } = useGLTF('/models/scene.gltf');  // Load the GLTF model

  return (
    <primitive object={scene} scale={scale} position={position} />
  );
};

// Preload the GLTF model
useGLTF.preload('/models/scene.gltf');

export default Globe;
