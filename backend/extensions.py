from flask_cors import CORS

def init_extensions(app):
    """Initialize Flask extensions"""
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:5000",
                "https://customer-management-system-p38bw6htv-akshitavijay01.vercel.app",
                "https://*.vercel.app",
                "https://*.railway.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type"]
        }
    })
