// src/components/tables/InventoryTable.jsx
import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function InventoryTable({ inventory, products, categories, onEdit, onDelete }) {
  return (
    <div>
      <table className="w-full text-gray-300">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 && (
            <tr><td colSpan="5" className="p-8 text-center text-gray-400">No inventory items found</td></tr>
          )}
          {inventory.map(item => {
            const product = products.find(p => p.id === item.product_id);
            const category = categories.find(c => c.id === product?.category_id);
            const isLow = item.quantity < 10;
            return (
              <tr key={item.id} className="border-t border-gray-700">
                <td className="p-3">{product?.name || 'Unknown'}</td>
                <td className="p-3">{category?.name || 'N/A'}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${isLow ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}