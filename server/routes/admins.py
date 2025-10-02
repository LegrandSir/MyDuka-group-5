from flask import Blueprint, request, jsonify
from models import db, User, Role, RoleEnum
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("admins", __name__, url_prefix="/admins")

@bp.route("/", methods=["POST", "OPTIONS"])
@jwt_required()
def create_admin():
    identity = get_jwt_identity()
    if identity["role"] != RoleEnum.MERCHANT.value:
        return jsonify({"msg":"Only merchant can create admins"}), 403

    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    store_id = data.get("store_id")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"User already exists"}), 400

    admin_role = Role.query.filter_by(name=RoleEnum.ADMIN.value).first()
    if not admin_role:
        return jsonify({"msg":"Admin role missing"}), 500

    user = User(name=name, email=email, role_id=admin_role.role_id, store_id=store_id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg":"admin_created", "user_id": user.user_id}), 201
