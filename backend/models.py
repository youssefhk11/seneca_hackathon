from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    surname = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)

    profile = db.relationship("UserProfile", uselist=False, backref="user")
    chat_messages = db.relationship("ChatMessage", backref="user")

    def to_dict(self, include_profile=False):
        data = {
            "id": self.id,
            "username": self.username,
            "surname": self.surname,
            "phone": self.phone
        }
        if include_profile and self.profile:
            data["profile"] = self.profile.to_dict()
        return data

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    fitness_level = db.Column(db.String(50))
    goals = db.Column(db.ARRAY(db.String))
    bmi = db.Column(db.Float)
    city = db.Column(db.String(128))
    group_id = db.Column(db.Integer, db.ForeignKey("group.id"))

    def to_dict(self):
        return {
            "age": self.age,
            "weight": self.weight,
            "height": self.height,
            "fitness_level": self.fitness_level,
            "goals": self.goals,
            "bmi": self.bmi,
            "city": self.city
        }

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    description = db.Column(db.String(256))
    members = db.relationship("UserProfile", backref="group")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "description": self.description}

class CommunityEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    details = db.Column(db.String(256))
    location = db.Column(db.String(128))
    attendees = db.Column(db.ARRAY(db.Integer))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "details": self.details,
            "location": self.location,
            "attendees": self.attendees or []
        }

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("group.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    username = db.Column(db.String(128))
    message = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "groupId": self.group_id,
            "userId": self.user_id,
            "username": self.username,
            "message": self.message,
            "timestamp": self.timestamp.isoformat()
        }

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    description = db.Column(db.String(256))
    progress = db.Column(db.Integer, default=0)
    reward = db.Column(db.String(128))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "progress": self.progress,
            "reward": self.reward
        }

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    calories = db.Column(db.Float)
    type = db.Column(db.String(128))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "calories": self.calories,
            "type": self.type
        }
