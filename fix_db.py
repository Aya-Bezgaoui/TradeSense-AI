import sqlite3

DB_PATH = "backend/tradesense.db"

def fix():
    print(f"🔧 Fixing database at {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 1. Check if column exists
        cursor.execute("PRAGMA table_info(challenges)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'daily_start_equity' not in columns:
            print("   👉 Adding missing column: daily_start_equity")
            cursor.execute("ALTER TABLE challenges ADD COLUMN daily_start_equity FLOAT")
        else:
            print("   ✅ Column daily_start_equity already exists.")

        # 2. Check DailyMetrics just in case
        cursor.execute("PRAGMA table_info(daily_metrics)")
        dm_columns = [row[1] for row in cursor.fetchall()]

        if 'day_end_equity' not in dm_columns:
            print("   👉 Adding missing column: day_end_equity to daily_metrics")
            cursor.execute("ALTER TABLE daily_metrics ADD COLUMN day_end_equity FLOAT")

        conn.commit()
        conn.close()
        print("✅ Database schema updated successfully.")
        
    except Exception as e:
        print(f"❌ Failed to fix DB: {e}")

if __name__ == "__main__":
    fix()
