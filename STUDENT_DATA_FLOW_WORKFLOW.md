# Complete Student Data Flow Workflow - Frontend → Backend → ML Model

## Overview
This document shows the complete journey of student data from manual entry through ML prediction to viewing analytics and results.

---

## 🎯 WORKFLOW: Student Study Data Entry

### Step 1: Student Opens Data Entry Form
**Location:** `frontend/src/components/student/StudyDataEntry.jsx`

```javascript
const [formData, setFormData] = useState({
    student_id: '',
    age: '',
    gender: '',
    study_hours_per_day: '',
    social_media_hours: '',
    netflix_hours: '',
    part_time_job: 'no',
    attendance_percentage: '',
    sleep_hours: '',
    diet_quality: 'average',
    exercise_frequency: '',
    parental_education_level: '',
    internet_quality: 'average',
    mental_health_rating: '',
    extracurricular_participation: 'no',
    stress_level: '',
    peer_influence: ''
});
```

**What happens:**
- Student navigates to `/student/data-entry`
- Form displays 17 input fields
- All fields are required
- Can use "Auto Fill Sample" button for testing

---

### Step 2: Student Fills Form Data
**Location:** `frontend/src/components/student/StudyDataEntry.jsx`

# Complete Student Data Flow Workflow - Frontend → Backend → ML Model

## Overview
This document shows the complete journey of student data from manual entry through ML prediction to viewing analytics and results.

---

## 🎯 WORKFLOW: Student Study Data Entry

### Step 1: Student Opens Data Entry Form
**Location:** `frontend/src/components/student/StudyDataEntry.jsx`

**Form Fields (17 total):**
- student_id (text)
- age (number)
- gender (0=Female, 1=Male)
- study_hours_per_day (number)
- social_media_hours (number)
- netflix_hours (number)
- part_time_job (yes/no)
- attendance_percentage (number)
- sleep_hours (number)
- diet_quality (poor/average/good → 3/5/8)
- exercise_frequency (days per week)
- parental_education_level (1-5)
- internet_quality (poor/average/good → 3/5/8)
- mental_health_rating (1-10)
- extracurricular_participation (yes/no → 2/0)
- stress_level (1-10)
- peer_influence (1-10)

**What happens:**
- Student navigates to `/student/data-entry`
- Form displays all input fields
- Can use "Auto Fill Sample" for testing

---

### Step 2: Student Submits Form
**Location:** `frontend/src/components/student/StudyDataEntry.jsx`
**Function:** `handleSubmit(e)`


```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert form data to API format
    const apiData = {
        age: parseInt(formData.age),
        gender: parseInt(formData.gender),
        study_hours_per_day: parseFloat(formData.study_hours_per_day),
        social_media_hours: parseFloat(formData.social_media_hours),
        netflix_hours: parseFloat(formData.netflix_hours),
        attendance_percentage: parseFloat(formData.attendance_percentage),
        sleep_hours: parseFloat(formData.sleep_hours),
        diet_quality: formData.diet_quality === 'poor' ? 3 : 
                      formData.diet_quality === 'average' ? 5 : 8,
        exercise_frequency: parseInt(formData.exercise_frequency),
        parental_education_level: parseInt(formData.parental_education_level),
        internet_quality: formData.internet_quality === 'poor' ? 3 : 
                         formData.internet_quality === 'average' ? 5 : 8,
        mental_health_rating: parseInt(formData.mental_health_rating),
        extracurricular_participation: parseInt(
            formData.extracurricular_participation === 'yes' ? 2 : 0
        ),
        stress_level: parseInt(formData.stress_level),
        peer_influence: parseInt(formData.peer_influence),
        part_time_job: formData.part_time_job === 'yes'
    };
    
    // Call API service
    const result = await studentService.submitData(apiData);
    
    // Navigate to prediction results
    navigate('/student/prediction', {
        state: {
            prediction: {
                prediction: result.prediction.value,
                label: result.prediction.label
            }
        }
    });
};
```

**What happens:**
- Converts text values to numbers
- Converts categorical values (poor/average/good) to numbers
- Calls API service with processed data

---

### Step 3: API Service Sends Request
**Location:** `frontend/src/services/studentAPI.js`
**Function:** `submitData(data)`

```javascript
export const studentService = {
    submitData: async (data) => {
        const response = await studentAPI.post('/submit', data);
        return response.data;
    }
};

// studentAPI is configured with:
const studentAPI = axios.create({
    baseURL: 'http://localhost:5001/api/student',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});
```

