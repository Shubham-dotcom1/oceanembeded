import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AtmosphericWeather({ depth = 0 }) {
  const gridRef = useRef();

  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.z += delta * 0.05;
    }
  });

  if (depth > 100) return null;

  return (
    <group position={[0, 45, -50]}>
      {/* High-Altitude Orbital Grid Overlay */}
      <mesh ref={gridRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[60, 120, 64]} />
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Atmospheric Scanning Laser Arc */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[80, 81.5, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
