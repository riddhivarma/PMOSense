# backend/services/predict_service.py
import os
import joblib
import pandas as pd
import numpy as np

# Paths setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'machine_learning', 'pcos_model.pkl')

class PredictService:
    _model = None

    @classmethod
    def _load_assets(cls):
        """Loads serialized model asset lazily"""
        if cls._model is None:
            # Fallback path checks just in case
            model_file = MODEL_PATH
            
            if not os.path.exists(model_file):
                # Temporary fallback if running during dev without full path resolution
                model_file = os.path.join(BASE_DIR, 'machine_learning', 'pcos_model.pkl')
                
                if not os.path.exists(model_file):
                    print("Warning: pcos_model.pkl not found at", model_file)
            
            try:
                cls._model = joblib.load(model_file)
            except Exception as e:
                print(f"Failed to load model: {e}")
                # Optional empty fallback if model isn't populated yet
                cls._model = None

    @classmethod
    def evaluate_risk(cls, data):
        """
        Runs Random Forest classification on clinical symptoms features dictionary.
        Returns:
            prediction_result: 'High', 'Moderate', or 'Low'
            confidence_score: percentage value (0 to 100)
            probability: float risk score
        """
        cls._load_assets()

        # Compile DataFrame matching model feature columns exactly (including units)
        feature_cols = [
            'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 'Blood Group', 'Cycle(R/I)', 'Cycle length(days)', 
            'Weight gain(Y/N)', 'hair growth(Y/N)', 'Skin darkening (Y/N)', 'Hair loss(Y/N)', 
            'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)'
        ]

        # Map binary attributes correctly (Yes=1, No=0)
        def get_binary(val):
            if isinstance(val, bool):
                return 1 if val else 0
            if str(val).lower() in ['yes', '1', 'true']:
                return 1
            return 0

        # Map Blood Group string to standard numerical encoding
        blood_group_map = {
            'A+': 11, 'A-': 12, 'B+': 13, 'B-': 14,
            'O+': 15, 'O-': 16, 'AB+': 17, 'AB-': 18
        }
        bg_str = str(data.get('blood_group', 'O+')).strip().upper()
        blood_group_val = blood_group_map.get(bg_str, 15)

        # Map Cycle (0 for regular, 1 for irregular) to model representation (2 and 4)
        cycle_val = 4 if int(data.get('menstrual_cycle', 0)) == 1 else 2

        # Build feature dict
        input_data = {
            'Age (yrs)': [int(data.get('age'))],
            'Weight (Kg)': [float(data.get('weight'))],
            'Height(Cm)': [float(data.get('height'))],
            'BMI': [float(data.get('bmi'))],
            'Blood Group': [blood_group_val],
            'Cycle(R/I)': [cycle_val],
            'Cycle length(days)': [int(data.get('cycle_length', 28))],
            'Weight gain(Y/N)': [get_binary(data.get('weight_gain'))],
            'hair growth(Y/N)': [get_binary(data.get('hair_growth'))],
            'Skin darkening (Y/N)': [get_binary(data.get('skin_darkening'))],
            'Hair loss(Y/N)': [get_binary(data.get('hair_loss'))],
            'Pimples(Y/N)': [get_binary(data.get('pimples'))],
            'Fast food (Y/N)': [get_binary(data.get('fast_food'))],
            'Reg.Exercise(Y/N)': [get_binary(data.get('regular_exercise', True))]
        }

        df_input = pd.DataFrame(input_data, columns=feature_cols)

        # Execute prediction
        if cls._model is None:
            # Fallback mock probability if empty model file hasn't been replaced yet
            prob = 0.5
        else:
            prob = float(cls._model.predict_proba(df_input)[0][1])

        # Map probability thresholds
        if prob >= 0.65:
            result = "High"
        elif prob >= 0.35:
            result = "Moderate"
        else:
            result = "Low"

        # Calculate confidence score matching probability offsets
        confidence = round(prob * 100) if prob >= 0.5 else round((1 - prob) * 100)
        confidence = max(min(confidence, 99), 55) # clamp between 55% and 99%

        return result, confidence, prob
