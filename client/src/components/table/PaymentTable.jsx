export default function PaymentsTable({ payments, stores = [], showStore = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-xl text-gray-300">
        <thead>
          <tr className="bg-gray-700 text-gray-200">
            {showStore && <th className="p-3 text-left">Store</th>}
            <th className="p-3 text-left">Supplier</th>
            <th className="p-3 text-left">Method</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Amount (Ksh)</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p) => {
              const store = stores.find((s) => s.id === p.store_id);
              return (
                <tr key={p.id} className="border-b border-gray-700">
                  {showStore && <td className="p-3">{store ? store.name : "Unknown"}</td>}
                  <td className="p-3">{p.supplier || "—"}</td>
                  <td className="p-3">{p.method}</td>
                  <td className={`p-3 ${p.status === "paid" ? "text-green-400" : "text-red-400"}`}>
                    {p.status}
                  </td>
                  <td className="p-3 text-right">{p.amount}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={showStore ? 5 : 4}
                className="p-3 text-center text-gray-500 italic"
              >
                No payments recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}