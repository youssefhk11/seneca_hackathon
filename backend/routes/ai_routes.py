from flask import Blueprint, request, jsonify
from ai_model import AIModel

ai_bp = Blueprint("ai", __name__)
ai_model = AIModel()

@ai_bp.route("/ai/chat", methods=["POST"])
def chat():
    data = request.json or {}
    prompt = data.get("prompt")
    profile = data.get("userProfile", {})
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400
    return jsonify({"response": ai_model.chat(prompt, profile)}), 200

@ai_bp.route("/ai/generate-workout", methods=["POST"])
def generate_workout():
    data = request.json or {}
    if not data.get("eventTitle"):
        return jsonify({"error": "Missing eventTitle"}), 400
    return jsonify({"plan": ai_model.generate_workout(data["eventTitle"])}), 200

@ai_bp.route("/ai/classify", methods=["POST"])
def classify():
    profile = request.json or {}
    return jsonify({"level": ai_model.classify(profile)}), 200
