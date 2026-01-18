from datetime import datetime
from models import db, Challenge

def evaluate_challenge(challenge_id):
    """
    The 'Killer Function': Evaluates Prop Firm rules for a specific challenge.
    Rules:
    1. Max Daily Loss 5% (equity vs daily_start_equity) -> FAIL
    2. Max Total Loss 10% (equity vs start_balance) -> FAIL
    3. Profit Target 10% (equity vs start_balance) -> PASS
    """
    challenge = Challenge.query.get(challenge_id)
    if not challenge or challenge.status != 'active':
        return

    # 1. Reset Daily Equity if new day
    current_time = datetime.utcnow()
    if challenge.last_daily_reset.date() < current_time.date():
        # It's a new day, update daily start equity
        # In a real system, this would be the equity at approx 00:00 UTC
        # For this logic, we assume the equity carries over
        challenge.daily_start_equity = challenge.equity
        challenge.last_daily_reset = current_time
        db.session.commit() # Save reset state

    # Ensure daily_start_equity is set (for new accounts)
    if challenge.daily_start_equity is None:
        challenge.daily_start_equity = challenge.start_balance

    # --- RULES EVALUATION ---
    
    # 1. Max Total Loss (10%)
    # Fail if equity drops below 90% of start balance
    if challenge.equity < (challenge.start_balance * 0.90):
        challenge.status = 'failed'
        challenge.failed_at = datetime.utcnow()
        db.session.commit()
        return {'status': 'failed', 'reason': 'Max Total Loss Exceeded'}

    # 2. Max Daily Loss (5%)
    # Fail if equity drops below 95% of DAILY START equity
    if challenge.equity < (challenge.daily_start_equity * 0.95):
        challenge.status = 'failed'
        challenge.failed_at = datetime.utcnow()
        db.session.commit()
        return {'status': 'failed', 'reason': 'Max Daily Loss Exceeded'}

    # 3. Profit Target (10%)
    # Pass if equity exceeds 110% of start balance
    if challenge.equity >= (challenge.start_balance * 1.10):
        challenge.status = 'passed'
        challenge.passed_at = datetime.utcnow()
        db.session.commit()
        return {'status': 'passed', 'reason': 'Profit Target Hit'}

    return {'status': 'active', 'reason': 'Ongoing'}
