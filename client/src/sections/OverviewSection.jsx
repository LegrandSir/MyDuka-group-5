import React from "react";

export default function OverviewSection({ products }) {
  return (
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
          {products.length === 0 && (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500 italic">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
