import React, { useState } from "react";
import { Routes, Route, Navigate  } from "react-router-dom";
import ClerkDashboard from "../pages/ClerkDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MerchantDashboard from "../pages/MerchantDashboard";
import Logo from "../assets/my duka logo-01.svg";
import { useAuth } from "../context/AuthContext";



const AppRoutes = () => {
  const { user } = useAuth();
  const Dash = user.role === 'clerk' ? ClerkDashboard : user.role === 'admin' ? AdminDashboard : MerchantDashboard;

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-gray-200">
  <div className="bg-[#041524] backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between items-center rounded-b-2xl shadow-2xl">
    <div className="flex items-center space-x-3">
      {/* App Logo */}
      <div className="w-8 h-8 flex items-center justify-center">
        <img 
          src={Logo} 
          alt="MY DUKA Logo" 
          className="w-8 h-8 object-contain"
        />
      </div>
      <h1 className="text-xl font-bold text-white">MY DUKA Inventory</h1>
    </div>
    
    <div className="flex items-center space-x-4">
      <span className="text-white font-medium">{user?.name}</span>
      <span
        className={`px-3 py-1 text-sm rounded ${
          user?.role === "clerk"
            ? "bg-blue-700 text-blue-200"
            : user?.role === "admin"
            ? "bg-green-700 text-green-200"
            : "bg-purple-700 text-purple-200"
        }`}
      >
        {user?.role?.toUpperCase()}
      </span>
      <button
        onClick={() => {
         
          console.log('Logout clicked');
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-red-200 hover:text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </div>

  <div className="p-6">{user && <Dash user={user} />}</div>
</div>

    <Routes>
       {/* <Route path="/" element={<Login />} />  */}
       <Route path="/clerk" element={user?.role === "clerk" ? <ClerkDashboard user={user} /> : <Navigate to="/" />} />
       <Route path="/admin" element={user?.role === "admin" ?<AdminDashboard user={user} /> : <Navigate to="/" />} />
       <Route path="/merchant" element={user?.role === "merchant" ?<MerchantDashboard />  : <Navigate to="/" /> }/>
      </Routes>
    </>
  );
};

export default AppRoutes;
