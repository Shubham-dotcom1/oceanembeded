import os
import sys
import logging
import torch
from torch.utils.data import DataLoader

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model.pytorch_nio.architecture import OceanEmbeddedNIO
from training.trainer import HeteroscedasticNLLLoss, train_epoch, validate_epoch
from data.dataset import OceanSatDataset, get_chronological_splits

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

def main():
    logger.info("=== NAUTILUS V2: Session 3 Architecture Smoke Test ===")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Using device: {device}")
    
    # 1. Dataset setup
    zarr_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed_nio.zarr'))
    dataset = OceanSatDataset(zarr_path, patch_size=25, temporal_context=3)
    
    if dataset.is_synthetic:
        logger.error("Dataset missing. Run preprocessing first.")
        return
        
    train_set, val_set, _ = get_chronological_splits(dataset, train_ratio=0.7, val_ratio=0.15)
    
    # 2. Memory-Safe Batching (Micro-Batch + Gradient Accumulation)
    # Effective Batch Size required by User = 1024
    micro_batch = 128 if device.type == 'cuda' else 16
    accumulation_steps = 1024 // micro_batch
    
    logger.info(f"Micro-Batch: {micro_batch} | Accumulation Steps: {accumulation_steps} | Effective Batch: 1024")
    
    train_loader = DataLoader(train_set, batch_size=micro_batch, shuffle=True, pin_memory=True, num_workers=0)
    val_loader = DataLoader(val_set, batch_size=micro_batch, shuffle=False, pin_memory=True, num_workers=0)
    
    # 3. Model initialization
    # Purged Climatology Prior - using Depth-Aware Decoder only
    model = OceanEmbeddedNIO(in_channels=7, spatial_dim=64, temporal_context=3, num_depths=15).to(device)
    criterion = HeteroscedasticNLLLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)
    scaler = torch.cuda.amp.GradScaler() if device.type == 'cuda' else None
    
    # 4. Resumable Checkpoint Logic
    checkpoint_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/checkpoints'))
    os.makedirs(checkpoint_dir, exist_ok=True)
    ckpt_path = os.path.join(checkpoint_dir, 'nautilus_v2_smoke.pth')
    
    start_epoch = 1
    epochs = 2 # Just a smoke test
    
    if os.path.exists(ckpt_path):
        logger.info(f"Found existing checkpoint at {ckpt_path}. Resuming...")
        checkpoint = torch.load(ckpt_path, weights_only=False)
        model.load_state_dict(checkpoint['model_state'])
        optimizer.load_state_dict(checkpoint['optimizer_state'])
        if scaler and 'scaler_state' in checkpoint:
            scaler.load_state_dict(checkpoint['scaler_state'])
        start_epoch = checkpoint['epoch'] + 1
        logger.info(f"Resumed from epoch {start_epoch - 1}")
    
    # 5. Smoke Test Loop
    for epoch in range(start_epoch, epochs + 1):
        logger.info(f"--- Epoch {epoch}/{epochs} ---")
        
        train_loss = train_epoch(model, train_loader, optimizer, criterion, device, scaler, accumulation_steps)
        val_loss, val_rmse, val_mae, _, _ = validate_epoch(model, val_loader, criterion, device)
        
        logger.info(f"Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val RMSE: {val_rmse:.4f}")
        
        # Save complete state for perfect resumability
        torch.save({
            'epoch': epoch,
            'model_state': model.state_dict(),
            'optimizer_state': optimizer.state_dict(),
            'scaler_state': scaler.state_dict() if scaler else None,
            'val_rmse': val_rmse
        }, ckpt_path)
        logger.info(f"Checkpoint saved to {ckpt_path}")
        
    logger.info("Session 3 Smoke Test Complete! VRAM usage was automatically constrained.")

if __name__ == "__main__":
    main()
