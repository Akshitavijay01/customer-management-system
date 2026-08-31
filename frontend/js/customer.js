// Customer Management Functions

// Current sort state
let currentSort = {
    by: 'created_at',
    order: 'DESC'
};

/**
 * Load and display customers list
 */
async function loadCustomers(sortBy = 'created_at', sortOrder = 'DESC') {
    const content = document.getElementById('content');

    content.innerHTML = `
        <div class="loading">Loading customers...</div>
    `;

    try {
        const result = await API.getCustomers(sortBy, sortOrder);
        const customers = result.data || [];

        // Update current sort state
        currentSort = { by: sortBy, order: sortOrder };

        const tableHTML = `
            <div class="page-header">
                <h1 class="page-title">Customers</h1>
                <p class="page-subtitle">Manage your customer database</p>
            </div>

            <div class="card section-spacing">
                <div class="flex-between mb-4">
                    <div class="search-container">
                        <input
                            type="text"
                            class="search-box"
                            id="searchBox"
                            placeholder="Search customers by ID, name, email, phone, or city..."
                            onkeyup="handleSearch()"
                        >
                    </div>
                    <button class="btn btn-primary" onclick="loadPage('add')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Customer
                    </button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th id="nameHeader" style="cursor: pointer;">
                                    Name ${getSortIcon('name')}
                                </th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>State</th>
                                <th id="createdHeader" style="cursor: pointer;">
                                    Created ${getSortIcon('created_at')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customerTableBody">
                            ${renderCustomerRows(customers)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        content.innerHTML = tableHTML;

        // Add event listeners after inserting HTML
        document.getElementById('nameHeader').addEventListener('click', function() {
            sortTable('name');
        });

        document.getElementById('createdHeader').addEventListener('click', function() {
            sortTable('created_at');
        });
    } catch (error) {
        content.innerHTML = `
            <div class="message message-error">
                Failed to load customers: ${error.message}
                <br><br>
                Make sure the backend server is running on http://localhost:5000
            </div>
        `;
    }
}

/**
 * Get sort icon for column
 */
function getSortIcon(column) {
    if (currentSort.by !== column) {
        return '<span style="opacity: 0.3;">↕</span>';
    }
    return currentSort.order === 'ASC' ? ' ↑' : ' ↓';
}

/**
 * Sort table by column
 */
function sortTable(column) {
    // Toggle order if clicking same column
    if (currentSort.by === column) {
        currentSort.order = currentSort.order === 'ASC' ? 'DESC' : 'ASC';
    } else {
        currentSort.order = 'DESC'; // Default to descending for new column
    }

    loadCustomers(column, currentSort.order);
}

/**
 * Render customer table rows
 */
function renderCustomerRows(customers) {
    if (!customers || customers.length === 0) {
        return '<tr><td colspan="8" class="no-data">No customers found</td></tr>';
    }

    return customers.map(customer => `
        <tr>
            <td><strong>${customer.customer_id}</strong></td>
            <td>${customer.first_name} ${customer.last_name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.city || 'N/A'}</td>
            <td>${customer.state || 'N/A'}</td>
            <td>${formatDate(customer.created_at)}</td>
            <td>
                <button class="btn btn-view" onclick="viewCustomer('${customer.customer_id}')">View</button>
                <button class="btn btn-edit" onclick="editCustomer('${customer.customer_id}')">Edit</button>
                <button class="btn btn-delete" onclick="confirmDelete('${customer.customer_id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Handle search
 */
let searchTimeout;
async function handleSearch() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        const searchBox = document.getElementById('searchBox');
        const query = searchBox.value.trim();

        if (query.length < 2) {
            loadCustomers(currentSort.by, currentSort.order);
            return;
        }

        try {
            const result = await API.searchCustomers(query, currentSort.by, currentSort.order);
            const customers = result.data || [];

            document.getElementById('customerTableBody').innerHTML = renderCustomerRows(customers);
        } catch (error) {
            showMessage('Search failed: ' + error.message, 'error');
        }
    }, 300);
}

/**
 * View customer details
 */
