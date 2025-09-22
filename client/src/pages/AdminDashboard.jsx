import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign } from 'lucide-react';

const requests = [
  { id: 1, product: 'Product A', qty: 50, status: 'pending', storeId: 1 },
  { id: 2, product: 'Product B', qty: 100, status: 'approved', storeId: 1 }
];

const Card = ({ title, value, icon: Icon }) => (
  <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-4 flex justify-between items-center shadow-2xl">
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
    <Icon className="w-6 h-6 text-gray-400" />
  </div>
);

const Admin = ({ user }) => {
  const [reqs, setReqs] = useState(requests.filter(r => r.storeId === user.storeId));
  const act = (id, s) => setReqs(reqs.map(r => r.id === id ? { ...r, status: s } : r));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Products" value={products.length} icon={Package} />
        <Card title="Pending" value={reqs.filter(r => r.status === 'pending').length} icon={ShoppingCart} />
        <Card title="Revenue" value="Ksh 8,450" icon={DollarSign} />
      </div>

      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Requests</h2>
        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr><th className="p-2">Product</th><th className="p-2">Qty</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr>
          </thead>
          <tbody>
            {reqs.map(r => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-2">{r.product}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.status === 'approved' ? 'bg-green-700 text-green-200' :
                    r.status === 'pending' ? 'bg-yellow-700 text-yellow-200' : 'bg-red-700 text-red-200'
                  }`}>{r.status}</span>
                </td>
                <td className="p-2">
                  {r.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button onClick={() => act(r.id, 'approved')} className="text-green-400"><Check className="w-4 h-4" /></button>
                      <button onClick={() => act(r.id, 'declined')} className="text-red-400"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
