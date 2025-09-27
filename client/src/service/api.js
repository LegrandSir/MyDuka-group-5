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
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // =============================
  // 🔑 AUTH ENDPOINTS
  // =============================

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
      requireAuth: false,
    });

    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async createSuperuser(email, name, password, setupSecret) {
    return this.request('/auth/create-superuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SETUP-SECRET': setupSecret,
      },
      body: { email, name, password },
      requireAuth: false,
    });
  }

  async inviteUser(email, roleId, storeId) {
    return this.request('/auth/invite', {
      method: 'POST',
      body: { email, role_id: roleId, store_id: storeId },
    });
  }

  async register(token, name, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { token, name, password },
      requireAuth: false,
    });
  }

  async getRegistrationPreview(token) {
    return this.request(`/auth/register?token=${token}`, {
      method: 'GET',
      requireAuth: false,
    });
  }

  // renamed to avoid recursion
  async createClerkViaAdmin(adminId, clerkData) {
    return this.request(`/auth/admins/${adminId}/create-clerk`, {
      method: 'POST',
      body: clerkData,
    });
  }

  async testLogin(username) {
    return this.request('/auth/test-login', {
      method: 'POST',
      body: { username },
      requireAuth: false,
    });
  }

  async testProtected() {
    return this.request('/auth/test-protected', { method: 'GET' });
  }

  logout() {
    this.setToken(null);
  }

  // =============================
  // 📌 ROLES ENDPOINTS
  // =============================

  getRoles() {
    return this.request('/roles');
  }

  getRole(roleId) {
    return this.request(`/roles/${roleId}`);
  }

  createRole(name, description) {
    return this.request('/roles', { method: 'POST', body: { name, description } });
  }

  updateRole(roleId, updates) {
    return this.request(`/roles/${roleId}`, { method: 'PUT', body: updates });
  }

  deleteRole(roleId) {
    return this.request(`/roles/${roleId}`, { method: 'DELETE' });
  }

  // =============================
  // 📂 CATEGORIES ENDPOINTS
  // =============================

  getCategories() {
    return this.request('/categories/');
  }

  getCategory(categoryId) {
    return this.request(`/categories/${categoryId}`);
  }

  createCategory(name, description) {
    return this.request('/categories/', { method: 'POST', body: { name, description } });
  }

  updateCategory(categoryId, updates) {
    return this.request(`/categories/${categoryId}`, { method: 'PUT', body: updates });
  }

  deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, { method: 'DELETE' });
  }

  // =============================
  // 📦 PRODUCTS ENDPOINTS
  // =============================

  getProducts() {
    return this.request('/products/');
  }

  getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  createProduct(productData) {
    return this.request('/products/', { method: 'POST', body: productData });
  }

  updateProduct(productId, updates) {
    return this.request(`/products/${productId}`, { method: 'PUT', body: updates });
  }

  deleteProduct(productId) {
    return this.request(`/products/${productId}`, { method: 'DELETE' });
  }

  // =============================
  // 📊 INVENTORY ENDPOINTS
  // =============================

  getInventory() {
    return this.request('/inventory/');
  }

  getInventoryItem(inventoryId) {
    return this.request(`/inventory/${inventoryId}`);
  }

  addInventory(productId, quantity) {
    return this.request('/inventory/', { method: 'POST', body: { product_id: productId, quantity } });
  }

  updateInventory(inventoryId, quantity) {
    return this.request(`/inventory/${inventoryId}`, { method: 'PUT', body: { quantity } });
  }

  deleteInventoryItem(inventoryId) {
    return this.request(`/inventory/${inventoryId}`, { method: 'DELETE' });
  }

  // =============================
  // 📑 SUPPLY REQUESTS ENDPOINTS
  // =============================

  getSupplyRequests() {
    return this.request('/supply_requests');
  }

  getSupplyRequest(requestId) {
    return this.request(`/supply_requests/${requestId}`);
  }

  createSupplyRequest(requestData) {
    return this.request('/supply_requests', { method: 'POST', body: requestData });
  }

  updateSupplyRequest(requestId, status) {
    return this.request(`/supply_requests/${requestId}`, { method: 'PUT', body: { status } });
  }

  deleteSupplyRequest(requestId) {
    return this.request(`/supply_requests/${requestId}`, { method: 'DELETE' });
  }

  // =============================
  // 📊 DASHBOARD HELPERS
  // =============================

  clerkDashboard = {
    getInventoryOverview: async (clerkId) => {
      return this.getInventory(); // backend should filter by store/clerk
    },
    recordSpoilage: async (itemId, quantity, reason) => {
      const item = await this.getInventoryItem(itemId);
      const newQuantity = Math.max(0, item.quantity - quantity);
      return this.updateInventory(itemId, newQuantity);
    },
    submitSupplyRequest: async (productName, quantity, reason, clerkId) => {
      return this.createSupplyRequest({
        product_id: null, // backend should resolve
        store_id: null,   // backend should resolve
        quantity,
        requested_by: clerkId,
        reason,
      });
    },
  };

  adminDashboard = {
    handleSupplyRequest: async (requestId, status) => {
      return this.updateSupplyRequest(requestId, status);
    },
    getStoreStats: async (storeId) => {
      const [products, inventory, requests] = await Promise.all([
        this.getProducts(),
        this.getInventory(),
        this.getSupplyRequests(),
      ]);
      return {
        products: products.filter((p) => p.store_id === storeId),
        inventory: inventory.filter((i) => i.store_id === storeId),
        requests: requests.filter((r) => r.store_id === storeId),
      };
    },
    createClerk: async (clerkData) => {
      return this.createClerkViaAdmin(clerkData.adminId, clerkData);
    },
  };

  merchantDashboard = {
    getAllStoresData: async () => {
      return Promise.all([
        this.getProducts(),
        this.getInventory(),
        this.getSupplyRequests(),
      ]);
    },
    createStoreAdmin: async (adminData) => {
      return this.inviteUser(adminData.email, 2, adminData.storeId); // roleId=2 assumed
    },
    getReports: async (period = 'weekly') => {
      return {
        period,
        data: [], // backend reporting endpoint needed
      };
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
  getProducts,
  getInventory,
  getSupplyRequests,
  createCategory,
  createProduct,
  createSupplyRequest,
  updateSupplyRequest,
} = apiService;

// Explicit exports for dashboard helpers
export const clerkDashboard = apiService.clerkDashboard;
export const adminDashboard = apiService.adminDashboard;
export const merchantDashboard = apiService.merchantDashboard;
