import { useState } from 'react';
import {  Package, ShoppingCart, AlertTriangle, Edit, Save, Plus, Warehouse, Loader, Settings, Mail, Clock, TrendingUp, TrendingDown, FolderPlus, CheckCircle, Clipboard } from 'lucide-react';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
// import { user } from "../utils/constants";


const initialInventory = [
  { id: 1, name: 'Rice 1kg', currentStock: 50, buyingPrice: 120, sellingPrice: 150, spoiltItems: 2, lastReceived: 20, paymentStatus: 'paid' },
  { id: 2, name: 'Cooking Oil 500ml', currentStock: 30, buyingPrice: 180, sellingPrice: 220, spoiltItems: 0, lastReceived: 15, paymentStatus: 'unpaid' },
  { id: 3, name: 'Sugar 1kg', currentStock: 25, buyingPrice: 110, sellingPrice: 140, spoiltItems: 1, lastReceived: 10, paymentStatus: 'paid' },
];


const ClerkDashboard = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [categories, setCategories] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newRequest, setNewRequest] = useState({ product: '', quantity: '', reason: '' });
  const [newItem, setNewItem] = useState({ name: '', received: '', buyingPrice: '', sellingPrice: '', paymentStatus: 'unpaid' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [spoilageRecord, setSpoilageRecord] = useState({ itemId: '', quantity: '', reason: '' });

  // Calculate metrics
  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const totalSpoilt = inventory.reduce((sum, item) => sum + item.spoiltItems, 0);
  const unpaidItems = inventory.filter(item => item.paymentStatus === 'unpaid').length;
  const pendingRequests = supplyRequests.filter(req => req.status === 'pending').length;

    // Handle inventory updates
  const updateInventory = (id, field, value) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  // Handle category updates
  const updateCategory = (id, field, value) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  // Add new category
  const addCategory = () => {
    if (!newCategory.name) return;
    
    const category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '' });
  };

  // Delete category
  const deleteCategory = (id) => {
    const hasProducts = inventory.some(item => item.category === categories.find(cat => cat.id === id)?.name);
    if (hasProducts) {
      alert('Cannot delete category with existing products');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Delete product
  const deleteProduct = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Add new received items
  const addReceivedItems = () => {
    if (!newItem.name || !newItem.received) return;
    
    const newInventoryItem = {
      id: Date.now(),
      name: newItem.name,
      currentStock: parseInt(newItem.received),
      buyingPrice: parseFloat(newItem.buyingPrice) || 0,
      sellingPrice: parseFloat(newItem.sellingPrice) || 0,
      spoiltItems: 0,
      lastReceived: parseInt(newItem.received),
      paymentStatus: newItem.paymentStatus
    };
    
    setInventory([...inventory, newInventoryItem]);
    setNewItem({ name: '', received: '', buyingPrice: '', sellingPrice: '', paymentStatus: 'unpaid' });
  };

  // Record spoilage
  const recordSpoilage = () => {
    if (!spoilageRecord.itemId || !spoilageRecord.quantity) return;
    
    const itemId = parseInt(spoilageRecord.itemId);
    const spoiltQty = parseInt(spoilageRecord.quantity);
    
    setInventory(inventory.map(item => 
      item.id === itemId ? { 
        ...item, 
        spoiltItems: item.spoiltItems + spoiltQty,
        currentStock: Math.max(0, item.currentStock - spoiltQty)
      } : item
    ));
    
    setSpoilageRecord({ itemId: '', quantity: '', reason: '' });
  };

  // Submit supply request
  const submitRequest = () => {
    if (!newRequest.product || !newRequest.quantity) return;
    
    const request = {
      id: Date.now(),
      product: newRequest.product,
      quantity: parseInt(newRequest.quantity),
      reason: newRequest.reason,
      status: 'pending',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    
    setSupplyRequests([...supplyRequests, request]);
    setNewRequest({ product: '', quantity: '', reason: '' });
    alert('Supply request submitted successfully!');
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
        <TabButton id="receive" label="Receive Items" isActive={activeTab === 'receive'} onClick={setActiveTab} icon={Warehouse} />
        <TabButton id="spoilage" label="Record Spoilage" isActive={activeTab === 'spoilage'} onClick={setActiveTab} icon={AlertTriangle} />
        <TabButton id="requests" label="Submit Requests" isActive={activeTab === 'requests'} onClick={setActiveTab} icon={Mail} />
        <TabButton id="status" label="Request Status" isActive={activeTab === 'status'} onClick={setActiveTab} icon={CheckCircle} />
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
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Buying Price</th>
                      <th className="p-3 text-left">Selling Price</th>
                      <th className="p-3 text-left">Spoilt</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.currentStock}
                              onChange={(e) => updateInventory(item.id, 'currentStock', parseInt(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            <span className={`${item.currentStock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                              {item.currentStock}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.buyingPrice}
                              onChange={(e) => updateInventory(item.id, 'buyingPrice', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            `Ksh ${item.buyingPrice}`
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.sellingPrice}
                              onChange={(e) => updateInventory(item.id, 'sellingPrice', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            `Ksh ${item.sellingPrice}`
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`${item.spoiltItems > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {item.spoiltItems}
                          </span>
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <select
                              value={item.paymentStatus}
                              onChange={(e) => updateInventory(item.id, 'paymentStatus', e.target.value)}
                              className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            >
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.paymentStatus === 'paid' 
                                ? 'bg-green-700 text-green-200' 
                                : 'bg-red-700 text-red-200'
                            }`}>
                              {item.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <button
                              onClick={() => setEditingItem(null)}
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
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Buying Price</th>
                      <th className="p-3 text-left">Selling Price</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateInventory(item.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            <span className="font-medium">{item.name}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <select
                              value={item.category}
                              onChange={(e) => updateInventory(item.id, 'category', e.target.value)}
                              className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-gray-400">{item.category}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.currentStock}
                              onChange={(e) => updateInventory(item.id, 'currentStock', parseInt(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            <span className={`${item.currentStock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                              {item.currentStock}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.buyingPrice}
                              onChange={(e) => updateInventory(item.id, 'buyingPrice', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            `Ksh ${item.buyingPrice}`
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.sellingPrice}
                              onChange={(e) => updateInventory(item.id, 'sellingPrice', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            />
                          ) : (
                            `Ksh ${item.sellingPrice}`
                          )}
                        </td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <select
                              value={item.paymentStatus}
                              onChange={(e) => updateInventory(item.id, 'paymentStatus', e.target.value)}
                              className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
                            >
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.paymentStatus === 'paid' 
                                ? 'bg-green-700 text-green-200' 
                                : 'bg-red-700 text-red-200'
                            }`}>
                              {item.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {editingItem === item.id ? (
                              <button
                                onClick={() => setEditingItem(null)}
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
                            <button
                              onClick={() => deleteProduct(item.id)}
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

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Manage Categories</h2>
              
              {/* Add New Category */}
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
                            {inventory.filter(item => item.category === category.name).length}
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
                  <label className="block text-gray-300 text-sm mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Quantity Received</label>
                  <input
                    type="number"
                    value={newItem.received}
                    onChange={(e) => setNewItem({...newItem, received: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Buying Price (Ksh)</label>
                  <input
                    type="number"
                    value={newItem.buyingPrice}
                    onChange={(e) => setNewItem({...newItem, buyingPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter buying price"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Selling Price (Ksh)</label>
                  <input
                    type="number"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter selling price"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Payment Status</label>
                  <select
                    value={newItem.paymentStatus}
                    onChange={(e) => setNewItem({...newItem, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="unpaid">Not Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addReceivedItems}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Inventory
              </button>
            </div>
          )}

          {activeTab === 'spoilage' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Record Spoilt Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Product</label>
                  <select
                    value={spoilageRecord.itemId}
                    onChange={(e) => setSpoilageRecord({...spoilageRecord, itemId: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Choose product</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Quantity Spoilt</label>
                  <input
                    type="number"
                    value={spoilageRecord.quantity}
                    onChange={(e) => setSpoilageRecord({...spoilageRecord, quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Reason</label>
                  <input
                    type="text"
                    value={spoilageRecord.reason}
                    onChange={(e) => setSpoilageRecord({...spoilageRecord, reason: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="e.g., expired, damaged"
                  />
                </div>
              </div>
              <button
                onClick={recordSpoilage}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Record Spoilage
              </button>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Submit Supply Request</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newRequest.product}
                    onChange={(e) => setNewRequest({...newRequest, product: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Requested Quantity</label>
                  <input
                    type="number"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter quantity needed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">Reason for Request</label>
                  <textarea
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                    placeholder="Explain why this product is needed"
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
  );
};

export default ClerkDashboard;