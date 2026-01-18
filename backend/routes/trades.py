from flask import Blueprint, request, jsonify
from models import db, Trade, Challenge
from middleware import token_required
from services.rules import rules_engine
from services.market import market_service
from services.morocco_scraper import morocco_scraper

trades_bp = Blueprint('trades', __name__)

@trades_bp.route('/', methods=['POST'])
@token_required
def execute_trade(current_user):
    data = request.json
    challenge_id = data.get('challenge_id')
    symbol = data.get('symbol')
    side = data.get('side') # buy or sell
    qty = float(data.get('qty', 0))
    
    challenge = Challenge.query.get(challenge_id)
    if not challenge or challenge.user_id != current_user.id:
        return jsonify({"error": "Challenge not found or unauthorized"}), 404
        
    if challenge.status != 'active':
        return jsonify({"error": f"Challenge is {challenge.status}"}), 400

    try:
        # Get Current Price
        # Check if Morocco stock
        morocco_symbols = ['IAM', 'ATW', 'BCP', 'Lafarge']
        if symbol in morocco_symbols:
            quote = morocco_scraper.get_stock_price(symbol)
        else:
            quote = market_service.get_quote(symbol)
            
        if not quote:
            return jsonify({"error": "Failed to get market price"}), 500
            
        price = quote['price']
        cost = price * qty
        
        commission = cost * 0.001 # 0.1%
        new_equity = challenge.equity - commission
        
        # Create Trade
        trade = Trade(
            challenge_id=challenge.id,
            symbol=symbol,
            side=side,
            qty=qty,
            price=price
        )
        
        challenge.equity = new_equity
        
        db.session.add(trade)
        db.session.commit()
        
        # Evaluate Rules
        status = rules_engine.evaluate_challenge(challenge.id)
        
        return jsonify({
            "message": "Trade executed", 
            "trade": {
                "symbol": symbol,
                "price": price, 
                "commission": commission
            },
            "challenge_status": status,
            "new_equity": new_equity
        })
    except Exception as e:
        import traceback
        loss_msg = traceback.format_exc()
        print(f"TRADE FAIL: {loss_msg}") # Log to terminal
        db.session.rollback()
        return jsonify({"error": str(e), "details": loss_msg}), 500

@trades_bp.route('/', methods=['GET'])
@token_required
def get_trades(current_user):
    challenge_id = request.args.get('challenge_id')
    if not challenge_id:
        return jsonify({"error": "Challenge ID required"}), 400
        
    trades = Trade.query.filter_by(challenge_id=challenge_id).order_by(Trade.executed_at.desc()).all()
    
    output = []
    for t in trades:
        output.append({
            "id": t.id,
            "symbol": t.symbol,
            "side": t.side,
            "qty": t.qty,
            "price": t.price,
            "executed_at": t.executed_at.isoformat()
        })
    return jsonify(output)
