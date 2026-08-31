#!/bin/bash
# Quick Setup Script for Linux/Mac
# Customer Management System

echo "========================================"
echo "Customer Management System - Setup"
echo "========================================"
echo ""

# Check Python
echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi
python3 --version
echo ""

# Check MySQL
echo "[2/5] Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo "WARNING: MySQL command not found in PATH"
    echo "Make sure MySQL is installed and running"
    echo ""
else
    mysql --version
    echo ""
fi

# Install Python dependencies
echo "[3/5] Installing Python dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed successfully!"
echo ""

# Check .env file
echo "[4/5] Checking configuration..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit .env file and update your MySQL password!"
    echo "File location: $(pwd)/.env"
    echo ""
    read -p "Press enter to continue..."
fi

# Create logs directory
mkdir -p backend/logs

echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo ""
echo "1. Update MySQL password in .env file"
echo "2. Run database setup:"
echo "   mysql -u root -p < database/schema.sql"
echo "   mysql -u root -p < database/seed.sql"
echo ""
echo "3. Start the application:"
echo "   python3 run.py           (Web version)"
echo "   python3 customer_cli.py  (CLI version)"
echo ""
echo "4. Open frontend/index.html in your browser"
echo ""
echo "========================================"
echo ""
