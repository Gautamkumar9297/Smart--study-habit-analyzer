#!/bin/bash

echo "Starting all services..."

# Start Flask ML Service
echo "Starting Flask ML Service on port 5000..."
cd ml-service
source venv/bin/activate
python app.py &
FLASK_PID=$!
cd ..

# Wait for Flask to start
sleep 3

# Start Node.js Backend
echo "Starting Node.js Backend on port 5001..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for Backend to start
sleep 2

# Start React Frontend
echo "Starting React Frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "All services started!"
echo "Flask PID: $FLASK_PID"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop all services, run: kill $FLASK_PID $BACKEND_PID $FRONTEND_PID"
