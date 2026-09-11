import sys
import os

# Setup path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from api.main import reconstruct_profile

try:
    res = reconstruct_profile(14.66, 81.02, '2020-01-01')
    print("SUCCESS")
    print(res)
except Exception as e:
    import traceback
    print("FAILED")
    traceback.print_exc()
