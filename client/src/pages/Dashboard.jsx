// // src/pages/Dashboard.jsx
// import { useEffect, useState } from "react";
// import { getDashboardData } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getDashboardData();

//       if (data.message) {
//         setMessage(data.message);
//       } else {
//         // Token invalid or expired → redirect to login
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </div>
//       <p className="text-gray-700">{message || "Welcome to your dashboard!"}</p>
//     </div>
//   );
// }



import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const users = [
  { id: 1, name: 'John Merchant', role: 'merchant' },
  { id: 2, name: 'Jane Admin', role: 'admin', storeId: 1 },
  { id: 3, name: 'Bob Clerk', role: 'clerk', storeId: 1 }
];
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
const requests = [
  { id: 1, product: 'Product A', qty: 50, status: 'pending', storeId: 1 },
  { id: 2, product: 'Product B', qty: 100, status: 'approved', storeId: 1 }
];
const chartData = [
  { name: 'Store 1', sales: 4000, profit: 2400 },
  { name: 'Store 2', sales: 3000, profit: 1398 }
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

const Merchant = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      <Card title="Stores" value="2" icon={Store} />
      <Card title="Products" value={products.length} icon={Package} />
      <Card title="Staff" value={users.length} icon={Users} />
      <Card title="Revenue" value="Ksh 24500" icon={DollarSign} />
    </div>
    <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-lg font-semibold text-white mb-4">Performance</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="sales" fill="#3B82F6" />
          <Bar dataKey="profit" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);


const App = () => {
   const [user, setUser] = useState(users[2]);
  const Dash = user.role === 'clerk' ? Clerk : user.role === 'admin' ? Admin : Merchant;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-[#041524] backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between rounded-b-2xl shadow-2xl">
        <h1 className="text-xl font-bold text-white">MY DUKA Inventory</h1>
        <div className="flex items-center space-x-4">
          <select value={user.id} onChange={e => setUser(users.find(u => u.id === +e.target.value))}
            className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white">
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
          <span className={`px-3 py-1 text-sm rounded ${user.role === 'clerk' ? 'bg-blue-700 text-blue-200' : user.role === 'admin' ? 'bg-green-700 text-green-200' : 'bg-purple-700 text-purple-200'}`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-6"><Dash user={user} /></div>
    </div>
  );
};

export default App;