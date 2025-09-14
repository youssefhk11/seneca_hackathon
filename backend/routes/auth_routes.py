from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import jwt
from datetime import datetime, timedelta
from config import Config

auth_bp = Blueprint("auth", __name__)

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

def decode_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        return None

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    username, surname, phone, password = data.get("username"), data.get("surname"), data.get("phone"), data.get("password")
    if not all([username, surname, phone, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(phone=phone).first():
        return jsonify({"error": "User already exists"}), 409

    pw_hash = generate_password_hash(password)
    user = User(username=username, surname=surname, phone=phone, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"user": user.to_dict(), "token": token}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    phone, password = data.get("phone"), data.get("password")
    if not phone or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(phone=phone).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user.id)
    return jsonify({"user": user.to_dict(include_profile=True), "token": token}), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    # For JWT, logout is client-side: just discard the token
    return jsonify({"message": "Logout successful"}), 200
