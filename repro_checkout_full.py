import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def run():
    print("🚀 Starting Checkout Debug (Full Output)...")
    
    # login
    email = "admin@tradesense.com" 
    password = "admin123"
    
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        print(f"❌ Login Failed: {resp.text}")
        return
    token = resp.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}

    # checkout
    payload = {"plan_slug": "pro", "method": "CMI"}
    resp = requests.post(f"{BASE_URL}/checkout/mock", json=payload, headers=headers)
    
    print(f"Status: {resp.status_code}")
    try:
        print(f"Response: {json.dumps(resp.json(), indent=2)}")
    except:
        print(f"Response Text: {resp.text}")

if __name__ == "__main__":
    run()
