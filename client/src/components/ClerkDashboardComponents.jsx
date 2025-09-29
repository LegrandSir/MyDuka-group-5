import React, { useState } from 'react';
import { Package, ShoppingCart, AlertTriangle, Plus, TrendingUp, Minus, Edit, Save, Clock, CheckCircle, XCircle } from 'lucide-react';

// InventoryTable Component
export const InventoryTable = ({ 
  inventory, 
  products, 
  editingItem, 
  onEditClick, 
  onSaveEdit, 
  onCancelEdit, 
  onEditChange, 
  onRecordSpoilage 
}) => {
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-900/30' };
    if (quantity < 10) return { label: 'Low Stock', color: 'text-yellow-500', bg: 'bg-yellow-900/30' };
    return { label: 'In Stock', color: 'text-green-500', bg: 'bg-green-900/30' };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Product</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Quantity</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-right py-3 px-4 text-gray-400 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                No inventory items found
              </td>
            </tr>
          ) : (
            inventory.map((item) => {
              const status = getStockStatus(item.quantity);
              const isEditing = editingItem?.id === item.id;

              return (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="font-medium">{getProductName(item.product_id)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editingItem.quantity}
                        onChange={(e) => onEditChange({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                        min="0"
                      />
                    ) : (
                      <span className="text-lg font-semibold">{item.quantity}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={onSaveEdit}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={onCancelEdit}
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onEditClick(item)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Edit Quantity"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRecordSpoilage(item)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Record Spoilage"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// SupplyRequestForm Component
export const SupplyRequestForm = ({ 
  products, 
  newRequest, 
  onRequestChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        New Supply Request
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Product</label>
          <select
            value={newRequest.product_id}
            onChange={(e) => onRequestChange({ ...newRequest, product_id: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Product</option>
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
            value={newRequest.quantity}
            onChange={(e) => onRequestChange({ ...newRequest, quantity: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter quantity"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            disabled={!newRequest.product_id || !newRequest.quantity}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

// RequestTable Component
export const RequestTable = ({ supplyRequests, products }) => {
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-900/30', text: 'text-yellow-500' };
      case 'approved':
        return { bg: 'bg-green-900/30', text: 'text-green-500' };
      case 'rejected':
        return { bg: 'bg-red-900/30', text: 'text-red-500' };
      case 'fulfilled':
        return { bg: 'bg-blue-900/30', text: 'text-blue-500' };
      default:
        return { bg: 'bg-gray-900/30', text: 'text-gray-500' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Product</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Quantity</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {supplyRequests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-8 text-gray-500">
                No supply requests found
              </td>
            </tr>
          ) : (
            supplyRequests.map((request) => {
              const statusStyle = getStatusColor(request.status);
              
              return (
                <tr key={request.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-purple-400" />
                      <span className="font-medium">{getProductName(request.product_id)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-lg font-semibold">{request.quantity}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusStyle.bg} ${statusStyle.text} capitalize`}>
                      {request.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(request.created_at || request.requested_at)}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};