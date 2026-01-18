import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from config import Config

def create_app():
    app = Flask(__name__)
    
    # Configuration from Config class (handles Vercel DB path)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    from models import db
    db.init_app(app)
    
    from flask_migrate import Migrate
    migrate = Migrate(app, db)
    
    # Import and register blueprints
    from routes.market import market_bp
    from routes.auth import auth_bp
    from routes.plans import plans_bp
    from routes.checkout import checkout_bp
    from routes.challenges import challenges_bp
    from routes.trades import trades_bp
    from routes.leaderboard import leaderboard_bp
    from routes.admin import admin_bp
    from routes.chat import chat_bp
    from routes.trading import trading_bp
    from routes.core import core_bp
    
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(plans_bp, url_prefix='/api/plans')
    app.register_blueprint(checkout_bp, url_prefix='/api/checkout')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(trades_bp, url_prefix='/api/trades')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(trading_bp, url_prefix='/api/trading')
    app.register_blueprint(core_bp, url_prefix='/api')

    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy", "service": "TradeSense API"})

    # verification: Removed auto-init to prevent Cold Start timeouts on Vercel
    # User must hit /api/debug/db once to set up tables.

    @app.route('/api/debug/db')
    def debug_db():
        try:
            db.create_all()
            return jsonify({
                "status": "success", 
                "message": "Connected to DB and ensured tables exist.",
                "db_url": app.config['SQLALCHEMY_DATABASE_URI'].split('@')[-1] if '@' in app.config['SQLALCHEMY_DATABASE_URI'] else "HIDDEN"
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    return app

# Expose app for Vercel
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)