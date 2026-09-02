import os
import sys
import mysql.connector

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.config import Config
from backend.utils.logger import logger

def init_db():
    print("Connecting to database...")
    db_config = Config.get_db_config()

    # Don't use pooling for this script
    if 'pool_name' in db_config:
        del db_config['pool_name']
    if 'pool_size' in db_config:
        del db_config['pool_size']

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        print(f"Connected to database: {db_config.get('database')}")

        # SQL to create the customers table
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id VARCHAR(50) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            phone VARCHAR(20),
            address VARCHAR(255),
            city VARCHAR(50),
            state VARCHAR(50),
            postal_code VARCHAR(20),
            date_of_birth DATE,
            gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_customer_id (customer_id),
            INDEX idx_email (email),
            INDEX idx_name (first_name, last_name),
            INDEX idx_city (city),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """

        print("Creating table 'customers'...")
        cursor.execute(create_table_sql)
        print("Table 'customers' successfully created.")

        # Simple check if there's any data
        cursor.execute("SELECT COUNT(*) FROM customers")
        count = cursor.fetchone()[0]

        print(f"Table 'customers' exists and contains {count} records.")

        cursor.close()
        conn.close()
        print("Database initialization complete! You can now use the API.")
        return True

    except Exception as e:
        print(f"Failed to initialize database: {e}")
        return False

if __name__ == "__main__":
    init_db()