import os
import sys
import json
import logging
import time
import torch
from torch.utils.data import DataLoader

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model.pytorch_nio.architecture import OceanEmbeddedNIO
from training.trainer import HeteroscedasticNLLLoss, train_epoch, validate_epoch
from data.dataset import OceanSatDataset, get_chronological_splits

# Setup Logging
log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../logs'))
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'ablation_run.log')

logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s [%(levelname)s] %(message)s', 
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

from tqdm import tqdm

def run_experiment(exp_name, temporal_context, use_climatology, device, zarr_path):
    logger.info(f"\n{'='*50}\nStarting Experiment: {exp_name}\n{'='*50}")
    
    # 1. Dataset setup
    dataset = OceanSatDataset(zarr_path, patch_size=25, temporal_context=temporal_context)
    train_set, val_set, _ = get_chronological_splits(dataset, train_ratio=0.7, val_ratio=0.15)
    
    # 2. Batching (User requested strictly Effective Batch = 1024, GPU = 60-75%)
    # By reducing micro-batch to 64, the GPU works on fewer parallel blocks, lowering usage/temps,
    # but accumulating 16 times means the math is exactly identical to batch size 1024.
    micro_batch = 64 if device.type == 'cuda' else 16
    accumulation_steps = 1024 // micro_batch
    
    train_loader = DataLoader(train_set, batch_size=micro_batch, shuffle=True, pin_memory=True, num_workers=0)
    val_loader = DataLoader(val_set, batch_size=micro_batch, shuffle=False, pin_memory=True, num_workers=0)
    
    # 3. Model setup
    aux_dim = 15 if use_climatology else 0
    model = OceanEmbeddedNIO(in_channels=7, spatial_dim=64, aux_dim=aux_dim, temporal_context=temporal_context, num_depths=15).to(device)
    
    criterion = HeteroscedasticNLLLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)
    scaler = torch.cuda.amp.GradScaler() if device.type == 'cuda' else None
    
    epochs = 15 # Short ablation
    best_val_rmse = float('inf')
    
    # Modify validation loader wrapper to zero out aux_inputs if climatology is off
    def get_aux(aux_t):
        return aux_t if use_climatology else torch.empty(aux_t.size(0), 0, device=device)
    
    for epoch in range(1, epochs + 1):
        model.train()
        total_train_loss = 0
        optimizer.zero_grad()
        
        for batch_idx, (spatial, aux, targets) in enumerate(tqdm(train_loader, desc=f"Train Ep {epoch}")):
            spatial = spatial.to(device)
            aux = get_aux(aux.to(device))
            targets = targets.to(device)
            
            with torch.amp.autocast(device_type=device.type, enabled=(scaler is not None)):
                temp_pred, log_var_pred = model(spatial, aux)
                loss = criterion(temp_pred, log_var_pred, targets) / accumulation_steps
                
            if scaler:
                scaler.scale(loss).backward()
            else:
                loss.backward()
                
            if ((batch_idx + 1) % accumulation_steps == 0) or (batch_idx + 1 == len(train_loader)):
                if scaler:
                    scaler.unscale_(optimizer)
                    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                    scaler.step(optimizer)
                    scaler.update()
                else:
                    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                    optimizer.step()
                optimizer.zero_grad()
                
            total_train_loss += loss.item() * accumulation_steps
            
        train_loss = total_train_loss / len(train_loader)
        
        # Validation
        model.eval()
        total_val_loss = 0
        all_preds, all_targets = [], []
        
        with torch.no_grad():
            for spatial, aux, targets in tqdm(val_loader, desc=f"Val Ep {epoch}"):
                spatial = spatial.to(device)
                aux = get_aux(aux.to(device))
                targets = targets.to(device)
                
                temp_pred, log_var_pred = model(spatial, aux)
                loss = criterion(temp_pred, log_var_pred, targets)
                
                total_val_loss += loss.item()
                all_preds.append(temp_pred.cpu())
                all_targets.append(targets.cpu())
                
        all_preds = torch.cat(all_preds, dim=0)
        all_targets = torch.cat(all_targets, dim=0)
        val_rmse = torch.sqrt(torch.nn.functional.mse_loss(all_preds, all_targets)).item()
        val_loss = total_val_loss / len(val_loader)
        
        logger.info(f"[{exp_name}] Epoch {epoch}/{epochs} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val RMSE: {val_rmse:.4f}")
        
        if val_rmse < best_val_rmse:
            best_val_rmse = val_rmse
            
    return best_val_rmse

def main():
    logger.info("=== NAUTILUS V2: Session 4 Ablation Studies ===")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    zarr_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed_nio.zarr'))
    
    results = {}
    
    # Experiment 1: Spatial Only
    results["1_Spatial_Only"] = run_experiment("Spatial Only (T=1, No Climatology)", 1, False, device, zarr_path)
    
    # Experiment 2: Spatial + Temporal
    results["2_Spatial_Temporal"] = run_experiment("Spatial + Temporal (T=3, No Climatology)", 3, False, device, zarr_path)
    
    # Experiment 3: Full V2 (Spatial + Temporal + Climatology)
    results["3_Full_V2"] = run_experiment("Full V2 (T=3, Climatology)", 3, True, device, zarr_path)
    
    logger.info("\n=== ABLATION RESULTS ===")
    for exp, rmse in results.items():
        logger.info(f"{exp}: Best Validation RMSE = {rmse:.4f}")
        
if __name__ == "__main__":
    main()
