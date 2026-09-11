import os
import torch
import numpy as np
import xarray as xr
from torch.utils.data import Dataset

class OceanSatDataset(Dataset):
    """
    Custom PyTorch Dataset for loading CMEMS NetCDF files via xarray.
    Extracts 25x25 spatial patches and aligns 7 surface variables.
    """
    def __init__(self, glorys_path, wind_path, patch_size=25):
        self.patch_size = patch_size
        self.target_depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
        
        print("Loading NetCDF files into memory...")
        # Load datasets lazily using xarray
        if os.path.exists(glorys_path):
            self.glorys = xr.open_dataset(glorys_path)
            
            # To avoid complex resampling in this pilot, we assume the user 
            # will harmonize grids via xESMF later. For the pilot, we will 
            # extract spatial coordinates directly.
            self.times = self.glorys.time.values
            self.lats = self.glorys.latitude.values
            self.lons = self.glorys.longitude.values
            
            # Define valid center points that can fit a 25x25 patch
            half_patch = patch_size // 2
            self.valid_lat_idx = range(half_patch, len(self.lats) - half_patch)
            self.valid_lon_idx = range(half_patch, len(self.lons) - half_patch)
            
            # Pre-calculate dataset length
            self.n_times = len(self.times)
            self.n_lats = len(self.valid_lat_idx)
            self.n_lons = len(self.valid_lon_idx)
            self.length = self.n_times * self.n_lats * self.n_lons
            self.is_synthetic = False
        else:
            print("WARNING: NetCDF files not found. Using synthetic data fallback for pipeline testing.")
            self.length = 100 # Dummy length
            self.is_synthetic = True

    def __len__(self):
        return self.length

    def __getitem__(self, idx):
        if self.is_synthetic:
            # Fallback for when data isn't downloaded yet
            spatial_inputs = torch.randn(1, 7, self.patch_size, self.patch_size)
            aux_inputs = torch.randn(10)
            targets = torch.randn(15) * 5 + 20
            return spatial_inputs, aux_inputs, targets

        # 1. Unravel index to time, lat, lon
        t_idx = idx // (self.n_lats * self.n_lons)
        rem = idx % (self.n_lats * self.n_lons)
        lat_idx = self.valid_lat_idx[rem // self.n_lons]
        lon_idx = self.valid_lon_idx[rem % self.n_lons]

        # 2. Slice 25x25 spatial patch
        half_p = self.patch_size // 2
        lat_slice = slice(lat_idx - half_p, lat_idx + half_p + 1)
        lon_slice = slice(lon_idx - half_p, lon_idx + half_p + 1)

        # 3. Extract Surface Features (depth ~ 0m)
        g_patch = self.glorys.isel(time=t_idx, latitude=lat_slice, longitude=lon_slice)
        
        sst = g_patch.thetao.isel(depth=0).values
        sss = g_patch.so.isel(depth=0).values
        ssh = g_patch.zos.values
        u_curr = g_patch.uo.isel(depth=0).values
        v_curr = g_patch.vo.isel(depth=0).values
        
        # Wind is tricky without regridding, using dummy wind for pilot 
        # to ensure the software pipeline runs smoothly immediately.
        u_wind = np.zeros_like(sst)
        v_wind = np.zeros_like(sst)

        # Build (7, 25, 25) tensor, filling NaNs (land) with 0
        channels = [sst, sss, ssh, u_curr, v_curr, u_wind, v_wind]
        channels = [np.nan_to_num(c, 0) for c in channels]
        spatial_tensor = torch.tensor(np.stack(channels), dtype=torch.float32)
        
        # Add Time dimension T=1 -> (1, 7, 25, 25)
        spatial_tensor = spatial_tensor.unsqueeze(0)
        
        # 4. Extract Target Subsurface Temperature (at center pixel)
        # Interpolating GLORYS native depths to our 15 target depths
        native_depths = self.glorys.depth.values
        center_profile = self.glorys.thetao.isel(
            time=t_idx, latitude=lat_idx, longitude=lon_idx
        ).values
        
        # Simple numpy interpolation for target
        valid_mask = ~np.isnan(center_profile)
        if np.sum(valid_mask) > 1:
            target_profile = np.interp(self.target_depths, native_depths[valid_mask], center_profile[valid_mask])
        else:
            target_profile = np.zeros(15)
            
        target_tensor = torch.tensor(target_profile, dtype=torch.float32)
        
        # 5. Dummy Aux / Climatology (Stage 4 feature)
        aux_tensor = torch.zeros(10, dtype=torch.float32)
        
        return spatial_tensor, aux_tensor, target_tensor
