# 🌊 Ocean Embedded

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?logo=vite)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg?logo=pytorch)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)

**Ocean Embedded** is a full-stack, enterprise-grade scientific oceanography platform. It bridges top-millimeter satellite remote sensing (SST, SSS, SLA, Winds, Currents) with a custom **Physics-Informed Neural Network (PINN)** to reconstruct and predict ocean temperature, salinity, and density fields from the surface down to **1,000 meters depth** in real time.

It features a cutting-edge 4D Spatiotemporal architecture, allowing researchers to slide through time and immediately visualize deep-ocean thermodynamics.

---

## 🏗️ Core Architecture & Features

### 1. The Physics-Informed Neural Network (PyTorch Backend)
At the heart of Ocean Embed is a massive PyTorch encoder-decoder PINN. 
- **Inputs**: It ingests 7 distinct satellite surface tensors (SST, SSS, SLA, U-Wind, V-Wind, U-Current, V-Current).
- **Temporal Encoding**: It uses cyclic day-of-year (sine/cosine) encoding to inherently understand seasonal thermodynamic shifts (summer vs winter).
- **Outputs**: It predicts a continuous subsurface temperature profile down to 1000m.
- **Physics Compliance Evaluation**: The FastAPI server strictly evaluates the AI's output in real-time, actively penalizing the model's reliability score for any thermodynamic violations (like predicting temperature increases with depth).

### 2. Spatiotemporal Observatory Dashboard (React Frontend)
- **MapLibre Coordinate Search**: An interactive global map allowing users to search exact Latitude/Longitude/Date coordinates (e.g., `15.5, 80.0 2020-05-15`).
- **4D Time Slider**: Scrub through dates to watch subsurface temperature profiles physically adapt to seasonal changes.
- **Dynamic AI Telemetry**: Instant charting of the AI's predicted depth profile alongside strict model reliability/uncertainty scoring.

### 3. Immersive 3D Grid Cell Visualizer
- Click `EXPLORE 3D GRID CELL` to launch a stunning CSS-isometric rendering of the precise 0.25° × 0.25° volumetric water column.
- Use the **Z-Axis Depth Scanner** to scrub through the depths, watching the entire UI dynamically color-map from fiery surface oranges down to freezing abyssal indigos.

### 4. Live ARGO Ground-Truth Validation (IFREMER ERDDAP)
- Stop guessing, start validating. Click `ARGO VALIDATION` to fire off a live REST API query to the French **IFREMER ERDDAP** oceanographic database.
- The app automatically hunts for real, physical autonomous Argo robotic floats that surfaced within a 5-degree radius of your selected coordinates on your selected week.
- Instantly computes real-world **MAE**, **RMSE**, and **Delta Bias** between the PyTorch prediction and the physical robot's telemetry.

---

## 🚀 Quick Start (Local Setup)

The project is split into a Python PyTorch Backend and a React Frontend.

### 1. Start the PyTorch API (Backend)

Requires Python 3.9+

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # (On Windows: .venv\Scripts\activate)
pip install -r requirements.txt
uvicorn api.main:app --reload
```
*The FastAPI server will boot up on `http://localhost:8000`.*

### 2. Start the Observatory UI (Frontend)

Requires Node.js 18+

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173/` in your browser to access the platform.*

---

## 📁 Repository Structure

```text
oceanembeded/
├── backend/                            # PyTorch & FastAPI Engine
│   ├── api/
│   │   └── main.py                     # Core FastAPI Server & Physics Evaluator
│   ├── data/                           # Dataset Generators & Ingestion
│   ├── model/
│   │   └── pytorch_nio/                # Deep Learning Architecture (Encoders/Decoders)
│   └── scripts/                        # Training & Checkpointing Scripts
│
├── frontend/                           # React 18 + Vite Frontend Project
│   ├── src/
│   │   ├── components/ui/
│   │   │   ├── DashboardLayout.jsx     # Main Observatory Engine
│   │   │   ├── MapLibreOceanMap.jsx    # Spatial Coordinate Picker
│   │   │   ├── TimeSlider.jsx          # Temporal Scrubber
│   │   │   ├── GridCellVisualizer.jsx  # 3D Z-Axis Voxel Explorer
│   │   │   └── ARGOValidationModal.jsx # Live ERDDAP Fetcher
│   │   └── App.jsx                     # Core Layout Routing
│   ├── tailwind.config.js              
│   └── package.json                    
└── .gitignore                          # Strict file exclusions for clean commits
```

## 📄 License
Distributed under the MIT License.
