import numpy as np
import sys
import os

# Add the model directory to the path so we can import S99_build_model
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/ejs_temp_ann')))

from S99_build_model import build_ejs_temp_ann, EJS_NATIVE_DEPTHS

def run_inference_test():
    """
    Test script to verify that the EJS-temp-ANN architecture can successfully
    compile and run inference using placeholder (dummy) data of the correct shape.
    This fulfills Phase 1 verification without requiring real data yet.
    """
    print("--- Phase 1: Standalone Inference Verification ---")
    
    # 1. Initialize the model
    print("1. Initializing EJS-temp-ANN Model...")
    model = build_ejs_temp_ann(
        spatial_input_shape=(25, 25, 2), # e.g. SST, SSH patches
        aux_input_shape=(10,),           # e.g. scalars like date/climatology
        output_dim=13
    )
    
    # 2. Generate Dummy Data (simulating 1 location)
    print("2. Generating synthetic input data matching required tensor shapes...")
    dummy_spatial = np.random.normal(loc=0.0, scale=1.0, size=(1, 25, 25, 2))
    dummy_aux = np.random.normal(loc=0.0, scale=1.0, size=(1, 10))
    
    # 3. Run Inference
    print("3. Running Model Inference...")
    predictions = model.predict([dummy_spatial, dummy_aux])
    
    # 4. Verify Output Format
    print("\n--- INFERENCE SUCCESSFUL ---")
    print(f"Input spatial shape: {dummy_spatial.shape}")
    print(f"Input auxiliary shape: {dummy_aux.shape}")
    print(f"Predicted shape: {predictions.shape} (Expected: (1, 13))")
    
    print("\nSample Predicted Subsurface Temperature (°C):")
    for depth, temp in zip(EJS_NATIVE_DEPTHS, predictions[0]):
        # The values will be random since weights aren't trained/loaded,
        # but it verifies the graph execution works end-to-end.
        print(f"  {depth:4d}m : {temp:>6.2f} °C")

if __name__ == "__main__":
    run_inference_test()
