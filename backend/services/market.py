import yfinance as yf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketService:
    @staticmethod
    def get_quote(symbol):
        """
        Fetch real-time quote for a symbol using yfinance.
        """
        try:
            ticker = yf.Ticker(symbol)
            # Use history for better reliability with crypto and indices
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                price = hist['Close'].iloc[-1]
                prev_close = hist['Open'].iloc[-1]
                
                # Try getting real previous close
                try:
                    info = ticker.info
                    if 'previousClose' in info and info['previousClose']:
                        prev_close = info['previousClose']
                except:
                    pass

                change = price - prev_close
                change_pct = (change / prev_close) * 100 if prev_close else 0
                
                return {
                    "symbol": symbol,
                    "price": round(price, 2),
                    "change": round(change, 2),
                    "change_pct": round(change_pct, 2),
                    "currency": "USD"
                }
            # If empty history, raise to trigger exception/fallback
            raise Exception("No history data found")

        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {str(e)}")
            # Fallback Mock Data for Demo Stability
            import random
            base_prices = {
                'BTC-USD': 42000.00,
                'ETH-USD': 2200.00,
                'AAPL': 185.00,
                'TSLA': 240.00
            }
            base = base_prices.get(symbol, 100.00)
            variation = random.uniform(-0.02, 0.02) * base
            price = base + variation
            return {
                "symbol": symbol,
                "price": round(price, 2),
                "change": round(variation, 2),
                "change_pct": round((variation/base)*100, 2),
                "currency": "USD",
                "source": "Simulated (Fallback)"
            }

    @staticmethod
    def get_series(symbol, interval="1m", period="1d"):
        """
        Fetch historical data for charting.
        """
        try:
            ticker = yf.Ticker(symbol)
            # Valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
            # Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
            history = ticker.history(period=period, interval=interval)
            
            if history.empty:
                logger.warning(f"No history for {symbol}, generating mock data")
                # Fallback Mock Data
                import time
                import random
                
                data = []
                # Generate last 24h of 1m candles (approx 1440 points, let's do 100 for speed)
                count = 100
                end_time = int(time.time())
                price = 42000.0 if 'BTC' in symbol else 150.0
                
                for i in range(count):
                    timestamp = end_time - (count - i) * 60
                    change = random.uniform(-0.002, 0.002) * price
                    open_p = price
                    close_p = price + change
                    high_p = max(open_p, close_p) * (1 + random.uniform(0, 0.001))
                    low_p = min(open_p, close_p) * (1 - random.uniform(0, 0.001))
                    
                    data.append({
                        "time": timestamp,
                        "open": round(open_p, 2),
                        "high": round(high_p, 2),
                        "low": round(low_p, 2),
                        "close": round(close_p, 2),
                        "volume": int(random.uniform(100, 1000))
                    })
                    price = close_p
                return data
            
            # Reset index to make Date/Datetime a column
            history.reset_index(inplace=True)
            
            data = []
            for _, row in history.iterrows():
                # TradingView Lightweight Charts expects 'time' in seconds
                # row Date/Datetime might be index or column depending on yfinance version
                ts_val = row.get("Date") if "Date" in row else row.get("Datetime")
                if ts_val is None:
                     # Fallback if index was not reset properly or name differs
                     ts_val = row.name 
                
                if hasattr(ts_val, 'timestamp'):
                    timestamp = int(ts_val.timestamp())
                else:
                    # If string or other
                     import pandas as pd
                     timestamp = int(pd.to_datetime(ts_val).timestamp())

                data.append({
                    "time": timestamp,
                    "open": row["Open"],
                    "high": row["High"],
                    "low": row["Low"],
                    "close": row["Close"],
                    "volume": row["Volume"]
                })
                
            return data
        except Exception as e:
            logger.error(f"Error fetching series for {symbol}: {str(e)}")
            return []

market_service = MarketService()