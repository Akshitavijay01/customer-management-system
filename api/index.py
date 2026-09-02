import sys
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Add the project root to Python path
    project_root = os.path.join(os.path.dirname(__file__), "..")
    sys.path.insert(0, project_root)
    logger.info(f"Added {project_root} to Python path")

    # Import and create the Flask app
    from backend.app import create_app
    app = create_app()
    logger.info("Flask app created successfully")

except Exception as e:
    logger.error(f"Failed to create Flask app: {e}")
    # Create a minimal Flask app for error handling
    from flask import Flask, jsonify
    app = Flask(__name__)

    @app.route('/<path:path>')
    def error_handler(path):
        return jsonify({
            "success": False,
            "message": "Server initialization failed",
            "error": str(e),
            "path": path
        }), 500