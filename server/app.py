from flask import Flask
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS  

from routes.auth import bp as auth_bp
from routes.roles import bp as roles_bp  

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS setup
    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"]
    )

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(roles_bp)  

    @app.route("/")
    def index():
        return {"ok": True, "msg": "MyDuka API running"}

    return app

if __name__ == "__main__":   # ✅ fix here
    create_app().run(debug=True)
