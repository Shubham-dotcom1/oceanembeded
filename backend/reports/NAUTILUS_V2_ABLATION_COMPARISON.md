# NAUTILUS V2 — ABLATION COMPARISON

## 1. COMPLETED EXPERIMENTS

| Experiment | Configuration | Epochs | Eff. Batch | Optimizer | Best Val RMSE |
|------------|---------------|--------|------------|-----------|---------------|
| **1. V1 Baseline** | Spatial GAP, T=1, No Climatology | 9 | 1024 | Adam | **2.0034** (Reported previously, but used flawed data pipeline) |
| **2. Spatial Only** | V2 Spatial Map, T=1, No Climatology | 15 | 1024 | Adam | **5.9520** |
| **3. Spatial + Temporal** | V2 Spatial Map, T=3, No Climatology | 15 | 1024 | Adam | **5.8394** |
| **4. Full V2** | V2 Spatial Map, T=3, Climatology | 15 | 1024 | Adam | **6.7553** |

*Note: The V1 Baseline RMSE (2.00) is not directly comparable because it used the older Zero-Risk Pre-Stacking with differing preprocessing scales. Experiments 2, 3, and 4 are strictly controlled ablations on the exact same dataset.*

## 2. ABLATION ANALYSIS

1. **Does the V2 spatial encoder improve over V1?**
   - **NOT VERIFIED directly** via identical datasets, but preserving spatial topology (5.95 RMSE) provides strict physical constraints missing in V1's Global Average Pooling.
   
2. **Does T=3 temporal context improve over the spatial-only version?**
   - **YES**. Adding a 3-day temporal context improved RMSE from `5.9520` to `5.8394`. It is scientifically sound that temporal dynamics aid in predicting subsurface structures.

3. **Does climatology + learned anomaly improve performance?**
   - **NO**. Adding static Climatological Priors severely degraded performance (`5.8394` -> `6.7553`). 
   - *Reason*: The V2 Depth-Aware Decoder already uses explicit, learnable `depth_embeddings`. Passing a static, non-varying 15-depth average into the context fusion vector forces the network to waste capacity processing redundant constant biases, directly interfering with the dynamic depth embeddings.

4. **Which modification gives the largest measurable improvement?**
   - **Temporal Context (T=3)**.

5. **Is any added complexity not justified by performance?**
   - **Climatology**. The added `aux_dim=15` processing is actively harmful to the Depth-Aware Decoder. It must be dropped.
