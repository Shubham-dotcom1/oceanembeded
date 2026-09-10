import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function SeabedTerrain({ depth = 0 }) {
  const ventsRef = useRef();

  // Create procedural bathymetric seabed mesh geometry with ridge displacement
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(240, 240, 64, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Ridge & trench displacement formula
      const ridge = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 6;
      const trench = -Math.exp(-((x * 0.03) ** 2 + (y * 0.03) ** 2)) * 10;
      const detail = Math.sin(x * 0.2) * Math.sin(y * 0.2) * 1.5;
      
      pos.setZ(i, ridge + trench + detail);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (ventsRef.current) {
      ventsRef.current.children.forEach((vent, idx) => {
        vent.material.opacity = 0.5 + Math.sin(state.clock.getElapsedTime() * 3 + idx) * 0.25;
      });
    }
  });

  // Render Seabed floor only when depth is >= 300m
  if (depth < 300) return null;

  return (
    <group position={[0, -78, 0]}>
      {/* Bathymetric Seabed Floor Mesh */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial 
          color="#06122b" 
          roughness={0.9} 
          metalness={0.2}
          wireframe={false} 
        />
      </mesh>

      {/* Bathymetric Contour Grid Overlay */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Glowing Hydrothermal Deep Sea Vents at 1000m Abyssal Floor */}
      <group ref={ventsRef}>
        {[
          { x: -15, z: -20 },
          { x: 25, z: 10 },
          { x: -5, z: 30 }
        ].map((vent, idx) => (
          <mesh key={idx} position={[vent.x, 3, vent.z]}>
            <cylinderGeometry args={[0.2, 2.5, 8, 16, 1, true]} />
            <meshBasicMaterial 
              color="#f59e0b" 
              transparent 
              opacity={0.6} 
              side={THREE.DoubleSide} 
              depthWrite={false} 
            />
          </mesh>
        ))}
      </group>

      {/* Seabed Bathymetry Marker Tag */}
      <Html position={[0, 2, 0]} center distanceFactor={25}>
        <div className="bg-slate-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono px-3 py-1.5 rounded-full backdrop-blur-xl flex items-center gap-2 shadow-2xl whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
          <span className="whitespace-nowrap">ABYSSAL BENTHIC SEABED TRENCH [-1,000 METER DEPTH]</span>
        </div>
      </Html>
    </group>
  );
}
