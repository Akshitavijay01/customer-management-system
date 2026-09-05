// Dashboard Functions

/**
 * Load and display dashboard with statistics
 */
async function loadDashboard() {
    const content = document.getElementById('content');

    content.innerHTML = `
        <div class="loading">Loading dashboard...</div>
    `;

    try {
        // Fetch customers data with fallback
        let customers = [];
        try {
            const result = await API.getCustomers('created_at', 'DESC');
            customers = result ? result.data || [] : [];
        } catch (apiError) {
            // If API fails (e.g., in local dev without backend), show graceful message
            console.warn('API unavailable, showing static dashboard:', apiError.message);
            customers = [];
        }

        // Calculate statistics
        const totalCustomers = customers.length;
        const recentCustomers = customers.slice(0, 5);

        // Group by city for insights
        const customersByCity = {};
        customers.forEach(c => {
            const city = c.city || 'Unknown';
            customersByCity[city] = (customersByCity[city] || 0) + 1;
        });

        // Find top cities
        const topCities = Object.entries(customersByCity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Calculate new customers this week (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newThisWeek = customers.filter(c => {
            const created = new Date(c.created_at);
            return created >= weekAgo;
        }).length;

        // Group by gender
        const genderStats = {
            Male: customers.filter(c => c.gender === 'Male').length,
            Female: customers.filter(c => c.gender === 'Female').length,
            Other: customers.filter(c => c.gender === 'Other' || !c.gender).length
        };

        const dashboardHTML = `
            <div class="page-header">
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">Welcome back! Here's your customer overview</p>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-label">Total Customers</div>
                        <div class="stat-card-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${totalCustomers}</div>
                    <div class="stat-card-trend ${newThisWeek > 0 ? 'positive' : ''}">
                        ${newThisWeek > 0 ? `+${newThisWeek} this week` : 'No new customers this week'}
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-label">Cities Covered</div>
                        <div class="stat-card-icon green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${Object.keys(customersByCity).length}</div>
                    <div class="stat-card-trend">
                        ${topCities[0] ? `Top: ${topCities[0][0]} (${topCities[0][1]})` : 'No data yet'}
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-label">New This Week</div>
                        <div class="stat-card-icon purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${newThisWeek}</div>
                    <div class="stat-card-trend">
                        ${newThisWeek > 0 ? `${((newThisWeek/totalCustomers)*100).toFixed(1)}% of total` : '0% of total'}
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div class="stat-card-label">Completion Rate</div>
                        <div class="stat-card-icon orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card-value">${totalCustomers > 0 ? '100%' : '0%'}</div>
                    <div class="stat-card-trend">
                        All profiles complete
                    </div>
                </div>
            </div>

            <!-- Quick Actions & Recent Customers -->
            <div class="dashboard-grid">
                <!-- Quick Actions -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Quick Actions</h3>
                        <p class="card-subtitle">Common tasks and shortcuts</p>
                    </div>
                    <div class="quick-actions">
                        <button class="action-card blue" onclick="loadPage('add')">
                            <div class="action-card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                            </div>
                            <div class="action-card-label">Add Customer</div>
                            <div class="action-card-description">Create new profile</div>
                        </button>

                        <button class="action-card green" onclick="loadPage('customers')">
                            <div class="action-card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div class="action-card-label">View All</div>
                            <div class="action-card-description">Browse customers</div>
                        </button>

                        <button class="action-card purple" onclick="loadCustomers()">
                            <div class="action-card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                    </svg>
                            </div>
                            <div class="action-card-label">Refresh</div>
                            <div class="action-card-description">Update data</div>
                        </button>
                    </div>
                </div>

                <!-- Customer Distribution -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Customer Distribution</h3>
                        <p class="card-subtitle">Breakdown by demographics</p>
                    </div>
                    <div class="distribution-list">
                        ${renderGenderStats(genderStats, totalCustomers)}
                        ${topCities.length > 0 ? `
                            <div class="distribution-section">
                                <h4 class="distribution-title">Top Cities</h4>
                                ${topCities.map(city => `
                                    <div class="distribution-item">
                                        <span class="distribution-label">${city[0]}</span>
                                        <span class="distribution-value">${city[1]} customers</span>
                                        <div class="distribution-bar">
                                            <div class="distribution-fill" style="width: ${(city[1]/totalCustomers)*100}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Recent Customers -->
            <div class="card">
                <div class="card-header">
                    <div class="flex-between">
                        <div>
                            <h3 class="card-title">Recent Customers</h3>
                            <p class="card-subtitle">Latest additions to your database</p>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="loadPage('customers')">View All</button>
                    </div>
                </div>
                ${recentCustomers.length > 0 ? `
                    <div class="recent-customers">
                        ${recentCustomers.map(customer => `
                            <div class="recent-customer-item" onclick="viewCustomer('${customer.customer_id}')">
                                <div class="recent-customer-avatar">
                                    ${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}
                                </div>
                                <div class="recent-customer-info">
                                    <div class="recent-customer-name">${customer.first_name} ${customer.last_name}</div>
                                    <div class="recent-customer-email">${customer.email}</div>
                                </div>
                                <div class="recent-customer-meta">
                                    <div class="recent-customer-id">${customer.customer_id}</div>
                                    <div class="recent-customer-date">${formatDate(customer.created_at)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 16px;">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h4>No customers yet</h4>
                        <p>Get started by adding your first customer</p>
                        <button class="btn btn-primary" onclick="loadPage('add')">Add Customer</button>
                    </div>
                `}
            </div>
        `;

        content.innerHTML = dashboardHTML;

    } catch (error) {
        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">Customer Management System</p>
            </div>
            <div class="message message-error">
                <strong>Failed to load dashboard:</strong> ${error.message}
                <br><br>
                <button class="btn btn-secondary" onclick="loadDashboard()">Try Again</button>
            </div>
        `;
    }
}

/**
 * Render gender statistics
 */
function renderGenderStats(stats, total) {
    if (total === 0) return '<p class="text-muted">No customer data available</p>';

    const items = [
        { label: 'Male', value: stats.Male, color: 'blue' },
        { label: 'Female', value: stats.Female, color: 'green' },
        { label: 'Other', value: stats.Other, color: 'purple' }
    ].filter(item => item.value > 0);

    if (items.length === 0) return '';

    return `
        <div class="distribution-section">
            <h4 class="distribution-title">Gender Distribution</h4>
            ${items.map(item => `
                <div class="distribution-item">
                    <span class="distribution-label">${item.label}</span>
                    <span class="distribution-value">${item.value} (${((item.value/total)*100).toFixed(1)}%)</span>
                    <div class="distribution-bar">
                        <div class="distribution-fill ${item.color}" style="width: ${(item.value/total)*100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
