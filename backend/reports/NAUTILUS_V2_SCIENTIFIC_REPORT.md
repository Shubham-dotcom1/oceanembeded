# NAUTILUS V2 — SCIENTIFIC REPORT & ABLATION DECISIONS

## 1. Abstract
The NAUTILUS V2 architecture implements a dynamic physics-guided model for Ocean Subsurface Temperature reconstruction in the North Indian Ocean. A critical decision in the V2 final configuration was the disabling of the Climatological Prior and its auxiliary embedding. This report transparently documents the scientific and methodological reasoning behind this choice.

## 2. Why Climatology Was Removed from V2
The inclusion of a Climatological Prior (historical long-term temperature average) is a scientifically sound concept, as ocean temperature possesses strong spatial and seasonal structure. However, in the NAUTILUS V2 pipeline, climatology was disabled due to two primary factors:

### A. Methodological Leakage Risk
The previous implementation computed the climatological average across the entire dataset (`np.nanmean(thetao_full)`), which implicitly included validation and test samples. This created a validation leakage risk where future target information could influence the training transforms. While climatology itself is not scientifically incorrect, this specific implementation was not leakage-safe.

### B. Experimental Ablation Results
During the Session-4 Ablation Studies (using strictly controlled environments on identical data splits), the addition of the static climatological profile did not demonstrate a measurable performance benefit for the V2 model. 
- **V2 (T=3, No Climatology):** `RMSE = 5.8394`
- **V2 (T=3, With Climatology):** `RMSE = 6.7553`

The degradation occurred because the V2 architecture utilizes a novel `Depth-Aware Decoder` that explicitly learns dynamic `depth_embeddings`. Forcing a static, non-varying 15-depth average into the context fusion vector caused capacity waste and actively interfered with the dynamic depth embeddings.

## 3. Conclusion & V3 Future Direction
Due to the leakage risk in the current implementation and the lack of demonstrated benefit in the ablation study, Climatology is disabled in the final V2 pipeline. The final V2 configuration prioritizes a cleaner and simpler scientifically defensible configuration based strictly on chronological temporal context (T=3) and spatial dynamics.

The concept of climatology remains scientifically interesting and is retained as a candidate for future investigation in **V3**. In V3, climatology may be reintroduced through a strictly leakage-safe implementation, where the statistical priors are calculated using **TRAINING DATA ONLY**, and then tested via a direct prediction vs. learned-anomaly comparison.
