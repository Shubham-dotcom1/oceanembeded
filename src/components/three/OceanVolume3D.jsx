import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function OceanVolume3D({ 
  selectedDepth = 200, 
  activeMetric = 'temperature', 
  onPointSelect 
}) {
  const groupRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Depth levels & corresponding Y coordinates in 3D scene space
  const depthTicks = [
    { label: '0 m', depth: 0, y: 0, temp: '26.4°C', color: '#f97316' },
    { label: '50 m', depth: 50, y: -2.5, temp: '22.1°C', color: '#eab308' },
    { label: '100 m', depth: 100, y: -5.0, temp: '18.7°C', color: '#06b6d4' },
    { label: '200 m', depth: 200, y: -9.0, temp: '14.2°C', color: '#0284c7' },
    { label: '500 m', depth: 500, y: -15.0, temp: '8.6°C', color: '#2563eb' },
    { label: '700 m', depth: 700, y: -19.0, temp: '6.1°C', color: '#4f46e5' },
    { label: '1000 m', depth: 1000, y: -24.0, temp: '4.1°C', color: '#7c3aed' }
  ];

  // Generate 3D grid points representing ocean subsurface sampling points
  const gridPoints = useMemo(() => {
    const points = [];
    const latCount = 5;
    const lonCount = 5;

    depthTicks.forEach((tick) => {
      for (let i = 0; i < latCount; i++) {
        for (let j = 0; j < lonCount; j++) {
          const lat = 24.0 + i * 0.4;
          const lon = -68.8 + j * 0.4;
          const x = (j - (lonCount - 1) / 2) * 4;
          const z = (i - (latCount - 1) / 2) * 4;
          
          // Temperature formula based on depth + slight noise
          const baseTemp = parseFloat(tick.temp);
          const noise = (Math.sin(i * 1.5 + j * 2.1) * 0.4).toFixed(2);
          const val = (baseTemp + parseFloat(noise)).toFixed(1);

          points.push({
            id: `pt-${tick.depth}-${i}-${j}`,
            depth: tick.depth,
            lat,
            lon,
            x,
            y: tick.y,
            z,
            value: `${val}°C`,
            color: tick.color
          });
        }
      }
    });
    return points;
  }, []);

  useFrame((state) => {
    if (groupRef.current && !hoveredPoint) {
      groupRef.current.rotation.y += 0.002; // Subtle idle rotation
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, 0]}>
      {/* 3D Orbit Controls for full rotation & inspection */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        maxDistance={60}
        minDistance={10}
        maxPolarAngle={Math.PI / 2 + 0.3}
      />

      {/* Volumetric Bounding Box Wireframe */}
      <mesh position={[0, -12, 0]}>
        <boxGeometry args={[22, 26, 22]} />
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Vertical Depth Scale Axis Line & Labels */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-12, 0, -12),
          new THREE.Vector3(-12, -25, -12)
        ])} />
        <lineBasicMaterial attach="material" color="#00f2ff" linewidth={2} />
      </line>

      {/* Render Depth Axis Markers */}
      {depthTicks.map((tick) => (
        <group key={tick.depth} position={[-12, tick.y, -12]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={tick.depth === selectedDepth ? '#00f2ff' : tick.color} />
          </mesh>
          <Text
            position={[-2.5, 0, 0]}
            fontSize={0.9}
            color={tick.depth === selectedDepth ? '#00f2ff' : '#94a3b8'}
            anchorX="right"
            anchorY="middle"
          >
            {tick.label}
          </Text>

          {/* Transparent Isothermal Surface Slab */}
          <mesh position={[12, 0, 12]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color={tick.color} 
              transparent 
              opacity={tick.depth === selectedDepth ? 0.45 : 0.1}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Render 3D Subsurface Ocean Data Points */}
      {gridPoints.map((pt) => {
        const isSelectedDepth = pt.depth === selectedDepth;
        return (
          <mesh
            key={pt.id}
            position={[pt.x, pt.y, pt.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredPoint(pt);
            }}
            onPointerOut={() => setHoveredPoint(null)}
            onClick={() => onPointSelect && onPointSelect(pt)}
          >
            <sphereGeometry args={[isSelectedDepth ? 0.35 : 0.2, 12, 12]} />
            <meshBasicMaterial 
              color={isSelectedDepth ? '#00f2ff' : pt.color} 
              transparent
              opacity={isSelectedDepth ? 0.95 : 0.3}
            />
          </mesh>
        );
      })}

      {/* Hover Tooltip for spatial data points */}
      {hoveredPoint && (
        <Html position={[hoveredPoint.x, hoveredPoint.y + 1, hoveredPoint.z]} center>
          <div className="glass-panel p-2.5 rounded-lg border border-cyan-400/60 shadow-xl text-[11px] font-mono text-slate-100 whitespace-nowrap backdrop-blur-md">
            <div className="text-cyan-400 font-bold mb-0.5">SUBSURFACE SAMPLE</div>
            <div>DEPTH: <span className="text-white">{hoveredPoint.depth} m</span></div>
            <div>LAT/LON: <span className="text-cyan-300">{hoveredPoint.lat}° N, {hoveredPoint.lon}° W</span></div>
            <div>TEMP: <span className="text-amber-400 font-bold">{hoveredPoint.value}</span></div>
          </div>
        </Html>
      )}
    </group>
  );
}
