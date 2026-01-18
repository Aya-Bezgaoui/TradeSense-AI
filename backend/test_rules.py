from app import create_app
from models import db, User, Challenge, Trade, DailyMetrics

app = create_app()

def test_rules_internal():
    print("--- Testing Challenge Rules (Internal) ---")
    
    with app.app_context():
        # Setup: Ensure Admin User and Challenge
        admin = User.query.filter_by(email="admin@tradesense.com").first()
        if not admin:
            print("Admin user not found! Cannot test.")
            return

        challenge = Challenge.query.filter_by(user_id=admin.id, status='active').first()
        if not challenge:
            print("No active challenge found for admin. Creating one...")
            # Create a mock challenge
            # We need a plan first... assume plan_id=1 exists
            challenge = Challenge(
                user_id=admin.id, 
                plan_id=1, 
                start_balance=5000.0, 
                equity=5000.0
            )
            db.session.add(challenge)
            db.session.commit()
            print(f"Created Challenge ID: {challenge.id}")
        else:
            print(f"Using Existing Challenge ID: {challenge.id}")
            # Reset equity for test
            challenge.equity = 5000.0
            challenge.status = 'active'
            db.session.commit()

        # Simulate Trade Execution directly via Route function or similar logic
        # But we want to test the full flow including the route + rules engine.
        
        client = app.test_client()
        
        # Generate Token manually to bypass password check
        import jwt
        import datetime
        token = jwt.encode({
            'user_id': admin.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        # Ensure token is string (pyjwt < 2.0 returns bytes)
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        headers = {"Authorization": f"Bearer {token}"}
        
        print(f"Generated Token for Admin ID {admin.id}")
        
        print("\n--- Attempting to Trigger Daily Loss ---")
        # Execute large trade to burn commission
        # Commission is 0.1%. Need to burn > $250.
        # Trade $5,000,000 volume.
        # Qty = 100 of BTC ($50k) = $5M.
        
        payload = {
            "challenge_id": challenge.id,
            "symbol": "BTC-USD",
            "side": "buy",
            "qty": 100
        }
        
        res = client.post('/api/trades/', json=payload, headers=headers)
        data = res.json
        print(f"Trade Response: {res.status_code}")
        print(f"Data: {data}")
        
        if data.get('challenge_status') == 'failed' or data.get('challenge_status') == 'failed_total_loss' or data.get('challenge_status') == 'failed_daily_loss':
            print("✅ SUCCESS: Challenge Failed as expected.")
        else:
            print(f"❌ Status is {data.get('challenge_status')}. New Equity: {data.get('new_equity')}")
            
if __name__ == "__main__":
    test_rules_internal()
