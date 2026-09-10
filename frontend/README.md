# 🌊 Ocean Embedded — Frontend Application Documentation

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r164-black.svg?logo=three.js)](https://threejs.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-4.3-cyan.svg)](https://maplibre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

This subdirectory contains the complete **React 18 + Vite** frontend codebase for **Ocean Embedded**, an enterprise-grade oceanography and remote sensing platform inspired by **Planet Labs (`planet.com`)**.

---

## 🛠️ Frontend Component Architecture

```text
frontend/src/
├── App.jsx                             # Root Component handling Page Modes ('landing' | 'dashboard')
├── index.css                           # Tailwind Base, Custom Glassmorphism, and Animations
├── main.jsx                            # Virtual DOM Mounting Point
└── components/
    ├── ui/                             # Enterprise UI & Dashboard System
    │   ├── Navbar.jsx                  # Planet.com Header Logo & Dashboard Toggle
    │   ├── PlanetHeroOverlay.jsx        # Dynamic Headline, Live Ticker & Vantage Cards
    │   ├── PlanetDataGridSection.jsx    # Altimetry, Tasking & Recharts Profile Cards
    │   ├── PlanetBannerSection.jsx      # Full-Width Satellite Imagery Banner
    │   ├── PlanetTestimonialsSection.jsx   # Science Partner Testimonials (NOAA, Copernicus)
    │   ├── PlanetCTASection.jsx         # Bottom Conversion CTA Banner ('See. Decide. Act.')
    │   ├── DashboardLayout.jsx          # Scientific Map Observatory Panel
    │   ├── MapLibreOceanMap.jsx         # Interactive Basin Map with ARGO Stations
    │   ├── DepthProfileChart.jsx        # Thermocline Depth Recharts Graph
    │   └── ARGOValidationModal.jsx      # Float Data Calibration Modal
    └── three/                          # 3D WebGL Canvas Scene (React Three Fiber)
        ├── OceanScene.jsx              # Main 3D Canvas Controller & Lighting System
        ├── OceanWater.jsx              # Holographic Surface Wave Shader with Sonar Pulses
        ├── ResearchVessel.jsx          # Cyber Digital Twin Vessel with Radar & Laser Cone
        ├── FleetVessels.jsx            # ASV Surface Drones & 3D Expanding Sonar Rings
        ├── OceanVolume3D.jsx           # Subsurface Spatial Block (0, 200, 500, 1000m)
        ├── SeabedTerrain.jsx           # Bathymetric Trench Wireframe Bedrock
        └── UnderwaterEnvironment.jsx   # Particles, Light Rays & ARGO Float Station
```

---

## 🚀 Available NPM Scripts

In the `frontend` directory, you can run:

- `npm run dev`: Starts local development server at `http://localhost:3000/`.
- `npm run build`: Compiles production bundle using Vite.
- `npm run preview`: Previews the compiled production build locally.
- `npm run lint`: Runs ESLint to check code quality.

---

## 📦 Dependencies

- **`react` & `react-dom`**: UI rendering engine
- **`@react-three/fiber` & `@react-three/drei`**: React bindings for Three.js 3D canvas
- **`maplibre-gl`**: Interactive vector/raster tile ocean mapping
- **`recharts`**: Data charts for subsurface ocean profiles
- **`lucide-react`**: Vector icons for scientific metrics
- **`tailwindcss`**: Utility-first CSS framework
- **`framer-motion`**: UI transitions and animations
