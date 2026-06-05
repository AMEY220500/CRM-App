#!/bin/bash

# CRM App - Start All Services Script
# This script starts: Database (MySQL), Backend, and Frontend

echo ""
echo "=========================================="
echo "Starting CRM Application (All Services)"
echo "=========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Step 1: Start MySQL Database
echo "[1/3] Starting MySQL Database..."
cd "$SCRIPT_DIR/database"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Failed to start database. Exiting."
    exit 1
fi

echo "✓ Database container started. Waiting 5 seconds for initialization..."
sleep 5

# Step 2: Start Backend
echo "[2/3] Starting Backend Server..."
cd "$SCRIPT_DIR/backend"

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "✓ Starting backend in background..."
npm run dev &
BACKEND_PID=$!

# Step 3: Start Frontend
echo "[3/3] Starting Frontend Dev Server..."
cd "$SCRIPT_DIR/frontend"

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "✓ Starting frontend in background..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "All Services Started!"
echo "=========================================="
echo ""
echo "Access URLs:"
echo "  Frontend:  http://localhost:5173/"
echo "  Backend:   http://localhost:8080/"
echo "  Database:  localhost:3306"
echo ""
echo "Login Credentials:"
echo "  Email:     admin@crm-app.com"
echo "  Password:  Admin@123"
echo ""
echo "Background Process IDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To stop all services, press Ctrl+C or run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  cd database && docker-compose down"
echo ""

# Keep script running
wait
