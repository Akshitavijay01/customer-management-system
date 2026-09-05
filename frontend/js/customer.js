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
                <div class="flex-between">
                    <div>
                        <h1 class="page-title">Customers</h1>
                        <p class="page-subtitle">${customers.length} customer${customers.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <button class="btn btn-primary" onclick="loadPage('add')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Customer
                    </button>
                </div>
            </div>

            <div class="card section-spacing">
                <div class="flex-between mb-4">
                    <div class="search-container">
                        <input
                            type="text"
                            class="search-box"
                            id="searchBox"
                            placeholder="Search by name, email, phone, or city..."
                            onkeyup="handleSearch()"
                        >
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="loadCustomers()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Refresh
                    </button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th id="nameHeader" style="cursor: pointer;" class="sortable">
                                    Name ${getSortIcon('first_name')}
                                </th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th id="createdHeader" style="cursor: pointer;" class="sortable">
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

                ${customers.length === 0 ? `
                    <div class="empty-state mt-6">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 16px;">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h4>No customers yet</h4>
                        <p>Get started by adding your first customer</p>
                        <button class="btn btn-primary mt-4" onclick="loadPage('add')">Add Customer</button>
                    </div>
                ` : ''}
            </div>
        `;

        content.innerHTML = tableHTML;

        // Add event listeners after inserting HTML
        document.getElementById('nameHeader').addEventListener('click', function() {
            sortTable('first_name');
        });

        document.getElementById('createdHeader').addEventListener('click', function() {
            sortTable('created_at');
        });
    } catch (error) {
        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Customers</h1>
                <p class="page-subtitle">Manage your customer database</p>
            </div>
            <div class="message message-error">
                <strong>Failed to load customers</strong><br>
                ${error.message}
                <br><br>
                <button class="btn btn-secondary" onclick="loadCustomers()">Try Again</button>
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
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="btn btn-icon btn-view" title="View Customer" onclick="viewCustomer('${customer.customer_id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8-4 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="btn btn-icon btn-edit" title="Edit Customer" onclick="editCustomer('${customer.customer_id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <button class="btn btn-icon btn-delete" title="Delete Customer" onclick="confirmDelete('${customer.customer_id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
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
            <div class="flex-between">
                <div>
                    <h1 class="page-title">Add New Customer</h1>
                    <p class="page-subtitle">Customer ID will be automatically generated</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="loadPage('customers')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Customers
                </button>
            </div>
        </div>

        <div class="card">
            <div id="formMessage"></div>

            <form id="customerForm" onsubmit="handleAddCustomer(event)">
                <div class="grid-2">
                    <div class="form-group">
                        <label for="first_name">First Name <span class="required">*</span></label>
                        <input type="text" id="first_name" name="first_name" required placeholder="Enter first name">
                    </div>

                    <div class="form-group">
                        <label for="last_name">Last Name <span class="required">*</span></label>
                        <input type="text" id="last_name" name="last_name" required placeholder="Enter last name">
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label for="email">Email <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required placeholder="Enter email address">
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" name="phone" placeholder="Enter phone number">
                    </div>
                </div>

                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" name="address" placeholder="Enter full address">
                </div>

                <div class="grid-3">
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" name="city" placeholder="Enter city">
                    </div>

                    <div class="form-group">
                        <label for="state">State</label>
                        <input type="text" id="state" name="state" placeholder="Enter state/province">
                    </div>

                    <div class="form-group">
                        <label for="postal_code">Postal Code</label>
                        <input type="text" id="postal_code" name="postal_code" placeholder="Enter postal code">
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label for="date_of_birth">Date of Birth</label>
                        <input type="date" id="date_of_birth" name="date_of_birth">
                    </div>

                    <div class="form-group">
                        <label for="gender">Gender</label>
                        <select id="gender" name="gender">
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
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('customerForm').reset()">
                        Clear Form
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="loadPage('customers')">
                        Back to List
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
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M12 6v6m0 0l-3 3m3-3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Saving...
    `;

    const formData = new FormData(form);
    const customerData = {};

    for (let [key, value] of formData.entries()) {
        customerData[key] = value || null;
    }

    try {
        const result = await API.createCustomer(customerData);
        showMessage(`Customer created successfully! ID: ${result.data.customer_id}`, 'success');

        // Reset form
        form.reset();

        // Redirect to customers list after delay
        setTimeout(() => {
            loadPage('customers');
        }, 1500);
    } catch (error) {
        showMessage('Failed to create customer: ' + error.message, 'error');
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
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
                <div class="flex-between">
                    <div>
                        <h1 class="page-title">Edit Customer</h1>
                        <p class="page-subtitle">Customer ID: <strong>${customer.customer_id}</strong></p>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="loadPage('customers')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Customers
                    </button>
                </div>
            </div>

            <div class="card">
                <div id="formMessage"></div>

                <form id="customerForm" onsubmit="handleUpdateCustomer(event, '${id}')">
                    <div class="grid-2">
                        <div class="form-group">
                            <label for="first_name">First Name <span class="required">*</span></label>
                            <input type="text" id="first_name" name="first_name" value="${escapeHtml(customer.first_name)}" required>
                        </div>

                        <div class="form-group">
                            <label for="last_name">Last Name <span class="required">*</span></label>
                            <input type="text" id="last_name" name="last_name" value="${escapeHtml(customer.last_name)}" required>
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label for="email">Email <span class="required">*</span></label>
                            <input type="email" id="email" name="email" value="${escapeHtml(customer.email)}" required>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone" name="phone" value="${escapeHtml(customer.phone || '')}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" name="address" value="${escapeHtml(customer.address || '')}">
                    </div>

                    <div class="grid-3">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" name="city" value="${escapeHtml(customer.city || '')}">
                        </div>

                        <div class="form-group">
                            <label for="state">State</label>
                            <input type="text" id="state" name="state" value="${escapeHtml(customer.state || '')}">
                        </div>

                        <div class="form-group">
                            <label for="postal_code">Postal Code</label>
                            <input type="text" id="postal_code" name="postal_code" value="${escapeHtml(customer.postal_code || '')}">
                        </div>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label for="date_of_birth">Date of Birth</label>
                            <input type="date" id="date_of_birth" name="date_of_birth" value="${customer.date_of_birth || ''}">
                        </div>

                        <div class="form-group">
                            <label for="gender">Gender</label>
                            <select id="gender" name="gender">
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
                        <button type="button" class="btn btn-danger" onclick="confirmDelete('${id}')" style="margin-left: auto;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Edit Customer</h1>
            </div>
            <div class="message message-error">
                <strong>Failed to load customer</strong><br>
                ${error.message}
                <br><br>
                <button class="btn btn-secondary" onclick="loadPage('customers')">Back to Customers</button>
            </div>
        `;
    }
}

/**
 * Handle update customer form submission
 */
async function handleUpdateCustomer(event, id) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M12 6v6m0 0l-3 3m3-3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Updating...
    `;
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
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

/**
 * Confirm delete customer - shows professional modal dialog
 */
function confirmDelete(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </div>
            <h3>Delete Customer?</h3>
            <p>Are you sure you want to delete customer <strong>${id}</strong>?</p>
            <p class="text-muted">This action cannot be undone.</p>

            <div class="modal-actions">
                <button class="btn btn-delete" id="confirmDeleteBtn" onclick="deleteCustomer('${id}')">Delete</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);


    // Focus the cancel button by default (safe default)
    setTimeout(() => {
        const cancelBtn = modal.querySelector('.btn-secondary');
        if (cancelBtn) cancelBtn.focus();
    }, 100);
}

/**
 * Delete customer
 */
async function deleteCustomer(id) {
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = 'Deleting...';
    }

    try {
        await API.deleteCustomer(id);
        closeModal();
        showToast('Customer deleted successfully', 'success');
        loadCustomers(currentSort.by, currentSort.order);
    } catch (error) {
        closeModal();
        showToast('Failed to delete customer: ' + error.message, 'error');
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
 * Show message in form
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
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Add icon based on type
    let icon = '';
    if (type === 'success') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (type === 'info') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
