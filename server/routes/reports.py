from flask import Blueprint, request, jsonify
from models import db, Store, SupplyRequest, Payment, Inventory
from datetime import datetime, timedelta

bp = Blueprint("reports", __name__, url_prefix="/reports")

def start_of_period(period: str):
    now = datetime.utcnow()
    if period == "weekly":
        return now - timedelta(days=7)
    elif period == "monthly":
        return now - timedelta(days=30)
    elif period == "yearly":
        return now - timedelta(days=365)
    return None

@bp.route("/store/<int:store_id>/<string:period>", methods=["GET"])
def store_report(store_id, period):
    try:
        start_date = start_of_period(period)
        if not start_date:
            return jsonify({"error": "Invalid period"}), 400

        # Supply Requests
        supply_requests = SupplyRequest.query.filter(
            SupplyRequest.store_id == store_id,
            SupplyRequest.created_at >= start_date
        ).all()

        # Payments
        payments = Payment.query.join(Store, Store.id == store_id).filter(
            Payment.created_at >= start_date
        ).all()

        # Inventory snapshot
        inventory = Inventory.query.join(Store).filter(Store.id == store_id).all()

        return jsonify({
            "store_id": store_id,
            "period": period,
            "supply_requests": len(supply_requests),
            "approved_requests": len([r for r in supply_requests if r.status == "approved"]),
            "pending_requests": len([r for r in supply_requests if r.status == "pending"]),
            "rejected_requests": len([r for r in supply_requests if r.status == "rejected"]),
            "total_payments": sum(p.amount for p in payments),
            "completed_payments": sum(p.amount for p in payments if p.status == "completed"),
            "inventory": [
                {"product_id": inv.product_id, "quantity": inv.quantity}
                for inv in inventory
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
