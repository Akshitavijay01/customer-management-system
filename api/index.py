import sys
import os

# Add the project root to Python path
project_root = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, project_root)

# Create Flask app at module scope — Vercel requires 'app' visible here
from backend.app import create_app

app = create_app()