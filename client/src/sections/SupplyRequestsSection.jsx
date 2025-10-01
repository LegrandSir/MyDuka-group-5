import React from "react";
import RequestTable from "../components/table/RequestsTable";

export default function SupplyRequestsSection({ supplyRequests, onUpdate, onDelete }) {
  return (
    <div>
      <h2 className="text-xl text-white mb-4">Supply Requests</h2>
      <RequestTable
        requests={supplyRequests}
        onApprove={(id) => onUpdate(id, "approved")}
        onDecline={(id) => onUpdate(id, "declined")}
        onDelete={onDelete}
      />
    </div>
  );
}