import streamlit as st
import requests

st.title("Iris Flower Classifier")

# Input fields
sepal_length = st.number_input("Sepal Length (cm)", min_value=0.0, format="%.1f")
sepal_width = st.number_input("Sepal Width (cm)", min_value=0.0, format="%.1f")
petal_length = st.number_input("Petal Length (cm)", min_value=0.0, format="%.1f")
petal_width = st.number_input("Petal Width (cm)", min_value=0.0, format="%.1f")

# Submit button
if st.button("Predict"):
    # Prepare the input data
    input_data = { "feature_array": [sepal_length, sepal_width, petal_length, petal_width]}

    

    try:
        # Send POST request to the Flask API
        response = requests.post("http://localhost:5000/predict", json=input_data)

        if response.status_code == 200:
            prediction = response.json().get("prediction")
            st.success(f"Predicted Iris Species: {prediction}")
        else:
            st.error(f"Error: {response.status_code}")
    except Exception as e:
        st.error(f"Could not connect to the API: {e}")
