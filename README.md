# Smart Study Habit Analyzer - Professional Full Stack Application

A professional full-stack MERN application with Flask ML service, MongoDB database, role-based authentication, separate Student and Faculty dashboards, Tailwind CSS styling, and comprehensive analytics for predicting and analyzing student study habits.

## 🏗️ Architecture

```
project/
├── frontend/                    # React Application (Port 3000)
│   ├── public/
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── Header.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   ├── PredictionResult.jsx
│   │   │   └── StatisticsChart.jsx
│   │   ├── services/           # API Services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express API (Port 5001)
│   ├── config/
│   │   └── database.js         # MongoDB Connection
│   ├── controllers/
│   │   └── predictionController.js
│   ├── models/
│   │   └── Prediction.js       # Mongoose Schema
│   ├── routes/
│   │   └── predictionRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env                    # Environment Variables
│   ├── server.js
│   └── package.json
│
├── ml-service/                  # Flask ML API (Port 5000)
│   ├── venv/                   # Python Virtual Environment
│   ├── app.py                  # Flask Application
│   ├── requirements.txt
│   └── check_model.py
│
├── study_model.pkl             # Trained ML Model
├── example-request.json        # Sample API Request
├── test-api.ps1               # API Testing Script
└── README.md
```

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication system
- ✅ Role-based access control (Student/Faculty)
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes and middleware
- ✅ User registration and login

### Student Dashboard
- ✅ Study data entry form with auto-fill feature
- ✅ Real-time ML predictions with AI recommendations
- ✅ Personal analytics with interactive charts
- ✅ Performance tracking and history
- ✅ Dashboard overview with key metrics

### Faculty Dashboard
- ✅ Class overview with aggregate statistics
- ✅ Excel upload with drag-and-drop support
- ✅ Student records management with search/filter
- ✅ Analytics with performance trends
- ✅ Bulk data import capabilities

### Technical Features
- ✅ Professional folder structure
- ✅ MongoDB Atlas integration for data persistence
- ✅ Tailwind CSS for modern, responsive UI
- ✅ Recharts for data visualization
- ✅ RESTful API architecture
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Real-time updates

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## 🔧 Installation & Setup

### 1. Flask ML Service Setup

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
```

Example `.env` content:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/study-analyzer
FLASK_API_URL=http://localhost:5000
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
```

**Note:** Never commit `.env` files to Git. Use `.env.example` as a template.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🎯 Running the Application

### Option 1: Run All Services Separately

**Terminal 1: Flask ML Service (Port 5000)**
```bash
cd ml-service
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
python app.py
```

**Terminal 2: Node.js Backend (Port 5001)**
```bash
cd backend
npm start
```

**Terminal 3: React Frontend (Port 3000)**
```bash
cd frontend
npm start
```

### Option 2: Use PowerShell Script (Windows)

```bash
.\start-all.bat
```

## 📊 Application URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- Flask ML Service: http://localhost:5000
- MongoDB: Atlas Cloud

## 🔌 API Endpoints

### Authentication API (Port 5001)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new student | No |
| POST | `/api/auth/login` | Login user (student/faculty) | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/create-faculty` | Create default faculty users | No |

### Prediction API (Port 5001)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/predict` | Get prediction and save to database | Yes |
| GET | `/api/predictions` | Get all predictions | Yes |
| GET | `/api/statistics` | Get prediction statistics | Yes |
| DELETE | `/api/predictions/:id` | Delete a prediction | Yes |
| GET | `/api/health` | Health check | No |

### Flask ML Service (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Get ML model prediction |
| GET | `/health` | Health check |

## 👥 Default User Accounts

### Faculty Accounts (Pre-created)

| Name | Email | Password | Department |
|------|-------|----------|------------|
| Dr. John Smith | faculty@university.edu | faculty123 | Computer Science |
| Prof. Sarah Johnson | admin@university.edu | admin123 | Mathematics |
| Dr. Michael Brown | teacher@university.edu | teacher123 | Physics |

### Student Accounts
Students can register through the registration page with:
- Student ID
- Full Name
- Email
- Password

## 🔐 Authentication Flow

1. User selects role (Student/Faculty) on login page
2. Enters credentials and submits
3. Backend validates credentials against MongoDB
4. JWT token generated and returned
5. Token stored in localStorage
6. Token included in all subsequent API requests
7. Protected routes verify token via middleware

## 📝 Input Fields (15 Features)

