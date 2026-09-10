import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SeabedTerrain from './SeabedTerrain';

export default function UnderwaterEnvironment({ depth = 0 }) {
  const particlesRef = useRef();
  const godRaysRef = useRef();
  const argoFloatRef = useRef();

  // Particle distribution simulating organic marine snow scatters
  const particleCount = 750;
  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = -Math.random() * 85;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    return [pos];
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Particle drift movement
    if (particlesRef.current) {
      const positionsArr = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArr[i * 3 + 1] += Math.sin(time + i) * 0.008 - 0.012;
        positionsArr[i * 3] += Math.cos(time * 0.4 + i) * 0.008;
        
        if (positionsArr[i * 3 + 1] < -85) {
          positionsArr[i * 3 + 1] = 0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (godRaysRef.current) {
      godRaysRef.current.rotation.y = time * 0.04;
    }

    if (argoFloatRef.current) {
      argoFloatRef.current.position.y = -65 + Math.sin(time * 1.6) * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Volumetric Solar Light Rays (Fades smoothly with depth) */}
      <group ref={godRaysRef} position={[0, -5, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[Math.sin(i * 0.8) * 12, -12, Math.cos(i * 0.8) * 12]} 
            rotation={[0.2, i * 0.7, -0.1]}
          >
            <cylinderGeometry args={[0.6, 8, 28, 16, 1, true]} />
            <meshBasicMaterial 
              color="#38bdf8" 
              transparent 
              opacity={Math.max(0, 0.3 - (depth / 350))} 
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Marine Snow & Bioluminescent Organism Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          color="#00f2ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Thermocline Thermal Layer 200m */}
      <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#00d2ff" transparent opacity={0.12} wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* Bathypelagic Deep Layer 500m */}
      <mesh position={[0, -45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.12} wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* Abyssal Benthic Boundary Layer 1000m */}
      <mesh position={[0, -70, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.14} wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* ARGO Autonomous Profiling Float Station at 1,000m */}
      <group ref={argoFloatRef} position={[6, -65, -12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 2.8, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <sphereGeometry args={[0.25, 20, 20]} />
          <meshBasicMaterial color="#00f2ff" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3D Bathymetric Seabed Terrain Floor */}
      <SeabedTerrain depth={depth} />
    </group>
  );
}
