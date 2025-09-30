// 🌐 Base configuration
const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // =============================
  // 🔧 Helper Methods
  // =============================

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.msg || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.requireAuth !== false),
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      return this.handleResponse(response);
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // =============================
  // 🔑 AUTH METHODS 
  // =============================

  async login(credentials) {
    return this.request('/auth/login', {   // ✅ fixed endpoint
      method: 'POST',
      body: credentials,
      requireAuth: false,
    }).then(data => {
      this.setToken(data.access_token);
      return data;
    });
  }

  // =============================
  // 📦 COMMON DATA METHODS 
  // =============================

  async getRoles() { return this.request('/roles'); }
  async getCategories() { return this.request('/categories'); }
  async createCategory(data) { return this.request('/categories', { method: 'POST', body: data }); }
  async updateCategory(id, data) { return this.request(`/categories/${id}`, { method: 'PUT', body: data }); }
  async deleteCategory(id) { return this.request(`/categories/${id}`, { method: 'DELETE' }); }

  async getProducts() { return this.request('/products/'); }
  async createProduct(data) { return this.request('/products', { method: 'POST', body: data }); }
  async updateProduct(id, data) { return this.request(`/products/${id}`, { method: 'PUT', body: data }); }
  async deleteProduct(id) { return this.request(`/products/${id}`, { method: 'DELETE' }); }

  // =============================
  // 📦 INVENTORY
  // =============================

  async getInventory(storeId) {
    const endpoint = storeId ? `/inventory/?store_id=${storeId}` : '/inventory/';
    return this.request(endpoint);
  }

  async updateInventory(inventoryId, quantity) {
    return this.request(`/inventory/${inventoryId}`, {
      method: 'PUT',
      body: { quantity },
    });
  }

  // =============================
  // 🚚 SUPPLY REQUESTS
  // =============================

  async getSupplyRequests(storeId) {
    const endpoint = storeId ? `/supply_requests?store_id=${storeId}` : '/supply_requests';
    return this.request(endpoint);
  }

  async createSupplyRequest(data) {
    return this.request('/supply_requests', { method: 'POST', body: data });
  }

  async updateSupplyRequest(id, status) {
    return this.request(`/supply_requests/${id}`, {
      method: 'PUT',
      body: { status },
    });
  }

  // =============================
  // 💸 PAYMENTS 
  // =============================

  async getPayments() { return this.request('/payments'); }
  async createPayment(data) { return this.request('/payments', { method: 'POST', body: data }); }

  // =============================
  // 👤 USER MANAGEMENT 
  // =============================

  async inviteUser(email, roleId, storeId) {
    return this.request('/invite', {
      method: 'POST',
      body: { email, role_id: roleId, store_id: storeId },
    });
  }

  async createClerkViaAdmin(clerkData) {
    return this.request('/users/clerk', { method: 'POST', body: clerkData });
  }

  // =============================
  // 🏪 STORE MANAGEMENT 
  // =============================

  async getStores() { return this.request('/stores/'); }
  async createStore(data) { return this.request('/stores/', { method: 'POST', body: data }); }

  // =============================
  // 🐘 DASHBOARD HELPERS 
  // =============================

  merchantDashboard = {
    getStores: async () => this.getStores(),
    createStore: async (data) => this.createStore(data),
    createStoreAdmin: async (adminData) => this.inviteUser(adminData.email, 2, adminData.storeId),
  };

  adminDashboard = {
    createSupplyRequest: async (data) => this.createSupplyRequest(data),
  };

  clerkDashboard = {
    createSupplyRequest: async (data) => this.createSupplyRequest(data),
  };

  // =============================
  // 🔐 UTILITIES
  // =============================

  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    if (!this.token) return null;
    try {
      return JSON.parse(atob(this.token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  handleError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      this.logout();
      window.location.href = '/login';
      return;
    }
    throw error;
  }
}

// Singleton export
const apiService = new ApiService();
export default apiService;

// Named exports for convenience
export const {
  login,
  logout,
  getRoles,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventory,
  updateInventory,
  getSupplyRequests,
  createSupplyRequest,
  updateSupplyRequest,
  getStores,
  createStore,
  getPayments,
  createPayment,
} = apiService;

export const merchantDashboard = apiService.merchantDashboard;
export const adminDashboard = apiService.adminDashboard;
export const clerkDashboard = apiService.clerkDashboard;