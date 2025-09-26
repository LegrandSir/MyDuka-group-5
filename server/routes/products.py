from flask import Blueprint, request, jsonify
from models import db, Product, Category

bp = Blueprint("products", __name__, url_prefix="/products")


# CREATE PRODUCT

@bp.route("/", methods=["POST"])
def create_product():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    price = data.get("price")
    category_id = data.get("category_id")

    
    if not all([name, price, category_id]):
        return jsonify({"error": "Name, price, and category_id are required"}), 400

    
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category does not exist"}), 404

    product = Product(name=name, description=description, price=price, category_id=category_id)
    db.session.add(product)
    db.session.commit()

    return jsonify({
        "id": product.product_id,
        "name": product.name,
        "price": product.price,
        "category_id": product.category_id,
        "category_name": category.name
    }), 201


# GET ALL PRODUCTS

@bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.product_id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "category_id": p.category_id,
            "category_name": p.category.name if p.category else None
        }
        for p in products
    ])


# GET SINGLE PRODUCT

@bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        "id": product.product_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category_id": product.category_id,
        "category_name": product.category.name if product.category else None
    })


# UPDATE PRODUCT

@bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    if "name" in data:
        product.name = data["name"]
    if "description" in data:
        product.description = data["description"]
    if "price" in data:
        product.price = data["price"]
    if "category_id" in data:
        category = Category.query.get(data["category_id"])
        if not category:
            return jsonify({"error": "Category does not exist"}), 404
        product.category_id = data["category_id"]

    db.session.commit()

    return jsonify({
        "id": product.product_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category_id": product.category_id,
        "category_name": product.category.name if product.category else None
    })


# DELETE PRODUCT

@bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": f"Product {product_id} deleted"})
