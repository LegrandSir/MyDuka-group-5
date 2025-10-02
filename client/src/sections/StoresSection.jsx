import { useState } from "react";
import StoresTable from "../components/table/StoresTable";

export default function StoresSection({ stores, products, payments, onAdd, onUpdate, onDelete }) {
  const [newStore, setNewStore] = useState({ name: "", location: "" });

  const handleAdd = () => {
    if (!newStore.name) return;
    onAdd(newStore);
    setNewStore({ name: "", location: "" });
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Stores</h2>

      {/* Add Store Form */}
      <div className="mb-6 bg-gray-800 p-4 rounded-xl">
        <h4 className="text-white mb-2">Add New Store</h4>
        <input
          type="text"
          placeholder="Store Name"
          className="p-2 rounded bg-gray-700 text-white mr-2"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="p-2 rounded bg-gray-700 text-white mr-2"
          value={newStore.location}
          onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 px-3 py-1 rounded text-white"
        >
          Add Store
        </button>
      </div>

      {/* Stores List with drilldown */}
      <StoresTable
        stores={stores}
        products={products}
        payments={payments}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}