| Field | Type | Range/Values | Description |
|-------|------|--------------|-------------|
| age | number | - | Student age |
| gender | number | 0 or 1 | 0=Female, 1=Male |
| study_hours_per_day | number | 0+ | Hours spent studying per day |
| social_media_hours | number | 0+ | Hours on social media |
| netflix_hours | number | 0+ | Hours watching Netflix |
| attendance_percentage | number | 0-100 | Class attendance percentage |
| sleep_hours | number | 0-24 | Hours of sleep per night |
| diet_quality | number | 1-10 | Diet quality rating |
| exercise_frequency | number | 0-7 | Days of exercise per week |
| parental_education_level | number | 1-5 | Parent education level |
| internet_quality | number | 1-10 | Internet connection quality |
| mental_health_rating | number | 1-10 | Mental health rating |
| extracurricular_participation | number | 0-5 | Number of activities |
| stress_level | number | 1-10 | Student stress level |
| peer_influence | number | 1-10 | Peer influence rating |

## 🧪 Testing the API

### Using PowerShell Script
```bash
.\test-api.ps1
```

### Using cURL
```bash
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d @example-request.json
```

### Using PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/predict" `
  -Method Post `
  -ContentType "application/json" `
  -Body (Get-Content example-request.json -Raw)
```

## 📈 Example Response

```json
{
  "prediction": 88.59560802241315,
  "label": "Excellent Study Habit",
  "status": "success",
  "id": "507f1f77bcf86cd799439011"
}
```

## 🎨 UI Features

### Prediction Form
- Clean, modern design with Tailwind CSS
- Responsive grid layout
- Input validation
- Loading states

### Prediction Result
- Color-coded results based on performance
- Animated progress bar
- Visual icons
- Score display

### Statistics Dashboard
- Bar chart for distribution
- Doughnut chart for performance breakdown
- Line chart for trends
- Summary cards with key metrics

## 🗄️ MongoDB Collections

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'faculty']),
  studentId: String (unique, required for students),
  profile: {
    age: Number,
    department: String,
    year: Number,
    phone: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Predictions Collection
```javascript
{
  studentData: {
    age: Number,
    gender: Number,
    study_hours_per_day: Number,
    // ... all 15 features
  },
  prediction: Number,
  predictionLabel: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### StudentData Collection
```javascript
{
  userId: ObjectId (ref: 'User'),
  studentId: String,
  studyData: {
    // 15 study habit features
  },
  predictions: [ObjectId] (ref: 'Prediction'),
  createdAt: Date,
  updatedAt: Date
}
```

### ExcelUpload Collection
```javascript
{
  uploadedBy: ObjectId (ref: 'User'),
  fileName: String,
  fileSize: Number,
  recordCount: Number,
  data: Array,
  status: String,
  createdAt: Date
}
```

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router DOM 6
- Tailwind CSS 3.4
- Recharts (for charts)
- XLSX (for Excel handling)
- Lucide React (icons)
- React Dropzone
- Axios

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Axios
- dotenv
- CORS

### ML Service
- Flask 3.0
- Flask-CORS
- scikit-learn 1.8
- NumPy
- Joblib

### Database
- MongoDB Atlas

## 🔒 Security Notes

- Environment variables for sensitive data
- CORS configured for local development
- Input validation on all endpoints
- Error handling middleware

## 🐛 Troubleshooting

### Port Already in Use
Change ports in:
- Flask: `app.py` line `app.run(port=5000)`
- Backend: `.env` file `PORT=5001`
- Frontend: Create `.env` with `PORT=3000`

### MongoDB Connection Error
- Check MongoDB URI in `backend/.env`
- Verify network access in MongoDB Atlas
- Ensure IP whitelist includes your IP

### Model Version Warning
The model was trained with scikit-learn 1.6.1 but runs on 1.8.0. This is generally safe but may show warnings.

### Tailwind CSS Not Working
```bash
cd frontend
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17
```

## 📦 Dependencies

### Frontend
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "recharts": "^2.10.0",
  "xlsx": "^0.18.5",
  "file-saver": "^2.0.5",
  "lucide-react": "^0.294.0",
  "react-dropzone": "^14.2.3",
  "tailwindcss": "^3.4.1"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "axios": "^1.6.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### ML Service
```
flask==3.0.0
flask-cors==4.0.0
joblib==1.3.2
numpy==1.24.3
scikit-learn==1.3.2
```

## 📄 License

MIT

## 👨‍💻 Author

Study Habit Predictor Team

---

**Note:** This is a development setup. For production deployment, consider:
- Using environment-specific configurations
- Implementing authentication
- Setting up HTTPS
- Using production WSGI server for Flask
- Optimizing React build
- Setting up proper logging
- Implementing rate limiting
