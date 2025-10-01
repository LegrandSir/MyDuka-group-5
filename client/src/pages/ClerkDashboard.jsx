import React, { useState, useEffect } from "react";
import {
  Package,
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  ListTree,
  FileStack,
  AlertTriangle,
} from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService, { clerkDashboard } from "../service/api";

import { useAuth } from "../context/AuthContext";

const ClerkDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [newProduct, setNewProduct] = useState({ name: '', category_id: '', price: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Supply request form
  const [newRequest, setNewRequest] = useState({ product_id: "", quantity: "" });
  const [showAddRequest, setShowAddRequest] = useState(false);

  // Inventory update form
  const [editingInventory, setEditingInventory] = useState(null);
  const [newInventoryItem, setNewInventoryItem] = useState({ product_id: '', quantity: '' });
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    fetchClerkData();
  }, []);

  const fetchClerkData = async () => {
    try {
      setLoading(true);
      const inventoryData = await apiService.getInventory();
      const requestsData = await apiService.getSupplyRequests();
      const categoriesData = await apiService.getCategories();
      const productsData = await apiService.getProducts();

      setInventory(inventoryData || []);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setRequests(requestsData || []);
    } catch (err) {
      console.error("Error loading clerk data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit supply request
  const submitRequest = async () => {
    if (!newRequest.product_id || !newRequest.quantity) return;
    try {
      await apiService.createSupplyRequest({
        product_id: parseInt(newRequest.product_id),
        quantity: parseInt(newRequest.quantity),
      });
      await fetchClerkData();
      setNewRequest({ product_id: "", quantity: "" });
      setShowAddRequest(false);
    } catch (err) {
      alert("Error submitting request: " + err.message);
    }
  };

   const addProduct = async () => {
    try {
      await apiService.createProduct(newProduct);
      await fetchDashboardData();
      setNewProduct({ name: '', category_id: '', price: '' });
      setShowAddProduct(false);
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  const updateProduct = async () => {
    try {
      await apiService.updateProduct(editingProduct.id, editingProduct);
      await fetchDashboardData();
      setEditingProduct(null);
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      await fetchDashboardData();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

    const addCategory = async () => {
    if (!newCategory.name.trim()) {
    alert('Please enter a category name');
    return;
  }
  try {
    await apiService.createCategory(newCategory);
    await fetchClerkData();
    setNewCategory({ name: '', description: '' });
    setShowAddCategory(false);
  } catch (err) {
    alert('Error creating category: ' + err.message);
  }
}


  const updateCategory = async () => {
  if (!editingCategory.name.trim()) {
    alert('Please enter a category name');
    return;
  }
  try {
    await apiService.updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description
    });
    await fetchClerkData();
    setEditingCategory(null);
  } catch (err) {
    alert('Error updating category: ' + err.message);
  }
};

// Delete category function
const deleteCategory = async (id) => {
  const productsInCategory = products.filter(p => p.category_id === id).length;
  
  if (productsInCategory > 0) {
    const confirmMsg = `This category has ${productsInCategory} product(s). Deleting it may affect those products. Continue?`;
    if (!confirm(confirmMsg)) return;
  } else {
    if (!confirm('Are you sure you want to delete this category?')) return;
  }
  
  try {
    await apiService.deleteCategory(id);
    await fetchClerkData();
  } catch (err) {
    alert('Error deleting category: ' + err.message);
  }
};

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  // Get current stock for a product
  const getCurrentStock = (productId) => {
    const inventoryItem = inventory.find(inv => inv.product_id === productId);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  // Update inventory quantity
  const updateStock = async () => {
    if (!editingInventory || !newQuantity) return;
    try {
      await apiService.updateInventory(editingInventory.id, parseInt(newQuantity));
      await fetchClerkData();
      setEditingInventory(null);
      setNewQuantity("");
    } catch (err) {
      alert("Error updating stock: " + err.message);
    }
  };

  const addInventoryItem = async () => {
  if (!newInventoryItem.product_id || !newInventoryItem.quantity) {
    alert('Please fill in all fields');
    return;
  }
  try {
    await apiService.createInventory({
      product_id: parseInt(newInventoryItem.product_id),
      quantity: parseInt(newInventoryItem.quantity),
    });
    await fetchClerkData();
    setNewInventoryItem({ product_id: '', quantity: '' });
    setShowAddInventory(false);
  } catch (err) {
    alert('Error adding inventory: ' + err.message);
  }
};

const deleteInventoryItem = async (id) => {
  if (!confirm('Are you sure you want to delete this inventory item?')) return;
  try {
    await apiService.deleteInventory(id);
    await fetchClerkData();
  } catch (err) {
    alert('Error deleting inventory: ' + err.message);
  }
};

  if (loading) {
    return (
      <div className="bg-[#041524] min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Clerk Dashboard</h1>
          <p className="text-gray-400">Manage stock and supply requests</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Inventory Items" value={inventory.length} icon={Package} color="blue" />
          <Card title="Categories" value={categories.length} icon={ListTree} color="purple" />
          <Card title="Requests Submitted" value={requests.length} icon={ClipboardList} color="green" />
          <Card
            title="Pending Requests"
            value={requests.filter((r) => r.status === "pending").length}
            icon={AlertTriangle}
            color="yellow"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={Package} />
          <TabButton id="products" label="Products" isActive={activeTab === "products"} onClick={setActiveTab} icon={Package} />
          <TabButton id="category" label="Category" isActive={activeTab === "category"} onClick={setActiveTab} icon={FileStack} />
          <TabButton id="requests" label="Supply Requests" isActive={activeTab === "requests"} onClick={setActiveTab} icon={ClipboardList} />
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
          {/* Overview */}
          {activeTab === "overview" && (
  <div>
    <h2 className="text-xl text-white mb-6">Clerk Overview</h2>
    
    {/* Inventory Summary */}
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Current Inventory</h3>
        <button
          onClick={() => setShowAddInventory(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Inventory
        </button>
      </div>
      
      <table className="w-full text-gray-300">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const product = products.find(p => p.id === item.product_id);
            const category = categories.find(c => c.id === product?.category_id);
            const isLow = item.quantity < 10;
            
            return (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="p-3">{product?.name || 'Unknown'}</td>
                <td className="p-3">{category?.name || 'N/A'}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${isLow ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingInventory(item);
                        setNewQuantity(item.quantity.toString());
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteInventoryItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {inventory.length === 0 && (
        <p className="text-gray-400 text-center py-4">No inventory items found</p>
      )}
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Total Products</div>
        <div className="text-2xl font-bold text-white">{products.length}</div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Low Stock Items</div>
        <div className="text-2xl font-bold text-red-400">
          {inventory.filter(i => i.quantity < 10).length}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Pending Requests</div>
        <div className="text-2xl font-bold text-yellow-400">
          {requests.filter(r => r.status === 'pending').length}
        </div>
      </div>
    </div>

    {/* Add Inventory Modal */}
    {showAddInventory && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-96">
          <h3 className="text-xl font-semibold text-white mb-4">Add Inventory Item</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Product</label>
              <select
                value={newInventoryItem.product_id}
                onChange={(e) => setNewInventoryItem({...newInventoryItem, product_id: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                value={newInventoryItem.quantity}
                onChange={(e) => setNewInventoryItem({...newInventoryItem, quantity: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addInventoryItem}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddInventory(false);
                  setNewInventoryItem({ product_id: '', quantity: '' });
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
                </div>
              </div>
              // </div>
    )}

    {/* Edit Inventory Modal */}
    {editingInventory && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-96">
          <h3 className="text-xl font-semibold text-white mb-4">Update Inventory</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Product</label>
              <input
                type="text"
                value={products.find(p => p.id === editingInventory.product_id)?.name || 'Unknown'}
                disabled
                className="w-full bg-gray-700 text-gray-400 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">New Quantity</label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                placeholder="Enter new quantity"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={updateStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditingInventory(null);
                  setNewQuantity('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
              </div>
            // </div>
    )}
  </div>
)}
{/* Helper Functions */}
      
      {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Products Management</h2>
                    <p className="text-gray-400 mt-1">Add and manage your product catalog</p>
                  </div>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Product
                  </button>
                </div>
    
          <div>
          {/* Products Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Product Name</th>
              <th className="text-left p-4 text-gray-300">Category</th>
              <th className="text-right p-4 text-gray-300">Price</th>
              <th className="text-center p-4 text-gray-300">Current Stock</th>
              <th className="text-right p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white font-medium">{product.name}</td>
                <td className="p-4 text-gray-300">
                  <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm">
                    {getCategoryName(product.category_id)}
                  </span>
                </td>
                <td className="p-4 text-right text-green-400 font-semibold">
                  Ksh {parseFloat(product.price).toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    getCurrentStock(product.id) > 10 
                      ? 'bg-green-600 text-white' 
                      : getCurrentStock(product.id) > 0 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {getCurrentStock(product.id)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No products found. Create your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  placeholder="e.g., Laptop, Office Chair"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div className="bg-blue-900/30 border border-blue-500 rounded p-3">
                <p className="text-blue-300 text-sm">
                  💡 After creating the product, you can set its initial stock quantity in the Inventory tab.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add Product
                </button>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    setNewProduct({ name: '', category_id: '', price: '' });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  value={editingProduct.category_id}
                  onChange={(e) => setEditingProduct({...editingProduct, category_id: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ To update stock quantity, use the Inventory tab.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={updateProduct}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
  </div>
)}


          {/* Categories */}
          {activeTab === "category" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Category Management</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Categories Table */}
              {categories.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No categories found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-3 text-left">Category Name</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Products Count</th>
                        <th className="p-3 text-left">Created Date</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => {
                        const productCount = products.filter(p => p.category_id === category.id).length;
                        
                        return (
                          <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                            <td className="p-3 font-medium">{category.name}</td>
                            <td className="p-3 text-gray-400">{category.description || 'No description'}</td>
                            <td className="p-3">
                              <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm">
                                {productCount} {productCount === 1 ? 'product' : 'products'}
                              </span>
                            </td>
                            <td className="p-3 text-sm">
                              {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingCategory(category)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                  title="Edit Category"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Category Modal */}
              {showAddCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-lg p-6 w-96">
                    <h3 className="text-xl font-semibold text-white mb-4">Add New Category</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Category Name *</label>
                        <input
                          type="text"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          placeholder="e.g., Electronics, Food, Beverages"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2 h-24 resize-none"
                          placeholder="Brief description of the category..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={addCategory}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                        >
                          Create Category
                        </button>
                        <button
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategory({ name: '', description: '' });
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-lg p-6 w-96">
                    <h3 className="text-xl font-semibold text-white mb-4">Edit Category</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Category Name *</label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          placeholder="Category name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea
                          value={editingCategory.description || ''}
                          onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2 h-24 resize-none"
                          placeholder="Brief description..."
                        />
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-sm text-gray-400">
                          Products in this category: 
                          <span className="ml-2 font-semibold text-white">
                            {products.filter(p => p.category_id === editingCategory.id).length}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={updateCategory}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Supply Requests */}
          {activeTab === "requests" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Supply Requests</h2>
              <button
                onClick={() => setShowAddRequest(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
              >
                <Plus className="w-4 h-4" /> New Request
              </button>

              {showAddRequest && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">New Supply Request</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select
                    value={newRequest.product_id}
                    onChange={(e) => setNewRequest({ ...newRequest, product_id: e.target.value })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={submitRequest} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Submit Request
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddRequest(false);
                      setNewRequest({ product_id: '', quantity: '' });
                    }} 
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Supply Requests</h3>
                <table className="w-full text-gray-300">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map((req) => {
                      const product = products.find(p => p.id === req.product_id);
                      
                      return (
                        <tr key={req.id} className="border-t border-gray-700">
                          <td className="p-3">{product?.name || 'Unknown'}</td>
                          <td className="p-3">{req.quantity}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              req.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                              req.status === 'approved' ? 'bg-green-900/50 text-green-300' :
                              'bg-red-900/50 text-red-300'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3">{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {requests.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No supply requests found</p>
                )}
                </div>
              </div>
    )}
    </div>
        </div>
        </div>
      // </div>
  );
};

export default ClerkDashboard;