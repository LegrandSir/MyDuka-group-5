import React, { useState } from 'react';
import { Users, Package, Check, X, Store, BarChart3, LineChart, ListTree, Plus, Calendar, Save, Edit, Trash2, UserPlus, AlertTriangle, Tags } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService from "../service/api";

const initialStores = [
  { id: 1, name: 'Downtown Store', location: 'Nairobi CBD', status: 'active', adminCount: 2 },
  { id: 2, name: 'Westlands Branch', location: 'Westlands', status: 'active', adminCount: 1 },
  { id: 3, name: 'Karen Outlet', location: 'Karen', status: 'inactive', adminCount: 1 }
];

const initialAdmins = [
  { id: 1, name: 'John Admin', email: 'john@store.com', storeId: 1, storeName: 'Downtown Store', status: 'active', lastLogin: '2024-01-15' },
  { id: 2, name: 'Jane Manager', email: 'jane@store.com', storeId: 1, storeName: 'Downtown Store', status: 'active', lastLogin: '2024-01-14' },
  { id: 3, name: 'Bob Supervisor', email: 'bob@store.com', storeId: 2, storeName: 'Westlands Branch', status: 'active', lastLogin: '2024-01-13' },
  { id: 4, name: 'Alice Controller', email: 'alice@store.com', storeId: 3, storeName: 'Karen Outlet', status: 'inactive', lastLogin: '2024-01-10' }
];

const initialProducts = [
  { id: 1, name: 'Rice 1kg', storeId: 1, storeName: 'Downtown Store', stock: 120, price: 150, paymentStatus: 'paid' },
  { id: 2, name: 'Cooking Oil', storeId: 1, storeName: 'Downtown Store', stock: 80, price: 220, paymentStatus: 'unpaid' },
  { id: 3, name: 'Sugar 1kg', storeId: 2, storeName: 'Westlands Branch', stock: 60, price: 140, paymentStatus: 'paid' },
  { id: 4, name: 'Bread', storeId: 2, storeName: 'Westlands Branch', stock: 45, price: 80, paymentStatus: 'unpaid' },
  { id: 5, name: 'Milk 1L', storeId: 3, storeName: 'Karen Outlet', stock: 30, price: 120, paymentStatus: 'paid' }
];

// Weekly data
const weeklyData = [
  { name: 'Mon', 'Downtown Store': 12000, 'Westlands Branch': 8000, 'Karen Outlet': 5000 },
  { name: 'Tue', 'Downtown Store': 15000, 'Westlands Branch': 9500, 'Karen Outlet': 6200 },
  { name: 'Wed', 'Downtown Store': 18000, 'Westlands Branch': 11000, 'Karen Outlet': 7500 },
  { name: 'Thu', 'Downtown Store': 16000, 'Westlands Branch': 10500, 'Karen Outlet': 6800 },
  { name: 'Fri', 'Downtown Store': 22000, 'Westlands Branch': 13000, 'Karen Outlet': 8500 },
  { name: 'Sat', 'Downtown Store': 25000, 'Westlands Branch': 15000, 'Karen Outlet': 9800 },
  { name: 'Sun', 'Downtown Store': 20000, 'Westlands Branch': 12000, 'Karen Outlet': 7200 }
];

// Monthly data
const monthlyData = [
  { name: 'Jan', 'Downtown Store': 450000, 'Westlands Branch': 320000, 'Karen Outlet': 180000 },
  { name: 'Feb', 'Downtown Store': 520000, 'Westlands Branch': 380000, 'Karen Outlet': 220000 },
  { name: 'Mar', 'Downtown Store': 480000, 'Westlands Branch': 350000, 'Karen Outlet': 200000 },
  { name: 'Apr', 'Downtown Store': 590000, 'Westlands Branch': 420000, 'Karen Outlet': 250000 },
  { name: 'May', 'Downtown Store': 630000, 'Westlands Branch': 450000, 'Karen Outlet': 280000 },
  { name: 'Jun', 'Downtown Store': 580000, 'Westlands Branch': 410000, 'Karen Outlet': 260000 }
];

