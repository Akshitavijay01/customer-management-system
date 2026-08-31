import mysql.connector
from mysql.connector import Error
from backend.config import Config
from backend.utils.logger import logger
from datetime import datetime

class DatabaseConnection:
    """Database connection manager"""

    @staticmethod
    def get_connection():
        """Create and return a database connection"""
        try:
            connection = mysql.connector.connect(**Config.get_db_config())
            if connection.is_connected():
                logger.debug("Database connection established")
                return connection
        except Error as e:
            logger.error(f"Database connection error: {e}")
            raise Exception(f"Failed to connect to database: {str(e)}")

    @staticmethod
    def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
        """
        Execute a database query

        Args:
            query: SQL query string
            params: Query parameters (tuple or dict)
            fetch_one: Return single row
            fetch_all: Return all rows
            commit: Commit the transaction

        Returns:
            Query result or None
        """
        connection = None
        cursor = None

        try:
            connection = DatabaseConnection.get_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute(query, params or ())

            if fetch_one:
                result = cursor.fetchone()
                return result
            elif fetch_all:
                result = cursor.fetchall()
                return result
            elif commit:
                connection.commit()
                return cursor.lastrowid if cursor.lastrowid else True

            return None

        except Error as e:
            if connection:
                connection.rollback()
            logger.error(f"Query execution error: {e}")
            logger.error(f"Query: {query}")
            logger.error(f"Params: {params}")
            raise Exception(f"Database query failed: {str(e)}")

        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
                logger.debug("Database connection closed")

    @staticmethod
    def fetch_one(query, params=None):
        """Fetch single row"""
        return DatabaseConnection.execute_query(query, params, fetch_one=True)

    @staticmethod
    def fetch_all(query, params=None):
        """Fetch all rows"""
        return DatabaseConnection.execute_query(query, params, fetch_all=True)

    @staticmethod
    def execute(query, params=None):
        """Execute query with commit"""
        return DatabaseConnection.execute_query(query, params, commit=True)

    @staticmethod
    def generate_customer_id():
        """Generate unique customer ID in format CUST-YYYY-NNNN"""
        connection = None
        cursor = None

        try:
            connection = DatabaseConnection.get_connection()
            cursor = connection.cursor(dictionary=True)

            # Get current year
            current_year = datetime.now().year

            # Find the highest number for this year
            query = """
                SELECT customer_id FROM customers
                WHERE customer_id LIKE %s
                ORDER BY customer_id DESC
                LIMIT 1
            """
            cursor.execute(query, (f'CUST-{current_year}-%',))
            result = cursor.fetchone()

            if result:
                # Extract the number part and increment
                last_id = result['customer_id']
                last_number = int(last_id.split('-')[-1])
                new_number = last_number + 1
            else:
                # First customer of the year
                new_number = 1

            # Format: CUST-2026-0001
            customer_id = f"CUST-{current_year}-{new_number:04d}"

            return customer_id

        except Error as e:
            logger.error(f"Error generating customer ID: {e}")
            # Fallback to timestamp-based ID
            import time
            return f"CUST-{current_year}-{int(time.time() % 10000):04d}"

        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
