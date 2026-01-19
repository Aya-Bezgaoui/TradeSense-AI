import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000/api"
ADMIN_TOKEN = None # Will need to login or use a helper to get token
# Actually, let's use the 'repro_checkout_full.py' logic to create a user and get a token first.

def get_token():
    # Login as admin (assuming seeded) or register new
    email = "test_rules@example.com"
    password = "password123"
    
    # Register/Login
    session = requests.Session()
    res = session.post(f"{BASE_URL}/auth/register", json={
        "username": "TestRules", "email": email, "password": password
    })
    
    # Login
    res = session.post(f"{BASE_URL}/auth/login", json={
        "email": email, "password": password
    })
    if res.status_code == 200:
        return res.json()['token']
    return None

def create_challenge(token):
    # Mock checkout to get a challenge
    headers = {'Authorization': f'Bearer {token}'}
    res = session.post(f"{BASE_URL}/checkout/mock", json={
        "plan_slug": "pro" # Assuming 'pro' gives $5000 balance
    }, headers=headers)
    if res.status_code == 200:
        return res.json()['challenge_id']
    print(f"Checkout Failed: {res.text}")
    return None

session = requests.Session()
TOKEN = None

def run_test():
    global TOKEN
    print("1. Authenticating...")
    token = get_token()
    if not token:
        print("❌ Auth Failed")
        return
    TOKEN = token
    headers = {'Authorization': f'Bearer {TOKEN}'}
    
    # --- TEST 1: Daily Loss (5%) ---
    print("\n--- TEST 1: Max Daily Loss (5%) ---")
    challenge_id = create_challenge(token)
    if not challenge_id: return
    print(f"   Challenge Created: {challenge_id}")
    
    # Start Balance: $5000. 5% is $250.
    # We need to lose > $250. Let's lose $300.
    # Trade: Sell IAM (Approx 100 MAD = $10). 
    # Wait, simple math: Buy at X, Sell at X - loss.
    # We can fake a trade via backend? No, we must use execute_trade.
    # The execute_trade endpoint takes 'price' from market. 
    # To force a loss, we need to buy high, sell low OR rely on large qty and spread/commission?
    # Actually, verify_rules.py is hard because we can't control the market price easily to ensure a loss!
    
    # Alternative: Use a "Backdoor" or assume market is volatile?
    # Better: Inspect `rules.py` directly using a unit test script that imports app/db?
    # Yes, DIRECT DB MANIPULATION is better for verifying logic than trying to trade against live mock market.
    pass

if __name__ == "__main__":
    # This script is a placeholder. 
    # Real verification is better done via a backend-side script that imports the app context.
    print("Switching to backend-side unit test logic...")