async function viewCustomer(id) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">Loading customer details...</div>';

    try {
        const result = await API.getCustomer(id);
        const customer = result.data;

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Customer Details</h1>
                <p class="page-subtitle">View customer information</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">${customer.first_name} ${customer.last_name}</h2>
                </div>

                <table class="detail-table">
                    <tr><td><strong>Customer ID:</strong></td><td>${customer.customer_id}</td></tr>
                    <tr><td><strong>First Name:</strong></td><td>${customer.first_name}</td></tr>
                    <tr><td><strong>Last Name:</strong></td><td>${customer.last_name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${customer.email}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>${customer.phone || 'N/A'}</td></tr>
                    <tr><td><strong>Address:</strong></td><td>${customer.address || 'N/A'}</td></tr>
                    <tr><td><strong>City:</strong></td><td>${customer.city || 'N/A'}</td></tr>
                    <tr><td><strong>State:</strong></td><td>${customer.state || 'N/A'}</td></tr>
                    <tr><td><strong>Postal Code:</strong></td><td>${customer.postal_code || 'N/A'}</td></tr>
                    <tr><td><strong>Date of Birth:</strong></td><td>${customer.date_of_birth || 'N/A'}</td></tr>
                    <tr><td><strong>Gender:</strong></td><td>${customer.gender || 'N/A'}</td></tr>
                    <tr><td><strong>Created At:</strong></td><td>${formatDateTime(customer.created_at)}</td></tr>
                    <tr><td><strong>Updated At:</strong></td><td>${formatDateTime(customer.updated_at)}</td></tr>
                </table>

                <div class="form-actions">
                    <button class="btn btn-primary" onclick="editCustomer('${customer.customer_id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit Customer
                    </button>
                    <button class="btn btn-secondary" onclick="loadPage('customers')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to List
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="message message-error">${error.message}</div>
            <button class="btn btn-secondary" onclick="loadPage('customers')">Back to List</button>
        `;
    }
}

/**
 * Load add customer form
 */
function loadAddCustomerForm() {
    const content = document.getElementById('content');

    content.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Add New Customer</h1>
            <p class="page-subtitle">Customer ID will be automatically generated</p>
        </div>

        <div class="card">
            <div id="formMessage"></div>

            <form id="customerForm" onsubmit="handleAddCustomer(event)">
                <div class="grid-2">
                    <div class="form-group">
                        <label>First Name <span class="required">*</span></label>
                        <input type="text" name="first_name" required>
                    </div>

                    <div class="form-group">
                        <label>Last Name <span class="required">*</span></label>
                        <input type="text" name="last_name" required>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label>Email <span class="required">*</span></label>
                        <input type="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" placeholder="555-0123">
                    </div>
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address">
                </div>

                <div class="grid-3">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" name="city">
                    </div>

                    <div class="form-group">
                        <label>State</label>
                        <input type="text" name="state">
                    </div>

                    <div class="form-group">
                        <label>Postal Code</label>
                        <input type="text" name="postal_code">
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="date_of_birth">
                    </div>

                    <div class="form-group">
                        <label>Gender</label>
                        <select name="gender">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Save Customer
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('customerForm').reset()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Clear
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="loadPage('customers')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back
                    </button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Handle add customer form submission
 */
async function handleAddCustomer(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const customerData = {};

    for (let [key, value] of formData.entries()) {
        customerData[key] = value || null;
    }

    try {
        const result = await API.createCustomer(customerData);
        showMessage(`Customer created successfully! ID: ${result.data.customer_id}`, 'success');

        setTimeout(() => {
            loadPage('customers');
        }, 2000);
    } catch (error) {
        showMessage('Failed to create customer: ' + error.message, 'error');
    }
}

/**
 * Load edit customer form
 */
async function editCustomer(id) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading">Loading customer data...</div>';

    try {
        const result = await API.getCustomer(id);
        const customer = result.data;

        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Edit Customer</h1>
                <p class="page-subtitle">Customer ID: <strong>${customer.customer_id}</strong></p>
            </div>

            <div class="card">
                <div id="formMessage"></div>

                <form id="customerForm" onsubmit="handleUpdateCustomer(event, '${id}')">
                    <div class="grid-2">
                        <div class="form-group">
                            <label>First Name <span class="required">*</span></label>
                            <input type="text" name="first_name" value="${customer.first_name}" required>
                        </div>

                        <div class="form-group">
                            <label>Last Name <span class="required">*</span></label>
                            <input type="text" name="last_name" value="${customer.last_name}" required>
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label>Email <span class="required">*</span></label>
                            <input type="email" name="email" value="${customer.email}" required>
                        </div>

                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" name="phone" value="${customer.phone || ''}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" name="address" value="${customer.address || ''}">
                    </div>

                    <div class="grid-3">
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" name="city" value="${customer.city || ''}">
                        </div>

                        <div class="form-group">
                            <label>State</label>
                            <input type="text" name="state" value="${customer.state || ''}">
                        </div>

                        <div class="form-group">
                            <label>Postal Code</label>
                            <input type="text" name="postal_code" value="${customer.postal_code || ''}">
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="date_of_birth" value="${customer.date_of_birth || ''}">
                        </div>

                        <div class="form-group">
                            <label>Gender</label>
                            <select name="gender">
                                <option value="">Select Gender</option>
                                <option value="Male" ${customer.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${customer.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${customer.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Update Customer
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="loadPage('customers')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="message message-error">${error.message}</div>
            <button class="btn btn-secondary" onclick="loadPage('customers')">Back to List</button>
        `;
    }
}

/**
 * Handle update customer form submission
 */
async function handleUpdateCustomer(event, id) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const customerData = {};

    for (let [key, value] of formData.entries()) {
        customerData[key] = value || null;
    }

    try {
        const result = await API.updateCustomer(id, customerData);
        showMessage('Customer updated successfully!', 'success');

        setTimeout(() => {
            loadPage('customers');
        }, 1500);
    } catch (error) {
        showMessage('Failed to update customer: ' + error.message, 'error');
    }
}

/**
 * Confirm delete customer
 */
function confirmDelete(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete customer <strong>${id}</strong>?</p>
            <p>This action cannot be undone.</p>

            <div class="modal-actions">
                <button class="btn btn-delete" onclick="deleteCustomer('${id}')">Yes, Delete</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Delete customer
 */
async function deleteCustomer(id) {
    try {
        await API.deleteCustomer(id);
        closeModal();
        showMessage('Customer deleted successfully!', 'success');
        loadCustomers(currentSort.by, currentSort.order);
    } catch (error) {
        closeModal();
        showMessage('Failed to delete customer: ' + error.message, 'error');
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Show message
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="message message-${type}">${message}</div>`;

        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

/**
 * Format date and time
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US');
}
