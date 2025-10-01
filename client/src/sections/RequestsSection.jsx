// src/sections/RequestsSection.jsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import RequestsTable from "../components/table/RequestsTable";
import RequestForm from "../components/forms/RequestForm";
import api from "../service/api";

export default function RequestsSection({ requests, products, onRequestsChange }) {
  const [showForm, setShowForm] = useState(false);

  const submit = async (data) => {
    await api.createSupplyRequest({ product_id: parseInt(data.product_id), quantity: parseInt(data.quantity) });
    onRequestsChange?.();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Supply Requests</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> New Request
        </button>
      </div>

      <RequestsTable requests={requests} products={products} />

      {showForm && (
        <Modal title="New Supply Request" onClose={() => setShowForm(false)}>
          <RequestForm products={products} onSubmit={async (d) => { await submit(d); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}