import React, { useState } from "react";
import { Routes, Route, Navigate  } from "react-router-dom";
import ClerkDashboard from "../pages/ClerkDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MerchantDashboard from "../pages/MerchantDashboard";
import { useAuth } from "../context/AuthContext";



const AppRoutes = () => {
   const { user } = useAuth();
  const Dash = user.role === 'clerk' ? Clerk : user.role === 'admin' ? Admin : Merchant;

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-gray-200">
        <div className="bg-[#041524] backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between rounded-b-2xl shadow-2xl">
          <h1 className="text-xl font-bold text-white">MY DUKA Inventory</h1>
          <div className="flex items-center space-x-4">
            <select value={user.id} onChange={e => setUser(user.find(u => u.id === +e.target.value))}
              className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white">
              {user.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
            <span className={`px-3 py-1 text-sm rounded ${user.role === 'clerk' ? 'bg-blue-700 text-blue-200' : user.role === 'admin' ? 'bg-green-700 text-green-200' : 'bg-purple-700 text-purple-200'}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-6"><Dash user={user} /></div>
      </div>

    <Routes>
       <Route path="/" element={<Login />} /> 
       <Route path="/clerk" element={user?.role === "clerk" ? <ClerkDashboard user={user} /> : <Navigate to="/" />} />
       <Route path="/admin" element={user?.role === "admin" ?<AdminDashboard user={user} /> : <Navigate to="/" />} />
       <Route path="/merchant" element={user?.role === "merchant" ?<MerchantDashboard />  : <Navigate to="/" /> }/>
      </Routes>
    </>
  );
};

export default AppRoutes;
