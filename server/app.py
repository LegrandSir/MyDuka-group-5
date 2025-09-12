from flask import Flask, jsonify
from config import Config
from models import db, Product
from flask_migrate import Migrate  

app = Flask(__name__)
app.config.from_object(Config)

# Initialize database and migrations
db.init_app(app)
migrate = Migrate(app, db)  

@app.route("/")
def index():
    return jsonify({"message": "My Duka API is running!"}), 200

@app.route("/products")
def products():
    products = Product.query.all()
    if products:
        data = [p.to_dict() for p in products]
    else:
        data = [
            {"id": 1, "name": "iPhone 12", "price": 55000},
            {"id": 2, "name": "iPhone 13", "price": 80000},
            {"id": 3, "name": "iPhone 14", "price": 120000},
        ]
    return jsonify(data), 200

if __name__ == "__main__":
    app.run(debug=True)
