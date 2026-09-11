import torch
import torch.nn as nn

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
        # Exponentiate log_var to get actual variance (added small epsilon for numeric stability)
        variance = torch.exp(pred_log_var) + 1e-6
        
        # Calculate NLL
        loss = 0.5 * (torch.pow(target - pred_mean, 2) / variance) + 0.5 * pred_log_var
        
        return loss.mean() # Mean over batch and depth dimensions

# Minimal Training Loop Skeleton (Stage 7)
def train_epoch(model, dataloader, optimizer, criterion, device):
    model.train()
    total_loss = 0
    
    for spatial_inputs, aux_inputs, targets in dataloader:
        spatial_inputs = spatial_inputs.to(device)
        aux_inputs = aux_inputs.to(device)
        targets = targets.to(device)
        
        optimizer.zero_grad()
        
        # Forward pass (Mixed Precision could be added here)
        temp_pred, log_var_pred = model(spatial_inputs, aux_inputs)
        
        # Calculate Loss
        loss = criterion(temp_pred, log_var_pred, targets)
        
        # Backward pass
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        
    return total_loss / len(dataloader)
