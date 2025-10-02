// src/components/forms/InventoryForm.jsx
import React, { useState, useEffect } from "react";

export default function InventoryForm({ initialData, products, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || { product_id: "", quantity: "" });

  useEffect(() => { setForm(initialData || { product_id: "", quantity: "" }); }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <select name="product_id" value={form.product_id} onChange={handleChange} className="w-full bg-gray-700 text-white rounded px-3 py-2">
        <option value="">Select Product</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full bg-gray-700 text-white rounded px-3 py-2" />
      <div className="flex gap-2">
        <button onClick={() => onSubmit(form)} className="flex-1 bg-blue-600 px-4 py-2 rounded text-white">Save</button>
        <button onClick={onCancel} className="flex-1 bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
      </div>
    </div>
  );
}