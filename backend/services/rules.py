from models import db, Challenge, DailyMetrics
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class RulesEngine:
    @staticmethod
    def evaluate_challenge(challenge_id):
        """
        Evaluate business rules for a challenge:
        - Max Daily Loss (5% of start balance)
        - Max Total Loss (10% of start balance)
        - Profit Target (10% of start balance)
        
        Updates challenge.status if a rule is triggered.
        """
        challenge = Challenge.query.get(challenge_id)
        if not challenge or challenge.status != 'active':
            return

        start_balance = challenge.start_balance
        current_equity = challenge.equity
        
        # 1. Total Loss Check (10%)
        # Fail if equity < 90% of start balance
        max_loss_limit = start_balance * 0.90
        if current_equity <= max_loss_limit:
            challenge.status = 'failed'
            challenge.failed_at = datetime.utcnow()
            db.session.commit()
            return "failed_total_loss"

        # 2. Daily Loss Check (5%)
        # We need today's starting equity. 
        # If no daily metric exists for today, we create one inheriting yesterday's end or start balance.
        today = datetime.utcnow().date()
        metrics = DailyMetrics.query.filter_by(challenge_id=challenge.id, date=today).first()
        
        if not metrics:
            # Logic to determine day_start_equity correctly:
            # 1. Try to find yesterday's metrics
            # 2. If not found, check if it's the very first day (use start_balance)
            # 3. Fallback to current (less ideal but prevents crash)
            
            yesterday = today - timedelta(days=1)
            last_metric = DailyMetrics.query.filter_by(challenge_id=challenge.id, date=yesterday).first()
            
            if last_metric:
                opening_equity = last_metric.day_end_equity or last_metric.day_start_equity
            else:
                # Assuming first day of trading or gap
                # If total fresh, use start_balance. 
                # If gap, we should technically use last known equity.
                opening_equity = challenge.start_balance if challenge.equity == challenge.start_balance else challenge.equity
                # BETTER: logic to find *last known* metric if multiple days gap? 
                # For MVP simplicity: Use Start Balance if no history, or Current if mid-game.
                # Actually, correct logic: "Day Start" is the equity at 00:00.
                # If we have no record, and we are mid-trade, it's tricky.
                # Let's assume opening_equity = challenge.equity is 'okay' for gaps for now, 
                # BUT heavily favor start_balance if it matches (fresh account).
                if len(challenge.trades) == 0:
                     opening_equity = challenge.start_balance

            metrics = DailyMetrics(
                challenge_id=challenge.id,
                date=today,
                day_start_equity=opening_equity,
                day_end_equity=current_equity
            )
            db.session.add(metrics)
            db.session.commit()
        

        
        # Calculate Drawdown from Day Start
        day_start = metrics.day_start_equity
        # Limit is 5% drop from Day Start
        daily_limit = day_start * 0.95
        
        if current_equity <= daily_limit:
            challenge.status = 'failed'
            challenge.failed_at = datetime.utcnow()
            db.session.commit()
            return "failed_daily_loss"
            
        # Update metrics
        metrics.day_end_equity = current_equity
        metrics.day_pnl = current_equity - day_start
        # Track max drawdown (simplified)
        
        # 3. Profit Target (10%)
        target = start_balance * 1.10
        if current_equity >= target:
            challenge.status = 'passed'
            challenge.passed_at = datetime.utcnow()
            db.session.commit()
            return "passed"

        db.session.commit()
        return "active"

rules_engine = RulesEngine()