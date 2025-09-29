import React from "react";
import { Edit, Save, XCircle, Clock, CheckCircle, X, Plus } from "lucide-react";

// InventoryTable Component
const InventoryTable = ({ inventory, editingItem, onEditClick, onSaveEdit, onCancelEdit, onEditChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="pb-3 text-gray-300">Product</th>
            <th className="pb-3 text-gray-300">Current Stock</th>
            <th className="pb-3 text-gray-300">Reorder Level</th>
            <th className="pb-3 text-gray-300">Status</th>
            <th className="pb-3 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="border-b border-gray-800">
              <td className="py-3 text-white">{item.product_name}</td>
              <td className="py-3">
                {editingItem && editingItem.id === item.id ? (
                  <input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) => onEditChange({ ...editingItem, quantity: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <span className="text-white">{item.quantity}</span>
                )}
              </td>
              <td className="py-3 text-gray-300">{item.reorder_level || 10}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.quantity <= (item.reorder_level || 10)
                    ? "bg-red-900 text-red-300"
                    : "bg-green-900 text-green-300"
                }`}>
                  {item.quantity <= (item.reorder_level || 10) ? "Low Stock" : "In Stock"}
                </span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  {editingItem && editingItem.id === item.id ? (
                    <>
                      <button onClick={onSaveEdit} className="text-green-400 hover:text-green-300">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={onCancelEdit} className="text-red-400 hover:text-red-300">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => onEditClick(item)} className="text-blue-400 hover:text-blue-300">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// RequestTable Component
const RequestTable = ({ requests, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-900 text-yellow-300";
      case "approved": return "bg-green-900 text-green-300";
      case "rejected": return "bg-red-900 text-red-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="pb-3 text-gray-300">Product</th>
            <th className="pb-3 text-gray-300">Quantity</th>
            <th className="pb-3 text-gray-300">Date</th>
            <th className="pb-3 text-gray-300">Status</th>
            <th className="pb-3 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-gray-800">
              <td className="py-3 text-white">{request.product_name}</td>
              <td className="py-3 text-gray-300">{request.quantity}</td>
              <td className="py-3 text-gray-300">{new Date(request.created_at).toLocaleDateString()}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </span>
              </td>
              <td className="py-3">
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => onUpdateStatus(request.id, "approved")} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded">
                      Approve
                    </button>
                    <button onClick={() => onUpdateStatus(request.id, "rejected")} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// SupplyRequestForm Component
const SupplyRequestForm = ({ products, newRequest, onRequestChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-700">
      <h3 className="text-lg font-medium mb-3">Create New Supply Request</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Product</label>
            <select
              value={newRequest.product_id || ""}
              onChange={(e) => onRequestChange({ ...newRequest, product_id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Quantity</label>
            <input
              type="number"
              value={newRequest.quantity || ""}
              onChange={(e) => onRequestChange({ ...newRequest, quantity: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Enter quantity needed"
              min="1"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Submit Request
        </button>
      </form>
    </div>
  );
};

export { InventoryTable, RequestTable, SupplyRequestForm };