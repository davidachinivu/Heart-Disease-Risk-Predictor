from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load models at startup
MODEL_PATH = 'heart_disease_model.pkl'
SCALER_PATH = 'scaler.pkl'

# Fallback to parent directory if not found in current (helpful for local testing)
if not os.path.exists(MODEL_PATH) and os.path.exists('../' + MODEL_PATH):
    MODEL_PATH = '../' + MODEL_PATH
if not os.path.exists(SCALER_PATH) and os.path.exists('../' + SCALER_PATH):
    SCALER_PATH = '../' + SCALER_PATH

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    models_loaded = True
except Exception as e:
    print(f"Error loading models: {e}")
    models_loaded = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not models_loaded:
        return jsonify({'error': 'Machine learning models are not loaded. Please ensure heart_disease_model.pkl and scaler.pkl exist.'}), 500

    try:
        data = request.json
        
        # Extract features strictly in order:
        # age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
        features = np.array([[
            float(data['age']),
            float(data['sex']),
            float(data['cp']),
            float(data['trestbps']),
            float(data['chol']),
            float(data['fbs']),
            float(data['restecg']),
            float(data['thalach']),
            float(data['exang']),
            float(data['oldpeak']),
            float(data['slope']),
            float(data['ca']),
            float(data['thal'])
        ]])
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Predict
        prediction = model.predict(scaled_features)[0]
        prediction_proba = model.predict_proba(scaled_features)[0]
        
        confidence = float(np.max(prediction_proba))
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': confidence
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# -------------------------------------------------------- #
# HOW TO RUN LOCALLY:
# 1. Open terminal and navigate to the heart_app directory
# 2. Run: pip install -r requirements.txt
# 3. Run: python app.py
# 4. Open http://127.0.0.1:5000 in your browser
#
# HOW TO DEPLOY FREE ON RENDER.COM:
# 1. Push this folder to a GitHub repository (including pkl files).
# 2. Go to Render.com and create a new "Web Service".
# 3. Connect your GitHub repository.
# 4. Set Build Command to: pip install -r requirements.txt
# 5. Set Start Command to: gunicorn app:app
# 6. Click "Create Web Service" and wait for deployment!
# -------------------------------------------------------- #
