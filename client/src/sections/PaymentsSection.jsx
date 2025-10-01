import React, { useState } from "react";
import { Plus } from "lucide-react";
import PaymentTable from "../components/table/PaymentTable";

export default function PaymentsSection({ payments, onAdd }) {
  const [newPayment, setNewPayment] = useState({ supplier: "", amount: "", status: "unpaid" });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    await onAdd(newPayment);
    setNewPayment({ supplier: "", amount: "", status: "unpaid" });
    setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Supplier Payments</h2>
      {showForm ? (
        <div className="mb-4">
          <input
            className="bg-gray-700 text-white p-2 rounded mr-2"
            placeholder="Supplier"
            value={newPayment.supplier}
            onChange={(e) => setNewPayment({ ...newPayment, supplier: e.target.value })}
          />
          <input
            className="bg-gray-700 text-white p-2 rounded mr-2"
            placeholder="Amount"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />
          <select
            className="bg-gray-700 text-white p-2 rounded mr-2"
            value={newPayment.status}
            onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
          <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded text-white">
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" /> Add Payment
        </button>
      )}
      <PaymentTable payments={payments} />
    </div>
  );
}
