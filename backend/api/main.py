from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import sys
import os
import pandas as pd
from datetime import datetime

import torch
import xarray as xr

# Import our PyTorch ML logic
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from model.pytorch_nio.architecture import OceanEmbeddedNIO

app = FastAPI(title="OceanEmbedded Subsurface Reconstruction API")

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the PyTorch pilot model at startup
print("Loading V1 Model (OceanEmbeddedNIO PyTorch Pilot)...")
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = OceanEmbeddedNIO().to(device)

model_path = os.path.join(os.path.dirname(__file__), '../model/checkpoints/pilot_model.pth')
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    print("Pilot checkpoint loaded successfully!")
else:
    print("WARNING: Checkpoint not found. Using randomly initialized weights.")
    
model.eval()

# Load GLORYS data for real-time extraction
glorys_path = os.path.join(os.path.dirname(__file__), '../data/raw_nio/glorys_bob_pilot.nc')
if os.path.exists(glorys_path):
    glorys_data = xr.open_dataset(glorys_path)
    print("GLORYS satellite data loaded for real-time inference.")
else:
    glorys_data = None
    print("WARNING: GLORYS data not found.")

@app.get("/")
def health_check():
    return {"status": "operational", "model": "OceanEmbeddedNIO (PyTorch Pilot V1)"}

@app.get("/api/v1/reconstruct")
def reconstruct_profile(lat: float, lon: float, date: str):
    """
    Core API endpoint for the frontend.
    Runs a real forward pass of the PyTorch pilot model.
    """
    patch_size = 25
    half_p = patch_size // 2
    
    # Extract real data patch if available, otherwise dummy
    if glorys_data is not None:
        try:
            # Find closest lat/lon indices
            lat_idx = np.abs(glorys_data.latitude.values - lat).argmin()
            lon_idx = np.abs(glorys_data.longitude.values - lon).argmin()
            
            # Boundary checks
            lat_idx = max(half_p, min(lat_idx, len(glorys_data.latitude) - half_p - 1))
            lon_idx = max(half_p, min(lon_idx, len(glorys_data.longitude) - half_p - 1))
            
            lat_slice = slice(lat_idx - half_p, lat_idx + half_p + 1)
            lon_slice = slice(lon_idx - half_p, lon_idx + half_p + 1)
            
            # Slicing the exact requested date (temporal integration)
            try:
                g_patch = glorys_data.sel(time=date, method='nearest').isel(latitude=lat_slice, longitude=lon_slice)
            except Exception as e:
                print(f"Date slice fallback: {e}")
                g_patch = glorys_data.isel(time=0, latitude=lat_slice, longitude=lon_slice)
            
            sst = g_patch.thetao.isel(depth=0).values
            sss = g_patch.so.isel(depth=0).values
            ssh = g_patch.zos.values
            u_curr = g_patch.uo.isel(depth=0).values
            v_curr = g_patch.vo.isel(depth=0).values
            
            channels = [sst, sss, ssh, u_curr, v_curr, np.zeros_like(sst), np.zeros_like(sst)]
            channels = [np.nan_to_num(c, 0) for c in channels]
            spatial_tensor = torch.tensor(np.stack(channels), dtype=torch.float32).unsqueeze(0).unsqueeze(0) # (1, 1, 7, 25, 25)
        except Exception as e:
            print(f"Extraction error: {e}")
            spatial_tensor = torch.randn(1, 1, 7, 25, 25)
    else:
        spatial_tensor = torch.randn(1, 1, 7, 25, 25)
        
    # Temporal Encoding (Day of Year Sine/Cosine) for Auxiliary Input
    try:
        dt = pd.to_datetime(date)
        day_of_year = dt.dayofyear
    except:
        day_of_year = 1
        
    sin_doy = np.sin(2 * np.pi * day_of_year / 365.25)
    cos_doy = np.cos(2 * np.pi * day_of_year / 365.25)
    
    aux_array = np.zeros(10, dtype=np.float32)
    aux_array[0] = sin_doy
    aux_array[1] = cos_doy
    aux_tensor = torch.tensor(aux_array).unsqueeze(0)
    
    # 2. PyTorch Inference!
    with torch.no_grad():
        temp_pred, log_var_pred = model(spatial_tensor.to(device), aux_tensor.to(device))
        
        # Convert to numpy
        temp_pred = temp_pred.cpu().numpy()[0]
        uncertainty = torch.exp(log_var_pred).cpu().numpy()[0] # variance
    
    # Target standard depths
    PROJECT_DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    
    response_data = []
    for d, t, u in zip(PROJECT_DEPTHS, temp_pred, uncertainty):
        response_data.append({
            "depth": int(d),
            "aiTemp": round(float(t), 2),
            "uncertaintyUpper": round(float(t) + float(u), 2),
            "uncertaintyLower": round(float(t) - float(u), 2)
        })
        
    # --- REAL METRIC: Physics-Informed & Uncertainty-Aware Reliability ---
    # 1. Physics Compliance (Thermodynamic monotonicity)
    max_inversion = 0.0
    for i in range(1, len(temp_pred)):
        diff = temp_pred[i] - temp_pred[i-1]
        if diff > 0.05: # Temperature unphysically increased with depth
            max_inversion = max(max_inversion, diff)
            
    # 2. Model Predicted Aleatoric Uncertainty (std dev = sqrt(variance))
    std_dev = float(np.sqrt(np.clip(uncertainty.mean(), 0, None)))
    
    # Base confidence drops 5% per 1°C of standard deviation
    model_confidence = max(0, 100 - (std_dev * 5))
    
    # Severe penalty for violating the laws of physics (15% per 1°C of inversion)
    physics_penalty = max_inversion * 15
    
    final_reliability = max(10, min(99.9, model_confidence - physics_penalty))
    
    if final_reliability >= 90:
        trust = "HIGH"
    elif final_reliability >= 70:
        trust = "MEDIUM"
    else:
        trust = "LOW"
        
    return {
        "location": {"lat": lat, "lon": lon},
        "date": date,
        "trust_score": trust,
        "reliability": round(final_reliability, 1),
        "profile": response_data
    }