**HTTP Request:**
```
POST http://localhost:5001/api/student/submit
Headers:
    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    Content-Type: application/json
Body:
{
    "age": 20,
    "gender": 1,
    "study_hours_per_day": 5.5,
    "social_media_hours": 2.0,
    "netflix_hours": 1.5,
    "attendance_percentage": 85.5,
    "sleep_hours": 7.0,
    "diet_quality": 8,
    "exercise_frequency": 3,
    "parental_education_level": 3,
    "internet_quality": 8,
    "mental_health_rating": 7,
    "extracurricular_participation": 2,
    "stress_level": 5,
    "peer_influence": 6,
    "part_time_job": false
}
```

---

### Step 4: Backend Receives Request
**Location:** `backend/server.js`

```javascript
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);
```

**Location:** `backend/routes/studentRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/auth');
const studentDataController = require('../controllers/studentDataController');

router.post('/submit', protect, studentOnly, studentDataController.submitStudentData);
```

**What happens:**
- Request hits `/api/student/submit`
- `protect` middleware validates JWT token
- `studentOnly` middleware checks user role
- Calls controller function

---

### Step 5: Authentication Middleware
**Location:** `backend/middleware/auth.js`

```javascript
const protect = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};

const studentOnly = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};
```

**What happens:**
- Validates JWT token
- Loads user from database
- Checks if user is a student
- Adds `req.user` to request

---

### Step 6: Controller Processes Data
**Location:** `backend/controllers/studentDataController.js`
**Function:** `submitStudentData(req, res)`

```javascript
exports.submitStudentData = async (req, res) => {
    const userId = req.user.id;
    const studentId = req.user.studentId;
    const studyData = req.body;
    
    // Step 6a: Validate required fields
    const requiredFields = [
        'age', 'gender', 'study_hours_per_day', 'social_media_hours',
        'netflix_hours', 'attendance_percentage', 'sleep_hours',
        'diet_quality', 'exercise_frequency', 'parental_education_level',
        'internet_quality', 'mental_health_rating', 
        'extracurricular_participation', 'stress_level', 'peer_influence'
    ];
    
    const missingFields = requiredFields.filter(
        field => studyData[field] === undefined
    );
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(', ')}`
        });
    }
    
    // Step 6b: Save to MongoDB
    const newStudentData = new StudentData({
        userId,
        studentId,
        ...studyData
    });
    await newStudentData.save();
    
    console.log('✅ Student data saved to MongoDB');
    
    // Continue to Step 7...
};
```

**What happens:**
- Validates all 15 required fields
- Saves student data to MongoDB
- Prepares data for ML prediction

---

### Step 7: Prepare Data for ML Service
**Location:** `backend/controllers/studentDataController.js`

```javascript
// Prepare data for ML prediction (15 features)
const predictionInput = {
    age: studyData.age,                                    // Feature 1
    gender: studyData.gender,                              // Feature 2
    study_hours_per_day: studyData.study_hours_per_day,   // Feature 3
    social_media_hours: studyData.social_media_hours,     // Feature 4
    netflix_hours: studyData.netflix_hours,               // Feature 5
    attendance_percentage: studyData.attendance_percentage, // Feature 6
    sleep_hours: studyData.sleep_hours,                   // Feature 7
    diet_quality: studyData.diet_quality,                 // Feature 8
    exercise_frequency: studyData.exercise_frequency,     // Feature 9
    parental_education_level: studyData.parental_education_level, // Feature 10
    internet_quality: studyData.internet_quality,         // Feature 11
    mental_health_rating: studyData.mental_health_rating, // Feature 12
    extracurricular_participation: studyData.extracurricular_participation, // Feature 13
    stress_level: studyData.stress_level,                 // Feature 14
    peer_influence: studyData.peer_influence              // Feature 15
};

console.log('📤 Calling ML service with 15 features');
```

**Data Example:**
```json
{
    "age": 20,
    "gender": 1,
    "study_hours_per_day": 5.5,
    "social_media_hours": 2.0,
    "netflix_hours": 1.5,
    "attendance_percentage": 85.5,
    "sleep_hours": 7.0,
    "diet_quality": 8,
    "exercise_frequency": 3,
    "parental_education_level": 3,
    "internet_quality": 8,
    "mental_health_rating": 7,
    "extracurricular_participation": 2,
    "stress_level": 5,
    "peer_influence": 6
}
```

---

### Step 8: Call ML Service
**Location:** `backend/controllers/studentDataController.js`

```javascript
// Call Flask ML API for prediction
const mlResponse = await axios.post(
    `${process.env.FLASK_API_URL}/predict`,
    predictionInput
);

