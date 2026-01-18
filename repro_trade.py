import requests
import sys
import random
import string

BASE_URL = "http://localhost:5000/api"

def random_string(length=10):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def register():
    email = f"{random_string()}@test.com"
    password = "password123"
    payload = {
        "email": email,
        "password": password,
        "name": "Test User"
    }
    try:
        print(f"Registering {email}...")
        res = requests.post(f"{BASE_URL}/auth/register", json=payload)
        if res.status_code == 201:
            return email, password
        print(f"Registration failed: {res.text}")
        return None, None
    except Exception as e:
        print(f"Registration error: {e}")
        return None, None

def login(email, password):
    try:
        res = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        if res.status_code == 200:
            return res.json()['token']
        print(f"Login failed: {res.text}")
        return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def buy_plan(token):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "plan_slug": "pro", # Assuming 'pro' exists
        "method": "CMI"
    }
    try:
        print("Buying plan...")
        res = requests.post(f"{BASE_URL}/checkout/mock", json=payload, headers=headers)
        if res.status_code == 200:
            print("Plan purchased.")
            return True
        print(f"Plan purchase failed: {res.text}")
        return False
    except Exception as e:
        print(f"Purchase error: {e}")
        return False

def get_challenge(token):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.get(f"{BASE_URL}/challenges/active", headers=headers)
        if res.status_code == 200:
            data = res.json()
            if data:
                return data['id']
            print("No active challenge found")
            return None
        print(f"Get challenge failed: {res.text}")
        return None
    except Exception as e:
        print(f"Get challenge error: {e}")
        return None

def trade(token, challenge_id):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "challenge_id": challenge_id,
        "symbol": "BTC-USD",
        "side": "buy",
        "amount": 100
    }
    try:
        print(f"Attempting POST to {BASE_URL}/trading/ with payload: {payload}")
        res = requests.post(f"{BASE_URL}/trading/", json=payload, headers=headers)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Trade error: {e}")

if __name__ == "__main__":
    email, password = register()
    if not email:
        sys.exit(1)
        
    token = login(email, password)
    if not token:
        sys.exit(1)
        
    if not buy_plan(token):
        sys.exit(1)
        
    challenge_id = get_challenge(token)
    if not challenge_id:
        sys.exit(1)
        
    trade(token, challenge_id)
