import React, { useState } from 'react';
import { Users, Package, Check, X, Store, BarChart3, LineChart, PieChart, Calendar, Eye, Edit, Trash2, UserPlus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';
// import Admin from "./AdminDashboard";
// import Card from "../components/Card";

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

// Payment status data for pie chart
const paymentStatusData = [
  { name: 'Paid Products', value: 3, color: '#10B981' },
  { name: 'Unpaid Products', value: 2, color: '#EF4444' }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Card = ({ title, value, icon: Icon, color = 'blue', onClick = null, trend = null }) => (
  <div 
    className={`bg-gradient-to-br from-${color}-900/20 to-${color}-800/10 backdrop-blur-sm border border-${color}-800/30 rounded-xl p-4 shadow-lg ${onClick ? 'cursor-pointer hover:bg-gray-800/30' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
  </div>
);

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStore, setSelectedStore] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('bar');
  const [stores, setStores] = useState(initialStores);
  const [admins, setAdmins] = useState(initialAdmins);
  const [products] = useState(initialProducts);
  const [users] = useState(initialAdmins); // For compatibility
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', storeId: '', password: '' });
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // Get chart data based on selected period
  const getChartData = () => {
    switch(reportPeriod) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'annual': return annualData;
      default: return weeklyData;
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

  // Calculate metrics
  const totalStores = stores.length;
  const totalProducts = products.length;
  const totalStaff = admins.length;
  const paidProducts = products.filter(p => p.paymentStatus === 'paid').length;
  const unpaidProducts = products.filter(p => p.paymentStatus === 'unpaid').length;

  const TabButton = ({ id, label, isActive, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

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
                  <ResponsiveContainer width="100%" height={350}>
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
                
                {/* Payment Status Pie Chart */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-4">Payment Status Overview</h3>
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

          {/* Store Performance Tab */}
          {activeTab === 'stores' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Individual Store Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stores.map(store => (
                  <div 
                    key={store.id}
                    onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                    className="bg-gray-800/50 rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 transition-colors border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">{store.name}</h3>
                        <p className="text-gray-400 text-sm">{store.location}</p>
                        <p className="text-gray-400 text-xs mt-1">Admins: {store.adminCount}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        store.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'
                      }`}>
                        {store.status}
                      </div>
                    </div>
                    {selectedStore === store.id && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-sm text-gray-300 space-y-1">
                          <div>Products: {products.filter(p => p.storeId === store.id).length}</div>
                          <div>Weekly Revenue: Ksh 128,000</div>
                          <div>Monthly Revenue: Ksh 450,000</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Tracking Tab */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Product Payment Tracking Across All Stores</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Store</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Payment Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">{product.storeName}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3">Ksh {product.price}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.paymentStatus === 'paid' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'
                          }`}>{product.paymentStatus}</span>
                        </td>
                        <td className="p-3">
                          <button className="text-blue-400 hover:text-blue-300 mr-2">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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