import os

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'dev-secret-key')
    
    # Database Config - Priority to Env Var (for LibSQL)
    # Default to local sqlite if not set
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///tradesense.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # PayPal Settings (Defaults)
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET', '')
    PAYPAL_MODE = os.getenv('PAYPAL_MODE', 'sandbox')