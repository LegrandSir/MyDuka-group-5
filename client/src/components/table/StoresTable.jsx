import { useState } from "react";

export default function StoresTable({ stores, onUpdate, onDelete }) {
  const [editingStore, setEditingStore] = useState(null);
  const [editData, setEditData] = useState({ name: "", location: "" });

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
              <tr key={s.id} className="border-b border-gray-700">
                <td className="p-3">
                  {editingStore === s.id ? (
                    <input
                      type="text"
                      className="p-2 bg-gray-700 rounded text-white w-full"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    s.name
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
  );
}