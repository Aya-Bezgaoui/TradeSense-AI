# TradeSense MVP (Prop Trading SaaS)

TradeSense is a premium Prop Trading platform featuring real-time market data (International + Casablanca Stock Exchange), trading challenges, and an advanced rule engine.

## Repository Structure

```
/
  backend/           # Flask API, Business Logic, Services
  frontend/          # React + TailwindCSS Dashboard
  database.sql       # SQL Schema
  README.md          # This file
```

## Prerequisites

- Python 3.8+
- Node.js 16+ & npm

## Quick Start / Run Instructions

### 1. Database Setup

First, initialize the database and seed the default data (Plans, Admin User).

```bash
# From the root directory
python backend/seed.py
```
> This will create `tradesense.db` (SQLite) by default and populate it with Plans (Starter, Pro, Elite) and an Admin user.

### 2. Backend (Flask)

Run the backend server on port 5000.

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```
*Backend runs at http://localhost:5000*

### 3. Frontend (React)

Run the frontend development server.

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
*Frontend runs at http://localhost:5173* (or 3000 depending on Vite config).

## Defaults & Credentials

- **Admin User**:
  - Email: `admin@tradesense.com`
  - Password: `admin123`
- **User Route**: Register a new account at `/auth/register`.

## Features Implemented

- **Market Data**: Real-time prices for BTC, ETH, AAPL (Yahoo Finance) + Morocco Stocks (IAM, ATW via Scraper).
- **Trading Engine**: Buy/Sell execution with immediate equity updates.
- **Rules Engine**: Checks Max Daily Loss (5%), Max Total Loss (10%), and Profit Target (10%).
- **Dashboard**: TradingView Charts, Order Panel, AI Signals, Stats.
- **Admin**: PayPal integration settings.
- **Styling**: Premium Dark Mode UI with TailwindCSS.

## Troubleshooting

- **Market Data Fails?**: Ensure you have internet access. If BVC scraping fails, the system falls back to simulated data for the demo.
- **Port Conflicts?**: Check `backend/app.py` (5000) and `frontend/vite.config.js` (3000/5173).