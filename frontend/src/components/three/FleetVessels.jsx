import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function FleetVessels({ depth = 0 }) {
  const asvRef = useRef();
  const buoy1Ref = useRef();
  const buoy2Ref = useRef();
  const sonarRing1 = useRef();
  const sonarRing2 = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Robotic ASV Drone movement
    if (asvRef.current) {
      asvRef.current.position.y = Math.sin(time * 1.8) * 0.15 + 0.6;
      asvRef.current.rotation.z = Math.cos(time * 1.5) * 0.04;
      asvRef.current.position.x = -16 + Math.sin(time * 0.1) * 1.2;
    }

    // Telemetry Buoy bobbing
    if (buoy1Ref.current) {
      buoy1Ref.current.position.y = Math.sin(time * 2.0) * 0.25 + 0.5;
    }
    if (buoy2Ref.current) {
      buoy2Ref.current.position.y = Math.cos(time * 2.2) * 0.25 + 0.5;
    }

    // Expanding Sonar Pulse Rings
    if (sonarRing1.current) {
      const s1 = (time * 1.5) % 3;
      sonarRing1.current.scale.set(1 + s1 * 2, 1 + s1 * 2, 1);
      sonarRing1.current.material.opacity = Math.max(0, 0.8 - s1 / 3);
    }

    if (sonarRing2.current) {
      const s2 = (time * 1.2 + 1.0) % 3;
      sonarRing2.current.scale.set(1 + s2 * 2, 1 + s2 * 2, 1);
      sonarRing2.current.material.opacity = Math.max(0, 0.8 - s2 / 3);
    }
  });

  if (depth > 120) return null;

  return (
    <group>
      {/* ================= 1. ROBOTIC ASV DRONE (CYBER POD) ================= */}
      <group ref={asvRef} position={[-16, 0.6, -2]}>
        {/* Sleek Dark Catamaran Pod */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.6, 0.4, 3.4]} />
          <meshStandardMaterial color="#0b1329" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.62, 0.42, 3.42]} />
          <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.4} />
        </mesh>

        {/* Cyber Solar Panel Grid */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.3, 0.05, 2.2]} />
          <meshBasicMaterial color="#00f2ff" wireframe />
        </mesh>

        {/* Sensor Tower & Laser Beacon */}
        <mesh position={[0, 1.2, -0.8]}>
          <cylinderGeometry args={[0.03, 0.04, 1.2]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.8, -0.8]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#00f2ff" />
        </mesh>

        {/* Downward Laser Profile Beam */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -25, 0)
          ])} />
          <lineBasicMaterial attach="material" color="#00f2ff" linewidth={2} transparent opacity={0.8} />
        </line>

        <Html position={[0, 2.2, 0]} center distanceFactor={22}>
          <div className="bg-slate-950/90 border border-cyan-400 text-cyan-300 text-[9px] font-mono px-2 py-0.5 rounded-full backdrop-blur-md whitespace-nowrap">
            AUTONOMOUS ASV DRONE #04
          </div>
        </Html>
      </group>

      {/* ================= 2. FLOATING TELEMETRY BUOYS WITH SONAR PULSE ================= */}
      {/* Buoy 1 (Left Forefront) */}
      <group ref={buoy1Ref} position={[-8, 0.5, 8]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#090d16" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.52, 0.32, 0.82, 16]} />
          <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.5} />
        </mesh>

        {/* Antenna Beacon */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 1.4]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#00f2ff" />
        </mesh>

        {/* Expanding Sonar Pulse Ring */}
        <mesh ref={sonarRing1} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Laser Depth Scanner Beam */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -30, 0)
          ])} />
          <lineBasicMaterial attach="material" color="#00f2ff" linewidth={2} transparent opacity={0.7} />
        </line>
      </group>

      {/* Buoy 2 (Right Background) */}
      <group ref={buoy2Ref} position={[24, 0.5, -22]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#090d16" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.52, 0.32, 0.82, 16]} />
          <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.5} />
        </mesh>

        {/* Antenna Beacon */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 1.4]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#00f2ff" />
        </mesh>

        {/* Expanding Sonar Pulse Ring */}
        <mesh ref={sonarRing2} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Laser Depth Profiler Beam */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -30, 0)
          ])} />
          <lineBasicMaterial attach="material" color="#00f2ff" linewidth={2} transparent opacity={0.7} />
        </line>
      </group>
    </group>
  );
}
