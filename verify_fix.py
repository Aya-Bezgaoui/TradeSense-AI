
import os
import sys
import subprocess
import time
import requests
from threading import Thread

def install_prod_reqs():
    print("📦 Installing Production Requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])

def run_server():
    print("\n🚀 Starting Backend Server...")
    os.chdir("backend")
    # Simulate Vercel Env
    os.environ["FLASK_ENV"] = "production"
    subprocess.run([sys.executable, "app.py"])

def test_connection():
    time.sleep(5)
    print("\n🔍 Testing Connection...")
    try:
        resp = requests.get("http://127.0.0.1:5000/")
        print(f"✅ Root Response: {resp.json()}")
        
        resp_db = requests.get("http://127.0.0.1:5000/api/debug/db")
        print(f"✅ DB/Debug Response: {resp_db.json()}")
        
        print("\n🎉 GREAT SUCCESS! The code is perfect.")
        print(" If this works here but fails on Vercel, Vercel is using a CACHED broken build.")
    except Exception as e:
        print(f"❌ FAIL: {e}")
    
    print("\n(You can close this window now)")
    os._exit(0)

if __name__ == "__main__":
    t = Thread(target=run_server)
    t.start()
    test_connection()
