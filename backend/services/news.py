import random
from datetime import datetime, timedelta

class NewsService:
    def get_market_news(self):
        # Mock Data - In real app, connect to NewsAPI or similar
        sentiment_options = ['positive', 'negative', 'neutral']
        
        headlines = [
            ("Bitcoin surges past resistance as institutional interest grows", "positive", "Crypto", "https://finance.yahoo.com/topic/crypto/"),
            ("Fed signals potential rate cuts later this year", "positive", "Forex", "https://www.cnbc.com/foreign-exchange/"),
            ("Tech stocks slip amid mixed earnings reports", "negative", "Stocks", "https://finance.yahoo.com/topic/tech/"),
            ("Oil prices stabilize after volatile week", "neutral", "Commodities", "https://www.cnbc.com/energy/"),
            ("New regulatory framework proposed for DeFi", "neutral", "Crypto", "https://www.coindesk.com/policy"),
            ("Gold hits all-time high on global uncertainty", "positive", "Commodities", "https://www.kitco.com/news"),
            ("Apple announces revolutionary AI integration", "positive", "Stocks", "https://www.apple.com/newsroom"),
            ("Tesla delivery numbers miss analyst expectations", "negative", "Stocks", "https://finance.yahoo.com/quote/TSLA")
        ]
        
        news = []
        for i in range(5):
            headline, sentiment, category, url = headlines[i]
            news.append({
                "id": i,
                "title": headline,
                "summary": "This is a brief AI-generated summary of the market event...",
                "source": "TradeSense Wire",
                "published_at": (datetime.now() - timedelta(minutes=random.randint(5, 120))).isoformat(),
                "sentiment": sentiment,
                "category": category,
                "url": url
            })
            
        return news

news_service = NewsService()
