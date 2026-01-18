from flask import Blueprint, request, jsonify
from models import db, Challenge, Trade
from middleware import token_required
from services.evaluator import evaluate_challenge
import random

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/', methods=['POST'])
@token_required
def execute_trade(current_user):
    data = request.json
    challenge_id = data.get('challenge_id')
    symbol = data.get('symbol')
    side = data.get('side', 'buy') # buy/sell
    amount = float(data.get('amount', 0)) # Risk amount or Position size? Let's say risk amount for simplicity or PnL impact
    
    # For this MVP, we simulate a trade result instantly to show the "equity move"
    # In a real system, this would open a position.
    
    try:
        challenge = Challenge.query.get(challenge_id)
        if not challenge or challenge.user_id != current_user.id:
            return jsonify({"error": "Challenge not found"}), 404
            
        if challenge.status != 'active':
            return jsonify({"error": f"Challenge is {challenge.status}"}), 400

        # SIMULATION LOGIC:
        # Random PnL between -2% and +3% of the trade amount/balance to make it exciting
        # Let's assume 'amount' is the position size, and we assume a random volatility
        
        # Simple Mock: Win Rate 55%
        is_win = random.random() > 0.45 
        pnl_pct = random.uniform(0.01, 0.04) if is_win else random.uniform(0.01, 0.03)
        pnl = (challenge.equity * pnl_pct) if is_win else -(challenge.equity * pnl_pct)
        
        # Apply PnL
        challenge.equity += pnl
        
        # Log Trade
        trade = Trade(
            challenge_id=challenge.id,
            symbol=symbol,
            side=side,
            qty=1, # Mock
            price=pnl, # Storing PnL in price column for this MVP hack, or use a new column
        )
        db.session.add(trade)
        db.session.commit()
        
        # Evaluate Rules
        evaluation = evaluate_challenge(challenge.id)
        
        return jsonify({
            "message": "Trade executed",
            "pnl": pnl,
            "new_equity": challenge.equity,
            "evaluation": evaluation
        })
    except Exception as e:
        import traceback
        loss_msg = traceback.format_exc()
        print(f"TRADING ROUTE FAIL: {loss_msg}")
        db.session.rollback()
        return jsonify({"error": str(e), "details": loss_msg}), 500

@trading_bp.route('/history/<int:challenge_id>', methods=['GET'])
@token_required
def trade_history(current_user, challenge_id):
    challenge = Challenge.query.get(challenge_id)
    if not challenge or challenge.user_id != current_user.id:
        return jsonify({"error": "Not authorized"}), 403
        
    trades = Trade.query.filter_by(challenge_id=challenge.id).order_by(Trade.executed_at.desc()).limit(20).all()
    
    return jsonify([{
        "symbol": t.symbol,
        "side": t.side,
        "pnl": t.price, # Using price col as PnL
        "time": t.executed_at.isoformat()
    } for t in trades])
