import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign, FileText, Edit, Trash2, UserPlus, ListTree, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from "../components/Card";
import TabButton from "../components/TabButton";

const initialRequests = [
  { id: 1, product: 'Rice 1kg', qty: 50, status: 'pending', storeId: 1, clerkName: 'John Doe', date: '2024-01-15', reason: 'Low stock alert' },
  { id: 2, product: 'Cooking Oil', qty: 100, status: 'approved', storeId: 1, clerkName: 'Jane Smith', date: '2024-01-14', reason: 'Weekly restock' },
  { id: 3, product: 'Sugar 1kg', qty: 25, status: 'declined', storeId: 1, clerkName: 'Bob Wilson', date: '2024-01-13', reason: 'Emergency request' }
];

const initialProducts = [
  { id: 1, name: 'Rice 1kg', stock: 120, price: 150, supplier: 'ABC Suppliers' },
  { id: 2, name: 'Cooking Oil', stock: 80, price: 220, supplier: 'XYZ Foods' },
  { id: 3, name: 'Sugar 1kg', stock: 60, price: 140, supplier: 'Sweet Co.' }
];

const initialClerks = [
  { id: 1, name: 'John Doe', email: 'john@store.com', status: 'active', storeId: 1, lastActive: '2024-01-15', entriesCount: 45 },
  { id: 2, name: 'Jane Smith', email: 'jane@store.com', status: 'active', storeId: 1, lastActive: '2024-01-14', entriesCount: 32 },
  { id: 3, name: 'Bob Wilson', email: 'bob@store.com', status: 'inactive', storeId: 1, lastActive: '2024-01-10', entriesCount: 28 }
];

const initialPayments= [
  { id: 1, supplier: 'ABC Suppliers', amount: 45000, dueDate: '2024-01-20', status: 'unpaid', products: ['Rice 1kg', 'Wheat Flour'] },
  { id: 2, supplier: 'XYZ Foods', amount: 22000, dueDate: '2024-01-18', status: 'paid', products: ['Cooking Oil'], paidDate: '2024-01-16' },
  { id: 3, supplier: 'Sweet Co.', amount: 15000, dueDate: '2024-01-22', status: 'overdue', products: ['Sugar 1kg', 'Salt'] }
];

const initialClerkReports = [
  { id: 1, clerkName: 'John Doe', date: '2024-01-15', action: 'Added Stock', product: 'Rice 1kg', quantity: 50, notes: 'New shipment received' },
  { id: 2, clerkName: 'Jane Smith', date: '2024-01-14', action: 'Recorded Spoilage', product: 'Bread', quantity: 5, notes: 'Expired items' },
  { id: 3, clerkName: 'Bob Wilson', date: '2024-01-13', action: 'Updated Prices', product: 'Milk 1L', quantity: 0, notes: 'Price adjustment' },
  { id: 4, clerkName: 'John Doe', date: '2024-01-12', action: 'Payment Update', product: 'Various', quantity: 0, notes: 'Marked supplier payment as received' }
];


