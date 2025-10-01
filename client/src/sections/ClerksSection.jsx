import React, { useState } from "react";
import ClerkTable from "../components/table/ClerkTable";

export default function ClerksSection({ clerks, onAdd, onToggleStatus }) {
  const [newClerk, setNewClerk] = useState({ email: "" });

  const handleSubmit = async () => {
    await onAdd(newClerk);
    setNewClerk({ email: "" });
  };

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Manage Clerks</h2>
      <div className="mb-6 bg-gray-800 p-4 rounded-xl">
        <h4 className="text-white mb-2">Invite New Clerk</h4>
        <input
          type="email"
          placeholder="Clerk Email"
          className="p-2 rounded bg-gray-700 text-white mr-2"
          value={newClerk.email}
          onChange={(e) => setNewClerk({ ...newClerk, email: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-3 py-1 rounded text-white"
        >
          Invite
        </button>
      </div>
      <ClerkTable clerks={clerks} onToggleStatus={onToggleStatus} />
    </div>
  );
}