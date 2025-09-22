import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign } from 'lucide-react';
import Card from "../components/Card";

const products = [
  {
    id: 1,
    name: 'Product A',
    storeId: 1,
    price: 20, 
    status: 'paid',
    stock:85,
    buyingPrice: 3000,
    sellingPrice: 3900,
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cd590?q=80&w=1983&auto=format&fit=crop',
  },
  { 
    id: 2,
    name: 'Product B', 
    storeId: 1, 
    stock: 150, 
    price: 12, 
    status: 'unpaid',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cd590?q=80&w=1983&auto=format&fit=crop', 
  },
];


const Clerk = ({ user }) => {
  const [items, setItems] = useState(products.filter(p => p.storeId === user.storeId));
  const [showForm, setShowForm] = useState(false);

  const addItem = e => {
    e.preventDefault();
    const f = e.target;
    setItems([...items, { id: Date.now(), name: f.name.value, stock: +f.stock.value, price: +f.price.value, status: 'unpaid', storeId: user.storeId }]);
    f.reset(); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Products" value={items.length} icon={Package} />
        <Card title="Stock" value={items.reduce((s, p) => s + p.stock, 0)} icon={ShoppingCart} />
        <Card title="Revenue" value="NaN" icon={DollarSign} />
        {/* <Card title="Revenue" value={`Ksh ${items.reduce((s, p) => s + p.stock * p.price, 0)}`} icon={DollarSign} /> */}
      </div>

      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Inventory</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 px-3 py-2 rounded text-white flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
        </div>

        {showForm && (
          <form onSubmit={addItem} className="mb-4 grid grid-cols-3 gap-3">
            <input name="name" placeholder="Name" className="bg-gray-700 rounded px-3 py-2 text-white" />
            <input name="stock" type="number" placeholder="Stock" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <input name="price" type="number" placeholder="Price" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <button type="submit" className="col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Save</button>
          </form>
        )}

        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr><th className="p-2">Product</th><th className="p-2">Stock</th><th className="p-2">Price</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t border-gray-700">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">Ksh {p.price}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'paid' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clerk;