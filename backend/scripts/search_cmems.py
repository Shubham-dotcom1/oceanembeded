import copernicusmarine

def search_catalog():
    print("Loading CMEMS Catalog...")
    catalogue = copernicusmarine.read_catalogue()
    
    print("\n--- GLORYS DATASETS ---")
    for product in catalogue.products:
        if "GLOBAL_MULTIYEAR_PHY_001_030" in product.product_id:
            for dataset in product.datasets:
                print(f"Dataset ID: {dataset.dataset_id}")
                
    print("\n--- WIND DATASETS ---")
    for product in catalogue.products:
        if "WIND_GLO_WIND_L4_REP_OBSERVATIONS_012_006" in product.product_id:
            for dataset in product.datasets:
                print(f"Dataset ID: {dataset.dataset_id}")

if __name__ == "__main__":
    search_catalog()
