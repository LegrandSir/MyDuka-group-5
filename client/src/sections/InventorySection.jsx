import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import InventoryTable from "../components/tables/InventoryTable";
import InventoryForm from "../components/forms/InventoryForm";
import api from "../service/api";

export default function InventorySection({ inventory, products, categories, onInventoryChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");

  const add = async (data) => {
    await api.createInventory({ product_id: parseInt(data.product_id), quantity: parseInt(data.quantity) });
    onInventoryChange?.();
  };

  const update = async (id, qty) => {
    await api.updateInventory(id, parseInt(qty));
    onInventoryChange?.();
  };

  const remove = async (id) => {
    if (!confirm("Delete inventory item?")) return;
    await api.deleteInventory(id);
    onInventoryChange?.();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Current Inventory</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={14} /> Add Inventory
        </button>
      </div>

      <InventoryTable inventory={inventory} products={products} categories={categories} onEdit={setEditing} onDelete={remove} />

      {showForm && (
        <Modal title="Add Inventory Item" onClose={() => setShowForm(false)}>
          <InventoryForm products={products} onSubmit={async (d) => { await add(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Update Inventory" onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Product</label>
              <input type="text" value={products.find(p => p.id === editing.product_id)?.name || 'Unknown'} disabled className="w-full bg-gray-700 text-gray-400 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">New Quantity</label>
              <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button onClick={async () => { await update(editing.id, newQuantity); setEditing(null); setNewQuantity(""); }} className="flex-1 bg-blue-600 px-4 py-2 rounded text-white">Update</button>
              <button onClick={() => { setEditing(null); setNewQuantity(""); }} className="flex-1 bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}