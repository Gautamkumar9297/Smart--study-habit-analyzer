from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), '..', 'study_model.pkl')
model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features in the correct order (15 features)
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
            float(data.get('stress_level', 5)),  # Default value if not provided
            float(data.get('peer_influence', 5))  # Default value if not provided
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features_array)
        
        return jsonify({
            'prediction': str(prediction[0]),
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'ML Service is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
