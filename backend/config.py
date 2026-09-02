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
        Supports both individual DB_* variables and a unified DATABASE_URL.
        """
        db_url = os.getenv('DATABASE_URL', '').strip()
        config = None

        # Only treat as a URL if it contains a protocol like mysql:// or postgresql://
        if db_url and ('://' in db_url):
            try:
                result = urlparse(db_url)
                if result.hostname:
                    config = {
                        'host': result.hostname,
                        'port': result.port or 3306,
                        'user': result.username or 'root',
                        'password': result.password or '',
                        'database': result.path.lstrip('/') or 'customer_management'
                    }
                    logger.info(f"Loaded database config from DATABASE_URL for host: {result.hostname}")
            except Exception as e:
                logger.error(f"Failed to parse DATABASE_URL: {e}")

        # If DATABASE_URL is not set, invalid, or missing host, fall back to DB_* variables
        if not config:
            config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': int(os.getenv('DB_PORT') or 3306),
                'user': os.getenv('DB_USER', 'root'),
                'password': os.getenv('DB_PASSWORD', ''),
                'database': os.getenv('DB_NAME', 'customer_management')
            }

        # Vercel Serverless specific connection fixes
        if Config.is_production():
            # For remote cloud databases, SSL is usually required
            config['ssl_disabled'] = False
            config['ssl_verify_cert'] = False
            config['ssl_verify_identity'] = False
            config['connect_timeout'] = 10

        return config
