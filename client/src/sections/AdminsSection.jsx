import { useState } from "react";

export default function AdminsSection({ admins, stores, onAdd, onToggleStatus }) {
  const [newAdmin, setNewAdmin] = useState({ email: "", storeId: "" });

  const handleAdd = () => {
    if (!newAdmin.email || !newAdmin.storeId) return;
    onAdd(newAdmin);
    setNewAdmin({ email: "", storeId: "" });
  };

  return (
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
          onClick={handleAdd}
          className="bg-blue-600 px-3 py-1 rounded text-white"
        >
          Invite
        </button>
      </div>

      {/* Admins Table */}
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
          {admins.length > 0 ? admins.map((a) => {
            const store = stores.find((s) => s.id === a.store_id);
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
                    onClick={() => onToggleStatus(a.id, !a.active)}
                    className={`px-2 py-1 rounded ${
                      a.active ? "bg-red-600" : "bg-green-600"
                    } text-white`}
                  >
                    {a.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                No admins available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}