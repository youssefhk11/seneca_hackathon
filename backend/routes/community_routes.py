from flask import Blueprint, request, jsonify
from models import db, User, UserProfile, Group, CommunityEvent, ChatMessage, Challenge

community_bp = Blueprint("community", __name__)

@community_bp.route("/community/stats", methods=["GET"])
def stats():
    total_members = User.query.count()
    total_groups = Group.query.count()
    upcoming_events = CommunityEvent.query.count()
    return jsonify({
        "totalMembers": total_members,
        "totalGroups": total_groups,
        "upcomingEvents": upcoming_events
    })

@community_bp.route("/community/events", methods=["GET"])
def get_events():
    events = CommunityEvent.query.all()
    return jsonify([e.to_dict() for e in events]), 200

@community_bp.route("/community/groups", methods=["GET"])
def get_groups():
    groups = Group.query.all()
    return jsonify([g.to_dict() for g in groups]), 200

@community_bp.route("/leaderboard", methods=["GET"])
def leaderboard():
    users = User.query.all()
    leaderboard = []
    for u in users:
        pts = 10
        if u.profile:
            if u.profile.age:
                pts += max(0, 100 - u.profile.age)
            if u.profile.bmi:
                pts += max(0, int(100 - u.profile.bmi))
        leaderboard.append({"user": u.to_dict(include_profile=True), "points": int(pts)})
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return jsonify(leaderboard), 200

@community_bp.route("/challenges", methods=["GET"])
def get_challenges():
    challenges = Challenge.query.all()
    return jsonify([c.to_dict() for c in challenges]), 200

@community_bp.route("/reports", methods=["GET"])
def reports():
    # Mock example for weekly/monthly progress
    return jsonify({"weekly": {"steps": 50000}, "monthly": {"steps": 200000}}), 200

@community_bp.route("/chat/<int:group_id>/messages", methods=["GET"])
def get_messages(group_id):
    msgs = ChatMessage.query.filter_by(group_id=group_id).all()
    return jsonify([m.to_dict() for m in msgs]), 200

@community_bp.route("/chat/<int:group_id>/messages", methods=["POST"])
def post_message(group_id):
    data = request.json or {}
    user_id = data.get("userId")
    message = data.get("message")
    if not user_id or not message:
        return jsonify({"error": "Missing fields"}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    msg = ChatMessage(group_id=group_id, user_id=user.id, username=user.username, message=message)
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201
