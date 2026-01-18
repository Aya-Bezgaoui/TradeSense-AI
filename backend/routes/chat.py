from flask import Blueprint, request, jsonify
from models import db, ChatMessage, User
from datetime import datetime
import logging

chat_bp = Blueprint('chat', __name__)
logger = logging.getLogger(__name__)

# Very basic auth middleware or check - for MVP we trust the frontend sends user info
# or we use the AuthContext logic which sends tokens. Here we ideally verify token.
# To keep MVP fast, we assume the user_id is passed or verified via middleware.
# Actually, let's try to do it right: use auth middleware if available, 
# or just pass `user_name` for now to be quick.

@chat_bp.route('/', methods=['GET'])
def get_messages():
    try:
        # Get last 50 messages
        messages = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(50).all()
        # Reverse to show oldest first in chat
        messages = messages[::-1]
        
        output = []
        for msg in messages:
            output.append({
                "id": msg.id,
                "user_name": msg.user_name,
                "text": msg.message,
                "timestamp": msg.created_at.isoformat()
            })
        return jsonify(output)
    except Exception as e:
        logger.error(f"Error fetching messages: {str(e)}")
        return jsonify({"error": "Failed to fetch messages"}), 500

@chat_bp.route('/', methods=['POST'])
def post_message():
    try:
        data = request.json
        if not data or not data.get('text') or not data.get('user_name'):
            return jsonify({"error": "Missing text or user_name"}), 400
            
        # In real app, we get user_id from token.
        # Here we mock or use what's sent.
        # Let's try to match a user or use a default ID.
        user = User.query.filter_by(name=data['user_name']).first()
        user_id = user.id if user else 1 # Fallback to admin or ID 1
        
        new_msg = ChatMessage(
            user_id=user_id,
            user_name=data['user_name'],
            message=data['text']
        )
        
        db.session.add(new_msg)
        db.session.commit()
        
        return jsonify({
            "id": new_msg.id,
            "user_name": new_msg.user_name,
            "text": new_msg.message,
            "timestamp": new_msg.created_at.isoformat()
        }), 201
        
    except Exception as e:
        logger.error(f"Error posting message: {str(e)}")
        return jsonify({"error": "Failed to post message"}), 500
