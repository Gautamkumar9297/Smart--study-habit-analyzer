from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model
model_path = os.path.join(os.path.dirname(__file__), 'study_model.pkl')

if not os.path.exists(model_path):
    model_path = os.path.join(os.path.dirname(__file__), '..', 'study_model.pkl')

model = joblib.load(model_path)

print(f"✅ Model loaded successfully from: {model_path}")


# Root route
@app.route('/')
def home():
    return jsonify({
        "message": "Smart Study Habit ML Service Running"
    })


# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'ML Service is running'
    })


# Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        features = [
            float(data['age']),
            float(data['gender']),
            float(data['study_hours_per_day']),
            float(data['social_media_hours']),
            float(data['netflix_hours']),
            float(data['attendance_percentage']),
            float(data['sleep_hours']),
            float(data['diet_quality']),
            float(data['exercise_frequency']),
            float(data['parental_education_level']),
            float(data['internet_quality']),
            float(data['mental_health_rating']),
            float(data['extracurricular_participation']),
            float(data.get('stress_level', 5)),
            float(data.get('peer_influence', 5))
        ]

        features_array = np.array(features).reshape(1, -1)

        prediction = model.predict(features_array)

        return jsonify({
            "status": "success",
            "prediction": float(prediction[0])
        })

    except Exception as e:
        print("Prediction error:", e)

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)