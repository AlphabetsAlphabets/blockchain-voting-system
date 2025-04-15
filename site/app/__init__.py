from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS to allow frontend communication

    # Load configuration
    app.config.from_object(Config)

    # Import and register routes
    from app.routes import main
    app.register_blueprint(main)

    return app