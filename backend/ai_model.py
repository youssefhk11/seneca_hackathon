class AIModel:
    def chat(self, prompt, user_profile):
        return f"Echo: {prompt} based on your profile."

    def classify(self, profile):
        return "Intermediate"

    def generate_workout(self, event_title):
        return f"Workout plan for event '{event_title}': 5km run, 20 push-ups, 15 squats."
