import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import ProductsTable from "../components/tables/ProductsTable";
import ProductForm from "../components/forms/ProductForm";
import api from "../service/api";

export default function ProductsSection({ products, categories, getCurrentStock, onProductsChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const add = async (data) => {
    await api.createProduct(data);
    onProductsChange?.();
  };

  const update = async (data) => {
    await api.updateProduct(data.id, data);
    onProductsChange?.();
  };

  const remove = async (id) => {
    if (!confirm("Delete product?")) return;
    await api.deleteProduct(id);
    onProductsChange?.();
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </header>

      <ProductsTable products={products} categories={categories} getCurrentStock={getCurrentStock} onEdit={setEditing} onDelete={remove} />

      {showForm && (
        <Modal title="Add Product" onClose={() => setShowForm(false)}>
          <ProductForm categories={categories} onSubmit={async (d) => { await add(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Product" onClose={() => setEditing(null)}>
          <ProductForm initialData={editing} categories={categories} onSubmit={async (d) => { await update({ ...editing, ...d }); setEditing(null); }} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}