from models import db, Plan
from app import create_app

app = create_app()

def seed_plans():
    with app.app_context():
        # Check if plans exist
        if Plan.query.first():
            print("Plans already seeded.")
            return

        plans = [
            Plan(slug='starter', price_dh=200.0, features_json='{"balance": 10000}'),
            Plan(slug='pro', price_dh=500.0, features_json='{"balance": 50000}'),
            Plan(slug='elite', price_dh=1000.0, features_json='{"balance": 100000}'),
        ]
        
        db.session.add_all(plans)
        db.session.commit()
        print("Plans seeded successfully!")

if __name__ == '__main__':
    seed_plans()