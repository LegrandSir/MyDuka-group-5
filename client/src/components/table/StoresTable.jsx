import { useState, Fragment } from "react";

export default function StoresTable({ stores, products = [], payments = [], onUpdate, onDelete }) {
  const [editingStore, setEditingStore] = useState(null);
  const [editData, setEditData] = useState({ name: "", location: "" });
  const [selectedStoreId, setSelectedStoreId] = useState(null); // NEW: drilldown toggle

  const startEditing = (store) => {
    setEditingStore(store.id);
    setEditData({ name: store.name, location: store.location });
  };

  const saveEdit = () => {
    onUpdate(editingStore, editData);
    setEditingStore(null);
    setEditData({ name: "", location: "" });
  };

  const cancelEdit = () => {
    setEditingStore(null);
    setEditData({ name: "", location: "" });
  };

  const toggleDrilldown = (id) => {
    setSelectedStoreId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-xl text-gray-300">
        <thead>
          <tr className="bg-gray-700 text-gray-200">
            <th className="p-3 text-left">Store Name</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((s) => (
                <Fragment key={s.id}>
                <tr className="border-b border-gray-700">
                    <td className="p-3 cursor-pointer" onClick={() => toggleDrilldown(s.id)}>
                    {editingStore === s.id ? (
                        <input
                        type="text"
                        className="p-2 bg-gray-700 rounded text-white w-full"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                    ) : (
                        <span className="hover:text-blue-400">{s.name}</span>
                    )}
                    </td>
                    <td className="p-3">
                    {editingStore === s.id ? (
                        <input
                        type="text"
                        className="p-2 bg-gray-700 rounded text-white w-full"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        />
                    ) : (
                        s.location
                    )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                    {editingStore === s.id ? (
                        <>
                        <button
                            onClick={saveEdit}
                            className="bg-green-600 px-3 py-1 rounded text-white"
                        >
                            Save
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="bg-gray-600 px-3 py-1 rounded text-white"
                        >
                            Cancel
                        </button>
                        </>
                    ) : (
                        <>
                        <button
                            onClick={() => startEditing(s)}
                            className="text-blue-400 hover:text-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(s.id)}
                            className="text-red-400 hover:text-red-600"
                        >
                            Delete
                        </button>
                        </>
                    )}
                    </td>
                </tr>

                {/* Drilldown Row */}
                {selectedStoreId === s.id && (
                    <tr>
                    <td colSpan="3" className="bg-gray-900 p-4">
                        <h4 className="text-white text-lg mb-2">Products</h4>
                        <ul className="ml-4 text-gray-300 space-y-1">
                        {products.filter((p) => p.store_id === s.id).map((p) => (
                            <li key={p.id} className="flex justify-between border-b border-gray-700 py-1">
                            <span>{p.name}</span>
                            <span className="text-green-400">Ksh {p.price}</span>
                            </li>
                        ))}
                        {products.filter((p) => p.store_id === s.id).length === 0 && (
                            <li className="text-gray-500 italic">No products available</li>
                        )}
                        </ul>

                        <h4 className="text-white text-lg mt-4 mb-2">Payments</h4>
                        <ul className="ml-4 text-gray-300 space-y-1">
                        {payments.filter((p) => p.store_id === s.id).map((p) => (
                            <li key={p.id} className="flex justify-between border-b border-gray-700 py-1">
                            <span>{p.method} – {p.status}</span>
                            <span className={p.status === "paid" ? "text-green-400" : "text-red-400"}>
                                Ksh {p.amount}
                            </span>
                            </li>
                        ))}
                        {payments.filter((p) => p.store_id === s.id).length === 0 && (
                            <li className="text-gray-500 italic">No payments recorded</li>
                        )}
                        </ul>
                    </td>
                    </tr>
                )}
                </Fragment>
            ))
            ) : (
            <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500 italic">
                No stores available
                </td>
            </tr>
            )}
            </tbody>
            </table>
            </div>
  )}