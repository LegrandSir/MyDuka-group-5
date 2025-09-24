from flask import Blueprint, request, jsonify
from models import db, SupplyRequest, Product, Store, User

bp = Blueprint("supply_requests", __name__, url_prefix="/supply_requests")

# -------------------------
# GET all supply requests
# -------------------------
@bp.route("/", methods=["GET"])
def get_all_requests():
    requests = SupplyRequest.query.all()
    return jsonify([
        {
            "id": r.request_id,
            "product_id": r.product_id,
            "product_name": r.product.name if r.product else None,
            "store_id": r.store_id,
            "store_name": r.store.name if r.store else None,
            "quantity": r.quantity,
            "requested_by": r.requested_by,
            "requester_name": r.user.name if r.user else None,
            "status": r.status,
            "created_at": r.created_at
        } for r in requests
    ])

# -------------------------
# GET single supply request
# -------------------------
@bp.route("/<int:request_id>", methods=["GET"])
def get_request(request_id):
    r = SupplyRequest.query.get_or_404(request_id)
    return jsonify({
        "id": r.request_id,
        "product_id": r.product_id,
        "product_name": r.product.name if r.product else None,
        "store_id": r.store_id,
        "store_name": r.store.name if r.store else None,
        "quantity": r.quantity,
        "requested_by": r.requested_by,
        "requester_name": r.user.name if r.user else None,
        "status": r.status,
        "created_at": r.created_at
    })

# -------------------------
# POST create new supply request
# -------------------------
@bp.route("/", methods=["POST"])
def create_request():
    data = request.get_json()
    product_id = data.get("product_id")
    store_id = data.get("store_id")
    quantity = data.get("quantity")
    requested_by = data.get("requested_by")

    # Validate required fields
    if not all([product_id, store_id, quantity, requested_by]):
        return jsonify({"error": "All fields are required"}), 400

    # Validate existence
    if not Product.query.get(product_id):
        return jsonify({"error": "Product does not exist"}), 404
    if not Store.query.get(store_id):
        return jsonify({"error": "Store does not exist"}), 404
    if not User.query.get(requested_by):
        return jsonify({"error": "User does not exist"}), 404

    req = SupplyRequest(
        product_id=product_id,
        store_id=store_id,
        quantity=quantity,
        requested_by=requested_by,
        status=data.get("status", "pending")
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({
        "id": req.request_id,
        "product_id": req.product_id,
        "store_id": req.store_id,
        "quantity": req.quantity,
        "requested_by": req.requested_by,
        "status": req.status
    }), 201

# -------------------------
# PUT update supply request status
# -------------------------
@bp.route("/<int:request_id>", methods=["PUT"])
def update_request(request_id):
    req = SupplyRequest.query.get_or_404(request_id)
    data = request.get_json()
    if "status" in data:
        req.status = data["status"]
    db.session.commit()
    return jsonify({
        "id": req.request_id,
        "status": req.status
    })

# -------------------------
# DELETE a supply request
# -------------------------
@bp.route("/<int:request_id>", methods=["DELETE"])
def delete_request(request_id):
    req = SupplyRequest.query.get_or_404(request_id)
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": f"Supply request {request_id} deleted"})

