// API Configuration
// Use environment variable in production (Vercel), fallback to localhost for development
// For plain HTML/JS without Vite, we detect environment differently
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';  // Same-origin: use /api prefix in production

// Fallback for local development when backend isn't running
const FALLBACK_API_BASE_URL = '';

// ============================================
// SAFE API REQUEST HANDLER
// ============================================

/**
 * Safely parse a fetch response as JSON.
 * Handles non-JSON responses (HTML, plain text) gracefully.
 */
async function parseJSON(response) {
    const contentType = response.headers.get('Content-Type') || '';

    // If response is empty
    if (response.status === 204) {
        return null;
    }

    // Only parse as JSON if content-type says so
    if (contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (e) {
            throw new Error('Invalid response format from server');
        }
    }

    // Try to parse as text fallback
    const text = await response.text();

    // Attempt to parse JSON if it looks like JSON
    if (text && text.startsWith('{')) {
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Could not parse server response');
        }
    }

    // Return error with meaningful message for HTML responses
    if (text && text.includes('<html') || text && text.includes('<!DOCTYPE')) {
        throw new Error('Server returned an HTML error page');
    }

    return null;
}

/**
 * Make a safe API request with error handling
 */
async function safeRequest(url, options = {}) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error('Network error - please check your connection and try again');
    }

    // Parse the response body safely
    const data = await parseJSON(response);

    if (!response.ok) {
        const message = (data && data.message) || `Request failed (${response.status})`;
        throw new Error(message);
    }

    return data;
}

// API utility functions
const API = {
    /**
     * Get all customers with optional sorting
     */
    async getCustomers(sortBy = 'created_at', sortOrder = 'DESC') {
        return safeRequest(`${API_BASE_URL}/customers/?sort_by=${sortBy}&sort_order=${sortOrder}`);
    },

    /**
     * Get customer by ID
     */
    async getCustomer(id) {
        return safeRequest(`${API_BASE_URL}/customers/${id}`);
    },

    /**
     * Create new customer
     */
    async createCustomer(customerData) {
        return safeRequest(`${API_BASE_URL}/customers/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
    },

    /**
     * Update customer
     */
    async updateCustomer(id, customerData) {
        return safeRequest(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
    },

    /**
     * Delete customer
     */
    async deleteCustomer(id) {
        return safeRequest(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE'
        });
    },

    /**
     * Search customers with optional sorting
     */
    async searchCustomers(query, sortBy = 'created_at', sortOrder = 'DESC') {
        return safeRequest(`${API_BASE_URL}/customers/search?q=${encodeURIComponent(query)}&sort_by=${sortBy}&sort_order=${sortOrder}`);
    }
};
