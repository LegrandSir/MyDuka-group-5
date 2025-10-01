import React from "react";
import ActionButtons from "../ActionButtons";

export default function CategoriesTable({ categories, products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-gray-300">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Category Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Products Count</th>
            <th className="p-3 text-left">Created Date</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr><td colSpan="5" className="p-8 text-center text-gray-400">No categories found.</td></tr>
          )}
          {categories.map(cat => {
            const productCount = products.filter(p => p.category_id === cat.id).length;
            return (
              <tr key={cat.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                <td className="p-3 font-medium text-white">{cat.name}</td>
                <td className="p-3 text-gray-400">{cat.description || 'No description'}</td>
                <td className="p-3">
                  <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm">
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </span>
                </td>
                <td className="p-3 text-sm">{cat.created_at ? new Date(cat.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="p-3">
                  <ActionButtons onEdit={() => onEdit(cat)} onDelete={() => onDelete(cat.id)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}