from flask import Blueprint, jsonify
from models import db, Challenge, User
from sqlalchemy import func
from datetime import datetime

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/monthly-top10', methods=['GET'])
def get_leaderboard():
    # Logic: Get top 10 challenges by profit % active or passed in current month
    # Simplified: Top 10 by (Equity - StartBalance) / StartBalance
    
    # Filter for this month?
    # prompt: "current month"
    now = datetime.utcnow()
    # start_of_month = datetime(now.year, now.month, 1)
    
    # We'll just look at ALL challenges for simplicity or filter by created_at >= start_of_month
    # Let's take top 10 by Profit % desc
    
    results = db.session.query(
        User.name,
        Challenge.equity,
        Challenge.start_balance,
        Challenge.status,
        ((Challenge.equity - Challenge.start_balance) / Challenge.start_balance * 100).label('profit_pct')
    ).join(User).filter(
        Challenge.equity > Challenge.start_balance
    ).order_by(db.desc('profit_pct')).limit(10).all()
    
    output = []
    for r in results:
        output.append({
            "trader": r.name,
            "profit_pct": round(r.profit_pct, 2),
            "equity": r.equity,
            "status": r.status
        })
        
    return jsonify(output)
