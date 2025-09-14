FitConnect - AI-Powered Fitness Community
<div align="center"> <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> </div>
Overview
FitConnect is an AI-powered web application designed to create a vibrant fitness community where users can create profiles, get matched with other members, and receive personalized fitness advice from an AI assistant. The platform combines social features with intelligent recommendations to help users achieve their fitness goals.

🏋️ Fis Fitness – My Fit Guy Integration
Fis Fitness is an intelligent fitness recommendation system powered by My Fit Guy, a machine learning model that provides personalized lifestyle recommendations in three key areas:

🥗 Nutrition

😴 Sleep

🏃 Training

This project combines machine learning models with a web-based application to deliver actionable fitness insights to users based on their personal data.

📌 Project Overview
The goal of this project is to help users adopt a healthy lifestyle by providing personalized recommendations.

We built two LightGBM models to classify users and predict their goals:

Category Classifier (lgb_model.pkl)

Predicts the fitness level category: Beginner, Activate, or Pro.

Goal Classifier (lgb_model_balanced.pkl)

Predicts the user's fitness goal (e.g., weight loss, muscle gain, maintenance).

These models are used together to generate clear recommendations for a new user, including diet, workout, and sleep suggestions.

⚙️ Pipeline Steps
Data Collection & Preprocessing

User data includes demographics, lifestyle, and fitness information.

Features used:

age, bmi, fitness_level_num

avg_sleep_duration, avg_calories_consumed, avg_calories_burned

avg_steps, avg_workout_duration, avg_workout_intensity

protein_g, carbs_g, fat_g

join_date → converted to days_since_joined.

Model Training

LightGBM Classifier was chosen for efficiency and performance.

Two separate models were trained:

Category model (lgb_model.pkl)

Goal model (lgb_model_balanced.pkl)

Model Saving

Models were serialized with joblib for easy reuse.

Local Testing

A standalone script (test_ml_standalone.py) allows users to test the models without the website, just by entering their personal info.

Web Application

A backend service (ml_service.py, backend_routes.py) integrates the models into an API.

A frontend script (useFitnessRecommendations.js) fetches predictions and displays recommendations.

📂 Project Files
File	Description	Usage
lgb_model.pkl	LightGBM model for predicting user fitness category	✅ Required (local + web)
lgb_model_balanced.pkl	LightGBM model for predicting user fitness goals	✅ Required (local + web)
ml_service.py	Backend service to load models and serve predictions (FastAPI/Flask)	✅ Required (web)
backend_routes.py	API routes for connecting frontend with backend	✅ Required (web)
useFitnessRecommendations.js	Frontend script to call backend and display recommendations	✅ Required (web)
requirements.txt	Python dependencies (LightGBM, pandas, joblib, Flask/FastAPI, etc.)	✅ Required (local + web)
test_ml_standalone.py	Script to test recommendations locally without the website	✅ Required (local only)
🚀 Usage Instructions
🔹 Local Standalone Mode (without website)
Install dependencies:

bash
pip install -r requirements.txt
Run the local test script:

bash
python test_ml_standalone.py
Enter your personal info:

python
age = 25
bmi = 23
fitness_level_num = 1
avg_sleep_duration = 7*60
avg_calories_consumed = 2500
avg_calories_burned = 400
avg_steps = 8000
avg_workout_duration = 45
avg_workout_intensity = 2
protein_g = 100
carbs_g = 300
fat_g = 70
join_date = "2025-01-01"
Get a personalized recommendation (nutrition, sleep, training).

text
Example:
  Category: Beginner
  Goal: Weight Loss
  Experience: 120 days since joining

 🥗 Nutrition:
    - Calories: 2200
    - Protein: 100 g
    - Carbs: 250 g
    - Fat: 70 g

🏋️ Workout:
   - Duration: 40 min
   - Intensity: 2/4 scale

😴 Sleep:
   - Target duration: 7.5 hours
🚀 Run and Deploy Your AI Studio App
This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Sqa7FX

please send it to me in a document
I'll create a comprehensive README document for your FitConnect project that combines both the web application and the AI model components.

FitConnect - AI-Powered Fitness Community
Table of Contents
Overview

Features

Technology Stack

Installation & Setup

Project Structure

AI Model Integration (Fis Fitness - My Fit Guy)

Usage Instructions

API Reference

Team Members

License

Overview
FitConnect is an AI-powered web application designed to create a vibrant fitness community where users can create profiles, get matched with other members, and receive personalized fitness advice from an AI assistant. The platform combines social features with intelligent recommendations to help users achieve their fitness goals.

The application integrates Fis Fitness - My Fit Guy, an intelligent fitness recommendation system that provides personalized lifestyle recommendations in nutrition, sleep, and training through machine learning models.

Features
User Authentication: Secure login and registration system

Profile Management: Complete user profiles with fitness information

AI-Powered Recommendations: Personalized nutrition, workout, and sleep suggestions

Community Features: Connect with other fitness enthusiasts

