import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""

    # Database configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'customer_management')

    # Flask configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # Production settings
    @staticmethod
    def is_production():
        """Check if running in production"""
        return os.getenv('FLASK_ENV') == 'production'

    @staticmethod
    def get_db_config():
        """Return database configuration as dictionary"""
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
