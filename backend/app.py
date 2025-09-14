from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.community_routes import community_bp
from routes.ai_routes import ai_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.config.from_object(Config)
db.init_app(app)
CORS(app, origins=Config.FRONTEND_ORIGIN, supports_credentials=True)

with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")

# Blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(community_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api")

@app.before_request
def log_request_info():
    print(f"Incoming request: {request.method} {request.path}")
    print(f"Headers: {request.headers}")
    print(f"Body: {request.get_data()}")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/test")
def test():
    return {"message": "Flask is working!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)