const predictionValue = parseFloat(mlResponse.data.prediction);

console.log('✅ ML prediction received:', predictionValue);
```

**HTTP Request to ML Service:**
```
POST http://localhost:5000/predict
Content-Type: application/json
Body:
{
    "age": 20,
    "gender": 1,
    "study_hours_per_day": 5.5,
    "social_media_hours": 2.0,
    "netflix_hours": 1.5,
    "attendance_percentage": 85.5,
    "sleep_hours": 7.0,
    "diet_quality": 8,
    "exercise_frequency": 3,
    "parental_education_level": 3,
    "internet_quality": 8,
    "mental_health_rating": 7,
    "extracurricular_participation": 2,
    "stress_level": 5,
    "peer_influence": 6
}
```

**What happens:**
- POST request to Flask ML service
- Sends 15 features as JSON
- Waits for prediction response

---

### Step 9: ML Service Processes Request
**Location:** `ml-service/app.py`

```python
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
        
        # Extract features in correct order (15 features)
        features = [
            float(data['age']),                              # Feature 1
            float(data['gender']),                           # Feature 2
            float(data['study_hours_per_day']),             # Feature 3
            float(data['social_media_hours']),              # Feature 4
            float(data['netflix_hours']),                   # Feature 5
            float(data['attendance_percentage']),           # Feature 6
            float(data['sleep_hours']),                     # Feature 7
            float(data['diet_quality']),                    # Feature 8
            float(data['exercise_frequency']),              # Feature 9
            float(data['parental_education_level']),        # Feature 10
            float(data['internet_quality']),                # Feature 11
            float(data['mental_health_rating']),            # Feature 12
            float(data['extracurricular_participation']),   # Feature 13
            float(data.get('stress_level', 5)),             # Feature 14
            float(data.get('peer_influence', 5))            # Feature 15
        ]
        
        # Convert to numpy array and reshape for model
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction using trained model
        prediction = model.predict(features_array)
        
        # Return prediction
        return jsonify({
            'prediction': str(prediction[0]),
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

**What happens:**
- Receives JSON with 15 features
- Extracts features in correct order
- Converts to NumPy array (shape: 1x15)
- Loads trained model from `study_model.pkl`
- Calls `model.predict(features_array)`
- Returns predicted score (e.g., 78.5)

**ML Response:**
```json
{
    "prediction": "78.5",
    "status": "success"
}
```

---

### Step 10: Calculate Prediction Label
**Location:** `backend/controllers/studentDataController.js`

```javascript
// Determine prediction label based on score
let predictionLabel;
if (predictionValue >= 80) {
    predictionLabel = 'Excellent Study Habit';
} else if (predictionValue >= 60) {
    predictionLabel = 'Good Study Habit';
} else if (predictionValue >= 40) {
    predictionLabel = 'Average Study Habit';
} else {
    predictionLabel = 'Needs Improvement';
}

console.log('📊 Prediction:', predictionValue, '-', predictionLabel);
```

**Examples:**
- Score 78.5 → "Good Study Habit"
- Score 85.0 → "Excellent Study Habit"
- Score 55.0 → "Average Study Habit"
- Score 35.0 → "Needs Improvement"

---

### Step 11: Save Prediction to MongoDB
**Location:** `backend/controllers/studentDataController.js`

```javascript
// Save prediction to database
const newPrediction = new Prediction({
    userId,
    studentId,
    studentData: {
        userId,
        ...predictionInput
    },
    prediction: predictionValue,
    predictionLabel
});
await newPrediction.save();

console.log('✅ Prediction saved to MongoDB');

// Update StudentData with prediction reference
newStudentData.predictions = [newPrediction._id];
await newStudentData.save();
```

**Database:** MongoDB
**Collection:** `predictions`
**Model:** `backend/models/Prediction.js`

**Document Structure:**
```javascript
{
    _id: ObjectId("..."),
    userId: ObjectId("..."),
    studentId: "STU001",
    studentData: {
        age: 20,
        gender: 1,
        study_hours_per_day: 5.5,
        // ... all 15 features
    },
    prediction: 78.5,
    predictionLabel: "Good Study Habit",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

---

### Step 12: Return Response to Frontend
**Location:** `backend/controllers/studentDataController.js`

```javascript
res.status(201).json({
    success: true,
    message: 'Study habit data submitted successfully',
    studentData: newStudentData,
    prediction: {
        value: predictionValue,
        label: predictionLabel,
        id: newPrediction._id
    }
});
```

**HTTP Response:**
```
Status: 201 Created
Body:
{
    "success": true,
    "message": "Study habit data submitted successfully",
    "studentData": {
        "_id": "67c1234567890abcdef",
        "userId": "67c0987654321fedcba",
        "studentId": "STU001",
        "age": 20,
        "gender": 1,
        "study_hours_per_day": 5.5,
        ...
    },
    "prediction": {
        "value": 78.5,
        "label": "Good Study Habit",
        "id": "67c5555555555555555"
    }
}
```

---

### Step 13: Frontend Receives Response
**Location:** `frontend/src/components/student/StudyDataEntry.jsx`

```javascript
const result = await studentService.submitData(apiData);

setSuccess(true);

setTimeout(() => {
    // Navigate to prediction results
    navigate('/student/prediction', {
        state: {
            prediction: {
                prediction: result.prediction.value,
                label: result.prediction.label,
                status: 'success'
            }
        }
    });
}, 2000);
```

**What happens:**
- Shows success message
- Waits 2 seconds
- Navigates to prediction results page
- Passes prediction data via route state

---

### Step 14: Display Prediction Results
**Location:** `frontend/src/components/student/PredictionResult.jsx`

```javascript
const PredictionResult = () => {
    const location = useLocation();
    const prediction = location.state?.prediction;
    
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Your Performance Prediction
                </h1>
                
                <div className="text-center mb-8">
                    <div className={`text-6xl font-bold ${getScoreColor(prediction.prediction)}`}>
                        {prediction.prediction}%
                    </div>
                    <div className="text-xl text-gray-700 mt-4">
                        {prediction.label}
                    </div>
                </div>
                
                {/* Recommendations based on score */}
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Recommendations:</h3>
                    <ul className="space-y-2">
                        <li>• Maintain consistent study hours</li>
                        <li>• Ensure 7-8 hours of sleep</li>
                        <li>• Limit social media usage</li>
                        <li>• Stay physically active</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
```

**What happens:**
- Displays prediction score with color coding
- Shows prediction label
- Provides personalized recommendations
- Student can navigate to analytics or dashboard

---

## 📊 WORKFLOW: Viewing Student Analytics

### Step 15: Student Views Analytics Dashboard
**Location:** `frontend/src/components/student/Analytics.jsx`

```javascript
useEffect(() => {
    checkStudentData();
}, []);

const checkStudentData = async () => {
    const response = await studentService.checkData();
    setHasData(response.hasData);
    
    if (response.hasData) {
        loadAnalyticsData();
    }
};

const loadAnalyticsData = async () => {
    const response = await studentService.getAnalytics();
    setAnalyticsData(response);
};
```

**API Calls:**
```
GET /api/student/check
GET /api/student/analytics
```

**What happens:**
- Checks if student has submitted data
- If yes, loads analytics data
- If no, shows "No data available" message

---

### Step 16: Backend Provides Analytics
**Location:** `backend/controllers/studentDataController.js`
**Function:** `getAnalyticsData(req, res)`

```javascript
exports.getAnalyticsData = async (req, res) => {
    const userId = req.user.id;
    
    // Get all student data submissions
    const allData = await StudentData.find({ userId })
        .sort({ createdAt: 1 });
    
    if (allData.length === 0) {
        return res.json({
            success: true,
            hasData: false
        });
    }
    
    // Get all predictions
    const predictions = await Prediction.find({ userId })
        .sort({ createdAt: 1 });
    
    // Calculate trends
    const trends = allData.map((data, index) => ({
        date: data.createdAt,
        studyHours: data.study_hours_per_day,
        sleepHours: data.sleep_hours,
        socialMedia: data.social_media_hours,
        attendance: data.attendance_percentage,
        mentalHealth: data.mental_health_rating,
        stressLevel: data.stress_level,
        score: predictions[index]?.prediction || 0
    }));
    
    // Calculate averages
    const averages = {
        studyHours: allData.reduce((sum, d) => sum + d.study_hours_per_day, 0) / allData.length,
        sleepHours: allData.reduce((sum, d) => sum + d.sleep_hours, 0) / allData.length,
        socialMedia: allData.reduce((sum, d) => sum + d.social_media_hours, 0) / allData.length
    };
    
    res.json({
        success: true,
        hasData: true,
        trends,
        averages,
        totalSubmissions: allData.length
    });
};
```

**What happens:**
- Queries MongoDB for all student submissions
- Calculates trends over time
- Computes averages
- Returns aggregated data

---

### Step 17: Display Analytics Charts
**Location:** `frontend/src/components/student/Analytics.jsx`

```javascript
// Display trends chart
<LineChart data={trends}>
    <XAxis dataKey="date" />
    <YAxis />
    <Line dataKey="studyHours" stroke="#3B82F6" name="Study Hours" />
    <Line dataKey="score" stroke="#10B981" name="Performance Score" />
</LineChart>

// Display performance radar
<RadarChart data={performanceRadar}>
    <PolarGrid />
    <PolarAngleAxis dataKey="subject" />
    <Radar dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
</RadarChart>

// Display habit distribution
<PieChart>
    <Pie data={habitDistribution} dataKey="value" />
</PieChart>
```

**What happens:**
- Displays study hours trends over time
- Shows performance score progression
- Visualizes habit distribution
- Provides insights and recommendations

---

## 🔄 Complete Data Flow Summary

```
1. Student fills form
   ↓ frontend/src/components/student/StudyDataEntry.jsx
   
2. Convert form data to API format
   ↓ Convert text to numbers, categorical to numeric
   
3. Call API service
   ↓ frontend/src/services/studentAPI.js
   
4. POST /api/student/submit
   ↓ backend/routes/studentRoutes.js
   
5. Authenticate user
   ↓ backend/middleware/auth.js
   
6. Validate and save to MongoDB
   ↓ backend/controllers/studentDataController.js
   ↓ backend/models/StudentData.js
   
7. Prepare 15 features for ML
   ↓ Extract and format data
   
8. POST http://localhost:5000/predict
   ↓ ml-service/app.py
   
9. Load study_model.pkl
   ↓ model.predict(features)
   
10. Return prediction score
    ↓ {"prediction": "78.5", "status": "success"}
    
11. Calculate prediction label
    ↓ Score → Label mapping
    
12. Save prediction to MongoDB
    ↓ backend/models/Prediction.js
    
13. Return response to frontend
    ↓ Success + prediction data
    
14. Navigate to results page
    ↓ frontend/src/components/student/PredictionResult.jsx
    
15. Display prediction with recommendations
    
16. View analytics dashboard
    ↓ frontend/src/components/student/Analytics.jsx
    
17. Fetch analytics data
    ↓ GET /api/student/analytics
    
18. Display charts and insights
```

---

## 📋 Complete File Structure

### Frontend Files (React):
```
frontend/src/
├── components/student/
│   ├── StudyDataEntry.jsx          ← Data entry form
│   ├── PredictionResult.jsx        ← Display prediction results
│   ├── Analytics.jsx               ← Analytics dashboard
│   ├── Dashboard.jsx               ← Student dashboard
│   ├── MentalHealthAssessment.jsx  ← Mental health form
│   └── StudentDashboard.jsx        ← Main student view
├── services/
│   ├── studentAPI.js               ← Student API service
│   ├── predictionAPI.js            ← Prediction API service
│   └── mentalHealthAPI.js          ← Mental health API service
└── context/
    └── AuthContext.js              ← Authentication context
```

### Backend Files (Node.js/Express):
```
backend/
├── server.js                       ← Express server setup
├── routes/
│   ├── studentRoutes.js            ← Student API routes
│   └── predictionRoutes.js         ← Prediction API routes
├── controllers/
│   ├── studentDataController.js    ← Student business logic
│   └── predictionController.js     ← Prediction business logic
├── models/
│   ├── StudentData.js              ← Student data schema
│   ├── Prediction.js               ← Prediction schema
│   └── User.js                     ← User authentication schema
├── middleware/
│   └── auth.js                     ← JWT authentication
└── config/
    └── database.js                 ← MongoDB connection
```

### ML Service Files (Python/Flask):
```
ml-service/
├── app.py                          ← Flask ML API
├── requirements.txt                ← Python dependencies
└── venv/                           ← Python virtual environment

study_model.pkl                     ← Trained ML model (root)
```

---

## 🎯 Key Points

1. **Form Conversion** - Text values converted to numbers in frontend
2. **15 Features Required** - ML model needs exactly 15 inputs
3. **Sequential Flow** - Data entry → Save → ML prediction → Save prediction
4. **MongoDB Storage** - Both student data and predictions stored
5. **Real-time Prediction** - Prediction generated immediately on submission
6. **Analytics Available** - Historical data used for trends and insights
7. **JWT Authentication** - All requests require valid token
8. **Role-based Access** - Students can only access their own data

---

## 📊 Data at Each Stage

**Stage 1 - Form Input (Frontend):**
```javascript
{
    student_id: "STU001",
    age: "20",
    gender: "1",
    study_hours_per_day: "5.5",
    diet_quality: "good",
    extracurricular_participation: "yes",
    // ... more fields
}
```

**Stage 2 - Converted API Data (Frontend):**
```javascript
{
    age: 20,
    gender: 1,
    study_hours_per_day: 5.5,
    diet_quality: 8,              // "good" → 8
    extracurricular_participation: 2,  // "yes" → 2
    // ... all numeric
}
```

**Stage 3 - ML Request (Backend → ML Service):**
```json
{
    "age": 20,
    "gender": 1,
    "study_hours_per_day": 5.5,
    "social_media_hours": 2.0,
    "netflix_hours": 1.5,
    "attendance_percentage": 85.5,
    "sleep_hours": 7.0,
    "diet_quality": 8,
    "exercise_frequency": 3,
    "parental_education_level": 3,
    "internet_quality": 8,
    "mental_health_rating": 7,
    "extracurricular_participation": 2,
    "stress_level": 5,
    "peer_influence": 6
}
```

**Stage 4 - ML Response (ML Service → Backend):**
```json
{
    "prediction": "78.5",
    "status": "success"
}
```

**Stage 5 - MongoDB StudentData Document:**
```javascript
{
    _id: ObjectId("67c1234567890abcdef"),
    userId: ObjectId("67c0987654321fedcba"),
    studentId: "STU001",
    age: 20,
    gender: 1,
    study_hours_per_day: 5.5,
    social_media_hours: 2.0,
    netflix_hours: 1.5,
    attendance_percentage: 85.5,
    sleep_hours: 7.0,
    diet_quality: 8,
    exercise_frequency: 3,
    parental_education_level: 3,
    internet_quality: 8,
    mental_health_rating: 7,
    extracurricular_participation: 2,
    stress_level: 5,
    peer_influence: 6,
    part_time_job: false,
    predictions: [ObjectId("67c5555555555555555")],
    submissionDate: ISODate("2024-01-15T10:30:00Z"),
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Stage 6 - MongoDB Prediction Document:**
```javascript
{
    _id: ObjectId("67c5555555555555555"),
    userId: ObjectId("67c0987654321fedcba"),
    studentId: "STU001",
    studentData: {
        userId: ObjectId("67c0987654321fedcba"),
        age: 20,
        gender: 1,
        // ... all 15 features
    },
    prediction: 78.5,
    predictionLabel: "Good Study Habit",
    timestamp: ISODate("2024-01-15T10:30:00Z"),
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Stage 7 - API Response (Backend → Frontend):**
```json
{
    "success": true,
    "message": "Study habit data submitted successfully",
    "studentData": { ... },
    "prediction": {
        "value": 78.5,
        "label": "Good Study Habit",
        "id": "67c5555555555555555"
    }
}
```

**Stage 8 - Display (Frontend):**
```
┌─────────────────────────────────┐
│  Your Performance Prediction    │
│                                 │
│         78.5%                   │
│    Good Study Habit             │
│                                 │
│  Recommendations:               │
│  • Maintain study hours         │
│  • Get adequate sleep           │
│  • Limit social media           │
└─────────────────────────────────┘
```

---

## 🔐 Environment Variables

**Backend (.env):**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/study-analyzer
JWT_SECRET=your_jwt_secret_key
FLASK_API_URL=http://localhost:5000
ML_SERVICE_URL=http://localhost:5000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5001/api
```

**ML Service:**
```
PORT=5000
```

---

## 🚀 Running the System

**1. Start MongoDB:**
```bash
mongod
```

**2. Start Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5001
```

**3. Start ML Service:**
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**4. Start Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

This is the complete workflow from student data entry to ML prediction to analytics display!

