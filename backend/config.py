import os
from dotenv import load_dotenv
from backend.utils.logger import logger
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""

    # Database configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT') or 3306)
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'customer_management')

    # Flask configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    FLASK_PORT = int(os.getenv('FLASK_PORT') or 5000)

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # Production settings
    @staticmethod
    def is_production():
        """Check if running in production"""
        return os.getenv('FLASK_ENV') == 'production'

    @staticmethod
    def get_db_config():
        """Return database configuration as dictionary.
        Supports both individual DB_* variables and a unified DATABASE_URL (Railway).
        """
        # If DATABASE_URL is provided (e.g., mysql://user:pass@host:port/dbname)
        db_url = os.getenv('DATABASE_URL')
        if db_url:
            try:
                result = urlparse(db_url)
                return {
                    'host': result.hostname or Config.DB_HOST,
                    'port': result.port or Config.DB_PORT,
                    'user': result.username or Config.DB_USER,
                    'password': result.password or Config.DB_PASSWORD,
                    'database': result.path.lstrip('/') or Config.DB_NAME
                }
            except Exception as e:
                logger.error(f"Failed to parse DATABASE_URL: {e}")
                # fall back to individual env vars below
        # Default to individual env vars
        config = {
            'host': Config.DB_HOST,
            'port': Config.DB_PORT,
            'user': Config.DB_USER,
            'password': Config.DB_PASSWORD,
            'database': Config.DB_NAME
        }
        # For production, add connection pooling settings
        if Config.is_production():
            config.update({
                'pool_name': 'cms_pool',
                'pool_size': 5,
                'pool_reset_session': True,
                'connect_timeout': 10000
            })
        return config
