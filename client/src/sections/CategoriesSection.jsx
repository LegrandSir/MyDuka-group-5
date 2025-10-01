import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import CategoriesTable from "../components/table/CategoriesTable";
import CategoryForm from "../components/forms/CategoryForm";
import api from "../service/api";

export default function CategoriesSection({ categories, products, onCategoriesChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const add = async (data) => {
    await api.createCategory(data);
    onCategoriesChange?.();
  };
  const update = async (data) => {
    await api.updateCategory(data.id, data);
    onCategoriesChange?.();
  };
  const remove = async (id) => {
    const productCount = products.filter(p => p.category_id === id).length;
    if (productCount > 0 && !confirm(`Category has ${productCount} product(s). Delete anyway?`)) return;
    if (!confirm('Delete category?')) return;
    await api.deleteCategory(id);
    onCategoriesChange?.();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Category Management</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <CategoriesTable categories={categories} products={products} onEdit={setEditing} onDelete={remove} />

      {showForm && (
        <Modal title="Add Category" onClose={() => setShowForm(false)}>
          <CategoryForm onSubmit={async (d) => { await add(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Category" onClose={() => setEditing(null)}>
          <CategoryForm initialData={editing} onSubmit={async (d) => { await update({ ...editing, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}