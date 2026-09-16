# 🌊 Ocean Embedded

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg?logo=vite)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg?logo=pytorch)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)

🚀 **Live Deployment:** [https://nautilus-jade-delta.vercel.app/](https://nautilus-jade-delta.vercel.app/)

**Ocean Embedded** is a full-stack, enterprise-grade scientific oceanography platform. It bridges top-millimeter satellite remote sensing (SST, SSS, SLA, Winds, Currents) with a custom **Physics-Informed Neural Network (PINN)** to reconstruct and predict ocean temperature, salinity, and density fields from the surface down to **1,000 meters depth** in real time.

It features a cutting-edge 4D Spatiotemporal architecture, allowing researchers to slide through time and immediately visualize deep-ocean thermodynamics.

---

## 🏗️ Core Architecture & Features

### 1. NAUTILUS V2: Physics-Informed Neural Network (PyTorch)
At the heart of Ocean Embedded is the massive **NAUTILUS V2** PyTorch encoder-decoder PINN. 
- **Inputs**: It ingests 7 distinct satellite surface tensors (SST, SSS, SLA, U-Wind, V-Wind, U-Current, V-Current).
- **Temporal Context**: It utilizes a Chronological T=3 GRU network to understand ocean fluid dynamics without data leakage.
- **Outputs**: It predicts a continuous subsurface temperature profile down to 1000m using a proprietary **Depth-Aware Decoder**.
- **Accuracy**: NAUTILUS V2 achieves a record-breaking **0.52°C Global RMSE** with an **$R^2$ of 99.47%**, effectively capturing deep-ocean thermodynamics directly from space.

#### 📊 Performance Metrics (Unseen Test Set)
- **Global R-Squared ($R^2$):** `0.9947` (**99.47% Variance Explained**)
- **Global RMSE:** `0.5214 °C`
- **Global MAE:** `0.2744 °C`

**Depth-Wise Accuracy Breakdown:**
| Ocean Layer | Depth | RMSE (°C) |
| :--- | :--- | :--- |
| **Surface / Mixed Layer** | 0m | **0.2628** |
| | 5m | **0.2365** |
| | 10m | **0.2402** |
| | 20m | **0.2820** |
| | 30m | **0.3148** |
| **Upper Thermocline** | 50m | 0.4783 |
| | 75m | 0.7493 |
| | 100m | 0.9267 |
| | 125m | 0.9379 |
| | 150m | 0.7924 |
| **Deep Ocean** | 200m | 0.5831 |
| | 300m | 0.5013 |
| | 500m | 0.4381 |
| | 700m | 0.4724 |
| | 1000m | **0.6052** |

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

## 🌍 Hosting & Deployment

The application is built to run entirely in the cloud, leveraging free, high-performance tiers.

### Backend (Hugging Face ZeroGPU)
The PyTorch model is hosted as a **Gradio SDK Space** on Hugging Face.
- **Hardware**: Free A100 GPU (ZeroGPU architecture).
- **Integration**: The standard FastAPI app was wrapped into a pure Gradio API to natively comply with ZeroGPU's websocket queue requirements. The backend dynamically downloads the 1.9GB GLORYS dataset on startup.

### Frontend (Vercel)
The React/Vite dashboard is deployed on **Vercel**.
- **Connection**: It uses the official `@gradio/client` to establish a secure WebSocket connection to the Hugging Face ZeroGPU queue, allowing the frontend to send coordinates and instantly stream back the 1,000m depth profile.
- **Environment**: Ensure the `VITE_API_URL` environment variable is set to your Hugging Face Space URL in Vercel settings.

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
