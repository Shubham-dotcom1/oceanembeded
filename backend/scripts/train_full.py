import os
import sys
import json
import logging
import time
import torch
from torch.utils.data import DataLoader

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model.pytorch_nio.architecture import OceanEmbeddedNIO
from training.trainer import HeteroscedasticNLLLoss, train_epoch, validate_epoch, EarlyStopping
from data.dataset import OceanSatDataset, get_chronological_splits

# Setup Logging
log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../logs'))
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'training_run.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def main():
    logger.info("=== NAUTILUS V2: Full-Scale Final Training ===")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Hardware Device: {device}")
    
    # 1. Dataset setup
    zarr_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed_nio.zarr'))
    dataset = OceanSatDataset(zarr_path, patch_size=25, temporal_context=3)
    
    if dataset.is_synthetic:
        logger.error("Dataset missing. Run preprocessing first.")
        return
        
    logger.info(f"Total Dataset Size: {len(dataset)} samples")
    train_set, val_set, test_set = get_chronological_splits(dataset, train_ratio=0.7, val_ratio=0.15)
    logger.info(f"Splits -> Train: {len(train_set)}, Val: {len(val_set)}, Test: {len(test_set)}")
    
    # 2. Memory-Safe Batching (Micro-Batch + Gradient Accumulation)
    micro_batch = 64 if device.type == 'cuda' else 16
    accumulation_steps = 1024 // micro_batch
    logger.info(f"Micro-Batch: {micro_batch} | Accumulation Steps: {accumulation_steps} | Effective Batch: 1024")
    
    train_loader = DataLoader(train_set, batch_size=micro_batch, shuffle=True, pin_memory=True, num_workers=0)
    val_loader = DataLoader(val_set, batch_size=micro_batch, shuffle=False, pin_memory=True, num_workers=0)
    test_loader = DataLoader(test_set, batch_size=micro_batch, shuffle=False, pin_memory=True, num_workers=0)
    
    # 3. Final V2 Model Initialization (Climatology Purged)
    model = OceanEmbeddedNIO(in_channels=7, spatial_dim=64, temporal_context=3, num_depths=15).to(device)
    criterion = HeteroscedasticNLLLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)
    scaler = torch.cuda.amp.GradScaler() if device.type == 'cuda' else None
    early_stopping = EarlyStopping(patience=10, delta=0.01)
    
    # 4. Resumable Checkpoint Logic
    checkpoint_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/checkpoints'))
    os.makedirs(checkpoint_dir, exist_ok=True)
    ckpt_path = os.path.join(checkpoint_dir, 'nautilus_v2_best.pth')
    
    start_epoch = 1
    epochs = 100
    best_val_rmse = float('inf')
    metrics = {"train_loss": [], "val_loss": [], "val_rmse": [], "val_mae": []}
    
    if os.path.exists(ckpt_path):
        logger.info(f"Found existing checkpoint at {ckpt_path}. Resuming...")
        checkpoint = torch.load(ckpt_path, weights_only=False)
        model.load_state_dict(checkpoint['model_state'])
        optimizer.load_state_dict(checkpoint['optimizer_state'])
        if scaler and 'scaler_state' in checkpoint and checkpoint['scaler_state']:
            scaler.load_state_dict(checkpoint['scaler_state'])
        start_epoch = checkpoint['epoch'] + 1
        best_val_rmse = checkpoint.get('val_rmse', float('inf'))
        logger.info(f"Resumed from epoch {start_epoch - 1}. Best Validation RMSE so far: {best_val_rmse:.4f}")
        
        # Load previous metrics if available
        if 'metrics' in checkpoint:
            metrics = checkpoint['metrics']
            
    # 5. Training Loop
    start_time = time.time()
    for epoch in range(start_epoch, epochs + 1):
        logger.info(f"--- Epoch {epoch}/{epochs} ---")
        
        train_loss = train_epoch(model, train_loader, optimizer, criterion, device, scaler, accumulation_steps)
        val_loss, val_rmse, val_mae, _, _ = validate_epoch(model, val_loader, criterion, device)
        
        metrics["train_loss"].append(train_loss)
        metrics["val_loss"].append(val_loss)
        metrics["val_rmse"].append(val_rmse)
        metrics["val_mae"].append(val_mae)
        
        logger.info(f"Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val RMSE: {val_rmse:.4f}")
        
        is_best = early_stopping(val_rmse)
        if is_best:
            torch.save({
                'epoch': epoch,
                'model_state': model.state_dict(),
                'optimizer_state': optimizer.state_dict(),
                'scaler_state': scaler.state_dict() if scaler else None,
                'val_rmse': val_rmse,
                'metrics': metrics
            }, ckpt_path)
            best_val_rmse = val_rmse
            logger.info(f"[*] Best model saved at Epoch {epoch} with RMSE {val_rmse:.4f}")
        else:
            logger.info(f"[!] Model not improved. Best RMSE remains {best_val_rmse:.4f}")
            
        if early_stopping.early_stop:
            logger.info("Early stopping triggered! Model stopped improving.")
            break
            
    train_time = time.time() - start_time
    logger.info(f"Training completed in {train_time/60:.2f} minutes.")
    
    # 6. Final Test Set Evaluation
    logger.info("Loading best model for Final Test Set Evaluation...")
    checkpoint = torch.load(ckpt_path, weights_only=False)
    model.load_state_dict(checkpoint['model_state'])
    
    _, test_rmse, test_mae, depth_rmse, depth_mae = validate_epoch(model, test_loader, criterion, device)
    
    logger.info(f"=== FINAL TEST SCORES ===")
    logger.info(f"Global RMSE: {test_rmse:.4f} °C")
    logger.info(f"Global MAE:  {test_mae:.4f} °C")
    
    depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    logger.info("--- Depth-wise RMSE ---")
    for d, r in zip(depths, depth_rmse):
        logger.info(f"Depth {d:4d}m : {r:.4f} °C")
        
    # 7. Save JSON Metrics
    report_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../reports'))
    os.makedirs(report_dir, exist_ok=True)
    metrics_file = os.path.join(report_dir, 'final_metrics.json')
    
    final_report = {
        "training_time_minutes": train_time/60,
        "epochs_run": epoch,
        "global_test_rmse": test_rmse,
        "global_test_mae": test_mae,
        "depth_wise_rmse": {str(d): r for d, r in zip(depths, depth_rmse)},
        "depth_wise_mae": {str(d): m for d, m in zip(depths, depth_mae)},
        "training_history": metrics
    }
    
    with open(metrics_file, 'w') as f:
        json.dump(final_report, f, indent=4)
        
    logger.info(f"Full metrics saved to: {metrics_file}")
    logger.info("Ready for V2 Scientific Pitch Deck!")

if __name__ == "__main__":
    main()
