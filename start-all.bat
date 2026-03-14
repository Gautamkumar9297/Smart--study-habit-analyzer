@echo off
echo Starting all services...

echo Starting Flask ML Service on port 5000...
start cmd /k "cd ml-service && venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak

echo Starting Node.js Backend on port 5001...
start cmd /k "cd backend && npm start"

timeout /t 2 /nobreak

echo Starting React Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo All services started in separate windows!
