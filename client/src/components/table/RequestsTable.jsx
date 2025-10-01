import StatusBadge from "../StatusBadge";

export default function RequestsTable({ requests, products }) {
  return (
    <div>
      <table className="w-full text-gray-300">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr><td colSpan="4" className="p-8 text-center text-gray-400">No supply requests found</td></tr>
          )}
          {requests.map(r => {
            const product = products.find(p => p.id === r.product_id);
            return (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-3">{product?.name || 'Unknown'}</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3"><StatusBadge status={r.status || 'pending'} /></td>
                <td className="p-3">{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}