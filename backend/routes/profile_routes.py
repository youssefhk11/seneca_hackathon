from flask import Blueprint, request, jsonify
from models import db, User, UserProfile, Group
from utils.helpers import calculate_bmi

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/users/<int:user_id>/profile", methods=["PUT"])
def update_profile(user_id):
    data = request.json or {}
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile or UserProfile(user_id=user.id)
    profile.age = data.get("age")
    profile.weight = data.get("weight")
    profile.height = data.get("height")
    profile.fitness_level = data.get("fitness_level")
    profile.goals = data.get("goals", [])
    profile.city = data.get("city")
    profile.bmi = calculate_bmi(profile.weight, profile.height)

    # Assign group based on city
    if profile.city:
        group = Group.query.filter(Group.name.ilike(f"%{profile.city}%")).first()
        if not group:
            group = Group(name=f"{profile.city} Fitness Group", description=f"Group for {profile.city}")
            db.session.add(group)
        profile.group_id = group.id

    db.session.add(profile)
    db.session.commit()
    return jsonify(user.to_dict(include_profile=True)), 200

@profile_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict(include_profile=True)), 200

@profile_bp.route("/users", methods=["GET"])
def get_all_users():
    users = User.query.all()
    return jsonify([u.to_dict(include_profile=True) for u in users]), 200
