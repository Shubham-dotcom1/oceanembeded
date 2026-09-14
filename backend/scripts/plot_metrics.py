import os
import sys
import json
import matplotlib
matplotlib.use('Agg') # Prevent UI hang
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    report_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../reports'))
    metrics_file = os.path.join(report_dir, 'final_metrics.json')
    plots_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../reports/plots'))
    os.makedirs(plots_dir, exist_ok=True)
    
    if not os.path.exists(metrics_file):
        print(f"Error: {metrics_file} not found. Run train_full.py first.")
        return
        
    with open(metrics_file, 'r') as f:
        metrics = json.load(f)
        
    # --- 1. Depth-wise RMSE Profile ---
    depths = []
    rmses = []
    for d_str, rmse in metrics['depth_wise_rmse'].items():
        depths.append(int(d_str))
        rmses.append(rmse)
        
    sns.set_theme(style="whitegrid", context="talk")
    plt.figure(figsize=(8, 10))
    
    # Invert Y-axis for ocean depth profile
    plt.plot(rmses, depths, marker='o', linewidth=3, color='#1E88E5', markersize=8)
    plt.gca().invert_yaxis()
    
    plt.title("NAUTILUS V2: Subsurface Depth-wise RMSE", pad=20, fontweight='bold')
    plt.xlabel("Root Mean Square Error (°C)", fontweight='bold')
    plt.ylabel("Depth (Meters)", fontweight='bold')
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Fill between for aesthetic
    plt.fill_betweenx(depths, 0, rmses, alpha=0.2, color='#1E88E5')
    plt.xlim(left=0)
    
    rmse_plot_path = os.path.join(plots_dir, 'depth_wise_rmse.png')
    plt.savefig(rmse_plot_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    # --- 2. Learning Curves ---
    history = metrics.get('training_history', {})
    if history and len(history.get('train_loss', [])) > 0:
        epochs = range(1, len(history['train_loss']) + 1)
        
        plt.figure(figsize=(10, 6))
        plt.plot(epochs, history['train_loss'], label='Train NLL Loss', color='#D81B60', linewidth=2.5)
        plt.plot(epochs, history['val_loss'], label='Val NLL Loss', color='#FFC107', linewidth=2.5)
        
        plt.title("NAUTILUS V2: Training vs Validation Loss", pad=20, fontweight='bold')
        plt.xlabel("Epoch", fontweight='bold')
        plt.ylabel("Loss (Negative Log-Likelihood)", fontweight='bold')
        plt.legend()
        plt.grid(True, linestyle='--', alpha=0.7)
        
        lc_plot_path = os.path.join(plots_dir, 'learning_curve.png')
        plt.savefig(lc_plot_path, dpi=300, bbox_inches='tight')
        plt.close()
        
    print(f"Publication-ready plots generated in: {plots_dir}")

if __name__ == "__main__":
    main()
