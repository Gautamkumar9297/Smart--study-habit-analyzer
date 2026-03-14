# Setup Guide - Smart Study Habit Analyzer

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/study-habit-analyzer.git
cd study-habit-analyzer
```

### 2. Setup Backend (Node.js/Express)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Update JWT_SECRET with a strong random string
# Update MONGODB_URI if using a different database
```

### 3. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file if needed (default should work)
```

### 4. Setup ML Service (Flask/Python)

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file (optional)
cp .env.example .env
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service):
# MongoDB should start automatically

# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

## Running the Application

You need to run three services simultaneously. Open three terminal windows:

### Terminal 1: Start Backend

```bash
cd backend
npm start
```

Backend will run on: `http://localhost:5001`

### Terminal 2: Start ML Service

```bash
cd ml-service
# Activate virtual environment first
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

python app.py
```

ML Service will run on: `http://localhost:5000`

### Terminal 3: Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

## Quick Start (All Services)

### Windows:
```bash
# Run the batch file
start-all.bat
```

### macOS/Linux:
```bash
# Run the shell script
chmod +x start-all.sh
./start-all.sh
```

## Default Login Credentials

After starting the application, you can register new users or use test accounts if seeded.

### Register New User:
1. Go to `http://localhost:3000`
2. Click "Register"
3. Choose role: Student or Faculty
4. Fill in details and submit

## Project Structure

```
study-habit-analyzer/
├── backend/              # Node.js/Express API
├── frontend/             # React application
├── ml-service/           # Flask ML prediction service
├── study_model.pkl       # Trained ML model
├── COMPLETE_DATA_FLOW_WORKFLOW.md
├── STUDENT_DATA_FLOW_WORKFLOW.md
└── README.md
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Default: `mongodb://localhost:27017/study-analyzer`

### ML Service Not Responding
- Ensure Python virtual environment is activated
- Check if port 5000 is available
- Verify study_model.pkl exists in project root

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5001
- Check REACT_APP_API_URL in frontend/.env
- Check CORS settings in backend/server.js

### Port Already in Use
- Backend (5001): Change PORT in backend/.env
- ML Service (5000): Change port in ml-service/app.py
- Frontend (3000): React will prompt to use different port

## Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/study-analyzer
JWT_SECRET=your_secret_key
FLASK_API_URL=http://localhost:5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Next Steps

1. Register as a Faculty user
2. Upload student data via Excel
3. View analytics and predictions
4. Register as a Student user
5. Enter study habit data
6. View personalized predictions

## Support

For issues or questions, please open an issue on GitHub.
