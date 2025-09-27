from flask import Blueprint, request, jsonify
from models import db, Payment

bp = Blueprint("payments", __name__, url_prefix="/payments")

@bp.route("/", methods=["GET"])
def get_payments():
    payments = Payment.query.all()
    return jsonify([
        {"id": p.id, "amount": p.amount, "method": p.method, "status": p.status}
        for p in payments
    ])

@bp.route("/", methods=["POST"])
def create_payment():
    data = request.get_json()
    payment = Payment(
        user_id=data.get("user_id"),
        amount=data.get("amount"),
        method=data.get("method"),
        status="pending"
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify({"msg": "Payment created", "id": payment.id}), 201
