import requests
import json

def test_login():
    url = "http://127.0.0.1:5000/api/auth/login"
    payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    headers = {"Content-Type": "application/json"}
    
    print(f"📡 Sending Login Request to {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"🔄 Status Code: {response.status_code}")
        print(f"📦 Response Body: {response.text}")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    test_login()
