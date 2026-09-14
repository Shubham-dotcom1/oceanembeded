# NAUTILUS V2 — IMPLEMENTATION AUDIT

## 1. DATA PIPELINE AUDIT
- **Variables**: All 7 required surface variables (SST, SSS, SSH/SLA, U-current, V-current, U-wind, V-wind) are present and actively loaded from the Zarr dataset.
- **Grid**: 0.25° × 0.25° unified grid.
- **Data Loading**: Currently loading the entire 1-month Zarr dataset into RAM (`self.ds.load()`). RAM usage is <100MB, safely containing the 8GB limit.
- **Leakage (Train/Val/Test)**: The split is strictly chronological (70/15/15), preventing spatial/temporal overlap leakage.
- **Climatology Leakage (CRITICAL BLOCKER)**: The climatological prior is calculated using `np.nanmean(self.thetao_full)`, which includes Validation and Test data! This is a data leak. Climatology must be computed ONLY on `train_indices`.

## 2. TEMPORAL CONTEXT AUDIT
- **T=3 Implementation**: `time_slice = slice(t_idx_start, t_idx_start + self.T)` extracts inputs at `[t-2, t-1, t]`.
- **Target Extraction**: `target_center = self.thetao_full[t_idx_start + self.T - 1, ...]`. This correctly targets timestamp `t`.
- **Status**: No future leakage. Correctly implemented.

## 3. DEPTH-AWARE DECODER AUDIT
- **Mechanism**: The decoder expands the spatial-temporal context vector and concatenates it with a learned `depth_embedding = nn.Parameter(torch.randn(15, 16))`.
- **Depths**: Outputs correspond to exactly 15 standard depths.
- **Status**: Genuinely active and mathematically sound. It conditions predictions on the specific ocean layer.

## 4. UNCERTAINTY AUDIT
- **Implementation**: Heteroscedastic NLL Loss.
- **Stability Mechanisms**: `log_var` is explicitly clamped between `[-10.0, 10.0]` to prevent NaNs.
- **Status**: Implemented correctly, but subject to overconfidence spikes (see Training Stability).

## 5. TRAINING STABILITY AUDIT
- **Observation**: Training NLL loss exhibits massive spikes (e.g., 40.12, 15.37) while Validation RMSE remains completely stable.
- **Root Cause**: Heteroscedastic overconfidence. If the model predicts a very low variance (`log_var -> -10`) for a sample it gets slightly wrong, the precision term (`exp(-log_var)`) acts as a massive multiplier (up to ~22026x) on the MSE, causing loss to explode without the actual temperature prediction being wildly off.
- **Status**: This is a known mathematical property of NLL, not an implementation bug. RMSE stability proves the model isn't diverging.

## 6. CHECKPOINT / RESUME AUDIT
- **Implementation**: Contains `model_state`, `optimizer_state`, `scaler_state`, `epoch`, and `val_rmse`.
- **Status**: Tested and verified during Session 3 Smoke Test. Fully resumable.

## 7. HARDWARE / RESOURCE AUDIT
- **VRAM**: Kept safely within 6GB using `Micro-Batch = 64` and `Accumulation = 16`.
- **Effective Batch Size**: 1024.
- **AMP**: Enabled via `torch.cuda.amp.GradScaler`.
- **Status**: Excellent. Hardware constraints are fully satisfied.
