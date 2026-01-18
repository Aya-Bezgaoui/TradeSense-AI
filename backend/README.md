# TradeSense Backend

Flask-based REST API handling auth, trading logic, and market data.

## Database Setup (LibSQL)
The project is configured to use LibSQL (e.g. Turso) for production/Vercel.

1. Create a `.env` file in `backend/` based on provided keys.
2. Required variables:
   - `LIBSQL_URL`
   - `LIBSQL_TOKEN`
   - `DATABASE_URL` (format: `sqlite+libsql://<url>?authToken=<token>`)

## Local Development
- Locally, you can fallback to SQLite if `DATABASE_URL` is not set.
- To use LibSQL locally, ensure you have internet access and valid credentials.

## Installation
```bash
pip install -r requirements.txt
```

## Key Services
- `services/market.py`: Yahoo Finance integration (yfinance).
- `services/morocco_scraper.py`: Custom scraper for Casablanca Stock Exchange.
- `services/rules.py`: Evaluates Pass/Fail conditions for challenges.

## Env Vars
Set in `config.py` or `.env`:
- `DATABASE_URL`
- `JWT_SECRET`