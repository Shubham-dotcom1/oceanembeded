# 🌊 Ocean Embedded — Multidimensional Ocean Observatory Platform

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r164-black.svg?logo=three.js)](https://threejs.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-4.3-cyan.svg)](https://maplibre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Ocean Embedded** is an enterprise-grade scientific Earth & Ocean observation platform inspired by the design system of **Planet Labs (`planet.com`)**. It seamlessly bridges top-millimeter satellite remote sensing (SST, Altimetry) with 3D subsurface Physics-Informed Neural Networks (PINNs) and ARGO profiling float telemetry to reconstruct ocean temperature, salinity, and density fields from the surface down to **1,000 meters depth** in real time.

---

## ✨ Key Features

- 🌐 **Planet.com-Inspired Enterprise UI**: Dark obsidian palette (`#080c14`), crisp typography, interactive telemetry ticker bars, and 4 vantage pillar cards (`LOOK BROADER`, `LOOK BACKWARD`, `LOOK CLOSER`, `LOOK DEEPER`).
- 🌊 **High-Resolution Ocean Data Cards**: Interactive cards featuring 3m Surface Altimetry, 50cm ARGO Tasking, and live subsurface temperature/salinity Recharts graphs.
- 🗺️ **Scientific Map Observatory Dashboard**: MapLibre GL powered global ocean basin map featuring active ARGO float station nodes, regional selectors (North Atlantic, Equatorial Pacific, Indian Ocean), and thermocline depth profile charts.
- 📊 **3D Subsurface Spatial Volume (0 - 1,000m)**: Interactive 3D subsurface thermal block built with React Three Fiber (`@react-three/fiber`) allowing layer selection at 0m, 200m, 500m, and 1,000m depths.
- 🖼️ **Full-Width SuperRes Feature Banner**: *"Unlock a Clearer Ocean"* aerial satellite hero showcase.
- 🎯 **ARGO Float Validation & Calibration Modal**: Interactive data verification module comparing PINN AI reconstructions against in-situ ARGO float profiles.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) |
| **Styling & Icons** | [Tailwind CSS 3](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) |
| **3D Rendering** | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| **Maps & Spatial** | [MapLibre GL](https://maplibre.org/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |

---

## 📁 Project Structure

```text
oceanembeded/
├── public/
│   └── images/
│       ├── hero-ocean.jpg            # 8K Ocean Satellite Telemetry Visual
│       └── banner-ocean-superres.jpg # Full-Width Coastal Satellite Banner
├── src/
│   ├── components/
│   │   ├── three/                    # 3D WebGL Canvas Components
│   │   │   ├── OceanScene.jsx
│   │   │   ├── OceanWater.jsx
│   │   │   ├── ResearchVessel.jsx
│   │   │   ├── OceanVolume3D.jsx
│   │   │   └── UnderwaterEnvironment.jsx
│   │   └── ui/                       # Planet.com Enterprise UI Components
│   │       ├── Navbar.jsx
│   │       ├── PlanetHeroOverlay.jsx
│   │       ├── PlanetDataGridSection.jsx
│   │       ├── PlanetBannerSection.jsx
│   │       ├── PlanetTestimonialsSection.jsx
│   │       ├── PlanetCTASection.jsx
│   │       ├── DashboardLayout.jsx
│   │       └── MapLibreOceanMap.jsx
│   ├── App.jsx                       # Main Application Entry Point
│   ├── index.css                     # Global Design Tokens & Tailwind Utilities
│   └── main.jsx                      # DOM Mount Point
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ysh2006-ai/oceanembeded.git
   cd oceanembeded
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000/`.

---

## 📦 Production Build

To compile and optimize the application for production deployment:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
