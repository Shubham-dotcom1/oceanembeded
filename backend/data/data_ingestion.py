import os
import copernicusmarine
from dotenv import load_dotenv

# Fix for PostgreSQL TLS Certificate errors in Windows
os.environ.pop('CURL_CA_BUNDLE', None)
os.environ.pop('REQUESTS_CA_BUNDLE', None)

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

def download_glorys_and_wind(out_dir):
    """
    Downloads a 1-month subset (Jan 2020) of GLORYS12V1 and CMEMS Winds 
    for the Bay of Bengal pilot training.
    """
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    target_date = "2020-01-01"
    end_date = "2020-01-31" # 1 month pilot
    
    # Bay of Bengal Bounding Box
    min_lon, max_lon = 80.0, 100.0
    min_lat, max_lat = 5.0, 25.0
    
    username = os.environ.get("COPERNICUS_MARINE_SERVICE_USERNAME")
    password = os.environ.get("COPERNICUS_MARINE_SERVICE_PASSWORD")

    print("1. Downloading GLORYS12V1 (Ocean Physics)...")
    glorys_file = os.path.join(out_dir, "glorys_bob_pilot.nc")
    if os.path.exists(glorys_file):
        os.remove(glorys_file)
        
    try:
        copernicusmarine.subset(
            dataset_id="cmems_mod_glo_phy_my_0.083deg_P1D-m", # GLORYS12V1 Daily Mean
            variables=["thetao", "so", "zos", "uo", "vo"],
            start_datetime=target_date,
            end_datetime=end_date,
            minimum_longitude=min_lon,
            maximum_longitude=max_lon,
            minimum_latitude=min_lat,
            maximum_latitude=max_lat,
            minimum_depth=0.0,
            maximum_depth=1000.0,
            output_directory=out_dir,
            output_filename="glorys_bob_pilot.nc",
            username=username,
            password=password
        )
        print("GLORYS download complete!")
    except Exception as e:
        import traceback
        print(f"GLORYS download failed:")
        traceback.print_exc()

    print("\n2. Downloading Blended Wind...")
    wind_file = os.path.join(out_dir, "wind_bob_pilot.nc")
    if os.path.exists(wind_file):
        os.remove(wind_file)
        
    try:
        copernicusmarine.subset(
            dataset_id="WIND_GLO_PHY_L4_MY_012_006", # Multi-Year Global Wind
            variables=["eastward_wind", "northward_wind"],
            start_datetime=target_date,
            end_datetime=end_date,
            minimum_longitude=min_lon,
            maximum_longitude=max_lon,
            minimum_latitude=min_lat,
            maximum_latitude=max_lat,
            output_directory=out_dir,
            output_filename="wind_bob_pilot.nc",
            username=username,
            password=password
        )
        print("Wind download complete!")
    except Exception as e:
        import traceback
        print(f"Wind download failed:")
        traceback.print_exc()

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'raw_nio'))
    download_glorys_and_wind(out_dir)
    print("\nNext step: Run backend/scripts/train_pilot.py to start training!")
