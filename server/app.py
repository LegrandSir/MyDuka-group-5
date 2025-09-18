from flask import Flask
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from routes.auth import bp as auth_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Blueprints
    app.register_blueprint(auth_bp)
    # app.register_blueprint(products_bp)

    @app.route("/")
    def index():
        return {"ok": True, "msg": "User Auth API running"}

    return app

if __name__ == "__main__":
    create_app().run(debug=True)
