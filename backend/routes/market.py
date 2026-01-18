from flask import Blueprint, request, jsonify
from services.market import market_service
from services.morocco_scraper import morocco_scraper

market_bp = Blueprint('market', __name__)

@market_bp.route('/quote', methods=['GET'])
def get_quote():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({"error": "Symbol required"}), 400
    
    # Routing logic: if it's a known Morocco stock, use scraper
    morocco_symbols = ['IAM', 'ATW', 'BCP', 'Lafarge', 'ADI', 'CSR', 'HOL', 'MNG', 'WAA', 'SNE', 'TQB']
    
    if symbol in morocco_symbols:
        data = morocco_scraper.get_stock_price(symbol)
    else:
        # Default to International (Yahoo Finance)
        data = market_service.get_quote(symbol)
        
    if not data:
        return jsonify({"error": "Symbol not found or service unavailable"}), 404
        
    return jsonify(data)

@market_bp.route('/series', methods=['GET'])
def get_series():
    symbol = request.args.get('symbol')
    interval = request.args.get('interval', '1m')
    period = request.args.get('period', '1d')
    
    if not symbol:
        return jsonify({"error": "Symbol required"}), 400

    # Note: Scraper usually doesn't provide historical data easily.
    # We will use Yahoo for everything for series OR return a simulated series for Morocco for the chart to work.
    
    morocco_symbols = ['IAM', 'ATW', 'BCP', 'Lafarge', 'ADI', 'CSR', 'HOL', 'MNG', 'WAA', 'SNE', 'TQB']
    if symbol in morocco_symbols:
        # MVP: Return empty or mock series for Morocco stocks if yfinance doesn't track them well
        # Some BVC stocks are on Yahoo (e.g. IAM.MA), so let's try appending .MA
        try:
            # Try fetching with .MA suffix
            data = market_service.get_series(f"{symbol}.MA", interval, period)
            if data:
                return jsonify(data)
        except:
            pass
        return jsonify([]) # Return empty if no history found
        
    data = market_service.get_series(symbol, interval, period)
    return jsonify(data)
