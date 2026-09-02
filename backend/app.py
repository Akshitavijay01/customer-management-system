from flask import Flask, jsonify, send_from_directory
from backend.config import Config
from backend.extensions import init_extensions
from backend.routes import customer_bp
from backend.utils.logger import logger
import os
import mysql.connector

def create_app():
    """Application factory"""

    # Get the frontend directory path (one level up from backend)
    backend_dir = os.path.dirname(__file__)
    project_root = os.path.dirname(backend_dir)
    frontend_dir = os.path.join(project_root, 'frontend')

    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    init_extensions(app)

    # Auto-migrate: create tables if they don't exist
    _auto_migrate()

    # Register API blueprints FIRST (so /api/* routes take precedence)
    app.register_blueprint(customer_bp)

    # Serve frontend HTML
    @app.route('/')
    def serve_index():
        return send_from_directory(frontend_dir, 'index.html')

    # Serve CSS files
    @app.route('/css/<path:filename>')
    def serve_css(filename):
        return send_from_directory(os.path.join(frontend_dir, 'css'), filename)

    # Serve JS files
    @app.route('/js/<path:filename>')
    def serve_js(filename):
        return send_from_directory(os.path.join(frontend_dir, 'js'), filename)

    # Health check
    @app.route('/health')
    def health():
        return jsonify({
            'success': True,
            'message': 'API is running',
            'status': 'healthy'
        })

    # Debug DB configuration safely (masks password)
    @app.route('/api/db-status')
    def db_status():
        db_cfg = Config.get_db_config()
        # Mask sensitive data
        safe_cfg = {
            'host': db_cfg.get('host'),
            'port': db_cfg.get('port'),
            'user': db_cfg.get('user'),
            'database': db_cfg.get('database'),
            'has_password': bool(db_cfg.get('password')),
            'has_database_url': bool(os.getenv('DATABASE_URL')),
            'flask_env': os.getenv('FLASK_ENV')
        }
        return jsonify({
            'success': True,
            'config': safe_cfg
        })

    # Explicit migration endpoint — run once to create tables
    @app.route('/api/migrate')
    def migrate():
        _auto_migrate()
        # Check if table exists
        try:
            db_cfg = Config.get_db_config()
            for key in ['pool_name', 'pool_size', 'pool_reset_session']:
                db_cfg.pop(key, None)
            conn = mysql.connector.connect(**db_cfg)
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES LIKE 'customers'")
            exists = cursor.fetchone() is not None
            cursor.close()
            conn.close()
            return jsonify({
                'success': True,
                'message': 'Migration complete',
                'customers_table_exists': exists
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
            }), 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found',
            'data': None
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'data': None
        }), 500

    logger.info("Flask application created successfully")
    logger.info(f"Frontend directory: {frontend_dir}")
    return app


def _auto_migrate():
    """Create required tables if they don't exist. Runs once per cold start."""
    try:
        db_config = Config.get_db_config()
        # Remove pooling keys that cause issues in serverless
        for key in ['pool_name', 'pool_size', 'pool_reset_session']:
            db_config.pop(key, None)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id VARCHAR(50) NOT NULL UNIQUE,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(20),
                address VARCHAR(255),
                city VARCHAR(50),
                state VARCHAR(50),
                postal_code VARCHAR(20),
                date_of_birth DATE,
                gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_customer_id (customer_id),
                INDEX idx_email (email),
                INDEX idx_name (first_name, last_name),
                INDEX idx_city (city),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)

        conn.commit()
        cursor.close()
        conn.close()
        logger.info("Auto-migrate: customers table verified/created successfully")
    except Exception as e:
        logger.error(f"Auto-migrate failed (non-fatal): {e}")