Progress Tracking: Monitor your fitness journey over time

Responsive Design: Works on desktop and mobile devices

Technology Stack
Frontend
React 19.1.1

TypeScript

Tailwind CSS

Vite (Build tool)

Backend
Node.js (Simulated via service workers)

Machine Learning Models (LightGBM)

Google Gemini AI integration

Machine Learning
LightGBM Classifiers

Python (for model training and inference)

Joblib (for model serialization)

Installation & Setup
Prerequisites
Node.js (v18 or higher)

Python 3.8+ (for ML components)

Gemini API key

Installation Steps
Clone the repository

bash
git clone <repository-url>
cd fitconnect
Install frontend dependencies

bash
npm install
Set up environment variables
Create a .env.local file in the root directory:

text
GEMINI_API_KEY=your_gemini_api_key_here
Install Python dependencies (for ML components)

bash
pip install -r requirements.txt
Run the application

bash
npm run dev
Start the ML service (in a separate terminal)

bash
python ml_service.py
The application will be available at http://localhost:5173

Project Structure
text
fitconnect/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Shared components
│   │   ├── LoginPage.tsx   # Login component
│   │   ├── RegistrationPage.tsx # Registration component
│   │   └── ...            # Other page components
│   ├── services/           # API services
│   │   └── database.ts     # Mock database service
│   ├── types.ts           # TypeScript type definitions
│   └── App.tsx            # Main application component
├── ml/                    # Machine learning components
│   ├── lgb_model.pkl              # Category prediction model
│   ├── lgb_model_balanced.pkl     # Goal prediction model
│   ├── ml_service.py              # ML inference service
│   ├── backend_routes.py          # API routes for ML
│   ├── test_ml_standalone.py      # Standalone testing script
│   └── requirements.txt           # Python dependencies
├── public/                # Static assets
├── package.json           # Node.js dependencies
├── vite.config.ts         # Vite configuration
└── index.html            # Main HTML file
AI Model Integration (Fis Fitness - My Fit Guy)
Fis Fitness is the intelligent recommendation system powered by My Fit Guy, a machine learning model that provides personalized lifestyle recommendations in three key areas:

🥗 Nutrition

😴 Sleep

🏃 Training

Model Architecture
We built two LightGBM models to classify users and predict their goals:

Category Classifier (lgb_model.pkl)

Predicts the fitness level category: Beginner, Activate, or Pro

Goal Classifier (lgb_model_balanced.pkl)

Predicts the user's fitness goal (e.g., weight loss, muscle gain, maintenance)

Data Processing Pipeline
Data Collection & Preprocessing

User data includes demographics, lifestyle, and fitness information

Features used:

age, bmi, fitness_level_num

avg_sleep_duration, avg_calories_consumed, avg_calories_burned

avg_steps, avg_workout_duration, avg_workout_intensity

protein_g, carbs_g, fat_g

join_date → converted to days_since_joined

Model Training

LightGBM Classifier was chosen for efficiency and performance

Two separate models were trained for category and goal prediction

Model Deployment

Models serialized with Joblib for easy reuse

Integrated with web application through API endpoints

Usage Instructions
Web Application Usage
Registration: Create a new account with your basic information

Onboarding: Complete your fitness profile with details about your goals and current fitness level

Dashboard: View personalized recommendations on the main dashboard

Community: Connect with other users and join fitness groups

Progress Tracking: Monitor your progress over time

ML Model Testing (Standalone)
You can test the ML models without the web application:

Navigate to the ml directory:

bash
cd ml
Run the standalone test script:

bash
python test_ml_standalone.py
Enter your personal information when prompted:

python
age = 25
bmi = 23
fitness_level_num = 1
avg_sleep_duration = 7*60  # in minutes
avg_calories_consumed = 2500
avg_calories_burned = 400
avg_steps = 8000
avg_workout_duration = 45  # in minutes
avg_workout_intensity = 2  # on a scale of 1-4
protein_g = 100
carbs_g = 300
fat_g = 70
join_date = "2025-01-01"
View your personalized recommendations

Example Output
text
Category: Beginner
Goal: Weight Loss
Experience: 120 days since joining

🥗 Nutrition:
   - Calories: 2200
   - Protein: 100 g
   - Carbs: 250 g
   - Fat: 70 g

🏋️ Workout:
   - Duration: 40 min
   - Intensity: 2/4 scale

😴 Sleep:
   - Target duration: 7.5 hours
API Reference
ML Service API
The ML service provides the following endpoints:

POST /api/predict - Get fitness recommendations

Request body: User fitness data

Response: Personalized recommendations

GET /api/health - Service health check

Frontend API
The frontend communicates with the ML service through these endpoints:

POST /api/user/recommendations - Get user-specific recommendations

GET /api/community/events - Get community events

GET /api/leaderboard - Get leaderboard data

Team Members
Ahmed Layouni

Youssef Hajckacem

Ahmed Aziz Gharbi

Med Ayoub Ktary
