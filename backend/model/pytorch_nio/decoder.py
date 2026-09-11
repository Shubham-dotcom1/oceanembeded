import torch
import torch.nn as nn

class Decoder(nn.Module):
    """
    Stage 4 & 5: Feature Fusion and Reconstruction Decoder.
    Takes the temporal/spatial embedding, fuses climatology, 
    and outputs Temperature and Uncertainty.
    """
    def __init__(self, feature_dim=64, aux_dim=10, num_depths=15):
        super().__init__()
        
        # Feature Fusion MLP
        fusion_dim = feature_dim + aux_dim
        self.fc_fusion = nn.Sequential(
            nn.Linear(fusion_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU()
        )
        
        # Stage 6: 15-depth Temperature Head (Mean)
        self.temp_head = nn.Linear(64, num_depths)
        
        # Stage 5: Uncertainty Head (Predictive Variance)
        # Outputs log(variance) for numeric stability during loss computation
        self.unc_head = nn.Linear(64, num_depths)
        
    def forward(self, temporal_features, aux_features):
        # Concatenate encoded satellite features with climatological priors
        fused = torch.cat([temporal_features, aux_features], dim=-1)
        
        decoded = self.fc_fusion(fused)
        
        # Dual output
        temp_pred = self.temp_head(decoded)
        log_var_pred = self.unc_head(decoded)
        
        return temp_pred, log_var_pred