const  AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [reqs, setReqs] = useState(initialRequests);
//   const [reqs, setReqs] = useState(initialRequests.filter(r => r.storeId === user.storeId));
  const [products] = useState(initialProducts);
  const [clerks, setClerks] = useState(initialClerks);
  const [payments, setPayments] = useState(initialPayments);
  const [clerkReports] = useState(initialClerkReports);

  const [newClerk, setNewClerk] = useState({ name: '', email: '', password: '' });
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', price: '', supplier: '', category: '', reorderLevel: '', barcode: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newRequest, setNewRequest] = useState({ product: '', qty: '', reason: '', clerkName: '' });

  const [showAddClerk, setShowAddClerk] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const act = (id, s) => setReqs(reqs.map(r => r.id === id ? { ...r, status: s } : r));

  const updatePaymentStatus = (id, status) => {
    setPayments(payments.map(p => 
      p.id === id ? { 
        ...p, 
        status, 
        paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined 
      } : p
    ));
  };

  // Handle clerk management
  const toggleClerkStatus = (id) => {
    setClerks(clerks.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const deleteClerk = (id) => {
    if (window.confirm('Are you sure you want to delete this clerk?')) {
      setClerks(clerks.filter(c => c.id !== id));
    }
  };

  const addClerk = () => {
    if (!newClerk.name || !newClerk.email) return;
    
    const clerk = {
      id: Date.now(),
      name: newClerk.name,
      email: newClerk.email,
      status: 'active',
      storeId: user.storeId,//////////////**** */
      lastActive: new Date().toISOString().split('T')[0],
      entriesCount: 0
    };
    
    setClerks([...clerks, clerk]);
    setNewClerk({ name: '', email: '', password: '' });
    setShowAddClerk(false);
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    
    const product = {
      id: Date.now(),
      name: newProduct.name,
      stock: parseInt(newProduct.stock),
      price: parseFloat(newProduct.price),
      supplier: newProduct.supplier,
      category: newProduct.category,
      reorderLevel: parseInt(newProduct.reorderLevel) || 10,
      barcode: newProduct.barcode
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', stock: '', price: '', supplier: '', category: '', reorderLevel: '', barcode: '' });
    setShowAddProduct(false);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Category CRUD operations
  const addCategory = () => {
    if (!newCategory.name) return;
    
    const category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      productCount: 0
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '' });
    setShowAddCategory(false);
  };

  const updateCategory = (updatedCategory) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    setEditingCategory(null);
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Supply request creation
  const createSupplyRequest = () => {
    if (!newRequest.product || !newRequest.qty || !newRequest.clerkName) return;
    
    const request = {
      id: Date.now(),
      product: newRequest.product,
      qty: parseInt(newRequest.qty),
      status: 'pending',
      storeId: 1,
      clerkName: newRequest.clerkName,
      date: new Date().toISOString().split('T')[0],
      reason: newRequest.reason
    };
    
    setReqs([...reqs, request]);
    setNewRequest({ product: '', qty: '', reason: '', clerkName: '' });
    setShowAddRequest(false);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate metrics
  const pendingRequests = reqs.filter(r => r.status === 'pending').length;
  const unpaidPayments = payments.filter(p => p.status === 'unpaid' || p.status === 'overdue').length;
  const activeClerks = clerks.filter(c => c.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel).length;

  return (
    <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage requests, payments, clerks, and view reports</p>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Products" value={products.length} icon={Package} color="blue" />
        <Card title="Low Stock Items" value={lowStockProducts} icon={AlertTriangle} color="red" />
        <Card title="Pending Requests" value={pendingRequests} icon={ShoppingCart} color="yellow" />
        <Card title="Unpaid Suppliers" value={unpaidPayments} icon={DollarSign} color="orange" />
        <Card title="Active Clerks" value={activeClerks} icon={Users} color="green" />
    </div>


      {/* <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl"> */}
    <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
        <TabButton id="inventory" label="Display Inventory" isActive={activeTab === 'inventory'} onClick={setActiveTab} icon={Package} />
        <TabButton id="categories" label="List Categories" isActive={activeTab === 'categories'} onClick={setActiveTab} icon={ListTree} />
        <TabButton id="requests" label="Supply Requests" isActive={activeTab === 'requests'} onClick={setActiveTab} icon={ShoppingCart} />
        <TabButton id="reports" label="Clerk Reports" isActive={activeTab === 'reports'} onClick={setActiveTab} icon={FileText} />
        <TabButton id="payments" label="Supplier Payments" isActive={activeTab === 'payments'} onClick={setActiveTab} icon={DollarSign} />
        <TabButton id="clerks" label="Manage Clerks" isActive={activeTab === 'clerks'} onClick={setActiveTab} icon={Users} />
    </div>

        {/* Tab Content */}
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          
        {/* Supply Requests Tab */}
         {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Inventory Management</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products or suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price (Ksh)"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Supplier"
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Reorder Level"
                      value={newProduct.reorderLevel}
                      onChange={(e) => setNewProduct({...newProduct, reorderLevel: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Barcode (Optional)"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addProduct}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Supplier</th>
                      <th className="p-3 text-left">Reorder Level</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3">
                          <span className={product.stock <= product.reorderLevel ? 'text-red-400 font-bold' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-3">Ksh {product.price}</td>
                        <td className="p-3">{product.supplier}</td>
                        <td className="p-3">{product.reorderLevel}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock <= product.reorderLevel ? 'bg-red-700 text-red-200' : 'bg-green-700 text-green-200'
                          }`}>
                            {product.stock <= product.reorderLevel ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setEditingProduct(product)}
                              className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-900/20"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Categories Management Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Category Management</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Add Category Form */}
              {showAddCategory && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addCategory}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Add Category
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{category.name}</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-900/20"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCategory(category.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{category.productCount} products</span>
                      <Tag className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supply Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Supply Requests</h2>
                <button
                  onClick={() => setShowAddRequest(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Request
                </button>
              </div>

              {/* Add Request Form */}
              {showAddRequest && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Create Supply Request</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <select
                      value={newRequest.product}
                      onChange={(e) => setNewRequest({...newRequest, product: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.name}>{product.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newRequest.qty}
                      onChange={(e) => setNewRequest({...newRequest, qty: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <select
                      value={newRequest.clerkName}
                      onChange={(e) => setNewRequest({...newRequest, clerkName: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Clerk</option>
                      {clerks.filter(c => c.status === 'active').map(clerk => (
                        <option key={clerk.id} value={clerk.name}>{clerk.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Reason"
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={createSupplyRequest}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Create Request
                    </button>
                    <button
                      onClick={() => setShowAddRequest(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  </div>
                  )}
                  </div>
          )}
          {/* Clerk Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Detailed Reports on Clerks' Entries</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Clerk</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Action</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clerkReports.map(report => (
                      <tr key={report.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{report.clerkName}</td>
                        <td className="p-3">{report.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.action === 'Added Stock' ? 'bg-green-700 text-green-200' :
                            report.action === 'Recorded Spoilage' ? 'bg-red-700 text-red-200' :
                            report.action === 'Updated Prices' ? 'bg-blue-700 text-blue-200' :
                            'bg-yellow-700 text-yellow-200'
                          }`}>{report.action}</span>
                        </td>
                        <td className="p-3">{report.product}</td>
                        <td className="p-3">{report.quantity || 'N/A'}</td>
                        <td className="p-3 text-sm">{report.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Supplier Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Supplier Payment Tracking</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Supplier</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Due Date</th>
                      <th className="p-3 text-left">Products</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{payment.supplier}</td>
                        <td className="p-3 font-semibold">Ksh {payment.amount.toLocaleString()}</td>
                        <td className="p-3">{payment.dueDate}</td>
                        <td className="p-3 text-sm">{payment.products.join(', ')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'paid' ? 'bg-green-700 text-green-200' :
                            payment.status === 'unpaid' ? 'bg-yellow-700 text-yellow-200' : 'bg-red-700 text-red-200'
                          }`}>
                            {payment.status}
                            {payment.paidDate && ` (${payment.paidDate})`}
                          </span>
                        </td>
                        <td className="p-3">
                          {payment.status !== 'paid' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => updatePaymentStatus(payment.id, 'paid')} 
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              >
                                Mark Paid
                              </button>
                              {payment.status === 'overdue' && (
                                <button 
                                  onClick={() => updatePaymentStatus(payment.id, 'unpaid')} 
                                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                  Mark Pending
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Clerks Tab */}
          {activeTab === 'clerks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Manage Clerks</h2>
                <button
                  onClick={() => setShowAddClerk(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Clerk
                </button>
              </div>

              {/* Add Clerk Form */}
              {showAddClerk && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Clerk</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newClerk.name}
                      onChange={(e) => setNewClerk({...newClerk, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newClerk.email}
                      onChange={(e) => setNewClerk({...newClerk, email: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newClerk.password}
                      onChange={(e) => setNewClerk({...newClerk, password: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addClerk}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Add Clerk
                    </button>
                    <button
                      onClick={() => setShowAddClerk(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Clerks Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Last Active</th>
                      <th className="p-3 text-left">Entries</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clerks.map(clerk => (
                      <tr key={clerk.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{clerk.name}</td>
                        <td className="p-3">{clerk.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            clerk.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'
                          }`}>{clerk.status}</span>
                        </td>
                        <td className="p-3">{clerk.lastActive}</td>
                        <td className="p-3">{clerk.entriesCount}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleClerkStatus(clerk.id)}
                              className={`px-3 py-1 rounded text-xs transition-colors ${
                                clerk.status === 'active' 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {clerk.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => deleteClerk(clerk.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;