// API Service for Inventory Management System
// Base configuration
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
    return this.request('/login', {
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

  async getRoles() {
    return this.request('/roles');
  }

  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: categoryData,
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
  
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getInventory(storeId) {
    const endpoint = storeId ? `/inventory?store_id=${storeId}` : '/inventory';
    return this.request(endpoint);
  }

  // Endpoint: PUT /inventory/<id> (Updates final quantity)
  async updateInventory(inventoryId, quantity) {
    return this.request(`/inventory/${inventoryId}`, {
      method: 'PUT',
      body: { quantity },
    });
  }
  
  async getSupplyRequests(storeId) {
    const endpoint = storeId ? `/supply_requests?store_id=${storeId}` : '/supply_requests';
    return this.request(endpoint);
  }

  async createSupplyRequest(requestData) {
    return this.request('/supply_requests', {
      method: 'POST',
      body: requestData,
    });
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

  async getPayments() {
    return this.request('/payments');
  }
  
  async createPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: paymentData,
    });
  }

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
    return this.request('/users/clerk', {
      method: 'POST',
      body: clerkData,
    });
  }

  // =============================
  // 🏪 STORE MANAGEMENT 
  // =============================

  async getStores() {
    return this.request('/stores');
  }

  async createStore(storeData) {
    return this.request('/stores', {
      method: 'POST',
      body: storeData,
    });
  }

  // =============================
  // 🐘 DASHBOARD HELPERS 
  // =============================

  merchantDashboard = {
    getStores: async () => {
      return this.getStores();
    },

    createStore: async (storeData) => {
      return this.createStore(storeData);
    },
    
    createStoreAdmin: async (adminData) => {
      return this.inviteUser(adminData.email, 2, adminData.storeId); // roleId=2 assumed
    },
    

  };

  adminDashboard = {

    createSupplyRequest: async (requestData) => {
      return this.createSupplyRequest(requestData);
    },
    
  };

  clerkDashboard = {

    createSupplyRequest: async (requestData) => {
      return this.createSupplyRequest(requestData);
    },
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

// Create singleton instance
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

// Explicit exports for dashboard helpers
export const merchantDashboard = apiService.merchantDashboard;
export const adminDashboard = apiService.adminDashboard;
export const clerkDashboard = apiService.clerkDashboard;