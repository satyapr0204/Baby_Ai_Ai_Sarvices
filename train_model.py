# import pandas as pd
# from sklearn.ensemble import RandomForestClassifier
# import joblib

# data = pd.read_csv("dataset/size_data.csv")

# X = data[['height','weight','chest','waist','hip']]
# y = data['size']

# model = RandomForestClassifier()
# model.fit(X,y)

# joblib.dump(model,"saved_model/size_model.pkl")

# print("Model trained!")

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv("dataset/size_data.csv")

X = data[['height','weight','chest','waist','hip']]
y = data['size']

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model
joblib.dump(model, "saved_model/size_model.pkl")

print("Model trained!")