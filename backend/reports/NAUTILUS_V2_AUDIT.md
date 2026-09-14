# NAUTILUS V2 AUDIT REPORT

## 1. Executive Summary
This audit reviews the NAUTILUS V1 codebase to identify weaknesses and prepare for the V2 upgrade. The objective is to make the model scientifically defensible, computationally efficient (laptop-safe), and stronger at predicting deeper ocean layers.

## 2. Current Architecture
- **Spatial Encoder:** Uses a 3-layer CNN followed by `AdaptiveAvgPool2d((1, 1))`. This aggressive global average pooling destroys fine-grained spatial gradients crucial for mesoscale eddy detection.
- **Temporal Encoder:** Hardcoded as a pass-through layer (`T=1`). There is no temporal context.
- **Decoder:** A simple shared MLP that outputs all 15 depths simultaneously. It lacks depth-awareness (e.g., distinguishing between highly variable surface vs stable deep layers).

## 3. Data Pipeline & Inputs
- **Current Memory Usage:** `dataset.py` uses "Zero-Risk Pre-Stacking" which loads arrays directly into system RAM (`self.spatial_features = np.stack(...)`). While fast for the small pilot (1.5GB), this will cause severe OOM crashes on full-scale data.
- **Input Variables:** 
  - SST, SSS, SSH, U-current, V-current are real (GLORYS).
  - **U-wind, V-wind are FAKE (Zero-padded).** This must be fixed.
- **Grid Resolution:** Currently mixed (GLORYS 0.083°, CMEMS Wind 0.125°). They must be unified to the final target of 0.25° x 0.25°.

## 4. Normalization
- Normalization is currently absent or implicit. Standardizing inputs (z-score) is required for stable gradients, especially when unifying winds and currents.

## 5. Train/Validation/Test Split
- The dataset is split chronologically using sequential indices. Because the multi-dimensional array is unraveled by `(Time, Lat, Lon)`, the first 70% of indices correctly represent the first 70% of Time. Temporal leakage is prevented.
- Spatial leakage is minimal as test timestamps never overlap with train timestamps.

## 6. Uncertainty Implementation
- **Current Status:** Uses Heteroscedastic Gaussian NLL.
- **Stability:** We recently clamped `pred_log_var` between `[-10.0, 10.0]`. This prevented NaN explosions, but the model's actual calibration (does high variance correlate with high error?) is completely untested.

## 7. GPU Usage Strategy
- The V1 model runs comfortably on the RTX 4050 6GB (~60% utilization, 55-58°C). We must maintain this healthy thermal profile using an effective batch size of 1024, utilizing gradient accumulation if VRAM pressure increases.

## 8. Recommended V2 Changes (Execution Order)
1. **Pipeline:** Implement xarray + Dask lazy loading and unify the grid to 0.25° x 0.25°. Ensure winds are real.
2. **Architecture:** 
   - Replace global pooling with a lightweight spatial feature map.
   - Introduce short temporal context (e.g., T=3 GRU).
   - Add a climatological prior so the model learns anomalies instead of absolute values.
   - Make the decoder depth-aware.
3. **Training:** Track uncertainty limits during training and run ablation studies.
