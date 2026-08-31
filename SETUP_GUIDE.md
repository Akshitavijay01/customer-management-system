# SETUP GUIDE - Customer Management System

## Quick Start Guide

### 1. Install Python Dependencies

Open terminal in the project directory and run:

```bash
pip install -r requirements.txt
```

### 2. Configure MySQL Database

#### Option A: Using MySQL Command Line

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the schema file:
```sql
source database/schema.sql
```

3. (Optional) Load sample data:
```sql
source database/seed.sql
```

4. Verify:
```sql
USE customer_management;
SHOW TABLES;
SELECT COUNT(*) FROM customers;
```

5. Exit:
```sql
exit
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script (lightning bolt icon)
5. (Optional) Open and execute `database/seed.sql`
6. Refresh the Schemas panel
7. Verify `customer_management` database exists

### 3. Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` file and update your MySQL password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD_HERE
DB_NAME=customer_management
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
```

**IMPORTANT:** Replace `YOUR_ACTUAL_MYSQL_PASSWORD_HERE` with your real MySQL password!

### 4. Run the Application

#### Option A: Web Interface (Flask + HTML)

1. Start the backend server:
```bash
python run.py
```

You should see:
```
Starting Customer Management System
Host: http://localhost:5000
```

2. Open the frontend:
   - Simply open `frontend/index.html` in your browser
   - OR use a local server:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Then visit: http://localhost:8000

#### Option B: Terminal CLI

Run the command-line version:
```bash
python customer_cli.py
```

This provides a text-based menu interface directly in your terminal.

## Verification Checklist

✓ Python 3.8+ installed  
✓ MySQL 8.0+ installed and running  
✓ Dependencies installed (`pip install -r requirements.txt`)  
✓ Database created (`customer_management`)  
✓ Table created (`customers`)  
✓ `.env` file configured with correct MySQL password  
✓ Backend server starts without errors  
✓ Frontend loads in browser  

## Common Issues and Solutions

### Issue: "Access denied for user 'root'@'localhost'"

**Cause:** Incorrect MySQL password in `.env` file

**Solution:**
1. Open `.env` file
2. Update `DB_PASSWORD=your_actual_password`
3. Save and restart the application

### Issue: "Unknown database 'customer_management'"

**Cause:** Database not created

**Solution:**
```bash
mysql -u root -p < database/schema.sql
```

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Cause:** Dependencies not installed

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Port 5000 is already in use"

**Solution 1:** Stop other applications using port 5000

**Solution 2:** Change port in `.env`:
```env
FLASK_PORT=5001
```

Also update `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### Issue: Frontend cannot connect to backend

**Solutions:**
1. Make sure backend is running (`python run.py`)
2. Check browser console for errors (F12)
3. Verify API_BASE_URL in `frontend/js/api.js` matches your backend
4. Clear browser cache

### Issue: MySQL won't start on Windows

**Solution:**
1. Open Services (Win + R, type `services.msc`)
2. Find "MySQL" service
3. Right-click → Start

## Testing

### Test Database Connection

```bash
python -c "from backend.database import DatabaseConnection; print('Success!' if DatabaseConnection.get_connection() else 'Failed')"
```

### Run Unit Tests

```bash
python -m unittest tests/test_customers.py -v
```

### Test API Endpoints

Backend must be running first (`python run.py`)

**Get all customers:**
```bash
curl http://localhost:5000/api/customers
```

**Create customer:**
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d "{\"first_name\":\"Test\",\"last_name\":\"User\",\"email\":\"test@test.com\"}"
```

## Next Steps

1. Update MySQL password in `.env`
2. Start backend: `python run.py`
3. Open frontend: `frontend/index.html`
4. Add your first customer!

## Need Help?

- Check `README.md` for detailed documentation
- Review logs in `backend/logs/app.log`
- Verify MySQL is running
- Check all environment variables in `.env`

---

**Project created:** 2026-08-24  
**Last updated:** 2026-08-24
