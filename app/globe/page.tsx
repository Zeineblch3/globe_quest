'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';

const GlobePage: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="text-2xl font-bold mb-4">3D Globe</h1>
      <div style={{ width: '80vw', height: '80vh' }}>
        {/* Canvas holds the Globe and other 3D settings */}
        <Canvas>
          {/* Lighting */}
          <ambientLight intensity={2} />
          
          <directionalLight position={[1, 1, 1]} intensity={2} />

          {/* Globe Component */}
          <Globe scale={15} position={[0, 0, 0]} />

          {/* Orbit Controls for user interaction */}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default GlobePage;
