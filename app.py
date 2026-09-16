import gradio as gr
import sys
import os

# Add backend to path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.api.main import app as fastapi_app

# Create a minimal dummy Gradio interface to satisfy HF Spaces
def welcome_message():
    return "Ocean Embedded API is actively running! The live PyTorch inference engine is hosted here. Please connect your Vercel frontend to this URL."

with gr.Blocks(theme=gr.themes.Monochrome()) as demo:
    gr.Markdown("# Ocean Embedded NAUTILUS V2 API")
    gr.Markdown(welcome_message())

# This is the magic trick: We mount our actual FastAPI app into the Gradio space!
# HF Spaces will run this file, and our API will be available at the root URL.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")
