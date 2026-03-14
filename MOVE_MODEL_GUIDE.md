# Moving study_model.pkl to ml-service Folder

## Why Move the Model?

Moving `study_model.pkl` to the `ml-service` folder is a better practice because:
- ✅ Better organization - ML files stay together
- ✅ Cleaner project root
- ✅ Easier deployment of ML service
- ✅ More modular architecture

## Changes Made

### ✅ Updated Code
The `ml-service/app.py` file has been updated to:
1. First look for the model in `ml-service/` folder
2. Fall back to parent directory if not found (backward compatibility)
3. Print confirmation message when model loads

### Updated Code in ml-service/app.py:
```python
# Load the trained model
# Try to load from ml-service folder first, then fall back to parent directory
model_path = os.path.join(os.path.dirname(__file__), 'study_model.pkl')
if not os.path.exists(model_path):
    # Fall back to parent directory (for backward compatibility)
    model_path = os.path.join(os.path.dirname(__file__), '..', 'study_model.pkl')

model = joblib.load(model_path)
print(f"✅ Model loaded successfully from: {model_path}")
```

## How to Move the Model

### Option 1: Using Command Line (Recommended)

**Windows (PowerShell):**
```powershell
Move-Item study_model.pkl ml-service/study_model.pkl
```

**Windows (Command Prompt):**
```cmd
move study_model.pkl ml-service\study_model.pkl
```

**macOS/Linux:**
```bash
mv study_model.pkl ml-service/study_model.pkl
```

### Option 2: Using File Explorer
1. Open your project folder
2. Find `study_model.pkl` in the root directory
3. Cut the file (Ctrl+X or Cmd+X)
4. Open the `ml-service` folder
5. Paste the file (Ctrl+V or Cmd+V)

## Verify the Move

### 1. Check File Location
```bash
# Windows
dir ml-service\study_model.pkl

# macOS/Linux
ls -la ml-service/study_model.pkl
```

You should see the file listed.

### 2. Test the ML Service

**Start the ML service:**
```bash
cd ml-service
python app.py
```

**You should see:**
```
✅ Model loaded successfully from: /path/to/ml-service/study_model.pkl
 * Running on http://0.0.0.0:5000
```

### 3. Test Prediction Endpoint

**Using PowerShell:**
```powershell
$body = @{
    age = 20
    gender = 1
    study_hours_per_day = 5.5
    social_media_hours = 2.0
    netflix_hours = 1.5
    attendance_percentage = 85.5
    sleep_hours = 7.0
    diet_quality = 8
    exercise_frequency = 3
    parental_education_level = 3
    internet_quality = 8
    mental_health_rating = 7
    extracurricular_participation = 2
    stress_level = 5
    peer_influence = 6
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/predict" -Method Post -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
    "prediction": "78.5",
    "status": "success"
}
```

## Project Structure After Move

```
project/
├── backend/
├── frontend/
├── ml-service/
│   ├── app.py
│   ├── requirements.txt
│   ├── check_model.py
│   └── study_model.pkl          ← Model is now here
├── README.md
└── other files...
```

## Update Git

After moving the file, commit the changes:

```bash
# Add the moved file
git add ml-service/study_model.pkl
git add ml-service/app.py

# Remove from old location (if git tracked it)
git rm study_model.pkl

# Commit
git commit -m "Move study_model.pkl to ml-service folder for better organization"

# Push to GitHub
git push origin main
```

## Troubleshooting

### Error: "FileNotFoundError: study_model.pkl"

**Solution 1:** Verify file location
```bash
# Check if file exists in ml-service
ls ml-service/study_model.pkl
```

**Solution 2:** Check file permissions
```bash
# Make sure file is readable
chmod 644 ml-service/study_model.pkl  # macOS/Linux
```

**Solution 3:** Verify Python working directory
```python
# Add this to app.py temporarily to debug
import os
print(f"Current directory: {os.getcwd()}")
print(f"Script directory: {os.path.dirname(__file__)}")
print(f"Model path: {model_path}")
print(f"Model exists: {os.path.exists(model_path)}")
```

### Error: "Model version mismatch"

This is just a warning and usually safe to ignore. The model was trained with scikit-learn 1.6.1 but runs on 1.8.0.

If you want to fix it:
```bash
pip install scikit-learn==1.6.1
```

### Backend Can't Connect to ML Service

The backend doesn't need to know where the model file is located. It only connects to the Flask API endpoint. No changes needed in backend code.

## Benefits of This Change

### Before (Model in Root):
```
project/
├── study_model.pkl          ← Mixed with other files
├── backend/
├── frontend/
└── ml-service/
```

### After (Model in ml-service):
```
project/
├── backend/
├── frontend/
└── ml-service/
    └── study_model.pkl      ← Organized with ML code
```

### Advantages:
- ✅ Cleaner project root
- ✅ ML service is self-contained
- ✅ Easier to deploy ML service separately
- ✅ Better for Docker containerization
- ✅ Follows microservices best practices

## No Changes Needed In:

- ❌ Backend code (backend/controllers/studentDataController.js)
- ❌ Backend code (backend/controllers/facultyController.js)
- ❌ Frontend code
- ❌ Environment variables
- ❌ Database

The backend only calls the Flask API endpoint (`http://localhost:5000/predict`), it doesn't access the model file directly.

## Summary

1. ✅ Updated `ml-service/app.py` to load model from ml-service folder
2. ✅ Added fallback to parent directory for compatibility
3. ✅ Added confirmation message when model loads
4. ✅ No changes needed in backend or frontend
5. ✅ Move the file using command line or file explorer
6. ✅ Test the ML service
7. ✅ Commit and push to GitHub

**The change is safe and recommended!** 🎉
