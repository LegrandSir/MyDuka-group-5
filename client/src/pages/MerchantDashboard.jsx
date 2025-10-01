import React, { useState, useEffect } from 'react';
import {
  Users, Package, Store, DollarSign, BarChart3, Plus, Edit, Trash2, UserPlus
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService, { merchantDashboard } from "../service/api";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [admins, setAdmins] = useState([]); // ⚠️ still no GET /admins
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // Forms
  const [newStore, setNewStore] = useState({ name: '', location: '' });
  const [newAdmin, setNewAdmin] = useState({ email: '', storeId: '' });
  const [editingStore, setEditingStore] = useState(null);
  const [editStoreData, setEditStoreData] = useState({ name: '', location: '' });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [storesData, productsData, paymentsData, adminsData] = await Promise.all([
        apiService.getStores(),
        apiService.getProducts(),
        apiService.getPayments(),
        // merchantDashboard.getAdmins()
      ]);
      setStores(storesData || []);
      setProducts(productsData || []);
      setPayments(paymentsData || []);
      // setAdmins(adminsData || []); 
    } finally {
      setLoading(false);
    }
  };

  // CRUD helpers
  const addStore = async () => {
    await apiService.createStore(newStore);
    await fetchDashboardData();
    setNewStore({ name: '', location: '' });
  };

  const deleteStore = async (id) => {
  if (window.confirm("Are you sure you want to delete this store?")) {
    await apiService.deleteStore(id);
    await fetchDashboardData();
  }
};

  const startEditing = (store) => {
    setEditingStore(store.id);
    setEditStoreData({ name: store.name, location: store.location });
};

  const saveEdit = async () => {
    await apiService.updateStore(editingStore, editStoreData);
    setEditingStore(null);
    setEditStoreData({ name: '', location: '' });
    await fetchDashboardData();
};

  const cancelEdit = () => {
    setEditingStore(null);
    setEditStoreData({ name: '', location: '' });
};


  const addAdmin = async () => {
    await merchantDashboard.createStoreAdmin(newAdmin);
    alert("Invitation sent!");
    setNewAdmin({ email: '', storeId: '' });
  };

  // =============================
  // REPORTING DATA
  // =============================
  const overviewData = stores.map((s) => {
    const storePayments = payments.filter(p => p.store_id === s.id);
    const total = storePayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const paid = storePayments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
    const unpaid = total - paid;
    return { name: s.name, total, paid, unpaid };
  });

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Merchant Dashboard</h1>
          <p className="text-gray-400">Manage stores and view perfomance</p>
        </div>


        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Stores" value={stores.length} icon={Store} color="blue" />
          <Card title="Products" value={products.length} icon={Package} color="green" />
          <Card title="Payments" value={payments.length} icon={DollarSign} color="purple" />
          <Card title="Admins" value={admins.length} icon={Users} color="orange" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} icon={BarChart3} />
          <TabButton id="stores" label="Stores" isActive={activeTab === 'stores'} onClick={setActiveTab} icon={Store} />
          <TabButton id="payments" label="Payments" isActive={activeTab === 'payments'} onClick={setActiveTab} icon={DollarSign} />
          <TabButton id="admins" label="Admins" isActive={activeTab === 'admins'} onClick={setActiveTab} icon={UserPlus} />
        </div>

        {/* Overview with store-by-store chart */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl text-white mb-4">Store Reports</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={overviewData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill={COLORS[1]} stackId="a" />
                <Bar dataKey="unpaid" fill={COLORS[3]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      {/* Stores with drilldown */}
     {activeTab === 'stores' && (
      <div>
       {!selectedStore ? (
        <>
          <h2 className="text-xl text-white mb-4">Stores</h2>
          {/* Add Store Form */}
          <div className="mb-6 bg-gray-800 p-4 rounded-xl">
           <h4 className="text-white mb-2">Add New Store</h4>
            <input
              type="text"
              placeholder="Store Name"
              className="p-2 rounded bg-gray-700 text-white mr-2"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="p-2 rounded bg-gray-700 text-white mr-2"
              value={newStore.location}
              onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
            />
            <button
              onClick={addStore}
              className="bg-blue-600 px-3 py-1 rounded text-white"
            >
              Add Store
            </button>
          </div>
          {stores.map(s => (
            <div
              key={s.id}
              className="flex justify-between items-center text-gray-300 border-b border-gray-700 py-2"
            >
              {editingStore === s.id ? (
                <>
                  <input
                    type="text"
                    className="p-1 rounded bg-gray-700 text-white mr-2"
                    value={editStoreData.name}
                    onChange={(e) => setEditStoreData({ ...editStoreData, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="p-1 rounded bg-gray-700 text-white mr-2"
                    value={editStoreData.location}
                    onChange={(e) => setEditStoreData({ ...editStoreData, location: e.target.value })}
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 px-2 py-1 rounded text-white mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-600 px-2 py-1 rounded text-white"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span 
                    onClick={() => setSelectedStore(s)} 
                    className="cursor-pointer hover:text-white flex-1"
                  >
                    {s.name} – {s.location}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(s)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStore(s.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
       ) : (
      <div>
        <button
          onClick={() => setSelectedStore(null)}
          className="bg-gray-600 px-3 py-1 rounded text-white mb-4"
        >
          ← Back
        </button>

        {/* Store Info */}
        <h3 className="text-2xl text-white mb-2">{selectedStore.name} Report</h3>
        <p className="text-gray-400 mb-6">{selectedStore.location}</p>

        {/* Products */}
        <h4 className="text-lg text-white mt-4 mb-2">Products</h4>
        <ul className="ml-4 text-gray-300 space-y-1">
          {products.filter(p => p.store_id === selectedStore.id).map(p => (
            <li key={p.id} className="flex justify-between border-b border-gray-700 py-1">
              <span>{p.name}</span>
              <span className="text-green-400">Ksh {p.price}</span>
            </li>
          ))}
          {products.filter(p => p.store_id === selectedStore.id).length === 0 && (
            <li className="text-gray-500 italic">No products available</li>
          )}
        </ul>

        {/* Store Payments */}
        <h4 className="text-lg text-white mt-6 mb-2">Payments</h4>
            <ul className="ml-4 text-gray-300 space-y-1">
              {payments.filter(p => p.store_id === selectedStore.id).map(p => (
                <li key={p.id} className="flex justify-between border-b border-gray-700 py-1">
                  <span>{p.method} – {p.status}</span>
                  <span className={p.status === "paid" ? "text-green-400" : "text-red-400"}>
                    Ksh {p.amount}
                  </span>
                </li>
              ))}
              {payments.filter(p => p.store_id === selectedStore.id).length === 0 && (
                <li className="text-gray-500 italic">No payments recorded for this store</li>
              )}
            </ul>
            </div>
          )}
        </div>
      )}

      {/* Payments */}
        {activeTab === 'payments' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Payments Across All Stores</h3>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-xl text-gray-300">
                <thead>
                  <tr className="bg-gray-700 text-gray-200">
                    <th className="p-3 text-left">Store</th>
                    <th className="p-3 text-left">Method</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Amount (Ksh)</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const store = stores.find(s => s.id === p.store_id);
                    return (
                      <tr key={p.id} className="border-b border-gray-700">
                        <td className="p-3">{store ? store.name : "Unknown"}</td>
                        <td className="p-3">{p.method}</td>
                        <td className={`p-3 ${p.status === "paid" ? "text-green-400" : "text-red-400"}`}>
                          {p.status}
                        </td>
                        <td className="p-3 text-right">{p.amount}</td>
                      </tr>
                    );
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                        No payments recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

        {/* Global Summary */}
            <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
              <h5 className="text-white font-semibold mb-2">Global Payments Summary</h5>
              {(() => {
                const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
                const paid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
                const unpaid = total - paid;
                return (
                  <div className="text-gray-300 space-y-1">
                    <p>Total Payments: <span className="text-blue-400">Ksh {total}</span></p>
                    <p>Paid: <span className="text-green-400">Ksh {paid}</span></p>
                    <p>Unpaid: <span className="text-red-400">Ksh {unpaid}</span></p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      {/* Admins */}
      {activeTab === 'admins' && (
      <div>
        <h2 className="text-xl text-white mb-4">Manage Admins</h2>

        {/* Add Admin Form */}
        <div className="mb-6 bg-gray-800 p-4 rounded-xl">
          <h4 className="text-white mb-2">Invite New Admin</h4>
          <input
            type="email"
            placeholder="Admin Email"
            className="p-2 rounded bg-gray-700 text-white mr-2"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <select
            className="p-2 rounded bg-gray-700 text-white mr-2"
            value={newAdmin.storeId}
            onChange={(e) => setNewAdmin({ ...newAdmin, storeId: e.target.value })}
          >
            <option value="">Select Store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={addAdmin}
            className="bg-blue-600 px-3 py-1 rounded text-white"
          >
            Invite
          </button>
        </div>

        { /* Admin List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-xl text-gray-300">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Store</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => {
                  const store = stores.find(s => s.id === a.store_id);
                  return (
                    <tr key={a.id} className="border-b border-gray-700">
                      <td className="p-3">{a.email}</td>
                      <td className="p-3">{store ? store.name : "Unassigned"}</td>
                      <td className="p-3">
                        {a.active 
                          ? <span className="text-green-400">Active</span> 
                          : <span className="text-red-400">Inactive</span>}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => merchantDashboard.toggleAdminStatus(a.id, !a.active)
                            .then(fetchDashboardData)}
                          className={`px-2 py-1 rounded ${
                            a.active ? "bg-red-600" : "bg-green-600"
                          } text-white`}
                        >
                          {a.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                      No admins available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
