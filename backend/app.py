from flask import Flask, jsonify, send_from_directory
from backend.config import Config
from backend.extensions import init_extensions
from backend.routes import customer_bp
from backend.utils.logger import logger
import os

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
