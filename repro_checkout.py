import requests
import time

BASE_URL = "http://127.0.0.1:5000/api"

def run():
    print("🚀 Starting Checkout Debug...")
    
    # 1. Login (or Register if needed)
    email = "admin@tradesense.com" # Existing admin
    password = "admin123"
    
    print(f"🔑 Logging in as {email}...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    
    if resp.status_code != 200:
        print(f"❌ Login Failed: {resp.text}")
        return
        
    token = resp.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Login Successful")

    # 2. Checkout
    print("\n💳 Attempting Checkout (Pro Plan)...")
    payload = {"plan_slug": "pro", "method": "CMI"}
    
    resp = requests.post(f"{BASE_URL}/checkout/mock", json=payload, headers=headers)
    
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    run()
