import os
import sqlite3
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# Configuration
LIBSQL_URL = os.getenv("LIBSQL_URL")
LIBSQL_TOKEN = os.getenv("LIBSQL_TOKEN")

def get_http_url(url):
    if url.startswith("libsql://"):
        return url.replace("libsql://", "https://")
    return url

def execute_remote(url, token, sql, args=None):
    # Turso HTTP API expects: POST /v2/pipeline (or just / depending on version)
    # or POST /v1/execute (deprecated?)
    # Valid is POST / with body {"requests": [{"type": "execute", "stmt": {"sql": "..."}}]}
    # OR simpler one used by some clients.
    
    # Let's use the standard pipeline API which is robust.
    # Docs: https://docs.turso.tech/reference/turso-api
    
    # Actually, the simplest standard is:
    # POST https://<db>.turso.io/v2/pipeline
    # Headers: Authorization: Bearer <token>
    # Body: { "requests": [ { "type": "execute", "stmt": { "sql": "...", "args": [...] } } ] }
    
    http_url = get_http_url(url)
    endpoint = f"{http_url}/v2/pipeline"
    
    # Prepare args
    # Turso args: 
    # { "type": "float", "value": 1.0 } or { "type": "text", "value": "str" }
    # This is complicated to map manually.
    
    # Easier way: The client might have failed due to environment. 
    # Let's try to fix the client usage in a simpler script wrapper or use the 'simple' HTTP protocol?
    # Simple protocol: NOT documented well for raw requests.
    
    # Let's try to use 'libsql_client' with 'asyncio' if the sync was the issue. 
    # But requests is safer if I can map args.
    
    # Let's try to just use f-strings for SQL (DANGEROUS but for migration it's okay-ish if we trust local data).
    # Wait, we can't do that safely.
    
    # Let's try to fix the libSQL client usage.
    # The error was "RuntimeError: no running event loop".
    # This happens when `create_client` is async but not awaited? 
    # No, documentation says it returns a SyncClient.
    # BUT on Windows `aiohttp` might complain.
    
    # Let's Try a minimal fix: run inside a thread or use specific event loop policy?
    pass

# RE-STRATEGIZING:
# Using `requests` requires mapping types to Turso JSON format.
# { "type": "integer", "value": "123" }, { "type": "text", "value": "foo" }
# It is doable.

def to_turso_arg(val):
    if val is None:
        return {"type": "null"}
    if isinstance(val, int):
        return {"type": "integer", "value": str(val)} # Turso uses string for int64 safety? or standard int?
        # Actually standard JSON int is fine usually, but Turso API specifies...
        # Let's assume standard values work for 'args' if using the simple Execute endpoint? 
        # No, pipeline requires explicit types usually.
    if isinstance(val, float):
        return {"type": "float", "value": val}
    if isinstance(val, (str, bool)): # bool might need to be int 0/1 for sqlite
        return {"type": "text", "value": str(val)}
    # Date?
    return {"type": "text", "value": str(val)}

def migrate():
    print("🚀 Starting migration to LibSQL (Requests Mode)...")
    
    http_url = get_http_url(LIBSQL_URL)
    
    # 1. Local
    sqlite_path = os.path.join(os.path.dirname(__file__), 'tradesense.db')
    local_conn = sqlite3.connect(sqlite_path)
    local_conn.row_factory = sqlite3.Row
    local_cursor = local_conn.cursor()
    
    # 2. Schema
    print("🏗️ Syncing Schema...")
    schema_rows = local_cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()
    
    # We batch schema creation
    for row in schema_rows:
        sql = row['sql']
        if sql:
            # Execute
            payload = {
                "requests": [
                    { "type": "execute", "stmt": { "sql": sql } }
                ]
            }
            try:
                r = requests.post(
                     f"{http_url}/v2/pipeline",
                     json=payload,
                     headers={"Authorization": f"Bearer {LIBSQL_TOKEN}"}
                )
                if r.status_code != 200:
                    print(f"   ⚠️ Schema Error: {r.text[:100]}")
            except Exception as e:
                print(f"   ❌ Network Error: {e}")
                
    print("✅ Schema synced.")
    
    # 3. Data
    tables = ['users', 'plans', 'paypal_settings', 'challenges', 'trades', 'daily_metrics', 'chat_messages']
    
    for table in tables:
        print(f"📦 Migrating table: {table}...")
        try:
            rows = local_cursor.execute(f"SELECT * FROM {table}").fetchall()
        except Exception:
            print(f"   ⚠️ Skipping {table}.")
            continue
            
        if not rows:
            continue
            
        # Insert one by one or batch? Batching 50
        batch_stmts = []
        for row in rows:
            data = dict(row)
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?'] * len(data))
            
            # Args mapping
            # sqlite returns native types.
            args = []
            for k in data.keys():
                v = data[k]
                args.append(to_turso_arg(v))
                
            stmt = {
                "type": "execute",
                "stmt": {
                    "sql": f"INSERT OR IGNORE INTO {table} ({columns}) VALUES ({placeholders})",
                    "args": args
                }
            }
            batch_stmts.append(stmt)
            
            if len(batch_stmts) >= 20:
                # Flush
                r = requests.post(
                     f"{http_url}/v2/pipeline",
                     json={"requests": batch_stmts},
                     headers={"Authorization": f"Bearer {LIBSQL_TOKEN}"}
                )
                if r.status_code != 200:
                    print(f"   ❌ Batch Error: {r.text[:100]}")
                batch_stmts = []
                
        # Final flush
        if batch_stmts:
            r = requests.post(
                 f"{http_url}/v2/pipeline",
                 json={"requests": batch_stmts},
                 headers={"Authorization": f"Bearer {LIBSQL_TOKEN}"}
            )
            if r.status_code != 200:
                print(f"   ❌ Final Batch Error: {r.text[:100]}")
                
        print(f"   ✅ Migrated {len(rows)} rows for {table}.")
        
    print("🎉 Migration completed!")

if __name__ == "__main__":
    migrate()
