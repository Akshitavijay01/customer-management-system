// API Configuration
// Use environment variable in production (Vercel), fallback to localhost for development
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : (import.meta.env.VITE_API_URL || '/api');

// API utility functions
const API = {
    /**
     * Get all customers with optional sorting
     */
    async getCustomers(sortBy = 'created_at', sortOrder = 'DESC') {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/?sort_by=${sortBy}&sort_order=${sortOrder}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch customers');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Get customer by ID
     */
    async getCustomer(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch customer');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Create new customer
     */
    async createCustomer(customerData) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create customer');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Update customer
     */
    async updateCustomer(id, customerData) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update customer');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Delete customer
     */
    async deleteCustomer(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete customer');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Search customers with optional sorting
     */
    async searchCustomers(query, sortBy = 'created_at', sortOrder = 'DESC') {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/search?q=${encodeURIComponent(query)}&sort_by=${sortBy}&sort_order=${sortOrder}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to search customers');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
