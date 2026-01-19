import sqlite3
import os

DB_PATH = "backend/instance/tradesense.db"

def fix():
    if not os.path.exists(DB_PATH):
        print(f"❌ DB not found at {DB_PATH}")
        return

    print(f"🔧 Check/Fixing database at {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA table_info(challenges)")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Check daily_start_equity (again)
        if 'daily_start_equity' not in columns:
            print("   👉 Adding: daily_start_equity")
            cursor.execute("ALTER TABLE challenges ADD COLUMN daily_start_equity FLOAT")
        
        # Check last_daily_reset
        if 'last_daily_reset' not in columns:
            print("   👉 Adding: last_daily_reset")
            cursor.execute("ALTER TABLE challenges ADD COLUMN last_daily_reset TIMESTAMP")
        else:
            print("   ✅ last_daily_reset already exists.")

        conn.commit()
        conn.close()
        print("✅ Database schema updated.")
        
    except Exception as e:
        print(f"❌ Failed to fix DB: {e}")

if __name__ == "__main__":
    fix()
