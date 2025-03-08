'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/lib/supbase';
import { useFrame, useThree } from '@react-three/fiber';

// Convert Lat/Lon to 3D Coordinates
const toCartesian = (lat: number, lon: number, radius: number) => {
  const latRad = THREE.MathUtils.degToRad(lat);
  const lonRad = THREE.MathUtils.degToRad(lon);

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);

  return new THREE.Vector3(x, y, z);
};

const Globe: React.FC<{ scale?: number; position?: [number, number, number] }> = ({
  scale = 1,
  position = [0, 0, 0],
}) => {
  const { scene } = useGLTF('/models/scene.gltf'); // Load 3D globe model
  const globeRef = useRef<THREE.Group>(null);
  const pinsRef = useRef<THREE.Mesh[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index for current image
  const { camera } = useThree(); // Move inside the component

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, name, description, photo_urls, tripAdvisor_link, latitude, longitude, price'); // Ensure price is included

      if (error) console.error('Error fetching tours:', error);
      else setTours(data);
    };

    fetchTours();
  }, []);

  const handleNextImage = () => {
    if (selectedTour && selectedTour.photo_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedTour.photo_urls.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedTour && selectedTour.photo_urls) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + selectedTour.photo_urls.length) % selectedTour.photo_urls.length
      );
    }
  };

  // Scale pins dynamically based on camera zoom
  useFrame(() => {
    if (!pinsRef.current.length) return;

    const distance = camera.position.length(); // Distance from globe
    const baseSize = 0.1; // Bigger base size to ensure visibility
    const scaleFactor = Math.max(0.02, baseSize * (distance / 5)); // Prevent scaling to 0

    pinsRef.current.forEach((pin) => {
      if (pin) pin.scale.set(scaleFactor, scaleFactor, scaleFactor);
    });
  });

  return (
    <>
      <group ref={globeRef}>
        {/* 3D Globe Model */}
        <primitive object={scene} scale={scale} position={position} rotation={[0, 1.2, 0]} />

        {/* 3D Tour Pins */}
        {tours.map((tour, index) => {
          const radius = 2.5; // Adjusted for the globe size
          const { x, y, z } = toCartesian(tour.latitude, tour.longitude, radius);

          return (
            <mesh
              key={tour.id}
              position={[x, y, z]}
              ref={(el) => {
                if (el) pinsRef.current[index] = el;
              }}
              rotation={[-Math.PI, 0, 0]}
              onPointerDown={(event) => {
                event.stopPropagation();
                setSelectedTour(tour);
                setCurrentImageIndex(0); // Reset to the first image
              }}
            >
              <coneGeometry args={[0.2, 0.8, 32]} /> {/* Increased initial size */}
              <meshStandardMaterial color={selectedTour?.id === tour.id ? 'yellow' : 'red'} />
            </mesh>
          );
        })}
      </group>

      {selectedTour && selectedTour.photo_urls && (
        <Html position={[0, 0, 0]} center>
          <div
            className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-500"
            style={{
              width: '500px',
              height: '600px',
              overflowY: 'auto',
              pointerEvents: 'auto', // Ensure pointer events are enabled
              zIndex: 1000, // Ensure the popup is on top
            }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedTour.name}</h3>
            
            {/* Image carousel */}
            <div className="relative w-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`, // Move the images horizontally
                }}
              >
                {selectedTour.photo_urls.map((url: string, index: number) => (
                  <div key={index} className="flex-shrink-0 w-full mx-1"> {/* Added margin */}
                    <img
                      src={url}
                      alt={`${selectedTour.name} image ${index}`}
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                  </div>
                ))}
              </div>
              {/* Left arrow */}
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 bg-opacity-5 text-gray-800 flex items-center justify-center backdrop-blur-sm hover:bg-gray-500 hover:bg-opacity-70 hover:text-white transition duration-300"
              >
                &lt;
              </button>

              {/* Right arrow */}
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 bg-opacity-30 text-gray-800 flex items-center justify-center backdrop-blur-sm hover:bg-gray-500 hover:bg-opacity-70 hover:text-white transition duration-300"
              >
                &gt;
              </button>

            </div>

            {/* Price display */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">${selectedTour.price}</h3>

            <p className="text-gray-700 mb-4">
              <a
                href={selectedTour.tripAdvisor_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the click from closing the popup
                }}
                style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled on the link
              >
                Visit TripAdvisor
              </a>
            </p>

            <p className="text-gray-700 mb-4">{selectedTour.description}</p>
            <button
              onClick={() => setSelectedTour(null)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </>
  );
};

// Preload GLTF Model
useGLTF.preload('/models/scene.gltf');

export default Globe;