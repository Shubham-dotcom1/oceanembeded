import numpy as np
from sklearn.metrics import root_mean_squared_error, mean_absolute_error

def calculate_falsification_metrics(predicted_temp, argo_temp):
    """
    Computes rigorous falsification metrics against ARGO ground truth.
    predicted_temp: array-like of predicted temperature profiles
    argo_temp: array-like of true ARGO temperature profiles (must match depths)
    """
    predicted = np.array(predicted_temp).flatten()
    actual = np.array(argo_temp).flatten()
    
    # Remove NaN values (common in unaligned ocean grids)
    valid_mask = ~np.isnan(actual) & ~np.isnan(predicted)
    valid_pred = predicted[valid_mask]
    valid_actual = actual[valid_mask]
    
    if len(valid_pred) == 0:
        return {"error": "No valid intersecting data points for validation"}

    rmse = root_mean_squared_error(valid_actual, valid_pred)
    mae = mean_absolute_error(valid_actual, valid_pred)
    bias = np.mean(valid_pred - valid_actual)
    r2 = np.corrcoef(valid_actual, valid_pred)[0, 1] ** 2 if len(valid_actual) > 1 else 0

    return {
        "rmse": float(rmse),
        "mae": float(mae),
        "bias": float(bias),
        "r2_score": float(r2),
        "n_samples": len(valid_actual)
    }

if __name__ == "__main__":
    print("--- Falsification Suite Scaffold ---")
    print("Testing metrics with dummy data...")
    dummy_pred = [26.0, 24.0, 20.0, 15.0, 10.0]
    dummy_true = [26.2, 23.8, 19.5, 14.8, 10.1]
    
    metrics = calculate_falsification_metrics(dummy_pred, dummy_true)
    for k, v in metrics.items():
        print(f"{k.upper()}: {v:.4f}")
