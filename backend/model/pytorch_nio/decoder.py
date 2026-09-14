import torch
import torch.nn as nn

class Decoder(nn.Module):
    """
    Stage 4 & 5: Feature Fusion and Reconstruction Decoder.
    Takes the temporal/spatial embedding, fuses climatology, 
    and outputs Temperature and Uncertainty using a Depth-Aware architecture.
    """
    def __init__(self, feature_dim=64, num_depths=15):
        super().__init__()
        self.num_depths = num_depths
        
        # Feature MLP (Context Vector without Climatology)
        self.context_mlp = nn.Sequential(
            nn.Linear(feature_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU()
        )
        
        # Explicit Depth Embeddings (V2 Depth-Aware)
        # Learnable vector for each of the 15 depths
        self.depth_embedding = nn.Parameter(torch.randn(num_depths, 16))
        
        # Depth-Specific Decoder MLP
        # Takes Context (64) + Depth Embedding (16) = 80
        self.depth_mlp = nn.Sequential(
            nn.Linear(80, 32),
            nn.ReLU()
        )
        
        # Final Heads (Outputs a scalar per depth)
        self.temp_head = nn.Linear(32, 1)
        self.unc_head = nn.Linear(32, 1)
        
    def forward(self, temporal_features):
        # 1. Create global context for the water column
        context = self.context_mlp(temporal_features) # (B, 64)
        
        # 2. Expand context for all 15 depths
        B = context.size(0)
        # context: (B, 1, 64) -> (B, 15, 64)
        context_expanded = context.unsqueeze(1).expand(B, self.num_depths, -1)
        
        # depth_emb: (1, 15, 16) -> (B, 15, 16)
        depth_emb_expanded = self.depth_embedding.unsqueeze(0).expand(B, -1, -1)
        
        # 3. Concatenate and decode per-depth
        # (B, 15, 80)
        depth_context = torch.cat([context_expanded, depth_emb_expanded], dim=-1)
        
        # Pass through shared depth MLP (B, 15, 32)
        depth_features = self.depth_mlp(depth_context)
        
        # 4. Predict
        temp_pred = self.temp_head(depth_features).squeeze(-1) # (B, 15)
        log_var_pred = self.unc_head(depth_features).squeeze(-1) # (B, 15)
        
        return temp_pred, log_var_pred
