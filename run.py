#!/usr/bin/env python3
"""
Customer Management System - Main Entry Point
Run this file to start the Flask application
"""

from backend.app import create_app
from backend.config import Config
from backend.utils.logger import logger

def main():
    """Start the Flask application"""
    try:
        app = create_app()

        logger.info("="*50)
        logger.info("Starting Customer Management System")
        logger.info("="*50)
        logger.info(f"Environment: {Config.FLASK_ENV}")
        logger.info(f"Debug Mode: {Config.FLASK_DEBUG}")
        logger.info(f"Database: {Config.DB_NAME}")
        logger.info(f"Host: http://localhost:{Config.FLASK_PORT}")
        logger.info("="*50)

        app.run(
            host='0.0.0.0',
            port=Config.FLASK_PORT,
            debug=Config.FLASK_DEBUG
        )

    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        raise

if __name__ == '__main__':
    main()
