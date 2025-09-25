import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ClerkDashboard from "../pages/ClerkDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MerchantDashboard from "../pages/MerchantDashboard";





const AppRoutes = () => {
  const [user, setUser] = useState(users[2]);
  const Dash = user.role === 'clerk' ? Clerk : user.role === 'admin' ? Admin : Merchant;

  return (
    <>
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

    <Routes>
      {user.role === "clerk" && <Route path="/" element={<ClerkDashboard user={user} />} />}
      {user.role === "admin" && <Route path="/" element={<AdminDashboard user={user} />} />}
      {user.role === "merchant" && <Route path="/" element={<MerchantDashboard />} />}
      </Routes>
    </>
  );
};

export default AppRoutes;
