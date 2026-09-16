import gradio as gr
import spaces
import sys
import os

# Add backend to path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.api.main import reconstruct_profile

# ZeroGPU strictly requires the Gradio function to be decorated
@spaces.GPU
def predict(lat, lon, date):
    # Call the exact same PyTorch function from main.py
    return reconstruct_profile(lat, lon, date)

# Create a clean Gradio API interface
demo = gr.Interface(
    fn=predict,
    inputs=[
        gr.Number(label="lat"), 
        gr.Number(label="lon"), 
        gr.Textbox(label="date")
    ],
    outputs=gr.JSON(label="output"),
    title="Ocean Embedded API",
    description="Live PyTorch ZeroGPU Inference Engine",
    api_name="reconstruct"
)

# Launch it! ZeroGPU will automatically manage this.
demo.launch()
