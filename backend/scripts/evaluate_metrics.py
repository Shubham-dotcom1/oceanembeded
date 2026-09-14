import os
import sys
import torch
import numpy as np
from sklearn.metrics import r2_score
from torch.utils.data import DataLoader
from tqdm import tqdm
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.dataset import OceanSatDataset, get_chronological_splits
from model.pytorch_nio.architecture import OceanEmbeddedNIO

def main():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw_nio'))
    glorys_path = os.path.join(data_dir, 'glorys_bob_pilot.nc')
    dataset = OceanSatDataset(glorys_path, "", patch_size=25)
    _, _, test_set = get_chronological_splits(dataset, train_ratio=0.7, val_ratio=0.15)
    
    batch_size = 1024 if device.type == 'cuda' else 32
    test_loader = DataLoader(test_set, batch_size=batch_size, shuffle=False, pin_memory=True)
    
    model = OceanEmbeddedNIO().to(device)
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/checkpoints/nautilus_best_model.pth'))
    model.load_state_dict(torch.load(model_path))
    model.eval()
    
    all_targets = []
    all_preds = []
    
    print("Evaluating Test Set for R^2 and Pitch Deck Metrics...")
    with torch.no_grad():
        for spatial_x, aux_x, targets in tqdm(test_loader):
            spatial_x = spatial_x.to(device)
            aux_x = aux_x.to(device)
            targets = targets.numpy()
            
            pred_mean, _ = model(spatial_x, aux_x)
            pred_mean = pred_mean.cpu().numpy()
            
            all_targets.append(targets)
            all_preds.append(pred_mean)
            
    all_targets = np.vstack(all_targets)
    all_preds = np.vstack(all_preds)
    
    # Calculate R2
    global_r2 = r2_score(all_targets.flatten(), all_preds.flatten())
    
    # R2 per depth
    depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    depth_r2 = {}
    for i, d in enumerate(depths):
        depth_r2[str(d)] = r2_score(all_targets[:, i], all_preds[:, i])
        
    print("\n=== FINAL PITCH DECK METRICS ===")
    print(f"Global R^2 Score: {global_r2:.4f}")
    
    # Append to existing json
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../reports/final_metrics.json'))
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
            
        metrics['global_r2'] = global_r2
        metrics['depth_wise_r2'] = depth_r2
        
        with open(metrics_path, 'w') as f:
            json.dump(metrics, f, indent=4)
            
    print("Metrics successfully updated in reports/final_metrics.json")

if __name__ == "__main__":
    main()
