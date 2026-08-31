@echo off
REM Quick Setup Script for Windows
REM Customer Management System

echo ========================================
echo Customer Management System - Setup
echo ========================================
echo.

REM Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)
python --version
echo.

REM Check MySQL
echo [2/5] Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is installed and running
    echo.
) else (
    mysql --version
    echo.
)

REM Install Python dependencies
echo [3/5] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Check .env file
echo [4/5] Checking configuration...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and update your MySQL password!
    echo File location: %CD%\.env
    echo.
    pause
)

REM Create logs directory
if not exist backend\logs mkdir backend\logs

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Update MySQL password in .env file
echo 2. Run database setup:
echo    mysql -u root -p ^< database\schema.sql
echo    mysql -u root -p ^< database\seed.sql
echo.
echo 3. Start the application:
echo    python run.py        (Web version)
echo    python customer_cli.py  (CLI version)
echo.
echo 4. Open frontend\index.html in your browser
echo.
echo ========================================
echo.
pause
