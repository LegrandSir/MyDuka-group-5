import { Edit2, Trash2 } from "lucide-react";

export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2 justify-end">
      <button onClick={onEdit} className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded">
        <Edit2 size={16}/>
      </button>
      <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
        <Trash2 size={16}/>
      </button>
    </div>
  );
}
