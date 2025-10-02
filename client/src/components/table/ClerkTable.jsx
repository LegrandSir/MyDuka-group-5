import React from "react";

export default function ClerkTable({ clerks, onToggleStatus }) {
  return (
    <table className="min-w-full bg-gray-800 rounded-xl text-gray-300">
      <thead>
        <tr className="bg-gray-700 text-gray-200">
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {clerks.map((c) => (
          <tr key={c.id} className="border-b border-gray-700">
            <td className="p-3">{c.email}</td>
            <td className="p-3">
              {c.active ? (
                <span className="text-green-400">Active</span>
              ) : (
                <span className="text-red-400">Inactive</span>
              )}
            </td>
            <td className="p-3 text-right">
              <button
                onClick={() => onToggleStatus(c.id, !c.active)}
                className={`px-2 py-1 rounded ${
                  c.active ? "bg-red-600" : "bg-green-600"
                } text-white`}
              >
                {c.active ? "Deactivate" : "Activate"}
              </button>
            </td>
          </tr>
        ))}
        {clerks.length === 0 && (
          <tr>
            <td colSpan="3" className="p-3 text-center text-gray-500 italic">
              No clerks available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}