'use client';

import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';
import { FaMap, FaBook, FaUser, FaCloudSun} from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';

const GlobePage: React.FC = () => {
  const controlsRef = useRef(null);

  const handleBackOffice = () => {
    window.open('/login', '_blank');
  };
  

  const handleOpenBook = () => {
    window.open('https://risper-catalogue.vercel.app/', '_blank');
  };

  return (
    <div className="relative w-full h-screen flex flex-col text-white animated-bg">
      <div className="stars">
        {/* Generate multiple stars */}
        {[...Array(100)].map((_, i) => (
          <div key={i} className="star" style={{ animationDelay: `${Math.random() * 5}s`, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }}></div>
        ))}
      </div>
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
        {/* Logo */}
        <div className="text-2xl font-bold flex items-center space-x-2">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">RISPER</span>
          <span>EXPLORE</span>
        </div>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-gray-300">Destinations</a>
          <a href="#" className="hover:text-gray-300">Tours</a>
          <a href="#" className="hover:text-gray-300">About Us</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
        </nav>
        {/* Back Office Button */}
        <button
          onClick={handleBackOffice}
          className="px-6 py-2 border border-gray-400 rounded-full hover:bg-gray-500/40 hover:text-gray-100 transition"
          >
          Back Office
        </button>
      </header>

      {/* Canvas Section */}
      <div className="w-full h-full relative z-10">
        <Canvas>
          <ambientLight intensity={1.5} />
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <Globe scale={15} position={[0, 0, 0]} />
          <OrbitControls ref={controlsRef} minDistance={2.8} maxDistance={5} />
        </Canvas>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-10 right-6 flex flex-col space-y-4 z-20">
        <div className="relative group">
          <button className="p-3 bg-gray-800 rounded-full shadow-md hover:bg-gray-700">
            <FaMap className="text-white text-xl" />
          </button>
          <span className="absolute right-full mr-3 px-4 py-2 text-lg text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Map</span>
        </div>
        <div className="relative group">
          <button
            onClick={handleOpenBook}
            className="p-3 bg-gray-800 rounded-full shadow-md hover:bg-gray-700"
          >
            <FaBook className="text-white text-xl" />
          </button>
          <span className="absolute right-full mr-3 px-4 py-2 text-lg text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Risper Catalogue</span>
        </div>
        <div className="relative group">
          <button className="p-3 bg-gray-800 rounded-full shadow-md hover:bg-gray-700">
            <FaCloudSun className="text-white text-2xl" />
          </button>
          <span className="absolute right-full mr-3 px-4 py-2 text-lg text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Weather</span>
        </div>
      </div>
    </div>
  );
};

export default GlobePage;