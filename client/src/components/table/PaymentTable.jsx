import React from "react";

export default function PaymentTable({ payments }) {
  return (
    <table className="w-full text-gray-300">
      <thead>
        <tr className="bg-gray-800">
          <th className="p-3 text-left">Supplier</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-t border-gray-700">
            <td className="p-3">{p.supplier || p.method}</td>
            <td className="p-3">Ksh {p.amount}</td>
            <td
              className={`p-3 capitalize ${
                p.status === "paid" ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {p.status}
            </td>
          </tr>
        ))}
        {payments.length === 0 && (
          <tr>
            <td colSpan="3" className="p-3 text-center text-gray-500 italic">
              No payments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}