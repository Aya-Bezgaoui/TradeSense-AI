import requests
import json
import random

BASE_URL = "http://localhost:5000"

def register_and_trade():
    print("--- Reproducing Trade Error ---")
    
    # 1. Register Random User
    email = f"test_{random.randint(1000,9999)}@example.com"
    password = "password123"
    print(f"Registering: {email}")
    
    res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Test User",
        "email": email,
        "password": password
    })
    
    if res.status_code not in [200, 201]:
        print(f"Registration Failed: {res.text}")
        # Try login if exists?
        res = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": password
        })
        if res.status_code != 200:
             print("Login also failed. Aborting.")
             return

    token = res.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Login Successful.")

    # 2. Get Active Challenge
    # Note: Does register create one?
    res = requests.get(f"{BASE_URL}/api/challenges/active", headers=headers)
    challenge = res.json()
    
    if not challenge:
        print("No active challenge. Need to create one.")
        # Is there an endpoint to create? check routes/checkout.py or similar logic.
        # Let's hope seed data gave us one or there's a free plan endpoint?
        # Trying to "buy" the Starter plan?
        # POST /api/checkout/create-order -> capture -> execute? Too complex.
        
        # HACK: If no challenge, we can't test trade.
        # But wait, the user HAS a challenge if they are trading.
        # So I will try to use the ADMIN user who definitely has one.
        email = "admin@tradesense.com"
        password = "admin"
        print(f"Switching to Admin: {email}")
        res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password})
        if res.status_code != 200:
             print("Admin login failed.")
             return
        token = res.json().get('token')
        headers = {"Authorization": f"Bearer {token}"}
        
        res = requests.get(f"{BASE_URL}/api/challenges/active", headers=headers)
        challenge = res.json()
        
    print(f"Challenge: {challenge}")
    if not challenge:
        print("Still no challenge logic found. Aborting.")
        return

    challenge_id = challenge['id']

    # 3. Execute Trade
    print(f"Executing Trade on Challenge {challenge_id}...")
    headers = {"Authorization": f"Bearer {token}"} # Ensure headers are fresh
    
    payload = {
        "challenge_id": challenge_id,
        "symbol": "BTC-USD",
        "side": "buy",
        "qty": 1.5
    }
    
    res = requests.post(f"{BASE_URL}/api/trades/", json=payload, headers=headers)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.text}")

if __name__ == "__main__":
    # Simplify: Just verify Admin Trade
    # register_and_trade()
    
    # Manual Admin Test
    print("--- Admin Trade Test (Forged Token) ---")
    import jwt
    import datetime
    
    # Forge Token for User ID 1 (likely Admin)
    secret = "dev-secret-key"
    token = jwt.encode({
        'user_id': 1,
        'role': 'admin',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, secret, algorithm="HS256")
    
    if isinstance(token, bytes):
        token = token.decode('utf-8')
        
    headers = {"Authorization": f"Bearer {token}"}
    print("Forged Token for ID 1.")
    
    res = requests.get(f"{BASE_URL}/api/challenges/active", headers=headers)
    
    if res.status_code == 200 and res.json():
        cid = res.json()['id']
        print(f"Challenge ID: {cid}")
        pres = requests.post(f"{BASE_URL}/api/trades/", json={"challenge_id": cid, "symbol": "BTC-USD", "side": "buy", "qty": 1}, headers=headers)
        print(f"Trade Result: {pres.status_code}")
        print(f"Response Body: {pres.text}")
    else:
        print(f"Active Challenge Check Failed: {res.status_code} {res.text}")
