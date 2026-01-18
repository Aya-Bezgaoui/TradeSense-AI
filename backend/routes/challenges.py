from flask import Blueprint, jsonify, request
from models import db, Challenge, DailyMetrics, Plan
from middleware import token_required
from datetime import datetime

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/active', methods=['GET'])
@token_required
def get_active_challenge(current_user):
    # Find the most recent active challenge
    challenge = Challenge.query.filter_by(user_id=current_user.id, status='active').order_by(Challenge.created_at.desc()).first()
    
    if not challenge:
        # If no active, maybe return the absolute last one even if failed/passed?
        challenge = Challenge.query.filter_by(user_id=current_user.id).order_by(Challenge.created_at.desc()).first()
    
    if not challenge:
        return jsonify(None) # No challenges at all
        
    # Get today's DailyMetric to find start equity
    today = datetime.utcnow().date()
    metric = DailyMetrics.query.filter_by(challenge_id=challenge.id, date=today).first()
    daily_start = metric.day_start_equity if metric else challenge.equity

    return jsonify({
        "id": challenge.id,
        "status": challenge.status,
        "equity": challenge.equity,
        "start_balance": challenge.start_balance,
        "daily_start_equity": daily_start,
        "created_at": challenge.created_at.isoformat()
    })

@challenges_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_challenge_detail(current_user, id):
    challenge = Challenge.query.get(id)
    if not challenge or challenge.user_id != current_user.id:
        return jsonify({"error": "Not found"}), 404
        
    # User's metrics
    today = datetime.utcnow().date()
    # Find simple targets
    target_equity = challenge.start_balance * 1.10
    max_loss_equity = challenge.start_balance * 0.90
    
    # Calculate daily loss limit for display
    # We need today's starting equity to know the limit
    metric = DailyMetrics.query.filter_by(challenge_id=challenge.id, date=today).first()
    day_start = metric.day_start_equity if metric else challenge.equity # fallback
    daily_loss_limit_equity = day_start * 0.95
    
    return jsonify({
        "id": challenge.id,
        "status": challenge.status,
        "equity": challenge.equity,
        "start_balance": challenge.start_balance,
        "targets": {
            "profit_target": target_equity,
            "max_loss_level": max_loss_equity,
            "daily_loss_level": daily_loss_limit_equity
        }
    })
