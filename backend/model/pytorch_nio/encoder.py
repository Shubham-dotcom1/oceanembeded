import torch
import torch.nn as nn

class SpatialEmbeddingEncoder(nn.Module):
    """
    Stage 2: Multi-channel spatial embedding encoder.
    Processes a (B, C, H, W) spatial patch into a flattened 1D embedding.
    """
    def __init__(self, in_channels=7, hidden_dim=64):
        super().__init__()
        # Input shape: (Batch, 7, 25, 25)
        # 7 channels: SST, SSS, SSH, U-curr, V-curr, U-wind, V-wind
        self.conv_block = nn.Sequential(
            nn.Conv2d(in_channels, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2), # (B, 16, 12, 12)
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2), # (B, 32, 6, 6)
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)) # (B, 64, 1, 1) - Global Average Pooling
        )
        self.fc = nn.Linear(64, hidden_dim)

    def forward(self, x):
        features = self.conv_block(x)
        features = features.view(features.size(0), -1) # Flatten to (B, 64)
        return self.fc(features)

class TemporalFeatureEncoder(nn.Module):
    """
    Stage 3: Minimal temporal component. 
    Initially acts as a pass-through for 1-day context.
    Ready for LSTM/GRU expansion for 3-day / 7-day contexts later.
    """
    def __init__(self, feature_dim=64, temporal_context=1):
        super().__init__()
        self.temporal_context = temporal_context
        # Placeholder for LSTM if T > 1
        if temporal_context > 1:
            self.rnn = nn.GRU(input_size=feature_dim, hidden_size=feature_dim, batch_first=True)
        else:
            self.rnn = None
            
    def forward(self, x):
        # x shape: (B, T, feature_dim)
        if self.rnn is not None:
            out, _ = self.rnn(x)
            return out[:, -1, :] # Take the last timestep's output
        else:
            # If T=1, just squeeze the time dimension
            return x.squeeze(1)
