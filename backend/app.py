import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'tradesense.db'))
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
    from routes.trading import trading_bp # New logic
    from routes.core import core_bp # Core logic (contact, newsletter, etc.)
    
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(plans_bp, url_prefix='/api/plans')
    app.register_blueprint(checkout_bp, url_prefix='/api/checkout')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(trades_bp, url_prefix='/api/trades')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(trading_bp, url_prefix='/api/trading') # New logic
    app.register_blueprint(core_bp, url_prefix='/api') # Core routes (contact, newsletter, etc.)

    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy", "service": "TradeSense API"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)