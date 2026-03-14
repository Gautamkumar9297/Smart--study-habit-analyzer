import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), '..', 'study_model.pkl')
model = joblib.load(model_path)

print(f"Model type: {type(model)}")
print(f"Expected number of features: {model.n_features_in_}")

if hasattr(model, 'feature_names_in_'):
    print(f"Feature names: {model.feature_names_in_}")
else:
    print("Feature names not available in model")
