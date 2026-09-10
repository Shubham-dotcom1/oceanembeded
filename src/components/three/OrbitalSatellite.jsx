import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function OrbitalSatellite() {
  const satelliteGroup = useRef();
  const scanBeamRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (satelliteGroup.current) {
      const radius = 24;
      const speed = 0.2;
      satelliteGroup.current.position.x = Math.cos(time * speed) * radius;
      satelliteGroup.current.position.z = Math.sin(time * speed) * radius + 4;
      satelliteGroup.current.position.y = 20 + Math.sin(time * 0.4) * 1.2;
      
      // Orient optical payload towards ocean surface
      satelliteGroup.current.lookAt(0, 0, 0);
    }

    if (scanBeamRef.current) {
      scanBeamRef.current.material.opacity = 0.35 + Math.sin(time * 4) * 0.15;
    }
  });

  return (
    <group ref={satelliteGroup} position={[-14, 22, -10]}>
      {/* Central Satellite Body (Gold Kapton Foil Material) */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.5, 2.8]} />
        <meshStandardMaterial 
          color="#d97706" 
          metalness={0.95} 
          roughness={0.15} 
          emissive="#78350f"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Solar Panel Wing Left (Detailed Dark Blue Cells) */}
      <group position={[-3.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.6, 0.06, 1.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Solar Cell Grid Overlay */}
        <mesh position={[0, 0.04, 0]}>
          <planeGeometry args={[4.4, 1.4]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial 
            color="#1d4ed8" 
            emissive="#1e40af" 
            emissiveIntensity={0.4}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Solar Panel Wing Right */}
      <group position={[3.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.6, 0.06, 1.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        <mesh position={[0, 0.04, 0]}>
          <planeGeometry args={[4.4, 1.4]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial 
            color="#1d4ed8" 
            emissive="#1e40af" 
            emissiveIntensity={0.4}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* High-Resolution Radar Altimeter Reflector Dish */}
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 0.3, 0.5, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Optical Infrared Sensor Aperture */}
      <mesh position={[0, -1.25, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#00f2ff" />
      </mesh>

      {/* Volumetric Laser Altimeter Pulse Cone */}
      <mesh ref={scanBeamRef} position={[0, -11, 0]}>
        <coneGeometry args={[7, 20, 32, 1, true]} />
        <meshBasicMaterial 
          color="#00f2ff" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>

      {/* Telemetry Badge */}
      <Html position={[0, 1.8, 0]} center distanceFactor={28}>
        <div className="flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-xl whitespace-nowrap shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SENTINEL-6 ALTIMETER [SST & SSH RADAR]</span>
        </div>
      </Html>
    </group>
  );
}
