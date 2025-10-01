import React, { useState, useEffect } from "react";

export default function CategoryForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || { name: "", description: "" });

  useEffect(() => { setForm(initialData || { name: "", description: "" }); }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Category Name" className="w-full bg-gray-700 text-white rounded px-3 py-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full bg-gray-700 text-white rounded px-3 py-2 h-24" />
      <div className="flex gap-2">
        <button onClick={() => onSubmit(form)} className="flex-1 bg-blue-600 px-4 py-2 rounded text-white">Save</button>
        <button onClick={onCancel} className="flex-1 bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
      </div>
    </div>
  );
}