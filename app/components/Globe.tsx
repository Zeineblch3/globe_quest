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
  const { camera } = useThree(); // Move inside the component

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, name, description, photo_url, tripAdvisor_link, latitude, longitude');

      if (error) console.error('Error fetching tours:', error);
      else setTours(data);
    };

    fetchTours();
  }, []);

  // Scale pins dynamically based on camera zoom
  useFrame(() => {
    if (!camera) return;
    const distance = camera.position.length(); // Get camera distance from origin
    const baseSize = 0.3; // Increased base size
    const minSize = 0.03; // Minimum pin size when zoomed in
    const scaleFactor = Math.max(minSize, baseSize * (distance / 10)); // Adjust scaling based on zoom

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
              }}
            >
              <coneGeometry args={[0.2, 0.8, 32]} /> {/* Increased initial size */}
              <meshStandardMaterial color={selectedTour?.id === tour.id ? 'yellow' : 'red'} />
            </mesh>
          );
        })}
      </group>

      {selectedTour && (
        <Html position={[0, 0, 0]} center>
          <div
            className="bg-white p-4 rounded-xl shadow-lg text-center"
            style={{
              width: '500px',
              height: '400px',
              overflowY: 'auto',
              pointerEvents: 'auto', // Ensure pointer events are enabled
              zIndex: 1000, // Ensure the popup is on top
            }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedTour.name}</h3>
            {selectedTour.photo_url && (
              <img
                src={selectedTour.photo_url}
                alt={selectedTour.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
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
