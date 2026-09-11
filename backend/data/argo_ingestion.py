import copernicusmarine
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

def fetch_argo_telemetry(
    output_dir, 
    start_date="2024-01-01", 
    end_date="2024-01-02",
    min_lon=80.0, 
    max_lon=100.0, 
    min_lat=0.0, 
    max_lat=25.0
):
    """
    Fetches independent ARGO float telemetry (ground truth) from CMEMS
    for the North Indian Ocean bounding box to validate the zero-shot model.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    dataset_id = "INSITU_GLO_PHY_TS_DISCRETE_MY_013_030" # ARGO Dataset ID
    filename = f"argo_nio_{start_date}.nc"
    
    print("Fetching ARGO ground-truth telemetry...")
    try:
        copernicusmarine.subset(
            dataset_id=dataset_id,
            variables=["TEMP", "PRES"],
            start_datetime=start_date,
            end_datetime=end_date,
            minimum_longitude=min_lon,
            maximum_longitude=max_lon,
            minimum_latitude=min_lat,
            maximum_latitude=max_lat,
            output_directory=output_dir,
            output_filename=filename,
            force_download=True
        )
        print(f"ARGO data successfully saved to {output_dir}/{filename}")
    except Exception as e:
        print(f"Failed to fetch ARGO telemetry: {e}")

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'raw_nio'))
    fetch_argo_telemetry(out_dir)
