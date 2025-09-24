from flask import Blueprint, request, jsonify
from models import db, Inventory, Product

bp = Blueprint("inventory", __name__, url_prefix="/inventory")

# GET all inventory
@bp.route("/", methods=["GET"])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([
        {
            "id": i.inventory_id,
            "product_id": i.product_id,
            "product_name": i.product.name if i.product else None,
            "quantity": i.quantity,
            "updated_at": i.updated_at
        } for i in items
    ])

# GET single inventory item
@bp.route("/<int:inventory_id>", methods=["GET"])
def get_inventory_item(inventory_id):
    item = Inventory.query.get_or_404(inventory_id)
    return jsonify({
        "id": item.inventory_id,
        "product_id": item.product_id,
        "product_name": item.product.name if item.product else None,
        "quantity": item.quantity,
        "updated_at": item.updated_at
    })

# POST add inventory
@bp.route("/", methods=["POST"])
def add_inventory():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 0)

    if not product_id:
        return jsonify({"error": "product_id is required"}), 400

    if not Product.query.get(product_id):
        return jsonify({"error": "Product does not exist"}), 404

    item = Inventory(product_id=product_id, quantity=quantity)
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.inventory_id, "product_id": item.product_id, "quantity": item.quantity}), 201

# PUT update quantity
@bp.route("/<int:inventory_id>", methods=["PUT"])
def update_inventory(inventory_id):
    item = Inventory.query.get_or_404(inventory_id)
    data = request.get_json()
    if "quantity" in data:
        item.quantity = data["quantity"]
    db.session.commit()
    return jsonify({"id": item.inventory_id, "product_id": item.product_id, "quantity": item.quantity})

# DELETE inventory item
@bp.route("/<int:inventory_id>", methods=["DELETE"])
def delete_inventory(inventory_id):
    item = Inventory.query.get_or_404(inventory_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": f"Inventory item {inventory_id} deleted"})
