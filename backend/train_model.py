import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import joblib

print("Loading dataset...")
df = pd.read_csv("creditcard.csv")

X = df.drop("Class", axis=1)
y = df["Class"]

amount_scaler = StandardScaler()
time_scaler = StandardScaler()

X["Amount"] = amount_scaler.fit_transform(X[["Amount"]])
X["Time"] = time_scaler.fit_transform(X[["Time"]])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Training model...")
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

print("Evaluating...")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

joblib.dump(model, "fraud_model.pkl")
joblib.dump(amount_scaler, "amount_scaler.pkl")
joblib.dump(time_scaler, "time_scaler.pkl")
print("Model and scalers saved.")