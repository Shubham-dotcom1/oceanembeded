import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HolographicCyberOceanShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorGrid: { value: new THREE.Color('#00f2ff') },
    uColorDeep: { value: new THREE.Color('#020617') },
    uColorSurface: { value: new THREE.Color('#032b69') },
  },
  vertexShader: `
    uniform float uTime;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 p = position;

      // Complex Futuristic Wave Harmonics
      float wave1 = sin(p.x * 0.15 + uTime * 1.5) * cos(p.y * 0.15 + uTime * 1.2) * 0.8;
      float wave2 = sin(p.x * 0.3 - uTime * 2.0) * sin(p.y * 0.25 + uTime * 1.8) * 0.4;
      float wave3 = cos(p.x * 0.6 + p.y * 0.6 + uTime * 2.5) * 0.2;
      
      p.z += wave1 + wave2 + wave3;
      vWaveHeight = p.z;

      vec4 worldPosition = modelMatrix * vec4(p, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalMatrix * vec3(0.0, 0.0, 1.0);

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorGrid;
    uniform vec3 uColorDeep;
    uniform vec3 uColorSurface;
    uniform float uTime;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWaveHeight;
    varying vec2 vUv;

    void main() {
      // Holographic Sci-Fi Surface Grid Pattern
      vec2 gridUv = fract(vUv * 60.0);
      float gridLine = smoothstep(0.02, 0.05, gridUv.x) * smoothstep(0.98, 0.95, gridUv.x) *
                       smoothstep(0.02, 0.05, gridUv.y) * smoothstep(0.98, 0.95, gridUv.y);
      float gridIntensity = 1.0 - gridLine;

      // Concentric Sonar Surface Radar Pulse
      float distFromCenter = length(vWorldPosition.xz);
      float sonarPulse = sin(distFromCenter * 0.3 - uTime * 3.0);
      sonarPulse = smoothstep(0.85, 1.0, sonarPulse) * 0.5;

      // Water Base Tinting
      vec3 waterColor = mix(uColorDeep, uColorSurface, smoothstep(-1.0, 1.5, vWaveHeight));
      
      // Add Cyan Neon Grid & Sonar Emissive Highlights
      vec3 finalColor = waterColor;
      finalColor += uColorGrid * gridIntensity * 0.65;
      finalColor += uColorGrid * sonarPulse * 0.8;
      
      // Wave Crest Neon Glow
      float crestGlow = smoothstep(0.6, 1.2, vWaveHeight);
      finalColor += vec3(0.0, 0.95, 1.0) * crestGlow * 0.4;

      gl_FragColor = vec4(finalColor, 0.88);
    }
  `
};

export default function OceanWater({ depth = 0 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group>
      {/* 3D Wave Surface */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[450, 450, 120, 120]} />
        <shaderMaterial
          ref={materialRef}
          args={[HolographicCyberOceanShader]}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Under-surface Cyber Bathymetric Sonar Wireframe plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[450, 450, 60, 60]} />
        <meshBasicMaterial 
          color="#00f2ff" 
          wireframe 
          transparent 
          opacity={0.12} 
        />
      </mesh>
    </group>
  );
}
