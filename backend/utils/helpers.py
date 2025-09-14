def calculate_bmi(weight, height):
    if not weight or not height:
        return None
    return round(weight / ((height / 100) ** 2), 2)
