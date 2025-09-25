import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign, FileText, Edit, Trash2, UserPlus, Eye, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const [showAddClerk, setShowAddClerk] = useState(false);
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
      storeId: user.storeId,
      lastActive: new Date().toISOString().split('T')[0],
      entriesCount: 0
    };
    
    setClerks([...clerks, clerk]);
    setNewClerk({ name: '', email: '', password: '' });
    setShowAddClerk(false);
  };

  // Calculate metrics
  const pendingRequests = reqs.filter(r => r.status === 'pending').length;
  const unpaidPayments = payments.filter(p => p.status === 'unpaid' || p.status === 'overdue').length;
  const activeClerks = clerks.filter(c => c.status === 'active').length;
  const totalRevenue = "Ksh 156,780";

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
        <Card title="Pending Requests" value={pendingRequests} icon={ShoppingCart} color="yellow" />
        <Card title="Unpaid Suppliers" value={unpaidPayments} icon={AlertTriangle} color="red" />
        <Card title="Active Clerks" value={activeClerks} icon={Users} color="green" />
    </div>


      {/* <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl"> */}
    <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
        <TabButton id="requests" label="Supply Requests" isActive={activeTab === 'requests'} onClick={setActiveTab} icon={ShoppingCart} />
        <TabButton id="reports" label="Clerk Reports" isActive={activeTab === 'reports'} onClick={setActiveTab} icon={FileText} />
        <TabButton id="payments" label="Supplier Payments" isActive={activeTab === 'payments'} onClick={setActiveTab} icon={DollarSign} />
        <TabButton id="clerks" label="Manage Clerks" isActive={activeTab === 'clerks'} onClick={setActiveTab} icon={Users} />
    </div>

        {/* Tab Content */}
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          
        {/* Supply Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Supply Requests from Clerks</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-gray-300">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Clerk</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Reason</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reqs.map(r => (
                      <tr key={r.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{r.product}</td>
                        <td className="p-3">{r.qty}</td>
                        <td className="p-3">{r.clerkName}</td>
                        <td className="p-3">{r.date}</td>
                        <td className="p-3 text-sm">{r.reason}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            r.status === 'approved' ? 'bg-green-700 text-green-200' :
                            r.status === 'pending' ? 'bg-yellow-700 text-yellow-200' : 'bg-red-700 text-red-200'
                          }`}>{r.status}</span>
                        </td>
                        <td className="p-3">
                          {r.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => act(r.id, 'approved')} 
                                className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-green-900/20"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => act(r.id, 'declined')} 
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
                                title="Decline Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
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