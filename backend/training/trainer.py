import torch
import torch.nn as nn
from tqdm import tqdm

class HeteroscedasticNLLLoss(nn.Module):
    """
    Gaussian Negative Log-Likelihood Loss for regression.
    Targets both prediction accuracy (Mean) and uncertainty calibration (Variance).
    """
    def __init__(self):
        super().__init__()

    def forward(self, pred_mean, pred_log_var, target):
        """
        pred_mean: (B, 15) - Predicted temperature
        pred_log_var: (B, 15) - Predicted log variance
        target: (B, 15) - True temperature (GLORYS)
        """
        # 1. Clamp log_var to prevent infinite AI cheating (NaNs)
        pred_log_var = torch.clamp(pred_log_var, min=-10.0, max=10.0)
        
        # 2. Mathematically robust NLL Formula (Precision = 1/Variance)
        precision = torch.exp(-pred_log_var)
        loss = 0.5 * precision * torch.pow(target - pred_mean, 2) + 0.5 * pred_log_var
        
        return loss.mean() # Mean over batch and depth dimensions

# Minimal Training Loop Skeleton (Stage 7)
def train_epoch(model, dataloader, optimizer, criterion, device, scaler=None, accumulation_steps=1):
    model.train()
    total_loss = 0
    
    optimizer.zero_grad() # Zero gradients at the very beginning
    
    for batch_idx, (spatial_inputs, targets) in enumerate(tqdm(dataloader, desc="Training Batches")):
        spatial_inputs = spatial_inputs.to(device)
        targets = targets.to(device)
        
        # Mixed Precision Forward Pass
        with torch.amp.autocast(device_type=device.type, enabled=(scaler is not None)):
            temp_pred, log_var_pred = model(spatial_inputs)
            loss = criterion(temp_pred, log_var_pred, targets)
            
            # Normalize loss for accumulation
            loss = loss / accumulation_steps
            
        # Backward pass with scaler
        if scaler is not None:
            scaler.scale(loss).backward()
        else:
            loss.backward()
            
        # Step optimizer only after accumulating enough gradients
        if ((batch_idx + 1) % accumulation_steps == 0) or (batch_idx + 1 == len(dataloader)):
            if scaler is not None:
                scaler.unscale_(optimizer) # Unscale before clipping
                torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                scaler.step(optimizer)
                scaler.update()
            else:
                torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()
                
            optimizer.zero_grad()
        
        # De-normalize loss for tracking
        total_loss += loss.item() * accumulation_steps
        
    return total_loss / len(dataloader)

def validate_epoch(model, dataloader, criterion, device):
    """
    Validation loop to compute loss, RMSE, and MAE across all 15 depths.
    """
    model.eval()
    total_loss = 0
    all_preds = []
    all_targets = []
    
    with torch.no_grad():
        for spatial_inputs, targets in tqdm(dataloader, desc="Validating Batches"):
            spatial_inputs = spatial_inputs.to(device)
            targets = targets.to(device)
            
            temp_pred, log_var_pred = model(spatial_inputs)
            loss = criterion(temp_pred, log_var_pred, targets)
            
            total_loss += loss.item()
            all_preds.append(temp_pred.cpu())
            all_targets.append(targets.cpu())
            
    # Calculate global RMSE and MAE
    all_preds = torch.cat(all_preds, dim=0)
    all_targets = torch.cat(all_targets, dim=0)
    
    mse = torch.mean((all_preds - all_targets) ** 2, dim=0) # Depth-wise MSE
    rmse = torch.sqrt(mse)
    mae = torch.mean(torch.abs(all_preds - all_targets), dim=0) # Depth-wise MAE
    
    global_rmse = torch.mean(rmse).item()
    global_mae = torch.mean(mae).item()
    
    return total_loss / len(dataloader), global_rmse, global_mae, rmse.tolist(), mae.tolist()

class EarlyStopping:
    """
    Early stops the training if validation loss doesn't improve after a given patience.
    """
    def __init__(self, patience=5, delta=0.0):
        self.patience = patience
        self.delta = delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False
        
    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
            return True # Is best
        elif val_loss > self.best_loss - self.delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
            return False
        else:
            self.best_loss = val_loss
            self.counter = 0
            return True # Is best
