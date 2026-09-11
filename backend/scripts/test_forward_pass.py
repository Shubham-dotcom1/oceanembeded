import os
import sys
import torch

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model.pytorch_nio.architecture import OceanEmbeddedNIO
from training.trainer import HeteroscedasticNLLLoss

def test_pipeline():
    print("=== SIH 2026: North Indian Ocean PyTorch Model Test ===")
    
    # 1. Initialize Model
    print("1. Initializing Model...")
    model = OceanEmbeddedNIO(
        in_channels=7, 
        spatial_dim=64, 
        aux_dim=10, 
        temporal_context=1, 
        num_depths=15
    )
    
    # Count parameters
    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"   -> Model initialized successfully. Total Trainable Parameters: {total_params:,}")
    assert total_params < 200000, "Model is too large for rapid laptop prototyping!"
    
    # 2. Create Synthetic Tensors (B, T, C, H, W)
    print("\n2. Creating Synthetic Input Tensors (Batch Size: 32)...")
    B, T, C, H, W = 32, 1, 7, 25, 25
    synthetic_spatial = torch.randn(B, T, C, H, W) # Normal distribution dummy data
    synthetic_aux = torch.randn(B, 10)             # Climatology dummy data
    synthetic_targets = torch.randn(B, 15) * 5 + 20 # Dummy target temps ~20C
    print(f"   -> Spatial Input Shape: {synthetic_spatial.shape}")
    print(f"   -> Aux Input Shape:     {synthetic_aux.shape}")
    
    # 3. Forward Pass Test
    print("\n3. Testing Forward Pass...")
    model.eval()
    with torch.no_grad():
        temp_pred, log_var_pred = model(synthetic_spatial, synthetic_aux)
    
    print(f"   -> Temperature Prediction Shape: {temp_pred.shape}")
    print(f"   -> Uncertainty (Log-Var) Shape:  {log_var_pred.shape}")
    assert temp_pred.shape == (B, 15), "Output shape mismatch!"
    
    # 4. Loss Function Test
    print("\n4. Testing Heteroscedastic NLL Loss...")
    criterion = HeteroscedasticNLLLoss()
    loss = criterion(temp_pred, log_var_pred, synthetic_targets)
    print(f"   -> Computed Loss Value: {loss.item():.4f}")
    
    # 5. Save/Load Checkpoint Test
    print("\n5. Testing Model Checkpoint Saving/Loading...")
    checkpoint_dir = os.path.join(os.path.dirname(__file__), '../model/checkpoints')
    os.makedirs(checkpoint_dir, exist_ok=True)
    checkpoint_path = os.path.join(checkpoint_dir, 'synthetic_test_model.pth')
    
    torch.save(model.state_dict(), checkpoint_path)
    print(f"   -> Model saved to {checkpoint_path}")
    
    new_model = OceanEmbeddedNIO()
    new_model.load_state_dict(torch.load(checkpoint_path, weights_only=True))
    print("   -> Model loaded successfully.")
    
    print("\n=== SUCCESS: All PyTorch Tensor Contracts Verified! ===")

if __name__ == "__main__":
    test_pipeline()
