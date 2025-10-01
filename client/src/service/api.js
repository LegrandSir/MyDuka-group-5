// 🌐 Base configuration
const BASE_URL = 'http://127.0.0.1:5000';

function getToken() {
  return localStorage.getItem("token"); 
}

async function request(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
     },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch { err = text; }
    throw new Error(err?.message || res.statusText || text);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return null;
}

const api = {
  // Products
  getProducts: () => request("/products/"),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request("/products/", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => request("/categories/"),
  createCategory: (data) => request("/categories/", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  // Inventory
  getInventory: () => request("/inventory/"),
  createInventory: (data) => request("/inventory/", { method: "POST", body: JSON.stringify(data) }),
  updateInventory: (id, quantity) => request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  deleteInventory: (id) => request(`/inventory/${id}`, { method: "DELETE" }),

  // Supply requests
  getSupplyRequests: () => request("/supply_requests/"),
  createSupplyRequest: (data) => request("/supply_requests/", { method: "POST", body: JSON.stringify(data) }),
  updateSupplyRequest: (id, status) =>
    request(`/supply_requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),

    // Payments
  getPayments: () => request("/payments/"),
  createPayment: (data) => request("/payments/", { method: "POST", body: JSON.stringify(data) }),

  // Clerks
  createClerkViaAdmin: (data) => request("/clerks", { method: "POST", body: JSON.stringify(data) }),
};

// Admin-specific helpers
export const adminDashboard = {
  toggleClerkStatus: (id, active) =>
    request(`/clerks/${id}/status`, { method: "PUT", body: JSON.stringify({ active }) }),
};

export default api;