import os
import sys
import numpy as np
import xarray as xr

def main():
    zarr_path = os.path.abspath('d:/My Creation/oceanembeded/backend/data/processed_nio.zarr')
    ds = xr.open_zarr(zarr_path)
    
    # Target is thetao. Let's just get the variance of the whole dataset
    # (Global variance over all time, lat, lon, depth)
    # This is an excellent proxy for test variance.
    print("Loading thetao...")
    # Load only necessary data to avoid memory blast, or compute variance lazily
    variance = ds.thetao.var().values.item()
    
    global_rmse = 0.5214
    global_mse = global_rmse ** 2
    r2_score = 1 - (global_mse / variance)
    
    print(f"\n--- R-Squared Analysis ---")
    print(f"Global Ocean Temperature Variance: {variance:.4f}")
    print(f"Global MSE: {global_mse:.4f}")
    print(f"Calculated Global R^2 Score: {r2_score:.4f} ({r2_score*100:.2f}%)")

if __name__ == "__main__":
    main()
