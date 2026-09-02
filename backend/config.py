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
        # Read from DATABASE_URL first
        db_url = os.getenv('DATABASE_URL', '').strip()

        if db_url:
            try:
                result = urlparse(db_url)
                # urlparse handles mysql://user:pass@host:port/dbname
                host = result.hostname
                port = result.port or 3306
                user = result.username
                password = result.password
                database = result.path.lstrip('/')

                logger.info(f"Using DATABASE_URL: host={host}, port={port}, user={user}, db={database}")

                config = {
                    'host': host,
                    'port': port,
                    'user': user,
                    'password': password,
                    'database': database
                }
            except Exception as e:
                logger.error(f"Failed to parse DATABASE_URL: {e}")
                config = {
                    'host': os.getenv('DB_HOST', 'localhost'),
                    'port': int(os.getenv('DB_PORT') or 3306),
                    'user': os.getenv('DB_USER', 'root'),
                    'password': os.getenv('DB_PASSWORD', ''),
                    'database': os.getenv('DB_NAME', 'customer_management')
                }
        else:
            # Fallback to individual DB_* env vars
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
