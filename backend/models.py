from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # user, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    challenges = db.relationship('Challenge', backref='user', lazy=True)

class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=False) # starter, pro, elite
    price_dh = db.Column(db.Float, nullable=False)
    features_json = db.Column(db.Text, nullable=True) # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_features(self):
        return json.loads(self.features_json) if self.features_json else {}

class PayPalSettings(db.Model):
    __tablename__ = 'paypal_settings'
    id = db.Column(db.Integer, primary_key=True)
    enabled = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.String(255), nullable=True)
    client_secret = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Challenge(db.Model):
    __tablename__ = 'challenges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    start_balance = db.Column(db.Float, nullable=False)
    equity = db.Column(db.Float, nullable=False)
    daily_start_equity = db.Column(db.Float, nullable=True) # Snapshot for daily drawdown
    last_daily_reset = db.Column(db.DateTime, default=datetime.utcnow)
    
    status = db.Column(db.String(20), default='active') # active, failed, passed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    passed_at = db.Column(db.DateTime, nullable=True)
    failed_at = db.Column(db.DateTime, nullable=True)
    
    trades = db.relationship('Trade', backref='challenge', lazy=True)
    metrics = db.relationship('DailyMetrics', backref='challenge', lazy=True)

class Trade(db.Model):
    __tablename__ = 'trades'
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False) # buy, sell
    qty = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Optional: Track PnL of this specific trade if we were holding positions, 
    # but for simple MVP we might just track equity changes. 
    # Let's assume this is a simple spot transaction or we calculate PnL properly.

class DailyMetrics(db.Model):
    __tablename__ = 'daily_metrics'
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    day_start_equity = db.Column(db.Float, nullable=False)
    day_end_equity = db.Column(db.Float, nullable=True)
    day_pnl = db.Column(db.Float, default=0.0)
    max_intraday_drawdown_pct = db.Column(db.Float, default=0.0)

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False) # Denormalized for simpler queries
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
