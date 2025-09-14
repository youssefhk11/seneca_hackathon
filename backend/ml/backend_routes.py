# Add these routes to your existing Flask/FastAPI backend

# For Flask:
from flask import request, jsonify
from ml_service import get_fitness_recommendation, ml_service

@app.route('/api/fitness/recommend', methods=['POST'])
def fitness_recommendation():
    """Get fitness recommendation endpoint"""
    try:
        user_data = request.json
        
        # Validate required fields
        required_fields = ['age', 'bmi', 'fitness_level_num']
        for field in required_fields:
            if field not in user_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Get recommendation
        result = get_fitness_recommendation(user_data)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify({"error": result['error']}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fitness/predict-category', methods=['POST'])
def predict_category():
    """Predict user fitness category"""
    try:
        user_data = request.json
        result = ml_service.predict_category(user_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fitness/predict-goal', methods=['POST'])
def predict_goal():
    """Predict user fitness goal"""
    try:
        user_data = request.json
        result = ml_service.predict_goal(user_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# For FastAPI:
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/fitness", tags=["fitness"])

class UserData(BaseModel):
    age: int
    bmi: float
    fitness_level_num: int
    avg_calories_consumed: Optional[int] = None
    avg_calories_burned: Optional[int] = None
    protein_g: Optional[int] = None
    carbs_g: Optional[int] = None
    fat_g: Optional[int] = None
    avg_workout_duration: Optional[int] = None
    avg_workout_intensity: Optional[float] = None
    avg_sleep_duration: Optional[int] = None
    avg_steps: Optional[int] = None
    join_date: Optional[str] = None

@router.post("/recommend")
async def get_recommendation(user_data: UserData):
    """Get fitness recommendation"""
    try:
        data_dict = user_data.dict()
        result = get_fitness_recommendation(data_dict)
        
        if result['success']:
            return result
        else:
            raise HTTPException(status_code=500, detail=result['error'])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-category")
async def predict_user_category(user_data: UserData):
    """Predict user fitness category"""
    try:
        data_dict = user_data.dict()
        result = ml_service.predict_category(data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-goal")
async def predict_user_goal(user_data: UserData):
    """Predict user fitness goal"""
    try:
        data_dict = user_data.dict()
        result = ml_service.predict_goal(data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Don't forget to include the router in your main FastAPI app:
# app.include_router(router)


# Example integration with your existing user system:
@app.route('/api/user/<user_id>/fitness-recommendation', methods=['GET'])
def get_user_fitness_recommendation(user_id):
    """Get recommendation for existing user"""
    try:
        # Get user data from your database
        user = get_user_by_id(user_id)  # Your existing function
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Convert user data to ML format
        user_data = {
            "age": user.age,
            "bmi": user.bmi,
            "fitness_level_num": user.fitness_level,
            "avg_calories_consumed": user.daily_calories,
            # ... map other fields from your user model
        }
        
        result = get_fitness_recommendation(user_data)
        
        if result['success']:
            # Optional: Save recommendation to database
            # save_recommendation(user_id, result)
            return jsonify(result)
        else:
            return jsonify({"error": result['error']}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Middleware to ensure models are loaded
@app.before_first_request
def load_ml_models():
    """Ensure ML models are loaded when app starts"""
    if not ml_service.clf_cat or not ml_service.model_goal:
        print("⚠️ ML models not loaded properly!")
    else:
        print("✅ ML models ready for inference")


# Health check endpoint
@app.route('/api/fitness/health', methods=['GET'])
def fitness_health_check():
    """Check if ML models are loaded and working"""
    return jsonify({
        "status": "healthy",
        "models_loaded": ml_service.clf_cat is not None and ml_service.model_goal is not None,
        "service_version": "1.0"
    })