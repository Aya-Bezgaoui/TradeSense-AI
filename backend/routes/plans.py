from flask import Blueprint, jsonify
from models import Plan

plans_bp = Blueprint('plans', __name__)

@plans_bp.route('/', methods=['GET'])
def get_plans():
    plans = Plan.query.all()
    output = []
    price_map = {
        'starter': 200,
        'pro': 500,
        'elite': 1000
    }
    
    for p in plans:
        output.append({
            "id": p.id,
            "slug": p.slug,
            "price_dh": price_map.get(p.slug, p.price_dh),
            "features": p.get_features()
        })
    return jsonify(output)
