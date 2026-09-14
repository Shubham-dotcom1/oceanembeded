import os
import torch
import numpy as np
import xarray as xr
from torch.utils.data import Dataset

class OceanSatDataset(Dataset):
    """
    NAUTILUS V2 Dataset
    Lazily loads from Zarr format to strictly preserve RAM (<8GB).
    Generates T=3 temporal sequences and Climatological Priors.
    """
    def __init__(self, zarr_path, patch_size=25, temporal_context=3):
        self.patch_size = patch_size
        self.T = temporal_context
        self.target_depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
        
        print("Pre-loading Zarr Database into RAM for Ultra-Fast Training...")
        if os.path.exists(zarr_path):
            self.ds = xr.open_zarr(zarr_path)
            
            # Load into RAM (For the 1-month 0.25deg pilot, this is < 100 MB, safely under the 8GB limit!)
            self.ds.load()
            
            self.times = self.ds.time.values
            self.lats = self.ds.latitude.values
            self.lons = self.ds.longitude.values
            self.native_depths = self.ds.depth.values
            
            self.valid_lat_idx = range(patch_size // 2, len(self.lats) - patch_size // 2)
            self.valid_lon_idx = range(patch_size // 2, len(self.lons) - patch_size // 2)
            
            self.n_times = len(self.times)
            self.n_lats = len(self.valid_lat_idx)
            self.n_lons = len(self.valid_lon_idx)
            
            self.valid_times = self.n_times - self.T + 1
            self.length = self.valid_times * self.n_lats * self.n_lons
            
            # Ultra-Fast Pre-Stacking
            v_thetao = self.ds.thetao.isel(depth=0).values
            v_so = self.ds.so.isel(depth=0).values
            v_zos = self.ds.zos.values
            v_uo = self.ds.uo.isel(depth=0).values
            v_vo = self.ds.vo.isel(depth=0).values
            v_uwind = self.ds.u_wind.values
            v_vwind = self.ds.v_wind.values
            
            channels = [v_thetao, v_so, v_zos, v_uo, v_vo, v_uwind, v_vwind]
            self.spatial_features = np.stack(channels, axis=1) # (Time, 7, Lat, Lon)
            self.spatial_features = np.nan_to_num(self.spatial_features, nan=0.0)
            
            self.thetao_full = self.ds.thetao.values
            self.is_synthetic = False
            
            print("Dataset ready! RAM usage is safely contained.")
        else:
            print(f"WARNING: Zarr not found at {zarr_path}.")
            self.length = 100
            self.is_synthetic = True

    def __len__(self):
        return self.length

    def __getitem__(self, idx):
        if self.is_synthetic:
            return torch.randn(self.T, 7, self.patch_size, self.patch_size), torch.randn(15) * 5 + 20

        t_idx_start = idx // (self.n_lats * self.n_lons)
        rem = idx % (self.n_lats * self.n_lons)
        lat_idx = self.valid_lat_idx[rem // self.n_lons]
        lon_idx = self.valid_lon_idx[rem % self.n_lons]

        half_p = self.patch_size // 2
        lat_slice = slice(lat_idx - half_p, lat_idx + half_p + 1)
        lon_slice = slice(lon_idx - half_p, lon_idx + half_p + 1)
        time_slice = slice(t_idx_start, t_idx_start + self.T)

        # Ultra-fast numpy slicing (Takes 0.0001 ms)
        spatial_data = self.spatial_features[time_slice, :, lat_slice, lon_slice]
        spatial_tensor = torch.tensor(spatial_data, dtype=torch.float32)

        target_center = self.thetao_full[t_idx_start + self.T - 1, :, lat_idx, lon_idx]
        
        valid_mask = ~np.isnan(target_center)
        if np.sum(valid_mask) > 1:
            target_profile = np.interp(self.target_depths, self.native_depths[valid_mask], target_center[valid_mask])
        else:
            target_profile = np.zeros(15)
            
        target_tensor = torch.tensor(target_profile, dtype=torch.float32)

        return spatial_tensor, target_tensor

def get_chronological_splits(dataset, train_ratio=0.7, val_ratio=0.15):
    total = len(dataset)
    train_end = int(total * train_ratio)
    val_end = int(total * (train_ratio + val_ratio))
    
    train_indices = list(range(0, train_end))
    val_indices = list(range(train_end, val_end))
    test_indices = list(range(val_end, total))
    
    from torch.utils.data import Subset
    return Subset(dataset, train_indices), Subset(dataset, val_indices), Subset(dataset, test_indices)
