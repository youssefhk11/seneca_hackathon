import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
import os

class FitnessMLService:
    def __init__(self, model_dir="./models/"):
        """Initialize ML service with model loading"""
        self.model_dir = model_dir
        self.clf_cat = None
        self.model_goal = None
        self.le = None
        self.user_df = None
        
        # Feature columns
        self.feature_columns_cat = [
            'age', 'bmi', 'fitness_level_num',
            'avg_sleep_duration', 'avg_calories_consumed',
            'avg_steps', 'avg_workout_duration', 'avg_heart_rate', 'days_since_joined'
        ]
        
        self.feature_columns_goal = [
            "avg_calories_consumed", "avg_calories_burned",
            "protein_g", "carbs_g", "fat_g",
            "avg_workout_duration", "avg_workout_intensity",
            "avg_sleep_duration", "days_since_joined"
        ]
        
        self.load_models()
        self.setup_user_data()
    
    def load_models(self):
        """Load ML models and encoders"""
        try:
            # Load models - adjust paths as needed
            self.clf_cat = joblib.load("lgb_model.pkl")
            self.model_goal = joblib.load("lgb_model_balanced.pkl")
            
            # Setup label encoder
            self.le = LabelEncoder()
            self.le.fit(["weight_loss", "muscle_gain", "maintenance"])
            
            print("✅ ML models loaded successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            return False
    
    def setup_user_data(self):
        """Setup example user data - replace with your database query"""
        self.user_df = pd.DataFrame([
            {"category": "Beginner", "merged_goal": "weight_loss",
             "avg_calories_consumed": 2200, "protein_g": 100, "carbs_g": 250, "fat_g": 70,
             "avg_sleep_duration": 420, "avg_workout_duration": 40, "avg_workout_intensity": 2,
             "days_since_joined": 120},
            {"category": "Pro", "merged_goal": "muscle_gain",
             "avg_calories_consumed": 2800, "protein_g": 150, "carbs_g": 350, "fat_g": 80,
             "avg_sleep_duration": 460, "avg_workout_duration": 60, "avg_workout_intensity": 3,
             "days_since_joined": 400},
            {"category": "Activate", "merged_goal": "maintenance",
             "avg_calories_consumed": 2500, "protein_g": 120, "carbs_g": 300, "fat_g": 75,
             "avg_sleep_duration": 440, "avg_workout_duration": 50, "avg_workout_intensity": 2.5,
             "days_since_joined": 250},
        ])
    
    def predict_category(self, user_data):
        """Predict user category only"""
        if self.clf_cat is None:
            raise Exception("Category model not loaded")
        
        df = pd.DataFrame([user_data])
        
        # Handle missing features
        for col in self.feature_columns_cat:
            if col not in df.columns:
                df[col] = 0
        
        df_cat = df[self.feature_columns_cat]
        category_num = self.clf_cat.predict(df_cat)[0]
        category_map = {0: "Beginner", 1: "Activate", 2: "Pro"}
        category = category_map.get(category_num, "Unknown")
        
        return {"category": category, "category_num": int(category_num)}
    
    def predict_goal(self, user_data):
        """Predict user goal only"""
        if self.model_goal is None:
            raise Exception("Goal model not loaded")
        
        df = pd.DataFrame([user_data])
        
        # Handle missing features
        for col in self.feature_columns_goal:
            if col not in df.columns:
                df[col] = 0
        
        df_goal = df[self.feature_columns_goal]
        goal_num = self.model_goal.predict(df_goal)[0]
        goal = self.le.inverse_transform([goal_num])[0]
        
        return {"goal": goal, "goal_num": int(goal_num)}
    
    def get_recommendation(self, user_data):
        """Generate complete fitness recommendation"""
        if not self.clf_cat or not self.model_goal:
            raise Exception("Models not loaded")
        
        # Prepare data
        df = pd.DataFrame([user_data])
        
        # Handle join_date conversion
        if "join_date" in df.columns:
            df["join_date"] = pd.to_datetime(df["join_date"], errors="coerce")
            today = pd.Timestamp.today()
            df["days_since_joined"] = (today - df["join_date"]).dt.days
            df = df.drop(columns=["join_date"])
        
        # Ensure all required features exist
        for col in self.feature_columns_cat:
            if col not in df.columns:
                df[col] = 0
        df_cat = df[self.feature_columns_cat]
        
        for col in self.feature_columns_goal:
            if col not in df.columns:
                df[col] = 0
        df_goal = df[self.feature_columns_goal]
        
        # Make predictions
        category_num = self.clf_cat.predict(df_cat)[0]
        category_map = {0: "Beginner", 1: "Activate", 2: "Pro"}
        category = category_map.get(category_num, "Unknown")
        
        goal_num = self.model_goal.predict(df_goal)[0]
        goal = self.le.inverse_transform([goal_num])[0]
        
        # Find similar users
        similar_users = self.user_df[
            (self.user_df['category'] == category) &
            (self.user_df['merged_goal'] == goal)
        ]
        
        if similar_users.empty:
            similar_users = self.user_df[self.user_df['category'] == category]
        
        if similar_users.empty:
            similar_users = self.user_df
        
        # Calculate recommendations
        rec_diet = similar_users[['avg_calories_consumed', 'protein_g', 'carbs_g', 'fat_g']].mean()
        rec_sleep = similar_users[['avg_sleep_duration']].mean()
        rec_workout = similar_users[['avg_workout_duration', 'avg_workout_intensity']].mean()
        rec_experience = similar_users[['days_since_joined']].mean()
        
        recommendation_text = f"""Category: {category}
Goal: {goal}
Experience: {rec_experience['days_since_joined']:.0f} days since joining

🥗 Nutrition:
  - Calories: {rec_diet['avg_calories_consumed']:.0f}
  - Protein: {rec_diet['protein_g']:.0f} g
  - Carbs: {rec_diet['carbs_g']:.0f} g
  - Fat: {rec_diet['fat_g']:.0f} g

🏋️ Workout:
  - Duration: {rec_workout['avg_workout_duration']:.0f} min
  - Intensity: {rec_workout['avg_workout_intensity']:.1f}/4 scale

😴 Sleep:
  - Target duration: {rec_sleep['avg_sleep_duration'] / 60:.1f} hours"""
        
        return {
            "success": True,
            "category": category,
            "goal": goal,
            "recommendation": recommendation_text,
            "nutrition": {
                "calories": int(rec_diet['avg_calories_consumed']),
                "protein": int(rec_diet['protein_g']),
                "carbs": int(rec_diet['carbs_g']),
                "fat": int(rec_diet['fat_g'])
            },
            "workout": {
                "duration": int(rec_workout['avg_workout_duration']),
                "intensity": round(rec_workout['avg_workout_intensity'], 1)
            },
            "sleep": {
                "hours": round(rec_sleep['avg_sleep_duration'] / 60, 1)
            }
        }

# Initialize the service (singleton pattern)
ml_service = FitnessMLService()

def get_fitness_recommendation(user_data):
    """
    Main function to call from your existing backend
    
    Args:
        user_data (dict): User data containing:
            - age (int): User's age
            - bmi (float): User's BMI
            - fitness_level_num (int): 0=Beginner, 1=Intermediate, 2=Advanced
            - avg_calories_consumed (int, optional)
            - avg_calories_burned (int, optional)
            - protein_g (int, optional)
            - carbs_g (int, optional)
            - fat_g (int, optional)
            - avg_workout_duration (int, optional)
            - avg_workout_intensity (float, optional)
            - avg_sleep_duration (int, optional): in minutes
            - avg_steps (int, optional)
            - join_date (str, optional): YYYY-MM-DD format
    
    Returns:
        dict: Recommendation result
    """
    try:
        # Set defaults for missing fields
        defaults = {
            "avg_sleep_duration": 420,  # 7 hours in minutes
            "avg_calories_consumed": 2000,
            "avg_calories_burned": 200,
            "avg_steps": 8000,
            "avg_workout_duration": 30,
            "avg_workout_intensity": 2,
            "avg_heart_rate": 70,
            "protein_g": 100,
            "carbs_g": 250,
            "fat_g": 70,
            "join_date": "2024-01-01"
        }
        
        for key, value in defaults.items():
            if key not in user_data:
                user_data[key] = value
        
        return ml_service.get_recommendation(user_data)
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Example usage for your existing routes
if __name__ == "__main__":
    # Test the service
    test_user = {
        "age": 25,
        "bmi": 23.5,
        "fitness_level_num": 1,
        "avg_calories_consumed": 2300,
        "protein_g": 90
    }
    
    result = get_fitness_recommendation(test_user)
    print(result)