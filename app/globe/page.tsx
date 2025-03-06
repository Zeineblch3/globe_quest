'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';
import { useRouter } from 'next/navigation';

const GlobePage: React.FC = () => {
  const router = useRouter();
  const controlsRef = useRef(null);

  const handleViewCatalogue = () => {
    window.open('https://risper-catalogue.vercel.app/', '_blank'); // Replace with your catalogue URL
  };

  const handleBackOffice = () => {
    router.push('/login'); // Redirect to the login page (or back office)
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center">
      <div className="absolute top-5 left-5 z-10">
        {/* View Catalogue Button */}
        <button
          onClick={handleViewCatalogue}
          className="
            px-5 py-2.5 
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
      </div>

      <div className="absolute top-20 left-5 z-10">
        {/* Back Office Button */}
        <button
          onClick={handleBackOffice}
          className="
            px-5 py-2.5 
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
      </div>

      <div className="w-full h-full">
        {/* Canvas holds the Globe and other 3D settings */}
        <Canvas>
          {/* Lighting */}
          <ambientLight intensity={2} />
          <directionalLight position={[1, 1, 1]} intensity={2} />

          {/* Globe Component */}
          <Globe scale={15} position={[0, 0, 0]} />

          {/* Orbit Controls for user interaction */}
          <OrbitControls 
            ref={controlsRef} 
            minDistance={2.8} // Set minimum zoom distance
            maxDistance={5} // Set maximum zoom distance
          />
        </Canvas>
      </div>
    </div>
  );
};

export default GlobePage;