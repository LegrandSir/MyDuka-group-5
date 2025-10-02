from flask import Blueprint, request, jsonify 
from models import db, Category, Product

bp = Blueprint("categories", __name__, url_prefix="/categories")

# -------------------------
# CREATE CATEGORY
# -------------------------
@bp.route("", methods=["POST"], strict_slashes=False)
def create_category():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description", "")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 400

    category = Category(name=name, description=description)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        "id": category.category_id,
        "name": category.name,
        "description": category.description,
        "products": []
    }), 201


# -------------------------
# GET ALL CATEGORIES
# -------------------------
@bp.route("", methods=["GET"], strict_slashes=False)
def get_categories():
    categories = Category.query.all()
    result = []
    for c in categories:
        result.append({
            "id": c.category_id,
            "name": c.name,
            "description": c.description,
            "products": [
                {
                    "id": p.product_id,
                    "name": p.name,
                    "description": p.description,
                    "price": p.price
                }
                for p in c.products
            ]
        })
    return jsonify(result)


# -------------------------
# GET SINGLE CATEGORY
# -------------------------
@bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify({
        "id": category.category_id,
        "name": category.name,
        "description": category.description,
        "products": [
            {
                "id": p.product_id,
                "name": p.name,
                "description": p.description,
                "price": p.price
            }
            for p in category.products
        ]
    })


# -------------------------
# UPDATE CATEGORY
# -------------------------
@bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    if "name" in data:
        category.name = data["name"]
    if "description" in data:
        category.description = data["description"]

    db.session.commit()
    return jsonify({
        "id": category.category_id,
        "name": category.name,
        "description": category.description,
        "products": [
            {
                "id": p.product_id,
                "name": p.name,
                "description": p.description,
                "price": p.price
            }
            for p in category.products
        ]
    })


# -------------------------
# DELETE CATEGORY
# -------------------------
@bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": f"Category {category_id} deleted"})