'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';
import { useRouter } from 'next/navigation';

const GlobePage: React.FC = () => {
  const router = useRouter();

  const handleViewCatalogue = () => {
    window.open('https://risper-catalogue.vercel.app/', '_blank'); // Replace with your catalogue URL
  };

  const handleBackOffice = () => {
    router.push('/login'); // Redirect to the login page (or back office)
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* View Catalogue Button */}
      <button
        onClick={handleViewCatalogue}
        className="
          absolute top-5 left-5 px-5 py-2.5 
          bg-transparent 
          border-2 border-white 
          rounded-2xl 
          text-white 
          text-lg 
          cursor-pointer 
          transition-all duration-300 ease-in-out
          hover:bg-white hover:text-gray-900 hover:border-white
        "
      >
        View Catalogue
      </button>

      {/* Back Office Button */}
      <button
        onClick={handleBackOffice}
        className="
          absolute top-5 right-5 px-5 py-2.5 
          bg-transparent 
          border-2 border-white 
          rounded-2xl 
          text-white 
          text-lg 
          cursor-pointer 
          transition-all duration-300 ease-in-out
          hover:bg-white hover:text-gray-900 hover:border-white
        "
      >
        Back Office
      </button>

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
