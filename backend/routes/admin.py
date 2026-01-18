from flask import Blueprint, request, jsonify
from models import db, PayPalSettings
from middleware import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/paypal-settings', methods=['GET'])
@admin_required
def get_paypal_settings(current_user):
    settings = PayPalSettings.query.first()
    if not settings:
        return jsonify({"enabled": False, "client_id": "", "client_secret": ""})
        
    return jsonify({
        "enabled": settings.enabled,
        "client_id": settings.client_id,
        "client_secret": settings.client_secret
    })

@admin_bp.route('/paypal-settings', methods=['PUT'])
@admin_required
def update_paypal_settings(current_user):
    data = request.json
    settings = PayPalSettings.query.first()
    if not settings:
        settings = PayPalSettings()
        db.session.add(settings)
    
    settings.enabled = data.get('enabled', False)
    settings.client_id = data.get('client_id')
    settings.client_secret = data.get('client_secret')
    
    db.session.commit()
    return jsonify({"message": "Settings updated"})