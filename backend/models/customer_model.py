from backend.database import DatabaseConnection
from backend.utils.logger import logger

class CustomerModel:
    """Customer database model"""

    @staticmethod
    def create(customer_data):
        """Create a new customer"""
        # Don't generate customer_id - let MySQL auto-increment handle it
        query = """
            INSERT INTO customers
            (first_name, last_name, email, phone, address, city, state, postal_code, date_of_birth, gender)
            VALUES (%(first_name)s, %(last_name)s, %(email)s, %(phone)s, %(address)s,
                    %(city)s, %(state)s, %(postal_code)s, %(date_of_birth)s, %(gender)s)
        """

        try:
            customer_id = DatabaseConnection.execute(query, customer_data)
            logger.info(f"Customer created with ID: {customer_id}")
            return customer_id
        except Exception as e:
            logger.error(f"Error creating customer: {e}")
            raise

    @staticmethod
    def get_all(sort_by='created_at', sort_order='DESC'):
        """Get all customers with sorting"""
        # Validate sort parameters
        allowed_sorts = {
            'created_at': 'created_at',
            'name': ['first_name', 'last_name'],
            'customer_id': 'customer_id'
        }

        sort_columns = allowed_sorts.get(sort_by, 'created_at')
        sort_direction = 'ASC' if sort_order.upper() == 'ASC' else 'DESC'

        # Handle multiple sort columns (for name) vs single column
        if isinstance(sort_columns, list):
            sort_clause = ', '.join([f"{col} {sort_direction}" for col in sort_columns])
        else:
            sort_clause = f"{sort_columns} {sort_direction}"

        query = f"""
            SELECT customer_id, first_name, last_name, email, phone,
                   address, city, state, postal_code, date_of_birth, gender,
                   created_at, updated_at
            FROM customers
            ORDER BY {sort_clause}
        """

        try:
            customers = DatabaseConnection.fetch_all(query)
            logger.debug(f"Retrieved {len(customers) if customers else 0} customers (sorted by {sort_by} {sort_direction})")
            return customers or []
        except Exception as e:
            logger.error(f"Error fetching customers: {e}")
            raise

    @staticmethod
    def get_by_id(customer_id):
        """Get customer by customer_id (CUST-YYYY-NNNN format)"""
        query = """
            SELECT customer_id, first_name, last_name, email, phone,
                   address, city, state, postal_code, date_of_birth, gender,
                   created_at, updated_at
            FROM customers
            WHERE customer_id = %s
        """

        try:
            customer = DatabaseConnection.fetch_one(query, (customer_id,))
            if customer:
                logger.debug(f"Customer found with ID: {customer_id}")
            else:
                logger.debug(f"No customer found with ID: {customer_id}")
            return customer
        except Exception as e:
            logger.error(f"Error fetching customer by ID: {e}")
            raise

    @staticmethod
    def search(search_term, sort_by='created_at', sort_order='DESC'):
        """Search customers by multiple fields with sorting"""
        allowed_sorts = {
            'created_at': 'created_at',
            'name': ['first_name', 'last_name'],
            'customer_id': 'customer_id'
        }

        sort_columns = allowed_sorts.get(sort_by, 'created_at')
        sort_direction = 'ASC' if sort_order.upper() == 'ASC' else 'DESC'

        # Handle multiple sort columns (for name) vs single column
        if isinstance(sort_columns, list):
            sort_clause = ', '.join([f"{col} {sort_direction}" for col in sort_columns])
        else:
            sort_clause = f"{sort_columns} {sort_direction}"

        query = f"""
            SELECT customer_id, first_name, last_name, email, phone,
                   address, city, state, postal_code, date_of_birth, gender,
                   created_at, updated_at
            FROM customers
            WHERE customer_id LIKE %s
               OR first_name LIKE %s
               OR last_name LIKE %s
               OR email LIKE %s
               OR phone LIKE %s
               OR city LIKE %s
            ORDER BY {sort_clause}
        """

        try:
            search_pattern = f"%{search_term}%"
            customers = DatabaseConnection.fetch_all(
                query,
                (search_pattern, search_pattern, search_pattern, search_pattern, search_pattern, search_pattern)
            )
            logger.debug(f"Search returned {len(customers) if customers else 0} results for '{search_term}'")
            return customers or []
        except Exception as e:
            logger.error(f"Error searching customers: {e}")
            raise

    @staticmethod
    def update(customer_id, customer_data):
        """Update customer"""
        # Build dynamic update query based on provided fields
        update_fields = []
        params = []

        allowed_fields = ['first_name', 'last_name', 'email', 'phone', 'address',
                         'city', 'state', 'postal_code', 'date_of_birth', 'gender']

        for field in allowed_fields:
            if field in customer_data:
                update_fields.append(f"{field} = %s")
                params.append(customer_data[field])

        if not update_fields:
            raise ValueError("No valid fields to update")

        query = f"""
            UPDATE customers
            SET {', '.join(update_fields)}
            WHERE customer_id = %s
        """
        params.append(customer_id)

        try:
            DatabaseConnection.execute(query, tuple(params))
            logger.info(f"Customer updated with ID: {customer_id}")
            return True
        except Exception as e:
            logger.error(f"Error updating customer: {e}")
            raise

    @staticmethod
    def delete(customer_id):
        """Delete customer"""
        query = "DELETE FROM customers WHERE customer_id = %s"

        try:
            DatabaseConnection.execute(query, (customer_id,))
            logger.info(f"Customer deleted with ID: {customer_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting customer: {e}")
            raise

    @staticmethod
    def email_exists(email, exclude_id=None):
        """Check if email already exists"""
        if exclude_id:
            query = "SELECT customer_id FROM customers WHERE email = %s AND customer_id != %s"
            params = (email, exclude_id)
        else:
            query = "SELECT customer_id FROM customers WHERE email = %s"
            params = (email,)

        try:
            result = DatabaseConnection.fetch_one(query, params)
            return result is not None
        except Exception as e:
            logger.error(f"Error checking email existence: {e}")
            raise