// Annual data
const annualData = [
  { name: '2021', 'Downtown Store': 5200000, 'Westlands Branch': 3800000, 'Karen Outlet': 2100000 },
  { name: '2022', 'Downtown Store': 6100000, 'Westlands Branch': 4500000, 'Karen Outlet': 2800000 },
  { name: '2023', 'Downtown Store': 6800000, 'Westlands Branch': 5200000, 'Karen Outlet': 3200000 },
  { name: '2024', 'Downtown Store': 7500000, 'Westlands Branch': 5800000, 'Karen Outlet': 3600000 }
];

const initialCategories = [
  { id: 1, name: 'Grains', description: 'Rice, wheat, and other grains', productCount: 1 },
  { id: 2, name: 'Oils', description: 'Cooking oils and fats', productCount: 1 },
  { id: 3, name: 'Sweeteners', description: 'Sugar and artificial sweeteners', productCount: 1 },
  { id: 4, name: 'Bakery', description: 'Bread and baked goods', productCount: 1 },
  { id: 5, name: 'Dairy', description: 'Milk and dairy products', productCount: 1 }
];

// Payment status data for pie chart
const paymentStatusData = [
  { name: 'Paid Products', value: 3, color: '#10B981' },
  { name: 'Unpaid Products', value: 2, color: '#EF4444' }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];



