import React from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function RequestTable({ requests, onApprove, onDecline, onDelete }) {
  return (
    <table className="w-full text-gray-300">
      <thead>
        <tr className="bg-gray-800">
          <th className="p-3 text-left">Product</th>
          <th className="p-3 text-left">Quantity</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Store</th>
          <th className="p-3 text-left">Requested By</th>
          <th className="p-3 text-left">Date</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id} className="border-t border-gray-700">
            <td className="p-3">{req.product_name || req.product_id}</td>
            <td className="p-3">{req.quantity}</td>
            <td className="p-3 capitalize">{req.status}</td>
            <td className="p-3">{req.store_name || req.store_id}</td>
            <td className="p-3">{req.requester_name || req.requested_by}</td>
            <td className="p-3">
              {req.created_at ? new Date(req.created_at).toLocaleString() : "—"}
            </td>
            <td className="p-3 flex gap-2">
              <button onClick={() => onApprove(req.id)} className="text-green-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onDecline(req.id)} className="text-red-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Decline
              </button>
              <button onClick={() => onDelete(req.id)} className="text-yellow-400 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </td>
          </tr>
        ))}
        {requests.length === 0 && (
          <tr>
            <td colSpan="7" className="p-3 text-center text-gray-500 italic">
              No supply requests
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}