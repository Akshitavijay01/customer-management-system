# Advanced Customer Management System

A full-stack customer management application built with Python, Flask, MySQL, and vanilla JavaScript.

## Features

- **Add Customer** - Create new customer records with validation
- **View Customers** - Display all customers in a clean table
- **Search Customer** - Search by name, email, phone, or city
- **Update Customer** - Edit existing customer information
- **Delete Customer** - Remove customers with confirmation
- **View Customer Details** - See complete customer information
- **Input Validation** - Frontend and backend validation
- **Error Handling** - Comprehensive error messages
- **Responsive Design** - Works on desktop and mobile

## Technology Stack

### Backend
- **Python 3** - Programming language
- **Flask** - Web framework
- **MySQL** - Database
- **mysql-connector-python** - MySQL driver
- **python-dotenv** - Environment configuration
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **JavaScript** - Client-side logic
- **Fetch API** - HTTP requests

## Project Structure

```
advanced_customer_management/
│
├── backend/
│   ├── app.py                      # Flask application factory
│   ├── config.py                   # Configuration management
│   ├── extensions.py               # Flask extensions
│   │
│   ├── routes/
│   │   └── customer_routes.py      # API route definitions
│   │
│   ├── controllers/
│   │   └── customer_controller.py  # Request handlers
│   │
│   ├── services/
│   │   └── customer_service.py     # Business logic
│   │
│   ├── models/
│   │   └── customer_model.py       # Database operations
│   │
│   ├── database/
│   │   └── db_connection.py        # Database connection manager
│   │
│   └── utils/
│       ├── validators.py           # Input validation
│       └── logger.py               # Logging configuration
│
├── frontend/
│   ├── index.html                  # Main page
│   ├── css/
│   │   └── style.css              # Styles
│   └── js/
│       ├── app.js                 # Main application logic
│       ├── customer.js            # Customer operations
│       └── api.js                 # API communication
│
├── database/
│   ├── schema.sql                 # Database schema
│   └── seed.sql                   # Sample data
│
├── tests/
│   └── test_customers.py          # Unit tests
│
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── requirements.txt               # Python dependencies
├── README.md                      # Documentation
└── run.py                         # Application entry point
```

## Installation

### Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- Modern web browser

### Step 1: Clone or Download

Download this project or navigate to the project directory.

### Step 2: Create Virtual Environment

```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Configure MySQL Database

1. **Open MySQL:**
```bash
mysql -u root -p
```

2. **Create Database:**
```bash
source database/schema.sql
```

3. **Insert Sample Data (Optional):**
```bash
source database/seed.sql
```

4. **Exit MySQL:**
```bash
exit
```

### Step 6: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and update your MySQL password:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=customer_management
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000
```

## Running the Application

### Step 1: Start Backend Server

```bash
python run.py
```

You should see:
```
Starting Customer Management System
Environment: development
Debug Mode: True
Database: customer_management
Host: http://localhost:5000
```

### Step 2: Open Frontend

Open `frontend/index.html` in your web browser.

**Or use a simple HTTP server:**

```bash
cd frontend
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/<id>` | Get customer by ID |
| POST | `/api/customers` | Create new customer |
| PUT | `/api/customers/<id>` | Update customer |
| DELETE | `/api/customers/<id>` | Delete customer |
| GET | `/api/customers/search?q=<term>` | Search customers |

### Example API Request

**Create Customer:**
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    "phone": "555-0123",
    "city": "New York",
    "state": "NY"
  }'
```

## Testing

Run unit tests:

```bash
python -m unittest tests/test_customers.py
```

## Validation Rules

### Required Fields
- First Name (max 50 chars)
- Last Name (max 50 chars)
- Email (valid format, max 100 chars)

### Optional Fields
- Phone (10-15 digits)
- Address (max 255 chars)
- City (max 50 chars)
- State (max 50 chars)
- Postal Code (max 20 chars)
- Date of Birth (YYYY-MM-DD, not in future)
- Gender (Male/Female/Other)

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:** Update MySQL password in `.env` file.

### Error: "Unknown database 'customer_management'"

**Solution:** Run `database/schema.sql` in MySQL:
```bash
mysql -u root -p < database/schema.sql
```

### Error: "Module not found"

**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Error: "Port 5000 is already in use"

**Solution 1:** Stop the process using port 5000.

**Solution 2:** Change port in `.env`:
```env
FLASK_PORT=5001
```

And update `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### Frontend Cannot Connect to Backend

**Solutions:**
1. Verify backend is running on `http://localhost:5000`
2. Check browser console for errors
3. Verify CORS is enabled in `backend/extensions.py`
4. Clear browser cache

### MySQL Connection Fails

**Solutions:**
1. Verify MySQL is running
2. Check MySQL credentials in `.env`
3. Verify database exists
4. Check MySQL port (default 3306)

## Security Notes

- Never commit `.env` file to version control
- Use parameterized queries (already implemented)
- Change default SECRET_KEY in production
- Use HTTPS in production
- Implement authentication in production

## Future Enhancements

- User authentication and authorization
- Export customers to CSV/PDF
- Customer activity logs
- Advanced filtering and sorting
- Pagination for large datasets
- Email notifications
- File uploads (profile pictures)
- Customer categories/tags

## License

This project is created for educational purposes.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review application logs in `backend/logs/app.log`
3. Check MySQL error logs
4. Verify all dependencies are installed

## Author

Created as an advanced full-stack Python + MySQL project.

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-24
