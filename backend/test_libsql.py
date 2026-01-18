import os
import requests
from dotenv import load_dotenv

load_dotenv()
LIBSQL_URL = os.getenv("LIBSQL_URL")
LIBSQL_TOKEN = os.getenv("LIBSQL_TOKEN")

def get_http_url(url):
    if url.startswith("libsql://"):
        return url.replace("libsql://", "https://")
    return url

def test_connection():
    print("🧪 Testing LibSQL Connection (Requests Mode)...")
    
    if not LIBSQL_URL:
        print("❌ LIBSQL_URL not found.")
        return

    http_url = get_http_url(LIBSQL_URL)
    
    # 1. Test Select 1
    # Check User count
    payload = {
        "requests": [
            { "type": "execute", "stmt": { "sql": "SELECT 1" } },
            { "type": "execute", "stmt": { "sql": "SELECT COUNT(*) FROM users" } },
            { "type": "execute", "stmt": { "sql": "SELECT COUNT(*) FROM trades" } }
        ]
    }
    
    try:
        r = requests.post(
             f"{http_url}/v2/pipeline",
             json=payload,
             headers={"Authorization": f"Bearer {LIBSQL_TOKEN}"}
        )
        
        if r.status_code == 200:
            res = r.json()
            # Response struct: { "results": [ { "response": { "type": "execute", "result": { "cols": [], "rows": [[...]] } } } ] }
            
            # Check 1
            if "results" in res:
                print("   ✅ Basic connection successful.")
                
                # Check Users
                try:
                    user_rows = res['results'][1]['response']['result']['rows']
                    # row format: [ { "type": "integer", "value": "1" } ]? or just values?
                    # Turso rows are list of values OR objects depending on format.
                    # Usually: [ [ {"type": "integer", "value": "5"} ] ]
                    
                    val = user_rows[0][0]['value']
                    print(f"   👤 Users found: {val}")
                except Exception:
                    print(f"   ⚠️ Could not parse User count (Result: {res['results'][1]})")

                # Check Trades
                try:
                    trade_rows = res['results'][2]['response']['result']['rows']
                    val = trade_rows[0][0]['value']
                    print(f"   📈 Trades found: {val}")
                except Exception:
                    print(f"   ⚠️ Could not parse Trade count")
            else:
                print(f"   ⚠️ Unexpected response: {res}")
        else:
            print(f"   ❌ Network/Auth Error: {r.status_code} {r.text}")
            
        print("🏁 Test completed.")
        
    except Exception as e:
        print(f"   ❌ Test failed: {e}")

if __name__ == "__main__":
    test_connection()
