import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.utils.validators import CustomerValidator

class TestCustomerValidation(unittest.TestCase):
    """Test customer validation logic"""

    def test_valid_email(self):
        """Test valid email validation"""
        valid, msg = CustomerValidator.validate_email('test@example.com')
        self.assertTrue(valid)
        self.assertEqual(msg, '')

    def test_invalid_email(self):
        """Test invalid email validation"""
        valid, msg = CustomerValidator.validate_email('invalid-email')
        self.assertFalse(valid)
        self.assertIn('Invalid email format', msg)

    def test_empty_email(self):
        """Test empty email validation"""
        valid, msg = CustomerValidator.validate_email('')
        self.assertFalse(valid)
        self.assertIn('Email is required', msg)

    def test_valid_phone(self):
        """Test valid phone validation"""
        valid, msg = CustomerValidator.validate_phone('555-0123')
        self.assertTrue(valid)

    def test_invalid_phone(self):
        """Test invalid phone validation"""
        valid, msg = CustomerValidator.validate_phone('123')
        self.assertFalse(valid)

    def test_valid_date(self):
        """Test valid date validation"""
        valid, msg = CustomerValidator.validate_date('1990-01-01')
        self.assertTrue(valid)

    def test_invalid_date_format(self):
        """Test invalid date format"""
        valid, msg = CustomerValidator.validate_date('01/01/1990')
        self.assertFalse(valid)
        self.assertIn('Invalid date format', msg)

    def test_future_date(self):
        """Test future date validation"""
        valid, msg = CustomerValidator.validate_date('2030-01-01')
        self.assertFalse(valid)
        self.assertIn('cannot be in the future', msg)

    def test_required_string(self):
        """Test required string validation"""
        valid, msg = CustomerValidator.validate_required_string('John', 'First name')
        self.assertTrue(valid)

    def test_empty_required_string(self):
        """Test empty required string"""
        valid, msg = CustomerValidator.validate_required_string('', 'First name')
        self.assertFalse(valid)
        self.assertIn('First name is required', msg)

    def test_complete_customer_data(self):
        """Test complete customer data validation"""
        customer_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'phone': '555-0123',
            'date_of_birth': '1990-01-01',
            'gender': 'Male'
        }
        valid, errors = CustomerValidator.validate_customer_data(customer_data)
        self.assertTrue(valid)
        self.assertEqual(len(errors), 0)

    def test_incomplete_customer_data(self):
        """Test incomplete customer data validation"""
        customer_data = {
            'first_name': 'John'
        }
        valid, errors = CustomerValidator.validate_customer_data(customer_data)
        self.assertFalse(valid)
        self.assertGreater(len(errors), 0)

if __name__ == '__main__':
    unittest.main()
