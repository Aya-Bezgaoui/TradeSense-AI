from flask import Blueprint, request, jsonify
from models import db, Challenge, Plan, PayPalSettings
from middleware import token_required
import datetime

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/mock', methods=['POST'])
@token_required
def mock_checkout(current_user):
    data = request.json
    plan_slug = data.get('plan_slug')
    
    plan = Plan.query.filter_by(slug=plan_slug).first()
    if not plan:
        return jsonify({"error": "Invalid plan"}), 400
        
    # Create the challenge
    start_balance = 5000.0
    
    features = plan.get_features()
    if 'balance' in features:
        # start_balance = float(features['balance'])
        pass

    new_challenge = Challenge(
        user_id=current_user.id,
        plan_id=plan.id,
        start_balance=start_balance,
        equity=start_balance,
        status='active'
    )
    
    db.session.add(new_challenge)
    db.session.commit()
    
    return jsonify({
        "message": "Payment successful. Challenge created.",
        "challenge_id": new_challenge.id
    })

@checkout_bp.route('/paypal-config', methods=['GET'])
def get_paypal_config():
    # Public endpoint to check if paypal is enabled
    settings = PayPalSettings.query.first()
    if settings and settings.enabled:
        return jsonify({
            "enabled": True,
            "client_id": settings.client_id
             # Secret never sent to frontend
        })
    return jsonify({"enabled": False})
