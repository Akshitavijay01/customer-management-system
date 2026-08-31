import re
from datetime import datetime

class CustomerValidator:
    """Validator for customer data"""

    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email:
            return False, "Email is required"

        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            return False, "Invalid email format"

        if len(email) > 100:
            return False, "Email is too long (max 100 characters)"

        return True, ""

    @staticmethod
    def validate_phone(phone):
        """Validate phone format"""
        if not phone:
            return True, ""  # Phone is optional

        # Remove common separators
        cleaned = re.sub(r'[\s\-\(\)\.]+', '', phone)

        # Allow 7-15 digits (more lenient)
        if not re.match(r'^\+?[\d]{7,15}$', cleaned):
            return False, "Invalid phone format (use digits, spaces, dashes, or parentheses)"

        return True, ""

    @staticmethod
    def validate_date(date_str):
        """Validate date format"""
        if not date_str:
            return True, ""  # Date is optional

        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')

            # Check if date is not in the future
            if date_obj > datetime.now():
                return False, "Date of birth cannot be in the future"

            # Check reasonable age range (0-150 years)
            age = (datetime.now() - date_obj).days / 365.25
            if age < 0 or age > 150:
                return False, "Invalid date of birth"

            return True, ""
        except ValueError:
            return False, "Invalid date format (use YYYY-MM-DD)"

    @staticmethod
    def validate_required_string(value, field_name, max_length=None):
        """Validate required string field"""
        if not value or not value.strip():
            return False, f"{field_name} is required"

        if max_length and len(value) > max_length:
            return False, f"{field_name} is too long (max {max_length} characters)"

        return True, ""

    @staticmethod
    def validate_customer_data(data, is_update=False):
        """Validate complete customer data"""
        errors = []

        # Required fields for creation
        if not is_update:
            valid, msg = CustomerValidator.validate_required_string(
                data.get('first_name'), 'First name', 50
            )
            if not valid:
                errors.append(msg)

            valid, msg = CustomerValidator.validate_required_string(
                data.get('last_name'), 'Last name', 50
            )
            if not valid:
                errors.append(msg)

            valid, msg = CustomerValidator.validate_email(data.get('email'))
            if not valid:
                errors.append(msg)
        else:
            # For updates, only validate fields that are present
            if 'first_name' in data:
                valid, msg = CustomerValidator.validate_required_string(
                    data.get('first_name'), 'First name', 50
                )
                if not valid:
                    errors.append(msg)

            if 'last_name' in data:
                valid, msg = CustomerValidator.validate_required_string(
                    data.get('last_name'), 'Last name', 50
                )
                if not valid:
                    errors.append(msg)

            if 'email' in data:
                valid, msg = CustomerValidator.validate_email(data.get('email'))
                if not valid:
                    errors.append(msg)

        # Optional fields
        if 'phone' in data:
            valid, msg = CustomerValidator.validate_phone(data.get('phone'))
            if not valid:
                errors.append(msg)

        if 'date_of_birth' in data:
            valid, msg = CustomerValidator.validate_date(data.get('date_of_birth'))
            if not valid:
                errors.append(msg)

        if 'gender' in data and data.get('gender'):
            if data['gender'] not in ['Male', 'Female', 'Other']:
                errors.append("Gender must be Male, Female, or Other")

        # String length validations for optional fields
        optional_fields = {
            'address': 255,
            'city': 50,
            'state': 50,
            'postal_code': 20
        }

        for field, max_len in optional_fields.items():
            if field in data and data.get(field):
                if len(data[field]) > max_len:
                    errors.append(f"{field.replace('_', ' ').title()} is too long (max {max_len} characters)")

        return len(errors) == 0, errors
