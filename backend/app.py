from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

model = joblib.load("fraud_model.pkl")
amount_scaler = joblib.load("amount_scaler.pkl")
time_scaler = joblib.load("time_scaler.pkl")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = data.get("features")
    transaction_id = data.get("transaction_id", "TXN-UNKNOWN")

    if not features or len(features) != 30:
        return jsonify({"error": "Provide exactly 30 features"}), 400

    features_array = np.array(features).reshape(1, -1)
    features_array[0][0] = amount_scaler.transform([[features_array[0][0]]])[0][0]
    features_array[0][29] = time_scaler.transform([[features_array[0][29]]])[0][0]

    prediction = model.predict(features_array)[0]
    probability = model.predict_proba(features_array)[0][1]
    risk_score = int(probability * 100)
    verdict = "FRAUD" if prediction == 1 else "LEGITIMATE"

    return jsonify({
        "transaction_id": transaction_id,
        "verdict": verdict,
        "risk_score": risk_score,
        "probability": round(float(probability), 4)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)