from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models import db, User, PasswordResetToken
import uuid

bp = Blueprint("password_reset", __name__, url_prefix="/reset")

@bp.route("/request", methods=["POST"])
def request_reset():
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    token = PasswordResetToken(
        user_id=user.id,
        token=str(uuid.uuid4()),
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )
    db.session.add(token)
    db.session.commit()

    return jsonify({"msg": "Reset token created", "token": token.token})

@bp.route("/confirm/<token>", methods=["POST"])
def confirm_reset(token):
    reset_token = PasswordResetToken.query.filter_by(token=token).first()
    if not reset_token or reset_token.is_expired():
        return jsonify({"msg": "Invalid or expired token"}), 400

    data = request.get_json()
    new_password = data.get("password")
    reset_token.user.set_password(new_password)
    db.session.delete(reset_token)
    db.session.commit()

    return jsonify({"msg": "Password reset successful"})
