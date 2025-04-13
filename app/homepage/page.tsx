'use client';

import React, { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';
import { FaMap, FaBook, FaCloudSun, FaInfoCircle, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import Stars from './Stars';
import { X } from 'lucide-react';
import { FaGlobe } from 'react-icons/fa';
import { VirtualGuide } from '../components/VirtualGuide';


const GlobePage: React.FC = () => {
  const controlsRef = useRef(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);


  const handleBackOffice = () => {
    window.open('/login', '_blank');
  };

  const handleOpenBook = () => {
    window.open('https://risper-catalogue.vercel.app/', '_blank');
  };

  const toggleContactPanel = () => setIsContactOpen(!isContactOpen);
  const toggleAboutPanel = () => setIsAboutOpen(!isAboutOpen);

  return (
    <div className="relative w-full h-screen flex flex-col text-white animated-bg">
      <Stars />
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
        {/* Logo */}
        <div className="text-2xl font-bold flex items-center space-x-2">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">RISPER</span>
          <span>GlobeQuest</span>
        </div>
        {/* Navigation Links */}
        <nav className="md:flex space-x-8 hidden">
          <a href="#" className="hover:text-gray-300">Destinations</a>
          <a href="#" className="hover:text-gray-300">Tours</a>
          <a href="#" className="hover:text-gray-300" onClick={toggleAboutPanel}>About Us</a>
          <a href="#" className="hover:text-gray-300" onClick={toggleContactPanel}>Contact</a>
        </nav>
        {/* Back Office Button */}
        <button
          onClick={handleBackOffice}
          className="px-6 py-2 border border-gray-400 rounded-full hover:bg-gray-500/40 hover:text-gray-100 transition"
        >
          Back Office
        </button>
      </header>

      {/* rotation globe */}
      <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-20 group">
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          className="relative p-4 rounded-full bg-gray-800 hover:bg-gray-700 shadow-lg transition-transform"
          title={autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        >
          <FaGlobe className="text-white text-2xl" />

          {/* Bar overlay when autoRotate is false */}
          {!autoRotate && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[2px] h-full bg-white rotate-45" />
            </div>
          )}
        </button>
        <span className="absolute left-18 mr-3 px-4 py-2 text-lg text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {autoRotate ? 'Stop Globe' : 'Start Globe'}
        </span>
      </div>


    {/* Canvas Section */}
<div className="w-full h-[80vh] md:h-full relative z-10">
  <Canvas>
    <ambientLight intensity={1.5} />
    <directionalLight position={[1, 1, 1]} intensity={2} />
    <Globe scale={15} position={[0, 0, 0]} rotate={autoRotate} />
    <OrbitControls ref={controlsRef} minDistance={2.8} maxDistance={7} />
  </Canvas>
</div>

{/* Virtual Guide (fixed modal) */}
<div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded shadow-md max-w-sm">
  {/* Virtual Guide Character */}
  <VirtualGuide
    sceneUrl="https://my.spline.design/robottutorialinteractiveeventscopy-T2dVGKwQBzPJOROLQexHZvs7/"
    description="Welcome to the sacred temples of Kyoto. Let me guide you."
    visible={true}
    style={{ pointerEvents: 'auto' }} // Ensure that the Spline component is clickable
  />
</div>




     {/* Contact Panel - Enhanced UI */}
      {isContactOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-purple-500/20">
            {/* Close button */}
            <button
              onClick={toggleContactPanel}
              className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-all duration-300 hover:rotate-90 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
              <div className="flex items-center justify-center">
                <FaEnvelope className="h-10 w-10 text-white mr-4" />
                <h2 className="text-4xl font-bold text-white">Contact Us</h2>
              </div>
              <p className="text-center text-white/80 mt-4 max-w-md mx-auto">
                We're here to help with your travel needs. Reach out to us through any of these channels.
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-l text-white">
                    <strong>Address:</strong> 2éme étage, Imm Mlika, 2 Rue des Palmiers, Sousse 4051
                  </p>
                  <p className="text-l text-white">
                    <strong>Phone:</strong> +216 21 708 608
                  </p>
                  <p className="text-l text-white">
                    <strong>Email:</strong> <a href="mailto:Hello@rispertravel.com" className="text-blue-400">Hello@rispertravel.com</a>
                  </p>
                  <p className="text-l text-white">
                    <strong>B2B Email:</strong> <a href="mailto:b2b@rispertravel.com" className="text-blue-400">b2b@rispertravel.com</a>
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-l text-white">
                    <strong>Social Media:</strong>
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/rispertravel" target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-white text-2xl cursor-pointer" />
                    </a>
                    <a href="https://www.instagram.com/risper_travel_tours?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-white text-2xl cursor-pointer" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="text-white text-2xl cursor-pointer" />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Panel - Enhanced UI */}
      {isAboutOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-purple-500/20">
            {/* Close button */}
            <button
              onClick={toggleAboutPanel}
              className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-all duration-300 hover:rotate-90 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
              <div className="flex items-center justify-center">
                <FaInfoCircle className="h-10 w-10 text-white mr-4" />
                <h2 className="text-4xl font-bold text-white">About Us</h2>
              </div>
              <p className="text-center text-white/80 mt-4 max-w-md mx-auto">
                We provide immersive travel experiences across the globe. Explore with us!
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
            <p className="text-l text-white">
              <strong>Welcome to Risper Travel Tours!</strong><br />
              <span className="block mt-4">We are a premier travel agency dedicated to crafting personalized and unforgettable travel experiences. With our expert team and commitment to excellence, we ensure every journey is seamless, safe, and filled with remarkable memories.</span>
              <span className="block mt-4">Discover the world with us! ✈️🌎</span>
            </p>
            </div>
          </div>
        </div>
      )}



      {/* Floating Action Buttons */}
      <div className="absolute bottom-100 right-6 flex flex-col space-y-4 z-20">
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
