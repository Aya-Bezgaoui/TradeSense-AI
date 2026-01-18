import os

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'dev-secret-key')
    
    # Database Config - Priority to Env Var (for LibSQL)
    # Default to local sqlite if not set. On Vercel, use /tmp/tradesense.db to avoid Read-Only error
    is_vercel = os.environ.get('VERCEL_REGION') is not None or os.getcwd().startswith('/var/task')
    default_db = 'sqlite:////tmp/tradesense.db' if is_vercel else 'sqlite:///tradesense.db'
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', default_db)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # PayPal Settings (Defaults)
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET', '')
    PAYPAL_MODE = os.getenv('PAYPAL_MODE', 'sandbox')