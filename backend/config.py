import os

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'dev-secret-key')
    
    # Database Config
    # Priority 1: Env Var (DATABASE_URL) -> intended for Postgres (Production)
    # Priority 2: Vercel Ephemeral SQLite -> fallback for quick deploy
    # Priority 3: Local SQLite -> for development
    
    uri = os.getenv('DATABASE_URL')
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    
    if not uri:
        is_vercel = os.environ.get('VERCEL_REGION') is not None or os.getcwd().startswith('/var/task')
        uri = 'sqlite:////tmp/tradesense.db' if is_vercel else 'sqlite:///tradesense.db'
        
    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # PayPal Settings (Defaults)
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET', '')
    PAYPAL_MODE = os.getenv('PAYPAL_MODE', 'sandbox')