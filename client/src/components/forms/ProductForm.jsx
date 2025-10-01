import React, { useState } from "react";

export default function ProductForm({ initialData, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || { name: "", category_id: "", price: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full bg-gray-700 text-white rounded px-3 py-2"/>
      <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full bg-gray-700 text-white rounded px-3 py-2">
        <option value="">Select Category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" className="w-full bg-gray-700 text-white rounded px-3 py-2"/>
      <div className="flex gap-2">
        <button type="button" onClick={() => onSubmit(form)} className="flex-1 bg-blue-600 px-4 py-2 rounded text-white">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
      </div>
    </form>
  );
}
