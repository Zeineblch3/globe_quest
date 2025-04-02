'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Html, Sphere, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import TourPopup from './TourPopup';
import { fetchTours } from '../Services/tourService';

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
  const { scene } = useGLTF('/models/scene.gltf');
  const globeRef = useRef<THREE.Group>(null);
  const pinsRef = useRef<THREE.Mesh[]>([]);
  const popupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const [tours, setTours] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const getTours = async () => {
      const { data } = await fetchTours();
      setTours(data ?? []);
    };

    getTours();
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

  const handleClosePopup = () => {
    setSelectedTour(null);
  };

  // Adjust popup position and rotation to always face the user
  useFrame(() => {
    if (popupRef.current && selectedTour) {
      const popupPosition = new THREE.Vector3(selectedTour.x, selectedTour.y + 0.3, selectedTour.z);
      popupRef.current.position.copy(popupPosition);
      popupRef.current.lookAt(camera.position);
    }
  });

  // Dynamic pin scaling based on camera zoom
  useFrame(() => {
    if (!pinsRef.current.length) return;

    const distance = camera.position.length();
    const baseSize = 0.1;
    const scaleFactor = Math.max(0.02, baseSize * (distance / 5));

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
          const radius = 2.5;
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
                setSelectedTour({ ...tour, x, y, z });
                setCurrentImageIndex(0);
              }}
            >
              <Sphere args={[0.1, 32, 32]}>
                <meshStandardMaterial color={selectedTour?.id === tour.id ? 'yellow' : 'red'} />
              </Sphere>
            </mesh>
          );
        })}
      </group>

      {/* Tour Popup - Always Faces the User */}
      {selectedTour && (
        <group ref={popupRef}>
          <Html center distanceFactor={2} transform>
            <TourPopup
              tour={selectedTour}
              currentImageIndex={currentImageIndex}
              onNextImage={handleNextImage}
              onPrevImage={handlePrevImage}
              onClose={handleClosePopup}
            />
          </Html>
        </group>
      )}
    </>
  );
};

// Preload GLTF Model
useGLTF.preload('/models/scene.gltf');

export default Globe;
