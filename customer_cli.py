#!/usr/bin/env python3
"""
Customer Management System - Terminal CLI Version
Run this for a command-line interface to manage customers
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.database import DatabaseConnection
from backend.models import CustomerModel
from backend.services import CustomerService
from backend.utils import logger
from backend.config import Config


class CustomerCLI:
    """Command-line interface for customer management"""

    def __init__(self):
        self.running = True

    def clear_screen(self):
        """Clear terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')

    def print_header(self):
        """Print application header"""
        print("=" * 50)
        print("   CUSTOMER MANAGEMENT SYSTEM - CLI")
        print("=" * 50)
        print()

    def print_menu(self):
        """Print main menu"""
        self.print_header()
        print("1. Add Customer")
        print("2. View All Customers")
        print("3. Search Customer")
        print("4. Update Customer")
        print("5. Delete Customer")
        print("6. View Customer by ID")
        print("7. Exit")
        print()

    def get_input(self, prompt, required=False):
        """Get user input"""
        while True:
            value = input(prompt).strip()
            if not required or value:
                return value if value else None
            print("This field is required!")

    def add_customer(self):
        """Add new customer"""
        self.clear_screen()
        print("=" * 50)
        print("   ADD NEW CUSTOMER")
        print("=" * 50)
        print()

        customer_data = {
            'first_name': self.get_input("First Name *: ", required=True),
            'last_name': self.get_input("Last Name *: ", required=True),
            'email': self.get_input("Email *: ", required=True),
            'phone': self.get_input("Phone: "),
            'address': self.get_input("Address: "),
            'city': self.get_input("City: "),
            'state': self.get_input("State: "),
            'postal_code': self.get_input("Postal Code: "),
            'date_of_birth': self.get_input("Date of Birth (YYYY-MM-DD): "),
            'gender': self.get_input("Gender (Male/Female/Other): ")
        }

        try:
            result = CustomerService.create_customer(customer_data)
            print("\n✓ Customer created successfully!")
            print(f"Customer ID: {result['customer_id']}")
        except Exception as e:
            print(f"\n✗ Error: {e}")

        input("\nPress Enter to continue...")

    def view_all_customers(self):
        """View all customers"""
        self.clear_screen()
        print("=" * 50)
        print("   ALL CUSTOMERS")
        print("=" * 50)
        print()

        try:
            customers = CustomerService.get_all_customers()

            if not customers:
                print("No customers found.")
            else:
                print(f"Total Customers: {len(customers)}\n")
                print(f"{'ID':<5} {'Name':<25} {'Email':<30} {'Phone':<15} {'City':<15}")
                print("-" * 90)

                for customer in customers:
                    name = f"{customer['first_name']} {customer['last_name']}"
                    phone = customer['phone'] or 'N/A'
                    city = customer['city'] or 'N/A'
                    print(f"{customer['customer_id']:<5} {name:<25} {customer['email']:<30} {phone:<15} {city:<15}")

        except Exception as e:
            print(f"✗ Error: {e}")

        input("\nPress Enter to continue...")

    def search_customer(self):
        """Search customers"""
        self.clear_screen()
        print("=" * 50)
        print("   SEARCH CUSTOMERS")
        print("=" * 50)
        print()

        search_term = self.get_input("Enter search term (name, email, phone, city): ", required=True)

        try:
            customers = CustomerService.search_customers(search_term)

            if not customers:
                print(f"\nNo customers found matching '{search_term}'")
            else:
                print(f"\nFound {len(customers)} customer(s):\n")
                print(f"{'ID':<5} {'Name':<25} {'Email':<30} {'Phone':<15} {'City':<15}")
                print("-" * 90)

                for customer in customers:
                    name = f"{customer['first_name']} {customer['last_name']}"
                    phone = customer['phone'] or 'N/A'
                    city = customer['city'] or 'N/A'
                    print(f"{customer['customer_id']:<5} {name:<25} {customer['email']:<30} {phone:<15} {city:<15}")

        except Exception as e:
            print(f"✗ Error: {e}")

        input("\nPress Enter to continue...")

    def update_customer(self):
        """Update customer"""
        self.clear_screen()
        print("=" * 50)
        print("   UPDATE CUSTOMER")
        print("=" * 50)
        print()

        customer_id = self.get_input("Enter Customer ID: ", required=True)

        try:
            # Get existing customer
            existing = CustomerService.get_customer_by_id(customer_id)

            print(f"\nCurrent Customer: {existing['first_name']} {existing['last_name']}")
            print("Leave blank to keep current value\n")

            customer_data = {}

            fields = [
                ('first_name', 'First Name'),
                ('last_name', 'Last Name'),
                ('email', 'Email'),
                ('phone', 'Phone'),
                ('address', 'Address'),
                ('city', 'City'),
                ('state', 'State'),
                ('postal_code', 'Postal Code'),
                ('date_of_birth', 'Date of Birth (YYYY-MM-DD)'),
                ('gender', 'Gender')
            ]

            for field, label in fields:
                current_value = existing.get(field) or 'N/A'
                print(f"Current {label}: {current_value}")
                new_value = self.get_input(f"New {label}: ")
                if new_value:
                    customer_data[field] = new_value

            if not customer_data:
                print("\nNo changes made.")
            else:
                result = CustomerService.update_customer(customer_id, customer_data)
                print("\n✓ Customer updated successfully!")

        except Exception as e:
            print(f"\n✗ Error: {e}")

        input("\nPress Enter to continue...")

    def delete_customer(self):
        """Delete customer"""
        self.clear_screen()
        print("=" * 50)
        print("   DELETE CUSTOMER")
        print("=" * 50)
        print()

        customer_id = self.get_input("Enter Customer ID: ", required=True)

        try:
            # Get customer details
            customer = CustomerService.get_customer_by_id(customer_id)

            print(f"\nCustomer: {customer['first_name']} {customer['last_name']}")
            print(f"Email: {customer['email']}")

            confirm = self.get_input("\nAre you sure you want to delete this customer? (yes/no): ", required=True)

            if confirm.lower() == 'yes':
                CustomerService.delete_customer(customer_id)
                print("\n✓ Customer deleted successfully!")
            else:
                print("\nDeletion cancelled.")

        except Exception as e:
            print(f"\n✗ Error: {e}")

        input("\nPress Enter to continue...")

    def view_customer_by_id(self):
        """View customer by ID"""
        self.clear_screen()
        print("=" * 50)
        print("   VIEW CUSTOMER DETAILS")
        print("=" * 50)
        print()

        customer_id = self.get_input("Enter Customer ID: ", required=True)

        try:
            customer = CustomerService.get_customer_by_id(customer_id)

            print(f"\n{'Field':<20} {'Value'}")
            print("-" * 60)
            print(f"{'Customer ID':<20} {customer['customer_id']}")
            print(f"{'First Name':<20} {customer['first_name']}")
            print(f"{'Last Name':<20} {customer['last_name']}")
            print(f"{'Email':<20} {customer['email']}")
            print(f"{'Phone':<20} {customer['phone'] or 'N/A'}")
            print(f"{'Address':<20} {customer['address'] or 'N/A'}")
            print(f"{'City':<20} {customer['city'] or 'N/A'}")
            print(f"{'State':<20} {customer['state'] or 'N/A'}")
            print(f"{'Postal Code':<20} {customer['postal_code'] or 'N/A'}")
            print(f"{'Date of Birth':<20} {customer['date_of_birth'] or 'N/A'}")
            print(f"{'Gender':<20} {customer['gender'] or 'N/A'}")
            print(f"{'Created At':<20} {customer['created_at']}")
            print(f"{'Updated At':<20} {customer['updated_at']}")

        except Exception as e:
            print(f"✗ Error: {e}")

        input("\nPress Enter to continue...")

    def run(self):
        """Run the CLI application"""
        print("\nChecking database connection...")

        try:
            # Test database connection
            connection = DatabaseConnection.get_connection()
            connection.close()
            print("✓ Database connection successful!\n")
            input("Press Enter to continue...")
        except Exception as e:
            print(f"✗ Database connection failed: {e}")
            print("\nPlease check your .env configuration and MySQL server.")
            return

        while self.running:
            self.clear_screen()
            self.print_menu()

            choice = self.get_input("Enter your choice (1-7): ", required=True)

            if choice == '1':
                self.add_customer()
            elif choice == '2':
                self.view_all_customers()
            elif choice == '3':
                self.search_customer()
            elif choice == '4':
                self.update_customer()
            elif choice == '5':
                self.delete_customer()
            elif choice == '6':
                self.view_customer_by_id()
            elif choice == '7':
                self.clear_screen()
                print("Thank you for using Customer Management System!")
                print("Goodbye!")
                self.running = False
            else:
                print("\nInvalid choice! Please enter 1-7.")
                input("Press Enter to continue...")


def main():
    """Main entry point"""
    try:
        cli = CustomerCLI()
        cli.run()
    except KeyboardInterrupt:
        print("\n\nApplication interrupted by user.")
        print("Goodbye!")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        logger.error(f"CLI Application error: {e}")


if __name__ == '__main__':
    main()
