from app import app
from werkzeug.security import generate_password_hash
from models import db, User, UserProfile, Group, CommunityEvent, ChatMessage, Challenge, Meal

with app.app_context():
    # ---------------------------
    # Create test users
    if not User.query.filter_by(username="ahmed").first():
        user1 = User(
            username="ahmed",
            surname="gharbi",
            phone="123456789",
            password_hash=generate_password_hash("mypassword")
        )
        db.session.add(user1)
        db.session.commit()

        profile1 = UserProfile(
            user_id=user1.id,
            age=25,
            weight=70,
            height=175,
            fitness_level="Beginner",
            goals=["Lose Weight", "Build Muscle"],
            city="Tunis",
            bmi=round(70 / (1.75**2), 2)
        )
        db.session.add(profile1)

    if not User.query.filter_by(username="aymen").first():
        user2 = User(
            username="aymen",
            surname="jdid",
            phone="987654321",
            password_hash=generate_password_hash("mypassword")
        )
        db.session.add(user2)
        db.session.commit()

        profile2 = UserProfile(
            user_id=user2.id,
            age=30,
            weight=80,
            height=180,
            fitness_level="Intermediate",
            goals=["Build Muscle"],
            city="Sfax",
            bmi=round(80 / (1.8**2), 2)
        )
        db.session.add(profile2)

    db.session.commit()

    # ---------------------------
    # Add community events
    events_data = [
        {"title": "Morning Run", "details": "5km in the park", "location": "Tunis"},
        {"title": "Yoga Session", "details": "Morning yoga with instructor", "location": "Sousse"}
    ]
    for ev in events_data:
        if not CommunityEvent.query.filter_by(title=ev["title"]).first():
            event = CommunityEvent(title=ev["title"], details=ev["details"], location=ev["location"])
            db.session.add(event)

    # ---------------------------
    # Add groups
    groups_data = [
        {"name": "Tunis Fitness Group", "description": "Group for Tunis"},
        {"name": "Sousse Gym Buddies", "description": "Fitness friends from Sousse"}
    ]
    for g in groups_data:
        if not Group.query.filter_by(name=g["name"]).first():
            group = Group(name=g["name"], description=g["description"])
            db.session.add(group)

    db.session.commit()

    # ---------------------------
    # Add challenges
    challenges_data = [
        {"title": "Lose 5kg", "description": "Weight loss challenge", "progress": 0, "reward": "Protein Bar"},
        {"title": "Run 20km", "description": "Running challenge", "progress": 0, "reward": "Medal"}
    ]
    for ch in challenges_data:
        if not Challenge.query.filter_by(title=ch["title"]).first():
            challenge = Challenge(**ch)
            db.session.add(challenge)

    # ---------------------------
    # Add meals
    meals_data = [
        {"name": "Chicken Salad", "calories": 350, "type": "Lunch"},
        {"name": "Oatmeal", "calories": 250, "type": "Breakfast"},
        {"name": "Protein Shake", "calories": 200, "type": "Snack"}
    ]
    for meal_data in meals_data:
        if not Meal.query.filter_by(name=meal_data["name"]).first():
            meal = Meal(**meal_data)
            db.session.add(meal)

    # ---------------------------
    # Add some chat messages
    # Assuming group 1 exists
    group1 = Group.query.filter_by(name="Tunis Fitness Group").first()
    user1 = User.query.filter_by(username="ahmed").first()
    user2 = User.query.filter_by(username="aymen").first()

    if group1:
        messages = [
            {"group_id": group1.id, "user_id": user1.id, "username": user1.username, "message": "Hey everyone!"},
            {"group_id": group1.id, "user_id": user2.id, "username": user2.username, "message": "Hello Ahmed!"}
        ]
        for msg in messages:
            chat = ChatMessage(**msg)
            db.session.add(chat)

    db.session.commit()
    print("✅ Full mock data seeded successfully!")
