# backend/services/recommendation_service.py

class RecommendationService:
    @staticmethod
    def generate_recommendations(assessment_data):
        """
        Dynamically compiles diet, workout, and lifestyle guides matching clinical parameters.
        """
        bmi = float(assessment_data.get('bmi', 22.0))
        cycle = int(assessment_data.get('menstrual_cycle', 0))
        weight_gain = assessment_data.get('weight_gain', False)
        hair_growth = assessment_data.get('hair_growth', False)
        skin_darkening = assessment_data.get('skin_darkening', False)
        pimples = assessment_data.get('pimples', False)
        fast_food = assessment_data.get('fast_food', False)
        exercise = assessment_data.get('regular_exercise', True)
        
        diet_plan = []
        exercise_plan = []
        lifestyle_advice = []

        # 1. Diet Plan Compilation
        if fast_food or weight_gain or bmi >= 25.0:
            diet_plan.append("Implement a Low-Glycemic Index (GI) dietary scheme to lower insulin resistance. Shift to whole oats, brown rice, beans, and high-fiber legumes.")
            diet_plan.append("Limit simple carbohydrates, packaged snacks, carbonated soft drinks, and refined sugars which trigger insulin spikes.")
            diet_plan.append("Pair remaining carbohydrates with clean protein (tofu, skinless chicken, egg whites) and healthy fats to slow digestion rates.")
        else:
            diet_plan.append("Incorporate an anti-inflammatory diet containing deep green leafy vegetables, fresh berries, chia seeds, and wild fish.")
            diet_plan.append("Focus on hydration, aiming for 2.5 to 3 liters of water daily to maintain endocrine balance.")

        # 2. Exercise Plan Compilation
        if not exercise:
            exercise_plan.append("Start with 30 minutes of low-impact aerobic exercise (brisk walking, swimming, light cycling) 4 times a week.")
            exercise_plan.append("Gradually introduce basic strength workouts twice a week. Building muscle tissue improves insulin receptors sensitivity.")
        else:
            exercise_plan.append("Continue current physical activity. Introduce structural progressive weightlifting to accelerate metabolic calorie burn.")
            exercise_plan.append("Incorporate recovery days. Avoid overtraining as excessive high-intensity workouts can elevate cortisol (stress hormones).")

        # 3. Lifestyle Advice Compilation
        if hair_growth or skin_darkening or pimples:
            lifestyle_advice.append("Address skin and hair symptoms: regulate sebum by maintaining face hygiene and managing stress to reduce adrenal androgen outputs.")
        
        lifestyle_advice.append("Aim for 7.5 to 8.5 hours of dark restful sleep. Sleep cycles regulate endocrine melatonin levels which support cycle regularity.")
        lifestyle_advice.append("Incorporate daily stress-relief techniques like deep breathing or mindfulness to keep stress hormones (cortisol) from stimulating testosterone release.")

        # 4. Medical Advice Compilation
        medical_advice = []
        if bmi >= 25.0 or cycle == 1:
            medical_advice.append("Schedule a formal clinical consultation with a reproductive endocrinologist or gynecologist.")
            medical_advice.append("Discuss clinical checks: pelvic ovarian ultrasound and hormone blood panels (free/total testosterone, LH/FSH ratio).")
        elif bmi >= 18.5 and bmi < 25.0:
            medical_advice.append("Monitor symptoms over the next 90 days. Share cycle logs and weight metrics during your next routine physical.")
        else:
            medical_advice.append("Consult your doctor during routine annual wellness checkups. Re-evaluate if cycle changes occur.")

        return {
            "diet_plan": diet_plan,
            "exercise_plan": exercise_plan,
            "lifestyle_advice": lifestyle_advice,
            "medical": medical_advice
        }
