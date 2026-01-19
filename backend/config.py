import os

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'dev-secret-key')
    
    # Database Config
    # Priority: Vercel Postgres Vars -> DATABASE_URL -> Vercel SQLite -> Local SQLite
    
    uri = os.getenv('POSTGRES_URL') or os.getenv('POSTGRES_PRISMA_URL') or os.getenv('DATABASE_URL')
    
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql+pg8000://", 1)
    elif uri and uri.startswith("postgresql://"):
        uri = uri.replace("postgresql://", "postgresql+pg8000://", 1)
    
    if not uri:
        # Fallback to ephemeral SQLite for Vercel if no DB connected
        is_vercel = os.environ.get('VERCEL_REGION') is not None or os.getcwd().startswith('/var/task')
        uri = 'sqlite:////tmp/tradesense.db' if is_vercel else 'sqlite:///tradesense.db'
        
    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # PayPal Settings (Defaults)
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET', '')
    PAYPAL_MODE = os.getenv('PAYPAL_MODE', 'sandbox')