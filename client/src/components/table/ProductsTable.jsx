import { Edit2, Trash2 } from "lucide-react";
import ActionButtons from "../ActionButtons";
import StatusBadge from "../StatusBadge";

export default function ProductsTable({ products, categories, onEdit, onDelete, getCurrentStock }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-4 text-left text-gray-300">Name</th>
            <th className="p-4 text-left text-gray-300">Category</th>
            <th className="p-4 text-right text-gray-300">Price</th>
            <th className="p-4 text-center text-gray-300">Stock</th>
            <th className="p-4 text-right text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gray-700">
              <td className="p-4 text-white">{p.name}</td>
              <td className="p-4 text-gray-300">
                {categories.find((c) => c.id === p.category_id)?.name || "N/A"}
              </td>
              <td className="p-4 text-right text-green-400">Ksh {parseFloat(p.price).toFixed(2)}</td>
              <td className="p-4 text-center">
                <StatusBadge status={getCurrentStock(p.id) < 10 ? "stockLow" : "stockOk"} />
              </td>
              <td className="p-4 text-right">
                <ActionButtons onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
