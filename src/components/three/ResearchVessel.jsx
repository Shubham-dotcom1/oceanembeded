import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function ResearchVessel({ onSelect, isHovered, setIsHovered }) {
  const shipGroup = useRef();
  const radarRef = useRef();
  const scannerRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (shipGroup.current) {
      // Hydrodynamic ocean pitch, roll, and heave physics
      shipGroup.current.position.y = Math.sin(time * 1.2) * 0.15 + 1.2;
      shipGroup.current.rotation.z = Math.sin(time * 0.9) * 0.02; // Roll
      shipGroup.current.rotation.x = Math.cos(time * 0.7) * 0.015; // Pitch
      shipGroup.current.position.x = 18 + Math.sin(time * 0.05) * 1.5;
    }

    if (radarRef.current) radarRef.current.rotation.y += delta * 3.5;
    if (scannerRef.current) scannerRef.current.rotation.y -= delta * 1.2;
  });

  return (
    <group 
      ref={shipGroup} 
      position={[18, 1.2, -10]} 
      rotation={[0, -0.45, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* ================= DIGITAL TWIN CYBER HULL ================= */}
      {/* Main Sleek Dark Obsidian Topsides Hull */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[3.4, 0.9, 13]} />
        <meshStandardMaterial color="#0b1329" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Cyber Wireframe Shell Contour Overlay */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[3.42, 0.92, 13.02]} />
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Lower Hydrodynamic Navy/Black Keel */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[3.38, 0.6, 12.9]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Neon Cyan Waterline Stripe */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.45, 0.1, 13.05]} />
        <meshBasicMaterial color="#00f2ff" />
      </mesh>

      {/* Sleek Aerodynamic Bow Cone */}
      <mesh position={[0, 1.1, -7.2]} rotation={[Math.PI / 2.2, 0, 0]}>
        <coneGeometry args={[1.7, 3.0, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, -7.2]} rotation={[Math.PI / 2.2, 0, 0]}>
        <coneGeometry args={[1.72, 3.02, 16]} />
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Subsurface Sonar Transducer Pod */}
      <mesh position={[0, -0.2, -7.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 1.8, 16]} />
        <meshStandardMaterial color="#0284c7" emissive="#00f2ff" emissiveIntensity={0.6} />
      </mesh>

      {/* ================= SUPERSTRUCTURE (DECKS & BRIDGE) ================= */}
      {/* Main Bridge Block (Obsidian Glass) */}
      <mesh position={[0, 2.2, -1.8]} castShadow>
        <boxGeometry args={[2.8, 1.5, 6.0]} />
        <meshStandardMaterial color="#090d16" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Holographic Glowing Bridge Windows */}
      <mesh position={[0, 2.6, -4.83]}>
        <boxGeometry args={[2.5, 0.5, 0.05]} />
        <meshBasicMaterial color="#00f2ff" />
      </mesh>

      {/* ================= PHASED-ARRAY RADAR & TELEMETRY MAST ================= */}
      {/* Phased Array Sphere */}
      <mesh position={[0, 4.4, -1.5]} castShadow>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 4.4, -1.5]}>
        <sphereGeometry args={[0.92, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Phased Array Radar Ring */}
      <mesh ref={radarRef} position={[0, 4.4, -1.5]}>
        <torusGeometry args={[1.3, 0.04, 16, 32]} />
        <meshBasicMaterial color="#00f2ff" />
      </mesh>

      {/* Vertical Sensor Mast */}
      <mesh position={[0, 4.2, -3.5]}>
        <cylinderGeometry args={[0.06, 0.1, 2.4, 12]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} />
      </mesh>

      {/* ================= DOWNWARD SCANNING LASER CONE ================= */}
      <group ref={scannerRef} position={[0, 0, 4.5]}>
        <mesh position={[0, -8, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[4.5, 16, 32, 1, true]} />
          <meshBasicMaterial 
            color="#00f2ff" 
            wireframe 
            transparent 
            opacity={0.18} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        <mesh position={[0, -8, 0]}>
          <coneGeometry args={[4.2, 16, 16, 1, true]} />
          <meshBasicMaterial 
            color="#38bdf8" 
            transparent 
            opacity={0.08} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>

      {/* ================= STERN A-FRAME & CTD WINCH LINE ================= */}
      <group position={[0, 1.8, 5.2]}>
        <mesh position={[-1.2, 1.2, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.8, 12]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1.2, 1.2, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.8, 12]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 2.4, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 12]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Laser CTD Subsurface Telemetry Wire */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 2.4, 5.5),
          new THREE.Vector3(0, -30, 5.5)
        ])} />
        <lineBasicMaterial attach="material" color="#00f2ff" linewidth={3} transparent opacity={0.85} />
      </line>

      {/* Interactive Telemetry Card */}
      {isHovered && (
        <Html position={[0, 5.8, 0]} center distanceFactor={18}>
          <div className="glass-panel p-3.5 rounded-2xl shadow-2xl w-80 border border-cyan-400 text-xs backdrop-blur-2xl animate-fade-in whitespace-normal bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-cyan-500/40 pb-1.5 mb-2">
              <span className="font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                DIGITAL TWIN (R 337)
              </span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
                SONAR SCANNING
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mb-2.5 leading-relaxed font-sans">
              NOAA Ship Okeanos Explorer digital twin. Emitting active multi-frequency bathymetric sonar down to 1,000 meters.
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] bg-slate-900 p-2 rounded-xl border border-cyan-500/30 text-slate-300">
              <div>RADAR: <span className="text-cyan-300">PHASED ARRAY</span></div>
              <div>SCANNER: <span className="text-cyan-300">LIDAR 1,000m</span></div>
              <div>TEL: <span className="text-emerald-400">ONLINE</span></div>
              <div>PING: <span className="text-cyan-300">12 ms</span></div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
