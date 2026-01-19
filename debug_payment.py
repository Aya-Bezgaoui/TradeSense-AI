import requests
import time

BASE_URL = "http://127.0.0.1:5000"

def debug_payment_flow():
    print("🚀 Starting Payment Debug Flow...")
    
    # 1. Register/Login User
    email = f"debug_user_{int(time.time())}@example.com"
    password = "password123"
    
    print(f"\n👤 1. Creating User: {email}")
    reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Debug User",
        "email": email,
        "password": password
    })
    
    if reg_resp.status_code not in [201, 400]:
        print(f"❌ Registration Failed: {reg_resp.text}")
        return

    # 2. Login to get Token
    print("\n🔑 2. Logging in...")
    login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    
    if login_resp.status_code != 200:
        print(f"❌ Login Failed: {login_resp.text}")
        return
        
    token = login_resp.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Check Plans (Should trigger seeding)
    print("\n📋 3. Fetching Plans (Triggers Auto-Seeding)...")
    plans_resp = requests.get(f"{BASE_URL}/api/plans", headers=headers)
    print(f"   Status: {plans_resp.status_code}")
    # print(f"   Body: {plans_resp.text[:100]}...")

    # 4. Attempt Checkout
    print("\n💳 4. Executing Checkout (Pro Plan)...")
    checkout_payload = {
        "plan_slug": "pro",
        "method": "CMI"
    }
    
    try:
        # Check both potential endpoints just in case
        urls_to_try = [
            f"{BASE_URL}/api/checkout/mock",
            f"{BASE_URL}/api/checkout/create-payment" # Maybe?
        ]
        
        for url in urls_to_try:
            print(f"   👉 Trying: {url}")
            resp = requests.post(url, json=checkout_payload, headers=headers)
            print(f"   🔄 Status: {resp.status_code}")
            print(f"   📦 Response: {resp.text}")
            
    except Exception as e:
        print(f"❌ Request Error: {e}")

if __name__ == "__main__":
    debug_payment_flow()
