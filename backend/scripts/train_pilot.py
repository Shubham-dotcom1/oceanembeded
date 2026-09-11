import os
import sys
import torch
from torch.utils.data import DataLoader, Subset

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model.pytorch_nio.architecture import OceanEmbeddedNIO
from training.trainer import HeteroscedasticNLLLoss, train_epoch
from data.dataset import OceanSatDataset

def main():
    print("=== SIH 2026: North Indian Ocean Pilot Training ===")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # 1. Setup Data Paths
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw_nio'))
    glorys_path = os.path.join(data_dir, 'glorys_bob_pilot.nc')
    wind_path = os.path.join(data_dir, 'wind_bob_pilot.nc')
    
    # 2. Initialize Dataset
    dataset = OceanSatDataset(glorys_path, wind_path, patch_size=25)
    
    if dataset.is_synthetic:
        print("\n[!] USING SYNTHETIC DATA.")
        print("Please run `python backend/data/data_ingestion.py` first to download real GLORYS data.")
        
    # For the pilot, if the dataset is large, we take a random subset (e.g. 1000 samples)
    # to ensure it trains in minutes on the laptop.
    max_samples = 1000
    if len(dataset) > max_samples and not dataset.is_synthetic:
        print(f"\nSubsetting dataset from {len(dataset)} to {max_samples} for pilot speed...")
        indices = torch.randperm(len(dataset))[:max_samples]
        dataset = Subset(dataset, indices)
        
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    # 3. Initialize Model & Training Tools
    model = OceanEmbeddedNIO().to(device)
    criterion = HeteroscedasticNLLLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    
    # 4. Train Loop
    epochs = 10
    print(f"\nStarting training for {epochs} epochs on {len(dataset)} samples...")
    
    for epoch in range(1, epochs + 1):
        loss = train_epoch(model, dataloader, optimizer, criterion, device)
        print(f"Epoch {epoch:02d}/{epochs:02d} - NLL Loss: {loss:.4f}")
        
    # 5. Save Pilot Checkpoint
    checkpoint_dir = os.path.join(os.path.dirname(__file__), '../model/checkpoints')
    os.makedirs(checkpoint_dir, exist_ok=True)
    save_path = os.path.join(checkpoint_dir, 'pilot_model.pth')
    
    torch.save(model.state_dict(), save_path)
    print(f"\nTraining complete. Model saved to {save_path}")
    print("Next step: Hook this trained model into FastAPI for the frontend!")

if __name__ == "__main__":
    main()
