from backend.models import CustomerModel
from backend.utils import CustomerValidator, logger

class CustomerService:
    """Business logic for customer operations"""

    @staticmethod
    def create_customer(customer_data):
        """Create a new customer with validation"""
        # Validate customer data
        is_valid, errors = CustomerValidator.validate_customer_data(customer_data)
        if not is_valid:
            logger.warning(f"Customer validation failed: {errors}")
            raise ValueError(', '.join(errors))

        # Check for duplicate email
        if CustomerModel.email_exists(customer_data['email']):
            logger.warning(f"Duplicate email attempt: {customer_data['email']}")
            raise ValueError("Email already exists")

        # Create customer (customer_id is generated automatically)
        customer_id = CustomerModel.create(customer_data)
        return CustomerModel.get_by_id(customer_id)

    @staticmethod
    def get_all_customers(sort_by='created_at', sort_order='DESC'):
        """Get all customers with sorting"""
        return CustomerModel.get_all(sort_by=sort_by, sort_order=sort_order)

    @staticmethod
    def get_customer_by_id(customer_id):
        """Get customer by ID"""
        if not customer_id or not customer_id.strip():
            raise ValueError("Invalid customer ID")

        customer = CustomerModel.get_by_id(customer_id)
        if not customer:
            raise ValueError("Customer not found")

        return customer

    @staticmethod
    def search_customers(search_term, sort_by='created_at', sort_order='DESC'):
        """Search customers with sorting"""
        if not search_term or not search_term.strip():
            raise ValueError("Search term is required")

        return CustomerModel.search(search_term.strip(), sort_by=sort_by, sort_order=sort_order)

    @staticmethod
    def update_customer(customer_id, customer_data):
        """Update customer with validation"""
        if not customer_id or not customer_id.strip():
            raise ValueError("Invalid customer ID")

        # Check if customer exists
        existing_customer = CustomerModel.get_by_id(customer_id)
        if not existing_customer:
            raise ValueError("Customer not found")

        # Validate update data
        is_valid, errors = CustomerValidator.validate_customer_data(customer_data, is_update=True)
        if not is_valid:
            logger.warning(f"Customer update validation failed: {errors}")
            raise ValueError(', '.join(errors))

        # Check for duplicate email (excluding current customer)
        if 'email' in customer_data:
            if CustomerModel.email_exists(customer_data['email'], exclude_id=customer_id):
                logger.warning(f"Duplicate email attempt during update: {customer_data['email']}")
                raise ValueError("Email already exists")

        # Update customer
        CustomerModel.update(customer_id, customer_data)
        return CustomerModel.get_by_id(customer_id)

    @staticmethod
    def delete_customer(customer_id):
        """Delete customer"""
        if not customer_id or not customer_id.strip():
            raise ValueError("Invalid customer ID")

        # Check if customer exists
        existing_customer = CustomerModel.get_by_id(customer_id)
        if not existing_customer:
            raise ValueError("Customer not found")

        # Delete customer
        CustomerModel.delete(customer_id)
        return True
