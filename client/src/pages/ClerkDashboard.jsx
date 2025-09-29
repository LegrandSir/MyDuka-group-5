import React, { useState, useEffect } from "react";
import {
  Package,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService from "../service/api";

const ClerkDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Supply request form
  const [newRequest, setNewRequest] = useState({ product_id: "", quantity: "" });
  const [showAddRequest, setShowAddRequest] = useState(false);

  // Inventory update form
  const [editingInventory, setEditingInventory] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    fetchClerkData();
  }, []);

  const fetchClerkData = async () => {
    try {
      setLoading(true);
      const inventoryData = await apiService.getInventory();
      const requestsData = await apiService.getSupplyRequests();

      setInventory(inventoryData || []);
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
          <Card title="Requests Submitted" value={requests.length} icon={ClipboardList} color="green" />
          <Card
            title="Pending Requests"
            value={requests.filter((r) => r.status === "pending").length}
            icon={ClipboardList}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={Package} />
          <TabButton id="inventory" label="Inventory" isActive={activeTab === "inventory"} onClick={setActiveTab} icon={Package} />
          <TabButton id="requests" label="Supply Requests" isActive={activeTab === "requests"} onClick={setActiveTab} icon={ClipboardList} />
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Clerk Overview</h2>
              <div className="space-y-3">
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 inline mr-2" />
                  <span className="text-yellow-200">⚠️ Recording items received not available (missing endpoint).</span>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 inline mr-2" />
                  <span className="text-yellow-200">⚠️ Payment status recording not available (missing endpoint).</span>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 inline mr-2" />
                  <span className="text-yellow-200">⚠️ Recording spoilt items not available (missing endpoint).</span>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 inline mr-2" />
                  <span className="text-yellow-200">⚠️ Buying/selling price recording not available (missing endpoint).</span>
                </div>
              </div>
            </div>
          )}

          {/* Inventory */}
          {activeTab === "inventory" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Inventory</h2>
              {inventory.length === 0 ? (
                <p className="text-gray-400">No inventory data.</p>
              ) : (
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-t border-gray-700">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.stock}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setEditingInventory(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {editingInventory && (
                <div className="mt-4">
                  <h3 className="text-white mb-2">Update Stock for {editingInventory.name}</h3>
                  <input
                    type="number"
                    placeholder="New Quantity"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white mr-2"
                  />
                  <button onClick={updateStock} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingInventory(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded ml-2">
                    Cancel
                  </button>
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
                  <h3 className="text-white font-medium mb-3">New Request</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="number"
                      placeholder="Product ID"
                      value={newRequest.product_id}
                      onChange={(e) => setNewRequest({ ...newRequest, product_id: e.target.value })}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newRequest.quantity}
                      onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={submitRequest} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                      Submit
                    </button>
                    <button onClick={() => setShowAddRequest(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {requests.length === 0 ? (
                <p className="text-gray-400">No requests submitted.</p>
              ) : (
                <table className="w-full text-gray-300">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-t border-gray-700">
                        <td className="p-3">{req.item_name || req.product_id}</td>
                        <td className="p-3">{req.quantity}</td>
                        <td
                          className={`p-3 capitalize ${
                            req.status === "approved"
                              ? "text-green-400"
                              : req.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {req.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClerkDashboard;