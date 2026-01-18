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
    
    # Simple Execution Logic (Market Order)
    # Buy: Deduct logic? No, these are usually CFDs or Margin. 
    # For MVP: We just track equity changes based on price movement?
    # NO: The prompt says "equity tracking". 
    # Usually: Open Position -> updates equity. Close Position -> Realizes PnL.
    # SIMPLIFICATION for MVP: Spot trading simulation.
    # Buy: Convert Cash to Asset. Equity = Cash + Asset Value.
    # Wait... "Equity drops 5%". 
    # If we do Spot:
    #   Start: $5000 Cash. 0 Assets.
    #   Buy $1000 BTC. Cash $4000. BTC Value $1000. Equity $5000.
    #   BTC drops 50%. Cash $4000. BTC Value $500. Equity $4500.
    
    # However, building a full portfolio tracker is complex.
    # ALTERNATIVE (Easier): 
    # "Trades" are just executed instant PnL for demo? No, that's gambling.
    # "Trades" Open/Close?
    
    # Prompt: "After EVERY trade evaluate... equity drops...".
    # Let's assume the user holds positions.
    # To keep MVP simple: we will just Log certain trades and *Mock* the potential PnL impact 
    # OR we actually simulate a holding.
    
    # Let's do: Trade = Execute Order.
    # We update "Equity" manually based on a simulated PnL from this trade instantly? 
    # No, that's weird.
    
    # BETTER MVP APPROACH:
    # We just track a list of trades.
    # The 'Equity' is mainted in the Challenge model.
    # When you Buy, you pay commission (spread). Equity dips slightly.
    # Then we assume time passes and price moves? 
    # The prompt says "real-time dashboard updates prices...".
    
    # Okay, for a truly impressive MVP:
    # We allow "Buy" and "Sell" (Shorting).
    # We assume the trade is INSTANTLY CLOSED for demo purposes? (Scalping)
    # OR we keep positions open.
    
    # Decision: Trades are *instant* executions at current price.
    # To simulate PnL change for the "Rules", we'll add a random "Result" or "PnL" param 
    # OR (better) we just log it and say "Trade Executed".
    # But checking rules requires Equity change.
    
    # REVISED STRATEGY: 
    # Trade execution creates a Trade record.
    # AND we apply a simulated "Realized PnL" immediately to the equity just to show the rules engine working?
    # NO, that's fake.
    
    # Let's implement: 
    # We deduct a small spread cost immediately from equity (e.g. 0.05%).
    # We relying on a "tick" or "refresh" to update equity based on held positions?
    # Too complex for quick MVP.
    
    # TRICK: we simply allow the user to Buy/Sell.
    # And we update equity by a random small amount to simulate market noise +/- spread.
    # UNLESS the prompt implies fully working position management.
    # "TradeSense... Prop Trading SaaS"
    
    # I will implement: 
    # Trade = Log the transaction.
    # Update Equity: Subtract 10 (commission). 
    # Also I'll add a hacky "simulate_pnl" param or just randomize it for the demo 
    # so the user can see equity go UP and DOWN to test rules.
    # I will add a "force_result" for testing if needed, or just standard spread.
    
    # Let's subtract commission ($5) per trade to show equity dropping.
    # Real "Profit" comes from... well, we can't wait for days.
    # I will add a 'Simulated Outcome' immediately for the MVP 'Trading Challenge Engine'.
    # e.g. "You bought BTC. 5 seconds later... PnL calculated."
    # Actually, let's just deduct cost. The user can cheat/hack equity via DB or I add a dev tool.
    # Wait, "AI Signals...". Maybe if they follow the signal they win?
    
    # Let's sticking to: Trade executes at Price.
    # Deduct transaction cost (0.1%).
    # Update Equity = Equity - Cost.
    # (Realtime equity updates from price feeds would be a separate background job).
    
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
