from flask import Blueprint, request, jsonify
from models import db, Role

bp = Blueprint("roles", __name__, url_prefix="/roles")

# Create a role
@bp.route("/", methods=["POST"])
def create_role():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"error": "Role name is required"}), 400

    if Role.query.filter_by(name=name).first():
        return jsonify({"error": "Role already exists"}), 400

    role = Role(name=name, description=description)
    db.session.add(role)
    db.session.commit()

    return jsonify({"id": role.role_id, "name": role.name, "description": role.description}), 201


# Get all roles
@bp.route("/", methods=["GET"])
def get_roles():
    roles = Role.query.all()
    return jsonify([
        {"id": r.role_id, "name": r.name, "description": r.description}
        for r in roles
    ])


# Get single role
@bp.route("/<int:role_id>", methods=["GET"])
def get_role(role_id):
    role = Role.query.get_or_404(role_id)
    return jsonify({"id": role.role_id, "name": role.name, "description": role.description})


# Update a role
@bp.route("/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    role = Role.query.get_or_404(role_id)
    data = request.get_json()

    if "name" in data:
        role.name = data["name"]
    if "description" in data:
        role.description = data["description"]

    db.session.commit()
    return jsonify({"id": role.role_id, "name": role.name, "description": role.description})


# Delete a role
@bp.route("/<int:role_id>", methods=["DELETE"])
def delete_role(role_id):
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": f"Role {role_id} deleted"})
