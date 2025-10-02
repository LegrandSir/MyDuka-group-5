from flask import Blueprint, request, jsonify
from models import db, Store

bp = Blueprint("stores", __name__, url_prefix="/stores")

@bp.route("/", methods=["GET"])
def get_stores():
    stores = Store.query.all()
    return jsonify([{"id": s.id, "name": s.name, "location": s.location} for s in stores])

@bp.route("/", methods=["POST"])
def create_store():
    data = request.get_json()
    store = Store(name=data.get("name"), location=data.get("location"))
    db.session.add(store)
    db.session.commit()
    return jsonify({"msg": "Store created", "id": store.id}), 201
