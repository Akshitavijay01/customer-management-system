from flask import Blueprint
from backend.controllers import CustomerController

# Create Blueprint
customer_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

# Define routes - customer_id is now in CUST-YYYY-NNNN format
customer_bp.route('/', methods=['GET'])(CustomerController.get_all)
customer_bp.route('/', methods=['POST'])(CustomerController.create)
customer_bp.route('/<string:customer_id>', methods=['GET'])(CustomerController.get_by_id)
customer_bp.route('/<string:customer_id>', methods=['PUT'])(CustomerController.update)
customer_bp.route('/<string:customer_id>', methods=['DELETE'])(CustomerController.delete)
customer_bp.route('/search', methods=['GET'])(CustomerController.search)
