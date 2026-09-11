import numpy as np
import scipy.interpolate

def interpolate_13_to_15_depths(predictions_13):
    """
    Interpolates the 13 depth levels outputted by EJS-temp-ANN to the 
    15 target depths required by the project.
    
    EJS NATIVE: [10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500]
    PROJECT TARGET: [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    """
    native_depths = np.array([10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500])
    target_depths = np.array([0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000])
    
    # We use 1D interpolation for each sample in the batch
    # 'extrapolate' is used for depths outside the 10-500m range (e.g. 0m, 1000m)
    # WARNING: Extrapolating to 1000m from 500m is scientifically risky, but necessary 
    # for the zero-shot transfer test until we fine-tune a custom output head.
    
    interpolator = scipy.interpolate.interp1d(
        native_depths, 
        predictions_13, 
        axis=-1, 
        kind='linear', 
        fill_value='extrapolate'
    )
    
    return interpolator(target_depths)

def format_inputs_for_ejs_ann(sst_patch, ssh_patch, climatology_scalars):
    """
    Takes 0.25 deg North Indian Ocean data patches and regrids/formats them
    to exactly match the (25, 25, 2) tensor expected by EJS-temp-ANN.
    """
    # Placeholder for actual spatial regridding logic (e.g., using xarray.interp)
    # EJS expected a 1/12 degree grid (approx 9km), our data is 0.25 degree (approx 25km).
    # We must upsample the 0.25 deg data to 1/12 deg over a 25x25 grid centered on the target.
    
    # For now, return the dummy shape so the pipeline can execute
    spatial_tensor = np.zeros((1, 25, 25, 2)) 
    aux_tensor = np.zeros((1, 10))
    
    return spatial_tensor, aux_tensor
