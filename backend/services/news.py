import random
from datetime import datetime, timedelta

class NewsService:
    def get_market_news(self):
        # Mock Data - In real app, connect to NewsAPI or similar
        sentiment_options = ['positive', 'negative', 'neutral']
        
        headlines = [
            ("Bitcoin surges past resistance as institutional interest grows", "positive", "Crypto"),
            ("Fed signals potential rate cuts later this year", "positive", "Forex"),
            ("Tech stocks slip amid mixed earnings reports", "negative", "Stocks"),
            ("Oil prices stabilize after volatile week", "neutral", "Commodities"),
            ("New regulatory framework proposed for DeFi", "neutral", "Crypto"),
            ("Gold hits all-time high on global uncertainty", "positive", "Commodities"),
            ("Apple announces revolutionary AI integration", "positive", "Stocks"),
            ("Tesla delivery numbers miss analyst expectations", "negative", "Stocks")
        ]
        
        news = []
        for i in range(5):
            headline, sentiment, category = headlines[i]
            news.append({
                "id": i,
                "title": headline,
                "summary": "This is a brief AI-generated summary of the market event...",
                "source": "TradeSense Wire",
                "published_at": (datetime.now() - timedelta(minutes=random.randint(5, 120))).isoformat(),
                "sentiment": sentiment,
                "category": category
            })
            
        return news

news_service = NewsService()