const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStore, setSelectedStore] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('bar');
  const [stores, setStores] = useState(initialStores);
  const [admins, setAdmins] = useState(initialAdmins);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users] = useState(initialAdmins); 

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', storeId: '', password: '' });
  const [newStore, setNewStore] = useState({ name: '', location: '', address: '', phone: '', manager: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category_id: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Get chart data based on selected period
  const getChartData = () => {
    switch(reportPeriod) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'annual': return annualData;
      default: return weeklyData;
    }
  };

  // Fetch backend data
  React.useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
      } catch (e) {
        console.error("Failed to load merchant data", e);
      }
    };
    load();
  }, []);

  // Store Management Functions
  const addStore = () => {
    if (!newStore.name || !newStore.location || !newStore.address || !newStore.phone) return;
    
    const store = {
      id: Date.now(),
      name: newStore.name,
      location: newStore.location,
      address: newStore.address,
      phone: newStore.phone,
      manager: newStore.manager,
      status: 'active',
      adminCount: 0
    };
    
    setStores([...stores, store]);
    setNewStore({ name: '', location: '', address: '', phone: '', manager: '' });
    setShowAddStore(false);
  };

  const updateStore = () => {
    if (!editingStore) return;
    
    setStores(stores.map(s => s.id === editingStore.id ? editingStore : s));
    setEditingStore(null);
  };

  const deleteStore = (id) => {
    if (window.confirm('Are you sure you want to delete this store? This will also remove all associated admins and products.')) {
      setStores(stores.filter(s => s.id !== id));
      setAdmins(admins.filter(a => a.storeId !== id));
      setProducts(products.filter(p => p.storeId !== id));
    }
  };

  const toggleStoreStatus = (id) => {
    setStores(stores.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  // Product Management Functions (backend)
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category_id) return;
    try {
      const created = await apiService.createProduct({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category_id: parseInt(newProduct.category_id),
      });
      setProducts(prev => [...prev, created]);
      setNewProduct({ name: '', price: '', category_id: '' });
      setShowAddProduct(false);
    } catch (e) {
      console.error("Failed to create product", e);
      alert("Error creating product");
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const payload = {
        name: editingProduct.name,
        price: editingProduct.price,
        category_id: editingProduct.category_id,
      };
      const updated = await apiService.updateProduct(editingProduct.id, payload);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
    } catch (e) {
      console.error("Failed to update product", e);
      alert("Error updating product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("Failed to delete product", e);
      alert("Error deleting product");
    }
  };


  // Handle admin management
  const toggleAdminStatus = (id) => {
    setAdmins(admins.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ));
  };

  const deleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const addAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.storeId) return;
    
    const store = stores.find(s => s.id === parseInt(newAdmin.storeId));
    const admin = {
      id: Date.now(),
      name: newAdmin.name,
      email: newAdmin.email,
      storeId: parseInt(newAdmin.storeId),
      storeName: store?.name || 'Unknown Store',
      status: 'active',
      lastLogin: new Date().toISOString().split('T')[0]
    };
    
    setAdmins([...admins, admin]);
    setNewAdmin({ name: '', email: '', storeId: '', password: '' });
    setShowAddAdmin(false);
  };

  // Category Management Functions
  const addCategory = () => {
    if (!newCategory.name || !newCategory.description) return;
    
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

  const updateCategory = () => {
    if (!editingCategory) return;
    
    setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    setEditingCategory(null);
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Calculate metrics
  const totalStores = stores.length;
  const totalProducts = products.length;
  const totalStaff = admins.length;
  const paidProducts = 0; // payments not tracked in backend products
  const unpaidProducts = 0;

  const renderChart = () => {
    const data = getChartData();
    
    if (chartType === 'bar') {
      return (
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          {stores.map((store, index) => (
            <Bar key={store.name} dataKey={store.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      );
    } else if (chartType === 'line') {
      return (
        <RechartsLineChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          {stores.map((store, index) => (
            <Line 
              key={store.name} 
              type="monotone" 
              dataKey={store.name} 
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      );
    } else {
      return (
        <AreaChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          {stores.map((store, index) => (
            <Area 
              key={store.name}
              type="monotone" 
              dataKey={store.name} 
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      );
    }
  };

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Merchant Dashboard</h1>
          <p className="text-gray-400">Manage stores, admins, and view comprehensive reports</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card title="Total Stores" value={totalStores} icon={Store} color="blue" trend={12} />
          <Card title="Total Products" value={totalProducts} icon={Package} color="green" trend={8} />
          <Card title="Total Staff" value={totalStaff} icon={Users} color="purple" trend={-2} />
          <Card title="Paid Products" value={paidProducts} icon={Check} color="green" />
          <Card title="Unpaid Products" value={unpaidProducts} icon={X} color="red" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
          <TabButton id="overview" label="Overview & Reports" isActive={activeTab === 'overview'} onClick={setActiveTab} icon={BarChart3} />
          <TabButton id="stores" label="Store Performance" isActive={activeTab === 'stores'} onClick={setActiveTab} icon={Store} />
          <TabButton id="products" label="Product Tracking" isActive={activeTab === 'products'} onClick={setActiveTab} icon={Package} />
          <TabButton id="categories" label="Display Categories" isActive={activeTab === 'categories'} onClick={setActiveTab} icon={ListTree} />
          <TabButton id="admins" label="Manage Admins" isActive={activeTab === 'admins'} onClick={setActiveTab} icon={Users} />
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          
          {/* Overview & Reports Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-white">Store Performance Reports</h2>
                <div className="flex gap-3">
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="annual">Annual Report</option>
                  </select>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
               <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-4 capitalize">{reportPeriod} Revenue by Store</h3>
                  <div className="flex items-center justify-center h-80 text-gray-400">
                    {stores.length === 0 ? (
                      <div className="text-center">
                        <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No stores available for reporting</p>
                        <p className="text-sm mt-2">Add stores to view performance charts</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        {renderChart()}
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                
                {/* Payment Status Pie Chart */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-4">Payment Status Overview</h3>
                  <div className="flex items-center justify-center h-48">
                    {products.length === 0 ? (
                      <div className="text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No products to display</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPieChart>
                          <Pie
                            data={paymentStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {paymentStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    {paymentStatusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-300 text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Management Tab */}
          {activeTab === 'stores' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Store Management</h2>
                <button
                  onClick={() => setShowAddStore(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Store
                </button>
              </div>

              {/* Add Store Form */}
              {showAddStore && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Store</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Store Name"
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newStore.location}
                      onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={newStore.address}
                      onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newStore.phone}
                      onChange={(e) => setNewStore({...newStore, phone: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Manager Name"
                      value={newStore.manager}
                      onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addStore}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Add Store
                    </button>
                    <button
                      onClick={() => setShowAddStore(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Store Form */}
              {editingStore && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Edit Store</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Store Name"
                      value={editingStore.name}
                      onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editingStore.location}
                      onChange={(e) => setEditingStore({...editingStore, location: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={editingStore.address}
                      onChange={(e) => setEditingStore({...editingStore, address: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={editingStore.phone}
                      onChange={(e) => setEditingStore({...editingStore, phone: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Manager Name"
                      value={editingStore.manager}
                      onChange={(e) => setEditingStore({...editingStore, manager: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updateStore}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Update Store
                    </button>
                    <button
                      onClick={() => setEditingStore(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Stores Table */}
              <div className="overflow-x-auto">
                {stores.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No Stores Yet</h3>
                    <p>Click "Add New Store" to create your first store</p>
                  </div>
                ) : (
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Store Name</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Manager</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map(store => (
                      <tr key={store.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{store.name}</td>
                        <td className="p-3">{store.location}</td>
                        <td className="p-3">{store.address}</td>
                        <td className="p-3">{store.phone}</td>
                        <td className="p-3">{store.manager}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            store.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'
                          }`}>{store.status}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setEditingStore(store)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => toggleStoreStatus(store.id)}
                              className={`px-3 py-1 rounded text-xs transition-colors ${
                                store.status === 'active' 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {store.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => deleteStore(store.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {/* Product Management Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Product Management</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <select
                      value={newProduct.category_id}
                      onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
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

              {/* Edit Product Form */}
              {editingProduct && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Edit Product</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price (Ksh)"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <select
                      value={editingProduct.category_id}
                      onChange={(e) => setEditingProduct({...editingProduct, category_id: parseInt(e.target.value)})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updateProduct}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Update Product
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No Products Yet</h3>
                    <p>Click "Add New Product" to create your first product</p>
                  </div>
                ) : (
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Store</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">SKU</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Supplier</th>
                      <th className="p-3 text-left">Payment Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">{product.storeName}</td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3">{product.sku}</td>
                        <td className="p-3">
                          <span className={product.stock <= product.reorderLevel ? 'text-red-400' : 'text-white'}>
                            {product.stock}
                            {product.stock <= product.reorderLevel && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                          </span>
                        </td>
                        <td className="p-3">Ksh {product.price}</td>
                        <td className="p-3">{product.supplier}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.paymentStatus === 'paid' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'
                          }`}>{product.paymentStatus}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setEditingProduct(product)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => togglePaymentStatus(product.id)}
                              className={`px-3 py-1 rounded text-xs transition-colors ${
                                product.paymentStatus === 'paid' 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              Mark {product.paymentStatus === 'paid' ? 'Unpaid' : 'Paid'}
                            </button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

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

              {/* Edit Category Form */}
              {editingCategory && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Edit Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updateCategory}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Update Category
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {/* Category Management Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Category Management</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Category
                </button>
              </div>

              {/* Categories Table */}
              <div className="overflow-x-auto">
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Tags className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No Categories Yet</h3>
                    <p>Click "Add New Category" to create your first category</p>
                  </div>
                ) : (
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Category Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Product Count</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{category.name}</td>
                        <td className="p-3">{category.description}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-700 text-blue-200 rounded-full text-xs">
                            {Array.isArray(category.products) ? category.products.length : 0}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setEditingCategory(category)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteCategory(category.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {/* Manage Admins Tab */}
          {activeTab === 'admins' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Manage Store Admins</h2>
                <button
                  onClick={() => setShowAddAdmin(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Admin
                </button>
              </div>

              {/* Add Admin Form */}
              {showAddAdmin && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Add New Admin</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <select
                      value={newAdmin.storeId}
                      onChange={(e) => setNewAdmin({...newAdmin, storeId: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Store</option>
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                    <input
                      type="password"
                      placeholder="Password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addAdmin}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Add Admin
                    </button>
                    <button
                      onClick={() => setShowAddAdmin(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Admins Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Store</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Last Login</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{admin.name}</td>
                        <td className="p-3">{admin.email}</td>
                        <td className="p-3">{admin.storeName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            admin.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'
                          }`}>{admin.status}</span>
                        </td>
                        <td className="p-3">{admin.lastLogin}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleAdminStatus(admin.id)}
                              className={`px-3 py-1 rounded text-xs transition-colors ${
                                admin.status === 'active' 
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                            >
                              {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => deleteAdmin(admin.id)}
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



export default MerchantDashboard;