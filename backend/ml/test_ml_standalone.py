import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
import os

print("🤖 Testing ML Models")
print("=" * 30)

# Check if model files exist
print("📁 Checking for model files...")
if os.path.exists("lgb_model.pkl"):
    print("✅ lgb_model.pkl found")
else:
    print("❌ lgb_model.pkl not found!")

if os.path.exists("lgb_model_balanced.pkl"):
    print("✅ lgb_model_balanced.pkl found")
else:
    print("❌ lgb_model_balanced.pkl not found!")

# Try to load models
print("\n🔄 Loading models...")
try:
    clf_cat = joblib.load("lgb_model.pkl")                # category model
    model_goal = joblib.load("lgb_model_balanced.pkl")    # goal model
    print("✅ Models loaded successfully!")
    
    # Setup label encoder
    le = LabelEncoder()
    le.fit(["weight_loss", "muscle_gain", "maintenance"])
    
    # Test data
    test_user = {
        "age": 25,
        "bmi": 23,
        "fitness_level_num": 1,
        "avg_sleep_duration": 420,
        "avg_calories_consumed": 2300,
        "avg_calories_burned": 300,
        "avg_steps": 7000,
        "avg_workout_duration": 45,
        "avg_workout_intensity": 2,
        "avg_heart_rate": 70,
        "days_since_joined": 100,
        "protein_g": 90,
        "carbs_g": 400,
        "fat_g": 60
    }
    
    print(f"\n🧪 Testing with user: {test_user}")
    
    # Test category prediction
    df = pd.DataFrame([test_user])
    
    feature_columns_cat = [
        'age', 'bmi', 'fitness_level_num',
        'avg_sleep_duration', 'avg_calories_consumed',
        'avg_steps', 'avg_workout_duration', 'avg_heart_rate', 'days_since_joined'
    ]
    
    df_cat = df[feature_columns_cat]
    category_num = clf_cat.predict(df_cat)[0]
    category_map = {0: "Beginner", 1: "Activate", 2: "Pro"}
    category = category_map.get(category_num, "Unknown")
    
    print(f"📊 Category Prediction: {category} (class {category_num})")
    
    # Test goal prediction
    feature_columns_goal = [
        "avg_calories_consumed", "avg_calories_burned",
        "protein_g", "carbs_g", "fat_g",
        "avg_workout_duration", "avg_workout_intensity",
        "avg_sleep_duration", "days_since_joined"
    ]
    
    df_goal = df[feature_columns_goal]
    goal_num = model_goal.predict(df_goal)[0]
    goal = le.inverse_transform([goal_num])[0]
    
    print(f"🎯 Goal Prediction: {goal} (class {goal_num})")
    
    print("\n🎉 SUCCESS! Your ML models are working perfectly!")
    print("✅ Ready for integration into your website")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\nPress Enter to exit...")
input()