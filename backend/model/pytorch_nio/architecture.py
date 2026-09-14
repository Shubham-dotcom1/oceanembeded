import torch
import torch.nn as nn

from .encoder import SpatialEmbeddingEncoder, TemporalFeatureEncoder
from .decoder import Decoder

class OceanEmbeddedNIO(nn.Module):
    """
    Master PyTorch Architecture for SIH 2026.
    North Indian Ocean Satellite Embedding & Subsurface Temperature Reconstruction.
    """
    def __init__(self, in_channels=7, spatial_dim=64, temporal_context=1, num_depths=15):
        super().__init__()
        
        # 1. Spatial Embedding Encoder
        self.spatial_encoder = SpatialEmbeddingEncoder(
            in_channels=in_channels, 
            hidden_dim=spatial_dim
        )
        
        # 2. Temporal Feature Encoder
        self.temporal_encoder = TemporalFeatureEncoder(
            feature_dim=spatial_dim, 
            temporal_context=temporal_context
        )
        
        # 3. Fusion & Reconstruction Decoder (Dual Heads)
        self.decoder = Decoder(
            feature_dim=spatial_dim, 
            num_depths=num_depths
        )
        
    def forward(self, spatial_inputs):
        """
        spatial_inputs: (B, T, C, H, W)
        """
        B, T, C, H, W = spatial_inputs.shape
        
        # Reshape to push Time into Batch dimension for spatial convolution
        # (B*T, C, H, W)
        x = spatial_inputs.view(B * T, C, H, W)
        
        # Pass through Spatial Encoder
        spatial_features = self.spatial_encoder(x) # (B*T, spatial_dim)
        
        # Reshape back to recover Time dimension
        # (B, T, spatial_dim)
        spatial_features = spatial_features.view(B, T, -1)
        
        # Pass through Temporal Encoder
        # (B, spatial_dim)
        temporal_features = self.temporal_encoder(spatial_features)
        
        # Decode to 15 depths (Temperature Mean and Log-Variance)
        temp_pred, log_var_pred = self.decoder(temporal_features)
        
        return temp_pred, log_var_pred
