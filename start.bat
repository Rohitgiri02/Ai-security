@echo off
echo.
echo 🚀 Starting AI Code Analyzer Platform
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Setup backend
echo 📦 Setting up backend...
cd backend

if not exist .env (
    echo Creating .env from template...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your API keys
)

if not exist node_modules (
    echo Installing dependencies...
    call npm install >nul 2>&1
)

echo ✅ Backend ready
cd ..
echo.

REM Setup frontend
echo 📦 Setting up frontend...
cd frontend

if not exist node_modules (
    echo Installing dependencies...
    call npm install >nul 2>&1
)

echo ✅ Frontend ready
cd ..
echo.

REM Create batch files to start in separate windows
echo Starting backend...
cd backend
start "AI Code Analyzer - Backend" cmd /k "npm start"
cd ..

timeout /t 2 /nobreak

echo Starting frontend...
cd frontend
start "AI Code Analyzer - Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 AI Code Analyzer is running!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📱 Frontend: http://localhost:3001
echo 🔌 Backend:  http://localhost:3000
echo.
echo Open the frontend URL in your browser to start!
echo.
