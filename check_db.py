import sqlite3

DB_PATH = "backend/tradesense.db"

def check():
    print(f"🔍 Checking database at {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA table_info(challenges)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Columns in 'challenges': {columns}")
        
        if 'daily_start_equity' in columns:
            print("✅ daily_start_equity FOUND.")
        else:
            print("❌ daily_start_equity MISSING.")

        conn.close()
        
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    check()
