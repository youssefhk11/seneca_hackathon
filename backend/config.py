import os

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:aziz1234@localhost:5432/fitconnect")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGIN = "http://localhost:3000"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")  # Change in production
