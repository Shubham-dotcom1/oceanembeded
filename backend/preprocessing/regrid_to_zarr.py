import os
import sys
import numpy as np
import xarray as xr
from dask.diagnostics import ProgressBar
import dask

# Limit Dask memory aggressively to stay under 8GB
dask.config.set({"distributed.worker.memory.target": 0.6})
dask.config.set({"distributed.worker.memory.spill": 0.7})
dask.config.set({"distributed.worker.memory.pause": 0.8})
dask.config.set({"distributed.worker.memory.terminate": 0.95})

def create_unified_zarr():
    """
    Session 1 & 2: Chunked Preprocessing Script
    Regrids GLORYS (0.083 deg) and Wind (0.125 deg) to a unified 0.25 deg grid.
    Uses lazy loading and chunking to stay strictly below 8 GB RAM.
    """
    raw_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw_nio'))
    zarr_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed_nio.zarr'))
    
    glorys_path = os.path.join(raw_dir, 'glorys_bob_pilot.nc')
    wind_path = os.path.join(raw_dir, 'wind_bob_pilot.nc')
    
    print("1. Lazy-loading Raw NetCDF files (No RAM usage yet)...")
    
    # Load with chunking to keep RAM low
    # GLORYS is Daily, 50-100 lon, 0-30 lat, 50 depths (we only need top 1000m, but we'll slice later or keep all)
    ds_glorys = xr.open_dataset(glorys_path, chunks={'time': 5})
    
    # Wind is Hourly, we chunk by time
    ds_wind = xr.open_dataset(wind_path, chunks={'time': 24})
    
    print("\n2. Resampling Wind from Hourly to Daily...")
    ds_wind_daily = ds_wind.resample(time='1D').mean()
    
    # Align time dimension to exactly match GLORYS
    ds_wind_aligned = ds_wind_daily.sel(time=ds_glorys.time, method='nearest')
    
    print("\n3. Defining unified 0.25 deg x 0.25 deg Grid...")
    # Bounding Box: Lon 50 to 100, Lat 0 to 30
    new_lon = np.arange(50.0, 100.0, 0.25)
    new_lat = np.arange(0.0, 30.0, 0.25)
    
    print("4. Regridding GLORYS (Ocean Physics) to 0.25 deg...")
    # Select only required variables to save memory
    vars_glorys = ds_glorys[['thetao', 'so', 'zos', 'uo', 'vo']]
    
    # We only need depths up to 1000m
    valid_depths = ds_glorys.depth.values
    valid_depths = valid_depths[valid_depths <= 1000.0]
    vars_glorys = vars_glorys.sel(depth=valid_depths)
    
    # Interpolate spatial dimensions
    glorys_regridded = vars_glorys.interp(
        latitude=new_lat, 
        longitude=new_lon, 
        method='linear'
    )
    
    print("5. Regridding Wind to 0.25 deg...")
    wind_regridded = ds_wind_aligned[['eastward_wind', 'northward_wind']].interp(
        latitude=new_lat, 
        longitude=new_lon, 
        method='linear'
    )
    
    print("\n6. Merging Datasets...")
    # Rename wind variables to match our unified pipeline
    wind_regridded = wind_regridded.rename({
        'eastward_wind': 'u_wind',
        'northward_wind': 'v_wind'
    })
    
    ds_unified = xr.merge([glorys_regridded, wind_regridded])
    
    # Re-chunk optimally for spatial patching during training
    # (Time: 5, Depth: 22, Lat: 120, Lon: 200) -> small manageable chunks
    ds_unified = ds_unified.chunk({'time': 5, 'latitude': 60, 'longitude': 100})
    
    print("\n7. Executing Computation & Saving to Zarr (Watch RAM usage)...")
    print(f"Target Zarr path: {zarr_dir}")
    
    if os.path.exists(zarr_dir):
        print(f"Zarr directory {zarr_dir} already exists. Please delete it if you want to overwrite.")
        return
        
    with ProgressBar():
        ds_unified.to_zarr(zarr_dir, compute=True, safe_chunks=False)
        
    print("\nSession 1/2 Complete: Preprocessing successfully written to Zarr format on D: drive!")

if __name__ == "__main__":
    os.makedirs(os.path.abspath(os.path.join(os.path.dirname(__file__), '../data')), exist_ok=True)
    create_unified_zarr()
