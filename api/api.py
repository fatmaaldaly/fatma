from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes and origins

# Load the trained model
with open("iris_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    feature_array = data["feature_array"]
    
    prediction = model.predict([feature_array]).tolist()
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
