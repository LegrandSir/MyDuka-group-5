from flask import Blueprint, request, jsonify, current_app, url_for
from models import db, User, Store, Invitation, Role, RoleEnum
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import uuid
from utils.email import send_email

bp = Blueprint("auth", __name__, url_prefix="/auth")

def get_serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def role_name_from_id(role_id):
    role = Role.query.filter_by(role_id=role_id).first()
    return role.name if role else None

@bp.route("/create-superuser", methods=["POST"])
def create_superuser():
    """
    One-time endpoint to create the merchant (superuser).
    Protect using X-SETUP-SECRET header = SECRET_KEY (or remove endpoint in prod).
    """
    data = request.get_json() or {}
    secret = request.headers.get("X-SETUP-SECRET")
    expected = current_app.config.get("SETUP_SECRET") or current_app.config.get("SECRET_KEY")
    if secret != expected:
        return jsonify({"msg":"Forbidden"}), 403

    email = data.get("email")
    name = data.get("name", "Merchant")
    password = data.get("password")
    if not (email and password):
        return jsonify({"msg":"email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"user exists"}), 400

    # find merchant role id
    merchant_role = Role.query.filter_by(name=RoleEnum.MERCHANT.value).first()
    if not merchant_role:
        return jsonify({"msg":"merchant role not found; run role seed"}), 500

    u = User(name=name, email=email, role_id=merchant_role.role_id)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()
    return jsonify({"msg":"merchant created", "user_id": u.user_id})

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    print("DEBUG: Received data ->", data)
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msg": "Both 'email' and 'password' fields are required", "received": data}), 400
    

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg":"Invalid credentials"}), 401
    if not user.active:
        return jsonify({"msg":"Account inactive"}), 403

    role = role_name_from_id(user.role_id)
    access_token = create_access_token(identity={"user_id": user.user_id, "role": role})
    return jsonify({"access_token": access_token, "user": {"user_id": user.user_id, "email": user.email, "role": role}})

@bp.route("/invite", methods=["POST"])
@jwt_required()
def invite():
    """
    Merchant can invite admins (store admins). Admins can create clerks (or merchant can invite them).
    Body: { "email": "...", "role_id": 2, "store_id": 1 }
    """
    identity = get_jwt_identity()
    if identity["role"] != RoleEnum.MERCHANT.value:
        return jsonify({"msg":"Only merchant can invite"}), 403

    data = request.get_json() or {}
    email = data.get("email")
    role_id = data.get("role_id")
    store_id = data.get("store_id")

    # Validate role exists and is admin or clerk
    role = Role.query.filter_by(role_id=role_id).first()
    if not role or role.name not in (RoleEnum.ADMIN.value, RoleEnum.CLERK.value):
        return jsonify({"msg":"Invalid role for invite"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"User already exists"}), 400

    serializer = get_serializer()
    token = serializer.dumps({"email": email, "role_id": role_id, "store_id": store_id, "nonce": str(uuid.uuid4())})
    inv = Invitation(email=email, invited_by=identity["user_id"], role_id=role_id, store_id=store_id, token=token)
    db.session.add(inv)
    db.session.commit()

    register_url = request.host_url.rstrip("/") + url_for("auth.register") + f"?token={token}"
    body = f"You have been invited as {role.name}. Register using this link (expires in {current_app.config['INVITE_TOKEN_EXP_SECONDS']} seconds):\n\n{register_url}"
    send_email(email, "You are invited to join", body)
    return jsonify({"msg":"invitation_sent", "register_url": register_url})

@bp.route("/register", methods=["GET", "POST"])
def register():
    token = request.args.get("token") or (request.get_json() or {}).get("token")
    if not token:
        return jsonify({"msg":"token required"}), 400

    serializer = get_serializer()
    try:
        data = serializer.loads(token, max_age=current_app.config["INVITE_TOKEN_EXP_SECONDS"])
    except SignatureExpired:
        return jsonify({"msg":"token_expired"}), 400
    except BadSignature:
        return jsonify({"msg":"invalid_token"}), 400

    inv = Invitation.query.filter_by(token=token, email=data["email"]).first()
    if not inv or inv.used:
        return jsonify({"msg":"invalid_or_used_token"}), 400

    if request.method == "GET":
        # return invite preview for frontend
        role = Role.query.filter_by(role_id=data["role_id"]).first()
        return jsonify({"email": data["email"], "role": role.name if role else None, "store_id": data.get("store_id")})

    payload = request.get_json() or {}
    name = payload.get("name")
    password = payload.get("password")
    if not password:
        return jsonify({"msg":"password required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg":"user exists"}), 400

    user = User(name=name, email=data["email"], role_id=data["role_id"], store_id=data.get("store_id"))
    user.set_password(password)
    db.session.add(user)
    inv.used = True
    db.session.commit()
    return jsonify({"msg":"registered", "user_id": user.user_id})

@bp.route("/admins/<int:admin_id>/create-clerk", methods=["POST"])
@jwt_required()
def admin_create_clerk(admin_id):
    identity = get_jwt_identity()
    # only admin or merchant can create clerks for their store
    if identity["role"] not in (RoleEnum.ADMIN.value, RoleEnum.MERCHANT.value):
        return jsonify({"msg":"forbidden"}), 403

    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    store_id = data.get("store_id")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"user exists"}), 400

    clerk_role = Role.query.filter_by(name=RoleEnum.CLERK.value).first()
    if not clerk_role:
        return jsonify({"msg":"clerk role missing"}), 500

    user = User(name=name, email=email, role_id=clerk_role.role_id, store_id=store_id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg":"clerk_created", "user_id": user.user_id})


# JWT TEST ROUTES (for debugging)

@bp.route("/test-login", methods=["POST"])
def test_login():
    """Quick route to test JWT token creation."""
    data = request.get_json()
    if not data or "username" not in data:
        return jsonify({"error": "username required"}), 400
    token = create_access_token(identity=data["username"])
    return jsonify({"access_token": token}), 200

@bp.route("/test-protected", methods=["GET"])
@jwt_required()
def test_protected():
    """Quick route to test JWT protection works."""
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, {current_user}. JWT works!"}), 200
