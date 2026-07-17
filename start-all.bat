@echo off
echo ===================================================
echo Starting StayConnect (Frontend + Backend Launcher)
echo ===================================================

:: 1. Start the Backend in a separate window
echo Starting Backend Server...
start "StayConnect Backend" cmd /c "run-backend.bat"

:: 2. Start the Frontend in this window
echo Starting Frontend Server...
npm run dev
