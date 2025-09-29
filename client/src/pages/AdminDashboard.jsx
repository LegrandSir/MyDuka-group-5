import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Package,
  DollarSign,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService from "../service/api";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [newClerk, setNewClerk] = useState({ name: "", email: "" });
  const [showAddClerk, setShowAddClerk] = useState(false);

  const [newPayment, setNewPayment] = useState({ supplier: "", amount: "", status: "unpaid" });
  const [showAddPayment, setShowAddPayment] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const inventoryData = await apiService.getInventory();
      const requestsData = await apiService.getSupplyRequests();
      const paymentsData = await apiService.getPayments();

      setInventory(inventoryData || []);
      setSupplyRequests(requestsData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve/decline requests
  const handleRequest = async (id, status) => {
    try {
      await apiService.updateSupplyRequest(id, status);
      await fetchDashboardData();
    } catch (err) {
      alert("Error updating request: " + err.message);
    }
  };

  // Add clerk
  const addClerk = async () => {
    try {
      await apiService.createClerkViaAdmin(newClerk);
      alert("Clerk created successfully!");
      setNewClerk({ name: "", email: "" });
      setShowAddClerk(false);
    } catch (err) {
      alert("Error creating clerk: " + err.message);
    }
  };

  // Add payment
  const addPayment = async () => {
    try {
      await apiService.createPayment(newPayment);
      await fetchDashboardData();
      setNewPayment({ supplier: "", amount: "", status: "unpaid" });
      setShowAddPayment(false);
    } catch (err) {
      alert("Error creating payment: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <h1 className="text-3l font-bold text-white mb-2" > Welcome {user?.email}</h1>
          <p className="text-gray-400">Manage clerks and supply requests</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Inventory Items" value={inventory.length} icon={Package} color="blue" />
          <Card title="Supply Requests" value={supplyRequests.length} icon={ClipboardList} color="green" />
          <Card title="Payments" value={payments.length} icon={DollarSign} color="purple" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={ClipboardList} />
          <TabButton id="requests" label="Supply Requests" isActive={activeTab === "requests"} onClick={setActiveTab} icon={ClipboardList} />
          <TabButton id="payments" label="Payments" isActive={activeTab === "payments"} onClick={setActiveTab} icon={DollarSign} />
          <TabButton id="clerks" label="Clerks" isActive={activeTab === "clerks"} onClick={setActiveTab} icon={UserPlus} />
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl text-white mb-4">Admin Overview</h2>
              <div className="bg-yellow-900/30 p-4 rounded text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Reports on clerks’ entries not yet supported by backend.
              </div>
            </div>
          )}

          {/* Supply Requests */}
          {activeTab === "requests" && (
            <div>
              <h2 className="text-xl text-white mb-4">Supply Requests</h2>
              <table className="w-full text-gray-300">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplyRequests.map((req) => (
                    <tr key={req.id} className="border-t border-gray-700">
                      <td className="p-3">{req.item_name || req.product_id}</td>
                      <td className="p-3">{req.quantity}</td>
                      <td className="p-3 capitalize">{req.status}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleRequest(req.id, "approved")} className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRequest(req.id, "declined")} className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div>
              <h2 className="text-xl text-white mb-4">Supplier Payments</h2>
              {showAddPayment && (
                <div className="mb-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Supplier" value={newPayment.supplier} onChange={(e) => setNewPayment({ ...newPayment, supplier: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Amount" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
                  <select className="bg-gray-700 text-white p-2 rounded mr-2" value={newPayment.status} onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                  <button onClick={addPayment} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                </div>
              )}
              {!showAddPayment && (
                <button onClick={() => setShowAddPayment(true)} className="bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2 mb-4">
                  <Plus className="w-4 h-4" /> Add Payment
                </button>
              )}
              <table className="w-full text-gray-300">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 text-left">Supplier</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t border-gray-700">
                      <td className="p-3">{p.supplier}</td>
                      <td className="p-3">${p.amount}</td>
                      <td className={`p-3 capitalize ${p.status === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Clerks */}
          {activeTab === "clerks" && (
            <div>
              <h2 className="text-xl text-white mb-4">Manage Clerks</h2>
              {showAddClerk && (
                <div className="mb-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Name" value={newClerk.name} onChange={(e) => setNewClerk({ ...newClerk, name: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Email" value={newClerk.email} onChange={(e) => setNewClerk({ ...newClerk, email: e.target.value })} />
                  <button onClick={addClerk} className="bg-green-600 px-4 py-2 rounded text-white">Add</button>
                </div>
              )}
              {!showAddClerk && (
                <button onClick={() => setShowAddClerk(true)} className="bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Add Clerk
                </button>
              )}
              <div className="mt-4 bg-yellow-900/30 p-4 rounded text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Listing, deactivating, or deleting clerks not supported by backend.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;