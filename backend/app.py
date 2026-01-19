import os
import sys
import traceback
from flask import Flask, jsonify, request

# Vercel Path Fix: Ensure current directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_app():
    try:
        # Move imports here to catch "Module Not Found" errors safely
        from flask_cors import CORS
        from dotenv import load_dotenv
        
        load_dotenv()
        
        app = Flask(__name__)
        
        # 1. Config
        from config import Config
        app.config.from_object(Config)

        # 2. Extensions
        CORS(app)
        from models import db
        db.init_app(app)
        
        from flask_migrate import Migrate
        migrate = Migrate(app, db)
        
        # 3. Blueprints (Lazy Import to catch specific module errors)
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
        
        app.register_blueprint(market_bp, url_prefix='/api/market') # RESTORED
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(plans_bp, url_prefix='/api/plans') # RESTORED
        app.register_blueprint(checkout_bp, url_prefix='/api/checkout') # RESTORED
        app.register_blueprint(challenges_bp, url_prefix='/api/challenges') # RESTORED
        app.register_blueprint(trades_bp, url_prefix='/api/trades') # RESTORED
        app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard') # Keep separate if not in core? Core has it.
        app.register_blueprint(admin_bp, url_prefix='/api/admin')
        app.register_blueprint(chat_bp, url_prefix='/api/chat')
        app.register_blueprint(trading_bp, url_prefix='/api/trading')
        # app.register_blueprint(core_bp, url_prefix='/api') # DISABLED due to Auth issues

        @app.route('/')
        @app.route('/api')
        def health_check():
            return jsonify({
                "status": "healthy", 
                "service": "TradeSense API",
                "version": "v5-pg8000-fix",
                "note": "Yahoo + BVC Scraper Active"
            })

        @app.route('/api/debug/db')
        def debug_db():
            try:
                # 1. Safe Diagnostic Mode (Default)
                action = request.args.get('action', 'check')
                db_uri = app.config['SQLALCHEMY_DATABASE_URI']
                
                # Obfuscate password for security
                safe_uri = "HIDDEN"
                if db_uri:
                    if "@" in db_uri:
                        safe_uri = db_uri.split("@")[-1] 
                    else:
                        safe_uri = db_uri
                
                if action == 'check':
                    return jsonify({
                        "status": "online",
                        "message": "App is running. DB Configured.",
                        "db_type": safe_uri,
                        "instructions": "To create tables, visit: /api/debug/db?action=init"
                    })

                # 2. Risky Action Mode (Only if requested)
                if action == 'init':
                    db.create_all()
                    return jsonify({
                        "status": "success", 
                        "message": "Tables created successfully!",
                        "db_type": safe_uri
                    })
                    
                return jsonify({"error": "Invalid action"}), 400

            except Exception as e:
                # Return JSON error even if crash happens
                return jsonify({
                    "status": "crash", 
                    "error": str(e), 
                    "type": str(type(e).__name__)
                }), 500

        return app

    except Exception as e:
        # SUPER SAFETY NET: If app crashes during load, return a valid app that reports the error
        boot_error = str(e) # Capture string immediately
        error_app = Flask(__name__)
        error_msg = traceback.format_exc()
        
        @error_app.route('/')
        @error_app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
        def catch_all(path=None):
            return jsonify({
                "status": "critical_boot_error",
                "error": boot_error,
                "traceback": error_msg.split('\n')
            }), 500
            
        return error_app

# Expose app for Vercel
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)