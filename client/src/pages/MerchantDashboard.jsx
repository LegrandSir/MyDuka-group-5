import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import Admin from "./AdminDashboard";
// import Clerk from "./ClerkDashboard";

const users = [
  { id: 1, name: 'John Merchant', role: 'merchant' },
  { id: 2, name: 'Jane Admin', role: 'admin', storeId: 1 },
  { id: 3, name: 'Bob Clerk', role: 'clerk', storeId: 1 }
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