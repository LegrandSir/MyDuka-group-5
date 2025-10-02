import React from "react";

export default function TabButton({ id, label, isActive, onClick, icon: Icon }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
}
