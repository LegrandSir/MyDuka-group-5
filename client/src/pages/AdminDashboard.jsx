import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Package,
  DollarSign,
  UserPlus,
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
// import apiService, { adminDashboard } from "../service/api";

import { useAuth } from "../context/AuthContext";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clerks, setClerks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Clerk state
  const [newClerk, setNewClerk] = useState({ name: "", email: "" });
  const [showAddClerk, setShowAddClerk] = useState(false);

  const [newPayment, setNewPayment] = useState({
    supplier: "",
    amount: "",
    status: "unpaid",
  });
  const [showAddPayment, setShowAddPayment] = useState(false);

const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const inventoryData = await apiService.getInventory();
      const productsData = await apiService.getProducts();
      const requestsData = await apiService.getSupplyRequests();
      const paymentsData = await apiService.getPayments();
      // const clerksData = await adminDashboard.getClerks();

      setInventory(inventoryData || []);
      setProducts(productsData || []);
      setSupplyRequests(requestsData || []);
      setPayments(paymentsData || []);
      // setClerks(clerksData || []); 
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  // add payment
const addPayment = async () => {
  try {
    await apiService.createPayment({
      user_id: user?.id,           // current logged-in user
      amount: newPayment.amount,
      method: newPayment.method,   // add method input in your form
    });
    await fetchDashboardData();
    setNewPayment({ method: "", amount: "" });
    setShowAddPayment(false);
  } catch (err) {
    alert("Error creating payment: " + err.message);
  }
};

  // 🔹 Update supply request (approve/decline)
  const handleRequest = async (id, status) => {
    try {
      await apiService.updateSupplyRequest(id, status);
      await fetchDashboardData();
    } catch (err) {
      alert("Error updating request: " + err.message);
    }
  };

  // 🔹 Delete supply request
  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await apiService.request(`/supply_requests/${id}`, { method: "DELETE" });
      await fetchDashboardData();
    } catch (err) {
      alert("Error deleting request: " + err.message);
    }
  };
  
  // Add clerk
  // const addClerk = async () => {
  //   try {
  //     await apiService.createClerkViaAdmin(newClerk);
  //     alert("Clerk created successfully!");
  //     setNewClerk({ name: "", email: "" });
  //     setShowAddClerk(false);
  //   } catch (err) {
  //     alert("Error creating clerk: " + err.message);
  //   }
  // };

  // // Add payment
  // const addPayment = async () => {
  //   try {
  //     await apiService.createPayment(newPayment);
  //     await fetchDashboardData();
  //     setNewPayment({ supplier: "", amount: "", status: "unpaid" });
  //     setShowAddPayment(false);
  //   } catch (err) {
  //     alert("Error creating payment: " + err.message);
  //   }
  // };

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
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
              <table className="w-full text-gray-300">
                <thead>
                 <tr className="bg-gray-800">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                   <th className="p-3 text-left">Price</th>
                 </tr>
                </thead>
              <tbody>
              {products.slice(0, 5).map((p) => (
             <tr key={p.id} className="border-t border-gray-700">
               <td className="p-3">{p.name}</td>
               <td className="p-3">{p.description}</td>
               <td className="p-3">Ksh {p.price}</td>
             </tr>
             ))}
        </tbody>
      </table>
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
                 <th className="p-3 text-left">Store</th>
                 <th className="p-3 text-left">Requested By</th>
                 <th className="p-3 text-left">Date</th>
                 <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
          <tbody>
            {supplyRequests.map((req) => (
              <tr key={req.id} className="border-t border-gray-700">
                <td className="p-3">{req.product_name || req.product_id}</td>
                <td className="p-3">{req.quantity}</td>
                <td className="p-3 capitalize">{req.status}</td>
                <td className="p-3">{req.store_name || req.store_id}</td>
                <td className="p-3">{req.requester_name || req.requested_by}</td>
                <td className="p-3">
                  {req.created_at
                    ? new Date(req.created_at).toLocaleString()
                    : "—"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleRequest(req.id, "approved")}
                    className="text-green-400 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleRequest(req.id, "declined")}
                    className="text-red-400 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(req.id)}
                    className="text-yellow-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
                {/* <thead>
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
          )} */}

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
                      <td className="p-3">{p.method}</td>
                      <td className="p-3">Ksh {p.amount}</td>
                      <td className={`p-3 capitalize ${p.status === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'clerks' && (
            <div>
              <h2 className="text-xl text-white mb-4">Manage Clerks</h2>
          
              {/* Add Clerk Form */}
              <div className="mb-6 bg-gray-800 p-4 rounded-xl">
                <h4 className="text-white mb-2">Invite New Clerk</h4>
                <input
                  type="email"
                  placeholder="Clerk Email"
                  className="p-2 rounded bg-gray-700 text-white mr-2"
                  value={newClerk.email}
                  onChange={(e) => setNewClerk({ ...newClerk, email: e.target.value })}
                />
                {/* <select
                  className="p-2 rounded bg-gray-700 text-white mr-2"
                  value={newClerk.storeId}
                  onChange={(e) => setNewClerk({ ...newClerk, storeId: e.target.value })}
                >
                  <option value="">Select Store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select> */}
                <button
                  onClick={addClerk}
                  className="bg-blue-600 px-3 py-1 rounded text-white"
                >
                  Invite
                </button>
              </div>
          
              { /* Clerk List */}
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
                      {clerks.map((c) => {
                        // const store = stores.find(s => s.id === c.store_id);
                        return (
                          <tr key={c.id} className="border-b border-gray-700">
                            <td className="p-3">{c.email}</td>
                            {/* <td className="p-3">{store ? store.name : "Unassigned"}</td> */}
                            <td className="p-3">
                              {c.active 
                                ? <span className="text-green-400">Active</span> 
                                : <span className="text-red-400">Inactive</span>}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => adminDashboard.toggleClerkStatus(c.id, !c.active)
                                  .then(fetchDashboardData)}
                                className={`px-2 py-1 rounded ${
                                  c.active ? "bg-red-600" : "bg-green-600"
                                } text-white`}
                              >
                                {c.active ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {clerks.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                            No clerks available
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
    </div>
  );
};

export default AdminDashboard;