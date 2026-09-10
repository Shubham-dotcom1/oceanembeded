import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import OceanWater from './OceanWater';
import ResearchVessel from './ResearchVessel';
import OrbitalSatellite from './OrbitalSatellite';
import UnderwaterEnvironment from './UnderwaterEnvironment';
import OceanVolume3D from './OceanVolume3D';
import FleetVessels from './FleetVessels';
import AtmosphericWeather from './AtmosphericWeather';

// Camera controller component synchronizing depth scroll & mouse parallax
function CameraRig({ depth, mode, mousePos, reducedMotion }) {
  const { camera } = useThree();
  const targetCamY = useRef(10);

  useFrame(() => {
    if (mode === 'volume') return; // OrbitControls handles camera in volume mode

    // Compute target camera height based on scroll depth
    const clampedDepth = Math.min(Math.max(depth, 0), 1000);
    const depthProgress = clampedDepth / 1000;
    
    // Smooth non-linear Y transition down the water column
    targetCamY.current = 10 - depthProgress * 78;

    // Mouse parallax offset (unless reduced motion is enabled)
    const parallaxX = reducedMotion ? 0 : mousePos.x * 4.0;
    const parallaxZ = reducedMotion ? 0 : mousePos.y * 3.0;

    // Smooth camera interpolation
    camera.position.y += (targetCamY.current - camera.position.y) * 0.08;
    camera.position.x += (parallaxX - camera.position.x) * 0.05;
    camera.position.z += (36 + parallaxZ - camera.position.z) * 0.05;

    // Adjust camera pitch look-at based on depth
    if (clampedDepth < 30) {
      camera.lookAt(0, 2, 0); // Wide view towards ocean horizon
    } else {
      camera.lookAt(0, targetCamY.current - 4, 0); // Looking down into underwater depth
    }
  });

  return null;
}

// Ocean fog controller that transitions ambient background color with depth
function EnvironmentEffects({ depth }) {
  const { scene } = useThree();

  useEffect(() => {
    // Surface: Atmosphere sky blue fog -> Deep Abyss: Pitch dark blue
    const depthRatio = Math.min(depth / 1000, 1);
    
    const surfaceColor = new THREE.Color('#031b4e');
    const abyssalColor = new THREE.Color('#020612');
    
    const currentColor = surfaceColor.clone().lerp(abyssalColor, depthRatio);
    scene.background = currentColor;
    scene.fog = new THREE.FogExp2(currentColor, 0.01 + depthRatio * 0.02);
  }, [depth, scene]);

  return null;
}

export default function OceanScene({ 
  depth = 0, 
  mode = 'hero', 
  mousePos = { x: 0, y: 0 }, 
  reducedMotion = false,
  selectedDepth = 200,
  onPointSelect
}) {
  const [isShipHovered, setIsShipHovered] = React.useState(false);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas shadows gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 12, 36]} fov={50} />
        
        <CameraRig 
          depth={depth} 
          mode={mode} 
          mousePos={mousePos} 
          reducedMotion={reducedMotion} 
        />
        
        <EnvironmentEffects depth={depth} />

        {/* Realistic Lighting System */}
        <ambientLight intensity={Math.max(0.15, 0.85 - depth / 800)} />
        <directionalLight 
          position={[100, 70, -80]} 
          intensity={Math.max(0.1, 1.8 - depth / 600)} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, -20, 0]} intensity={0.6} color="#00f2ff" />

        {/* 3D Scene Modes */}
        {mode === 'volume' ? (
          <OceanVolume3D 
            selectedDepth={selectedDepth} 
            onPointSelect={onPointSelect} 
          />
        ) : (
          <>
            {/* Atmospheric Sky Weather (Clouds & Sun Flare) */}
            <AtmosphericWeather depth={depth} />

            {/* Ocean Water Surface (Visible mainly at depth < 150m) */}
            {depth < 150 && <OceanWater depth={depth} />}

            {/* Main Oceanographic Research Vessel (Positioned on Right Horizon) */}
            {depth < 80 && (
              <ResearchVessel 
                isHovered={isShipHovered} 
                setIsHovered={setIsShipHovered} 
              />
            )}

            {/* Secondary Fleet Vessels (ASV Drone, Cutter Ship, Telemetry Buoys) */}
            <FleetVessels depth={depth} />

            {/* High-Altitude Orbital Satellite */}
            {depth < 80 && <OrbitalSatellite />}

            {/* Underwater Atmospheric Environment (particles, god rays, seabed terrain) */}
            <UnderwaterEnvironment depth={depth} />
          </>
        )}
      </Canvas>
    </div>
  );
}
