# Project Workflow Checkpoints

## 1) Repository Setup
- Open `Smart--study-habit-analyzer/`
- Verify git:
  - `git status`
  - `git pull origin main`

## 2) Install Dependencies
### Backend
- Go to `backend/`
- `npm install`

### Frontend
- Go to `frontend/`
- `npm install`

### ML service (if used)
- Go to `ml-service/`
- `pip install -r requirements.txt` (Python)

## 3) Environment Configuration
- Review backend config (e.g. `backend/config/database.js`)
- Ensure DB connection variables (if any) are correctly set
- Ensure any required credentials are available

## 4) Start Services
- Use provided scripts if available:
  - `start-all.sh` (mac/linux)
  - `start-all.bat` (windows)

Or start manually:
- Backend: `node backend/server.js`
- Frontend: `npm start` (inside `frontend/`)

## 5) Validate End-to-End Functionality
- Login/register (frontend → backend)
- Faculty upload / data ingestion
- Student prediction / mental health assessment
- Chat feature (if enabled)

## 6) Update Checkpoints
- After each completed milestone, update this file with:
  - Date
  - Completed items
  - Any blockers

## 7) Commit & Push
- `git add .`
- `git commit -m "Update: <summary>"`
- `git push origin main`

