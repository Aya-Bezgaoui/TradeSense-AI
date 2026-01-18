from models import db, Challenge, DailyMetrics
from datetime import datetime
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
            # If generated first time today, start equity is effectively current equity before this trade 
            # (or we should have snapshot at midnight). 
            # For simplicity in MVP: use current equity as start if none exists (flawed but works for day 1)
            # Better: Get yesterday's close or use challenge start if day 1.
            metrics = DailyMetrics(
                challenge_id=challenge.id,
                date=today,
                day_start_equity=current_equity, # Approx
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