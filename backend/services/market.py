import logging
import requests
import time
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketService:
    BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    def get_quote(self, symbol):
        """
        Fetch real-time quote using direct Yahoo API (Lightweight, no pandas).
        """
        try:
            # Fetch 1 day range to get current price and previous close
            url = f"{self.BASE_URL}/{symbol}?interval=1d&range=2d"
            response = requests.get(url, headers=self.HEADERS, timeout=5)
            
            if response.status_code != 200:
                logger.error(f"Yahoo API Error: {response.text}")
                return self._get_mock_quote(symbol) # Fallback if API fails

            data = response.json()
            result = data['chart']['result'][0]
            meta = result['meta']
            
            price = meta['regularMarketPrice']
            prev_close = meta['chartPreviousClose']
            
            change = price - prev_close
            change_pct = (change / prev_close) * 100 if prev_close else 0

            return {
                "symbol": symbol,
                "price": round(price, 2),
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
                "currency": meta.get('currency', 'USD'),
                "source": "Real-Time (Yahoo API)"
            }

        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {str(e)}")
            return self._get_mock_quote(symbol)

    def get_series(self, symbol, interval="1m", period="1d"):
        """
        Fetch historical data using direct Yahoo API (Lightweight, no pandas).
        """
        try:
            # Map friendly period to Yahoo range
            yahoo_range = period
            if period == '1d': yahoo_range = '1d'
            elif period == '5d': yahoo_range = '5d'
            elif period == '1mo': yahoo_range = '1mo'
            
            url = f"{self.BASE_URL}/{symbol}?interval={interval}&range={yahoo_range}"
            response = requests.get(url, headers=self.HEADERS, timeout=5)
            
            if response.status_code != 200:
                return self._get_mock_series(symbol, interval)

            data = response.json()
            result = data['chart']['result'][0]
            timestamps = result['timestamp']
            indicators = result['indicators']['quote'][0]
            
            chart_data = []
            for i, ts in enumerate(timestamps):
                # specific Yahoo API quirk: sometimes values are None
                if indicators['open'][i] is None: continue
                
                chart_data.append({
                    "time": ts,
                    "open": round(indicators['open'][i], 2),
                    "high": round(indicators['high'][i], 2),
                    "low": round(indicators['low'][i], 2),
                    "close": round(indicators['close'][i], 2),
                    "volume": indicators['volume'][i] or 0
                })
                
            return chart_data

        except Exception as e:
            logger.error(f"Error fetching series for {symbol}: {str(e)}")
            return self._get_mock_series(symbol, interval)

    # --- FALLBACKS (Just in case API blocks IP) ---
    def _get_mock_quote(self, symbol):
        base_price = sum(ord(c) for c in symbol) + 50
        if 'BTC' in symbol: base_price = 42000
        return {
            "symbol": symbol, "price": base_price, "change": 1.5, "change_pct": 0.5, "currency": "USD", "source": "Simulated (Fallback)"
        }

    def _get_mock_series(self, symbol, interval):
        data = []
        end_time = int(time.time())
        
        # Base price depends on symbol roughly
        price = 100.0
        if 'BTC' in symbol: price = 92000.0
        elif 'ETH' in symbol: price = 2800.0
        elif 'IAM' in symbol: price = 105.0 # Maroc Telecom
        elif 'ATW' in symbol: price = 480.0
        elif 'ADI' in symbol: price = 450.0
        
        points = 60 # Show more points for a better chart
        step = 86400 if interval == '1d' else 3600 # 1 day or 1 hour
        
        # Start from history and walk forward
        current_price = price * 0.95 # Start slightly lower to show trend
        
        for i in range(points):
            # Random walk
            change = random.uniform(-0.02, 0.025) # Slightly bullish bias
            open_p = current_price
            close_p = open_p * (1 + change)
            high_p = max(open_p, close_p) * (1 + random.uniform(0, 0.01))
            low_p = min(open_p, close_p) * (1 - random.uniform(0, 0.01))
            
            data.append({
                "time": end_time - (points - i) * step,
                "open": round(open_p, 2),
                "high": round(high_p, 2),
                "low": round(low_p, 2),
                "close": round(close_p, 2),
                "volume": random.randint(1000, 50000)
            })
            current_price = close_p
            
        return data

market_service = MarketService()