import pickle
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

# Load the iris dataset
iris = load_iris()
X = iris.data
y = iris.target

# Create and train the model
model = LogisticRegression(max_iter=200)
model.fit(X, y)

# Save the model to a file
with open('iris_model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Model created and saved as iris_model.pkl")