import { useState, useEffect } from 'react';
import {  Package, ShoppingCart, AlertTriangle, Edit, XCircle, Save, Plus, Warehouse, Loader, Settings, Mail, Clock, TrendingUp, TrendingDown, FolderPlus, CheckCircle, Clipboard } from 'lucide-react';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService from "../service/api";
// import { user } from "../utils/constants";
import { clerkDashboard } from "../service/api";


const ClerkDashboard = (user) => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newRequest, setNewRequest] = useState({ product_id: null, store_id: null, quantity: null, requested_by: null });
  const [receiveItem, setReceiveItem] = useState({ product_id: null, quantity: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  // const [spoilageRecord, setSpoilageRecord] = useState({ itemId: '', quantity: '', reason: '' });
  const [loading, setLoading] = useState(true);

  // Calculate metrics (aligned to backend fields)
  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalSpoilt = 0; // not tracked in backend
  const unpaidItems = 0; // not tracked in backend
  const pendingRequests = supplyRequests.filter(req => req.status === 'pending').length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, productsData, categoriesData, requestsData] = await Promise.all([
          clerkDashboard.getInventoryOverview(user.id),
          apiService.getProducts(),
          apiService.getCategories(),
          apiService.getSupplyRequests(),
        ]);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSupplyRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (err) {
        console.error("Failed to load clerk dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  // Auto-fill store_id and requested_by from user
  useEffect(() => {
    setNewRequest((prev) => ({
      ...prev,
      store_id: prev.store_id ?? user.storeId ?? null,
      requested_by: prev.requested_by ?? user.id ?? null,
    }));
  }, [user.storeId, user.id]);

  // Default product_id to first product when products load
  useEffect(() => {
    if (!newRequest.product_id && products.length > 0) {
      setNewRequest((prev) => ({ ...prev, product_id: products[0].id }));
    }
  }, [products, newRequest.product_id]);

  const addInventory = async () => {
    if (!receiveItem.product_id || !receiveItem.quantity) return;
    try {
      await apiService.addInventory(receiveItem.product_id, parseInt(receiveItem.quantity));
      const data = await clerkDashboard.getInventoryOverview(user.id);
      setInventory(Array.isArray(data) ? data : []);
      setReceiveItem({ product_id: null, quantity: '' });
      alert('Items received and inventory updated.');
    } catch (e) {
      console.error('Failed to add inventory', e);
      alert('Error receiving items');
    }
  };

  const submitRequest = async () => {
  const { product_id, store_id, quantity, requested_by } = newRequest;

  if (!product_id || !store_id || !quantity || !requested_by) {
    alert("Please fill all required fields: Product ID, Store ID, Quantity, and Your User ID.");
    return;
  }
  
  try {
    const created = await apiService.createSupplyRequest({ product_id, store_id, quantity, requested_by });
    setSupplyRequests((prev) => [...prev, created]);
    setNewRequest({ product_id: null, store_id: null, quantity: null, requested_by: null });
    alert('Supply request submitted successfully!');
  } catch (err) {
    console.error("Failed to submit supply request", err);
    alert("Error submitting request. Check console for details.");
  }
};

    // Handle inventory updates
  const updateInventory = (id, field, value) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const saveInventoryItem = async (id) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    try {
      await apiService.updateInventory(id, item.quantity);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to save inventory item", err);
      alert("Error saving inventory");
    }
  };
  // Handle category updates
  const updateCategory = (id, field, value) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  // Add new category
  const addCategory = async () => {
  if (!newCategory.name) return;

  try {
    const category = await apiService.createCategory(
      newCategory.name,
      newCategory.description
    );

    setCategories([...categories, category]); 
    setNewCategory({ name: "", description: "" });
  } catch (error) {
    console.error("Failed to add category:", error);
    alert("Error adding category");
  }
};


  // Delete category
  const deleteCategory = async (id) => {
  const hasProducts = inventory.some(
    item => item.category === categories.find(cat => cat.id === id)?.name
  );
  if (hasProducts) {
    alert("Cannot delete category with existing products");
    return;
  }

  try {
    await apiService.deleteCategory(id);
    setCategories(categories.filter(cat => cat.id !== id));
  } catch (error) {
    console.error("Failed to delete category:", error);
    alert("Error deleting category");
  }
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts();
        setProducts(data); 
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, []);

  // Update product locally and backend
  const updateProduct = async (id, field, value) => {
    try {
      const updated = products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      );
      setProducts(updated);

      const product = updated.find((p) => p.id === id);
      await apiService.updateProduct(id, product);
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
  try {
    await apiService.deleteProduct(id);
    setInventory(inventory.filter(item => item.id !== id));
  } catch (error) {
    console.error("Failed to delete product:", error);
    alert("Error deleting product");
  }
};

  return (
    <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
    {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Clerk Dashboard</h1>
          <p className="text-gray-400">Manage inventory, track payments, and submit requests</p>
        </div>

    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
       <Card title="Total Products" value={totalProducts} icon={Package} color="blue" />
       <Card title="Total Stock" value={totalStock} icon={TrendingUp} color="green" /> 
       <Card title="Spoilt Items" value={totalSpoilt} icon={AlertTriangle} color="red" />
       <Card title="Unpaid Items" value={unpaidItems} icon={Clock} color="yellow" />
       <Card title="Pending Requests" value={pendingRequests} icon={Loader} color="purple" />
      </div>

    <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
        <TabButton id="overview" label="Inventory Overview" isActive={activeTab === 'overview'} onClick={setActiveTab}  icon={Clipboard} />
        <TabButton id="products" label="Manage Products" isActive={activeTab === 'products'} onClick={setActiveTab} icon={Settings} />
        <TabButton id="categories" label="Categories" isActive={activeTab === 'categories'} onClick={setActiveTab} icon={FolderPlus} />
        {/* <TabButton id="spoilage" label="Record Spoilage" isActive={activeTab === 'spoilage'} onClick={setActiveTab} icon={AlertTriangle} /> */}
        <TabButton id="receive" label="Receive Items" isActive={activeTab === 'receive'} onClick={setActiveTab} icon={Warehouse} />
        <TabButton id="requests" label="Submit Requests" isActive={activeTab === 'requests'} onClick={setActiveTab} icon={Mail} />
        {/* <TabButton id="status" label="Request Status" isActive={activeTab === 'status'} onClick={setActiveTab} icon={CheckCircle} /> */}
    </div>

     {/* Tab Content */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      {activeTab === 'overview' && (
    <div>
        <h2 className="text-xl font-semibold text-white mb-6">Inventory Overview</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-gray-300">
                <thead className="bg-gray-800 text-gray-200">
                    <tr>
                        <th className="p-3 text-left">ID</th> 
                        <th className="p-3 text-left">Product Name</th>
                        <th className="p-3 text-left">Product ID</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Last Updated</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                            <td className="p-3 font-medium">{item.id}</td>
                            <td className="p-3 font-medium">{item.product_name}</td>
                            <td className="p-3">{item.product_id}</td>
                            
                            <td className="p-3">
                                {editingItem === item.id ? (
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateInventory(item.id, 'quantity', parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                                    <span className={`${item.quantity < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                        {item.quantity}
                                    </span>
                                )}
                            </td>

                            <td className="p-3">{new Date(item.updated_at).toLocaleDateString()}</td> 
                            
                            <td className="p-3">
                                {editingItem === item.id ? (
                                    <button
                                        onClick={() => saveInventoryItem(item.id)}
                                        className="text-green-400 hover:text-green-300"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditingItem(item.id)}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )}

        
    {activeTab === 'products' && (
    <div>
        <h2 className="text-xl font-semibold text-white mb-6">Manage Products</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-gray-300">
                <thead className="bg-gray-800 text-gray-200">
                    <tr>
                        <th className="p-3 text-left">Product Name</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Price (Ksh)</th> 
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item) => (
                        <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                            
                            {/* Product name */}
                            <td className="p-3">
                                {editingItem === item.id ? (
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateProduct(item.id, "name", e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </td>

                            <td className="p-3">
                                {editingItem === item.id ? (
                                    <select
                                        value={item.category_id} 
                                        onChange={(e) => updateProduct(item.id, "category_id", parseInt(e.target.value))} 
                                        className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-sm text-gray-400">{item.category_name}</span>
                                )}
                            </td>

                            <td className="p-3">
                                {editingItem === item.id ? (
                                    <input
                                        type="number"
                                        value={item.price} 
                                        onChange={(e) => updateProduct(item.id, "price", parseFloat(e.target.value))}
                                        className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                                    `Ksh ${item.price}`
                                )}
                            </td>

                            {/* Actions */}
                            <td className="p-3">
                                <div className="flex gap-2">
                                    {editingItem === item.id ? (
                                        <button
                                            onClick={() => setEditingItem(null)} 
                                            className="text-green-400 hover:text-green-300"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setEditingItem(item.id)}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteProduct(item.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
   )}

          {activeTab === 'categories' && (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Manage Categories</h2>
      <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Description</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter description"
            />
          </div>
        </div>
        <button
          onClick={addCategory}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="overflow-x-auto">
        <table className="w-full text-gray-300">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Products Count</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                <td className="p-3">
                  {editingCategory === category.id ? (
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                    />
                  ) : (
                    <span className="font-medium">{category.name}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingCategory === category.id ? (
                    <input
                      type="text"
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                    />
                  ) : (
                    <span className="text-gray-400">{category.description}</span>
                  )}
                </td>
                
                <td className="p-3">
                  <span className="text-blue-400">
                    {category.products ? category.products.length : 0} 
                  </span>
                </td>
                
                <td className="p-3">
                  <div className="flex gap-2">
                    {editingCategory === category.id ? (
                      <button
                        onClick={() => setEditingCategory(null)} 
                        className="text-green-400 hover:text-green-300"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   )}

         {activeTab === 'receive' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Record Received Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Product</label>
                  <select
                    value={receiveItem.product_id || ''}
                    onChange={(e) => setReceiveItem({ ...receiveItem, product_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Quantity Received</label>
                  <input
                    type="number"
                    value={receiveItem.quantity}
                    onChange={(e) => setReceiveItem({...receiveItem, quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter quantity"
                  />
                </div>
                
              </div>
              <button
                onClick={addInventory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Inventory
              </button>
            </div>
          )}

    {activeTab === 'requests' && (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Submit Supply Request</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Product</label>
          <select
            value={newRequest.product_id || ''}
            onChange={(e) => setNewRequest({ ...newRequest, product_id: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Requested Quantity</label>
          <input
            type="number"
            value={newRequest.quantity || ''}
            onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="Enter quantity needed"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Store</label>
          <input
            type="text"
            value={newRequest.store_id || ''}
            readOnly
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Requested By</label>
          <input
            type="text"
            value={newRequest.requested_by || ''}
            readOnly
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          />
        </div>

      </div>
      
      <button
        onClick={submitRequest}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Submit Request
      </button>

    </div>
   )}
  </div>
  </div>
</div>
)}

export default ClerkDashboard;