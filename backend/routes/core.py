from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, desc
from datetime import datetime, date
from models import db, Plan, Challenge, Trade, User, DailyMetrics
from services.market import market_service
from services.morocco_scraper import morocco_scraper
from services.rules import rules_engine

core_bp = Blueprint('core', __name__, url_prefix='/api')

# -------------------
# PLANS ROUTES
# -------------------

@core_bp.route('/plans', methods=['GET'])
def get_plans():
    """Get all available plans"""
    try:
        plans = Plan.query.all()
        return jsonify([plan.to_dict() for plan in plans]), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch plans: {str(e)}'}), 500

# -------------------
# CHECKOUT ROUTES
# -------------------

@core_bp.route('/checkout/mock', methods=['POST'])
@jwt_required()
def mock_checkout():
    """Mock checkout process - creates active challenge for user"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'plan_slug' not in data:
            return jsonify({'error': 'Missing plan_slug'}), 400
        
        plan_slug = data['plan_slug']
        payment_method = data.get('method', 'CMI')  # CMI, CRYPTO, PAYPAL
        
        # Validate plan exists
        plan = Plan.query.filter_by(slug=plan_slug).first()
        if not plan:
            return jsonify({'error': 'Plan not found'}), 404
        
        # Check if user already has an active challenge
        existing_challenge = Challenge.query.filter_by(
            user_id=current_user_id,
            status='active'
        ).first()
        
        if existing_challenge:
            return jsonify({
                'error': 'You already have an active challenge',
                'challenge_id': existing_challenge.id
            }), 400
        
        # Create new challenge with balance based on plan
        # Starter: 5,000 | Pro: 15,000 | Elite: 50,000
        plan_balances = {
            'starter': 5000.0,
            'pro': 15000.0,
            'elite': 50000.0
        }
        start_balance = plan_balances.get(plan.slug, 5000.0)
        
        challenge = Challenge(
            user_id=current_user_id,
            plan_id=plan.id,
            start_balance=start_balance,
            equity=start_balance,
            status='active'
        )
        
        db.session.add(challenge)
        db.session.commit()
        
        return jsonify({
            'message': 'Payment successful! Challenge activated.',
            'challenge': challenge.to_dict(),
            'payment_method': payment_method
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Checkout failed: {str(e)}'}), 500

# -------------------
# CHALLENGES ROUTES
# -------------------

@core_bp.route('/challenges/active', methods=['GET'])
@jwt_required()
def get_active_challenge():
    """Get user's active challenge"""
    try:
        current_user_id = get_jwt_identity()
        
        challenge = Challenge.query.filter_by(
            user_id=current_user_id,
            status='active'
        ).first()
        
        if not challenge:
            return jsonify({'message': 'No active challenge found'}), 200
        
        return jsonify(challenge.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch challenge: {str(e)}'}), 500

@core_bp.route('/challenges/<int:challenge_id>', methods=['GET'])
@jwt_required()
def get_challenge(challenge_id):
    """Get specific challenge details"""
    try:
        current_user_id = get_jwt_identity()
        
        challenge = Challenge.query.filter_by(
            id=challenge_id,
            user_id=current_user_id
        ).first()
        
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404
        
        # Get additional details
        summary = rules_engine.get_challenge_status_summary(challenge_id)
        
        return jsonify(summary), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch challenge: {str(e)}'}), 500

# -------------------
# MARKET DATA ROUTES
# -------------------

@core_bp.route('/market/quote', methods=['GET'])
def get_market_quote():
    """Get quote for a symbol"""
    try:
        symbol = request.args.get('symbol')
        if not symbol:
            return jsonify({'error': 'Missing symbol parameter'}), 400
        
        # Handle Morocco stocks separately
        moroccan_stocks = ['IAM', 'ATW', 'MNG', 'BCP', 'CAS']
        if symbol in moroccan_stocks:
            quote = morocco_scraper.get_ma_quote(symbol)
        else:
            quote = market_service.get_quote(symbol)
        
        return jsonify(quote), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch quote: {str(e)}'}), 500

@core_bp.route('/market/series', methods=['GET'])
def get_market_series():
    """Get historical price series for charting"""
    try:
        symbol = request.args.get('symbol')
        interval = request.args.get('interval', '1m')
        range_param = request.args.get('range', '1d')
        
        if not symbol:
            return jsonify({'error': 'Missing symbol parameter'}), 400
        
        # For Morocco stocks, return mock data since we don't have historical scraping
        moroccan_stocks = ['IAM', 'ATW', 'MNG', 'BCP', 'CAS']
        if symbol in moroccan_stocks:
            # Generate mock historical data for Morocco stocks
            import random
            from datetime import datetime
            import time as time_module
            
            data = []
            now = int(time_module.time())
            points = 60  # 60 data points
            
            # Get current price as base
            current_quote = morocco_scraper.get_ma_quote(symbol)
            base_price = current_quote['price']
            
            for i in range(points):
                timestamp = now - (points - i) * 60  # 1-minute intervals
                # Generate realistic price movements
                change = random.uniform(-0.005, 0.005)
                price = base_price * (1 + change)
                
                data.append({
                    'time': timestamp,
                    'open': round(price * (1 - random.uniform(0, 0.002)), 4),
                    'high': round(price * (1 + random.uniform(0, 0.003)), 4),
                    'low': round(price * (1 - random.uniform(0, 0.003)), 4),
                    'close': round(price, 4),
                    'volume': random.randint(1000, 10000)
                })
                
                base_price = price
            
            return jsonify(data), 200
        else:
            # International stocks
            data = market_service.get_historical_data(symbol, period=range_param, interval=interval)
            return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch series: {str(e)}'}), 500

@core_bp.route('/market/ma-quote', methods=['GET'])
def get_ma_quote():
    """Get Morocco stock quote specifically"""
    try:
        symbol = request.args.get('symbol')
        if not symbol:
            return jsonify({'error': 'Missing symbol parameter'}), 400
        
        quote = morocco_scraper.get_ma_quote(symbol)
        return jsonify(quote), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch MA quote: {str(e)}'}), 500

# -------------------
# TRADES ROUTES
# -------------------

@core_bp.route('/trades', methods=['POST'])
@jwt_required()
def create_trade():
    """Execute a trade"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['challenge_id', 'symbol', 'side', 'qty']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': f'Missing required fields: {", ".join(required_fields)}'}), 400
        
        challenge_id = data['challenge_id']
        symbol = data['symbol'].upper()
        side = data['side'].lower()
        qty = float(data['qty'])
        
        # Validate side
        if side not in ['buy', 'sell']:
            return jsonify({'error': 'Side must be either "buy" or "sell"'}), 400
        
        # Validate quantity
        if qty <= 0:
            return jsonify({'error': 'Quantity must be positive'}), 400
        
        # Verify challenge ownership and status
        challenge = Challenge.query.filter_by(
            id=challenge_id,
            user_id=current_user_id,
            status='active'
        ).first()
        
        if not challenge:
            return jsonify({'error': 'Active challenge not found'}), 404
        
        # Get current market price
        try:
            if symbol in ['IAM', 'ATW', 'MNG', 'BCP', 'CAS']:
                quote = morocco_scraper.get_ma_quote(symbol)
            else:
                quote = market_service.get_quote(symbol)
            price = quote['price']
        except Exception as e:
            return jsonify({'error': f'Could not fetch market price: {str(e)}'}), 500
        
        # Create trade
        trade = Trade(
            challenge_id=challenge_id,
            symbol=symbol,
            side=side,
            qty=qty,
            price=price
        )
        
        db.session.add(trade)
        db.session.commit()
        
        # Evaluate rules after trade
        evaluation_result = rules_engine.evaluate_after_trade(challenge_id)
        
        return jsonify({
            'message': 'Trade executed successfully',
            'trade': trade.to_dict(),
            'evaluation': evaluation_result
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Trade execution failed: {str(e)}'}), 500

@core_bp.route('/trades', methods=['GET'])
@jwt_required()
def get_trades():
    """Get trades for a challenge"""
    try:
        current_user_id = get_jwt_identity()
        challenge_id = request.args.get('challenge_id')
        
        if not challenge_id:
            return jsonify({'error': 'Missing challenge_id parameter'}), 400
        
        # Verify challenge ownership
        challenge = Challenge.query.filter_by(
            id=challenge_id,
            user_id=current_user_id
        ).first()
        
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404
        
        # Get trades
        trades = Trade.query.filter_by(challenge_id=challenge_id)\
                          .order_by(desc(Trade.executed_at))\
                          .all()
        
        return jsonify([trade.to_dict() for trade in trades]), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch trades: {str(e)}'}), 500

# -------------------
# LEADERBOARD ROUTES
# -------------------

@core_bp.route('/leaderboard/monthly-top10', methods=['GET'])
def get_monthly_leaderboard():
    """Get top 10 traders of the month"""
    try:
        # Get current month
        now = datetime.now()
        start_of_month = datetime(now.year, now.month, 1)
        
        # Query for top performers this month
        leaderboard = db.session.query(
            User.name,
            User.id.label('user_id'),
            Challenge.id.label('challenge_id'),
            Challenge.start_balance,
            Challenge.equity,
            ((Challenge.equity - Challenge.start_balance) / Challenge.start_balance * 100).label('pnl_percentage')
        ).join(Challenge)\
         .filter(
             Challenge.status == 'active',
             Challenge.created_at >= start_of_month
         )\
         .order_by(desc('pnl_percentage'))\
         .limit(10)\
         .all()
        
        # Format results
        results = []
        for idx, row in enumerate(leaderboard, 1):
            results.append({
                'rank': idx,
                'trader_name': row.name,
                'user_id': row.user_id,
                'challenge_id': row.challenge_id,
                'start_balance': float(row.start_balance),
                'current_equity': float(row.equity),
                'pnl_percentage': round(float(row.pnl_percentage), 2)
            })
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch leaderboard: {str(e)}'}), 500

# -------------------
# CONTACT & NEWSLETTER ROUTES
# -------------------

@core_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submission"""
    try:
        data = request.get_json()
        
        # Validate fields
        if not data or not all(k in data for k in ['name', 'email', 'message']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # In a real app, send email via SMTP/SendGrid here
        # For now, just log and return success
        print(f"Contact Form Submission: {data}")
        
        return jsonify({'message': 'Message sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@core_bp.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    """Handle newsletter subscription"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
            
        # Mock subscription
        print(f"Newsletter Subscription: {data['email']}")
        
        return jsonify({'message': 'Subscribed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500