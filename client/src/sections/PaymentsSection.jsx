import { useState } from "react";
import PaymentsTable from "../components/table/PaymentTable";
import { Plus } from "lucide-react";

export default function PaymentsSection({ payments, stores = [], onAdd, showStore = false }) {
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    supplier: "",
    method: "",
    amount: "",
    status: "unpaid",
    storeId: "",
  });

  const handleAdd = async () => {
    if (!newPayment.amount) return;
    await onAdd(newPayment);
    setNewPayment({ supplier: "", method: "", amount: "", status: "unpaid", storeId: "" });
    setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Payments</h2>

      {/* Add Payment Form */}
      {onAdd && (
        <>
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
                placeholder="Method"
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              />
              <input
                className="bg-gray-700 text-white p-2 rounded mr-2"
                placeholder="Amount"
                type="number"
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

              {showStore && (
                <select
                  className="bg-gray-700 text-white p-2 rounded mr-2"
                  value={newPayment.storeId}
                  onChange={(e) => setNewPayment({ ...newPayment, storeId: e.target.value })}
                >
                  <option value="">Select Store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handleAdd}
                className="bg-green-600 px-4 py-2 rounded text-white"
              >
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
        </>
      )}

      {/* Payments Table */}
      <PaymentsTable payments={payments} stores={stores} showStore={showStore} />
    </div>
  );
}