import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import ProductsTable from "../components/tables/ProductsTable";
import ProductForm from "../components/forms/ProductForm";

export default function ProductsSection({ products, categories, getCurrentStock, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={20}/> Add Product
        </button>
      </header>

      <ProductsTable products={products} categories={categories} getCurrentStock={getCurrentStock} onEdit={setEditing} onDelete={onDelete} />

      {showForm && (
        <Modal title="Add Product" onClose={() => setShowForm(false)}>
          <ProductForm categories={categories} onSubmit={(data) => { onAdd(data); setShowForm(false); }} onCancel={() => setShowForm(false)}/>
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Product" onClose={() => setEditing(null)}>
          <ProductForm initialData={editing} categories={categories} onSubmit={(data) => { onUpdate({ ...editing, ...data }); setEditing(null); }} onCancel={() => setEditing(null)}/>
        </Modal>
      )}
    </div>
  );
}
