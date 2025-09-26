from flask import Flask
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS  
from flask_cors import CORS  

from routes.auth import bp as auth_bp
from routes.roles import bp as roles_bp
from routes.categories import bp as categories_bp
from routes.products import bp as products_bp
from routes.inventory import bp as inventory_bp
from routes.supply_requests import bp as supply_requests_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5173"}})  

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(roles_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(supply_requests_bp)

    # Root endpoint for quick API test
    @app.route("/")
    def index():
        return {"ok": True, "msg": "MyDuka API running"}

    return app

if __name__ == "__main__":
    # Run Flask in debug mode for development
    create_app().run(debug=True)

