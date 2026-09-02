from flask import request, jsonify
from backend.services import CustomerService
from backend.utils.logger import logger

class CustomerController:
    """Controller for customer API endpoints"""

    @staticmethod
    def create():
        """Handle POST /api/customers"""
        try:
            data = request.get_json()

            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided',
                    'data': None
                }), 400

            customer = CustomerService.create_customer(data)

            return jsonify({
                'success': True,
                'message': 'Customer created successfully',
                'data': customer
            }), 201

        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 400
        except Exception as e:
            logger.error(f"Error in create customer: {e}")
            return jsonify({
                'success': False,
                'message': f'An error occurred: {str(e)}',
                'data': None
            }), 500

    @staticmethod
    def get_all():
        """Handle GET /api/customers with optional sorting"""
        try:
            # Get sort parameters from query string
            sort_by = request.args.get('sort_by', 'created_at')  # Default: newest first
            sort_order = request.args.get('sort_order', 'DESC')  # Default: descending

            customers = CustomerService.get_all_customers(sort_by=sort_by, sort_order=sort_order)

            return jsonify({
                'success': True,
                'message': f'Retrieved {len(customers)} customers',
                'data': customers,
                'sort_by': sort_by,
                'sort_order': sort_order
            }), 200

        except Exception as e:
            logger.error(f"Error in get all customers: {e}")
            return jsonify({
                'success': False,
                'message': f'An error occurred: {str(e)}',
                'data': None
            }), 500

    @staticmethod
    def get_by_id(customer_id):
        """Handle GET /api/customers/<id>"""
        try:
            customer = CustomerService.get_customer_by_id(customer_id)

            return jsonify({
                'success': True,
                'message': 'Customer retrieved successfully',
                'data': customer
            }), 200

        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 404
        except Exception as e:
            logger.error(f"Error in get customer by id: {e}")
            return jsonify({
                'success': False,
                'message': 'An error occurred while fetching customer',
                'data': None
            }), 500

    @staticmethod
    def search():
        """Handle GET /api/customers/search?q=<search_term>"""
        try:
            search_term = request.args.get('q', '').strip()
            sort_by = request.args.get('sort_by', 'created_at')
            sort_order = request.args.get('sort_order', 'DESC')

            if not search_term:
                return jsonify({
                    'success': False,
                    'message': 'Search term is required',
                    'data': None
                }), 400

            customers = CustomerService.search_customers(search_term, sort_by=sort_by, sort_order=sort_order)

            return jsonify({
                'success': True,
                'message': f'Found {len(customers)} customers',
                'data': customers
            }), 200

        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 400
        except Exception as e:
            logger.error(f"Error in search customers: {e}")
            return jsonify({
                'success': False,
                'message': 'An error occurred while searching customers',
                'data': None
            }), 500

    @staticmethod
    def update(customer_id):
        """Handle PUT /api/customers/<id>"""
        try:
            data = request.get_json()

            if not data:
                return jsonify({
                    'success': False,
                    'message': 'No data provided',
                    'data': None
                }), 400

            customer = CustomerService.update_customer(customer_id, data)

            return jsonify({
                'success': True,
                'message': 'Customer updated successfully',
                'data': customer
            }), 200

        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 400
        except Exception as e:
            logger.error(f"Error in update customer: {e}")
            return jsonify({
                'success': False,
                'message': 'An error occurred while updating customer',
                'data': None
            }), 500

    @staticmethod
    def delete(customer_id):
        """Handle DELETE /api/customers/<id>"""
        try:
            CustomerService.delete_customer(customer_id)

            return jsonify({
                'success': True,
                'message': 'Customer deleted successfully',
                'data': None
            }), 200

        except ValueError as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 404
        except Exception as e:
            logger.error(f"Error in delete customer: {e}")
            return jsonify({
                'success': False,
                'message': 'An error occurred while deleting customer',
                'data': None
            }), 500
